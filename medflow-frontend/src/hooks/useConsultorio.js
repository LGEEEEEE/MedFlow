import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

const PORT = import.meta.env.VITE_PORT || 3001;
const URLPADRAO = `http://localhost:${PORT}`;

export function useConsultorio() {
  const [fila, setFila] = useState([]);
  const [pacienteAtual, setPacienteAtual] = useState(null);
  const [relatorio, setRelatorio] = useState('');
  const [modalSADT, setModalSADT] = useState(false);

  // A ficha clínica gigante
  const [ficha, setFicha] = useState({
    sexo: '', acompanhante: '', tipoAtendimento: '1º Atendimento',
    queixa: '', tempoValor: '', tempoUnidade: 'dias', carater: '', sintomasAssoc: '',
    sinaisAlarme: [], morbidades: [], alergias: 'Nega alergias',
    medicamentos: '', vitais: { pa: '', fc: '', sat: '', temp: '' },
    exameFisico: [], impressao: '', observacao: '', condutaTab: 'Alta', condutas: []
  });

  const [formSADT, setFormSADT] = useState({
    categoria: '', exame: '', prioridade: 'Verde', justificativa: '', observacoes: ''
  });

  // Funções Utilitárias do Formulário
  const mascaraPA = (valor) => {
    return valor.replace(/\D/g, '').replace(/(\d{3})(\d{1,2})/, '$1/$2').replace(/(\d{2})(\d{2})/, '$1/$2').substring(0, 7);
  };

  const toggleArray = (field, value) => {
    setFicha(prev => {
      const arr = prev[field] || [];
      if (arr.includes(value)) return { ...prev, [field]: arr.filter(i => i !== value) };
      return { ...prev, [field]: [...arr, value] };
    });
  };

  const carregarFila = async () => {
    try {
      const res = await api.get('/atendimentos');
      const listaTotal = res.data.dados || res.data || [];
      const emConsulta = listaTotal.find(item => item.status === 'EM_CONSULTA');

      if (emConsulta) setPacienteAtual(emConsulta);
      setFila(listaTotal.filter(item => item.status === 'AGUARDANDO_ATENDIMENTO' || item.status === 'AGUARDANDO_RETORNO'));
    } catch (e) {
      console.error('Erro ao carregar a fila médica', e);
    }
  };

  useEffect(() => {
    carregarFila();
    const socket = io(api.defaults.baseURL || URLPADRAO);
    socket.on('novo_atendimento', carregarFila);
    socket.on('atualizar_fila', carregarFila);
    socket.on('status_atualizado', carregarFila);
    return () => socket.disconnect();
  }, []);

  // GERADOR AUTOMÁTICO DE PRONTUÁRIO
  useEffect(() => {
    let txt = "";

    if (pacienteAtual && pacienteAtual.sintomas) {
      txt += pacienteAtual.sintomas + "\n\n--- NOVA AVALIAÇÃO MÉDICA ---\n";
    }

    if (ficha.queixa) txt += `HDA:\nPaciente refere ${ficha.queixa}`;
    if (ficha.tempoValor) txt += ` há ${ficha.tempoValor} ${ficha.tempoUnidade}.`;
    if (ficha.carater) txt += ` Caráter: ${ficha.carater}.`;
    if (ficha.sintomasAssoc) txt += ` Sintomas associados: ${ficha.sintomasAssoc}.`;
    if (ficha.sinaisAlarme.length > 0) txt += `\nSINAIS DE ALARME: ${ficha.sinaisAlarme.join(', ')}.`;

    txt += `\n\nANTECEDENTES:\nComorbidades: ${ficha.morbidades.length > 0 ? ficha.morbidades.join(', ') : 'Nega'}.`;
    txt += ` Alergias: ${ficha.alergias}.`;
    if (ficha.medicamentos) txt += ` Uso contínuo: ${ficha.medicamentos}.`;

    txt += `\n\nEXAME FÍSICO:\nPA: ${ficha.vitais.pa || '--'} mmHg | FC: ${ficha.vitais.fc || '--'} bpm | SpO2: ${ficha.vitais.sat || '--'} % | Temp: ${ficha.vitais.temp || '--'} ºC`;
    if (ficha.exameFisico.length > 0) txt += `\nSistemas s/ alt: ${ficha.exameFisico.join(', ')}.`;

    if (ficha.impressao) txt += `\n\nIMPRESSÃO CLÍNICA:\n${ficha.impressao} ${ficha.observacao ? '(' + ficha.observacao + ')' : ''}`;

    if (ficha.condutas.length > 0) {
      txt += `\n\nCONDUTA:\n`;
      ficha.condutas.forEach(c => txt += `• ${c}\n`);
    }

    setRelatorio(txt.trim());
  }, [ficha, pacienteAtual]);

  const chamarPaciente = async (paciente) => {
    try {
      await api.put(`/atendimentos/${paciente.id}/status`, { status: 'EM_CONSULTA' });
      setPacienteAtual(paciente);
      setFicha({
        sexo: '', acompanhante: '', tipoAtendimento: '1º Atendimento', queixa: '', tempoValor: '', tempoUnidade: 'dias', carater: '', sintomasAssoc: '', sinaisAlarme: [], morbidades: [], alergias: 'Nega alergias', medicamentos: '', vitais: { pa: '', fc: '', sat: '', temp: '' }, exameFisico: [], impressao: '', observacao: '', condutaTab: 'Alta', condutas: []
      });
      carregarFila();
    } catch (error) {
      toast.error("Erro ao chamar o paciente. Verifique o servidor.");
    }
  };

  const finalizarAtendimento = async () => {
    if (!pacienteAtual) return;
    try {
      await api.put(`/atendimentos/${pacienteAtual.id}/status`, {
        status: 'FINALIZADO',
        sintomas: relatorio,
        diagnostico: ficha.impressao,
        prescricao: ficha.condutas.join(', ')
      });
      setPacienteAtual(null);
      carregarFila();
      toast.success("Atendimento finalizado com sucesso!");
    } catch (error) {
      toast.error("Erro ao finalizar atendimento.");
    }
  };

  const handleSalvarExame = async (e) => {
    e.preventDefault();
    if (!formSADT.exame || !formSADT.justificativa) return toast.error("Preencha o exame e a justificativa clínica.");
    try {
      await api.post(`/atendimentos/${pacienteAtual.id}/exames`, formSADT);
      await api.put(`/atendimentos/${pacienteAtual.id}/status`, { status: 'AGUARDANDO_EXAME' });
      toast.success("Pedido gerado com sucesso! Paciente encaminhado para exames.");
      setModalSADT(false);
      setPacienteAtual(null);
      carregarFila();
    } catch (error) {
      toast.error("Erro ao gerar pedido de exame.");
    }
  };

  return {
    fila, pacienteAtual, 
    ficha, setFicha, toggleArray, mascaraPA,
    relatorio, setRelatorio,
    modalSADT, setModalSADT, formSADT, setFormSADT,
    chamarPaciente, finalizarAtendimento, handleSalvarExame
  };
}