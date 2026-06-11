import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

const PORT = import.meta.env.VITE_PORT || 3001;
const URLPADRAO = `http://localhost:${PORT}`;

export function useTriagem() {
  const [fila, setFila] = useState([]);
  const [pacienteAtual, setPacienteAtual] = useState(null);
  const [formTriagem, setFormTriagem] = useState({
    pressao: '', temperatura: '', saturacao: '', peso: '', queixa: ''
  });

  const carregarFila = async () => {
    try {
      const res = await api.get('/atendimentos');
      const dados = res.data.dados || res.data || [];
      // Na triagem, apenas interessam os pacientes ABERTOS ou AGUARDANDO_TRIAGEM
      setFila(dados.filter(a => a.status === 'ABERTO' || a.status === 'AGUARDANDO_TRIAGEM'));
    } catch (e) {
      toast.error('Erro ao carregar a fila de triagem.');
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

  const selecionarPaciente = (paciente) => {
    setPacienteAtual(paciente);
    // Limpa o formulário quando troca de paciente
    setFormTriagem({ pressao: '', temperatura: '', saturacao: '', peso: '', queixa: '' }); 
  };

  const salvarTriagem = async (e) => {
    e.preventDefault();
    if (!pacienteAtual) return;

    try {
      // Monta o texto que vai aparecer no Prontuário do Médico depois
      const textoTriagem = `[TRIAGEM] PA: ${formTriagem.pressao} | Temp: ${formTriagem.temperatura}ºC | SpO2: ${formTriagem.saturacao}% | Peso: ${formTriagem.peso}kg\nQueixa: ${formTriagem.queixa}`;

      await api.put(`/atendimentos/${pacienteAtual.id}/status`, {
        status: 'AGUARDANDO_ATENDIMENTO', // Envia o paciente para a fila do médico
        sintomas: textoTriagem
      });

      toast.success('Triagem registada! Paciente enviado para o consultório.');
      setPacienteAtual(null);
      carregarFila();
    } catch (error) {
      toast.error('Erro ao guardar os dados da triagem.');
    }
  };

  const handleChange = (campo) => (e) => {
    // Máscara básica para a pressão arterial (ex: 120/80)
    let valor = e.target.value;
    if (campo === 'pressao') {
      valor = valor.replace(/\D/g, '').replace(/(\d{3})(\d{1,2})/, '$1/$2').replace(/(\d{2})(\d{2})/, '$1/$2').substring(0, 7);
    }
    setFormTriagem({ ...formTriagem, [campo]: valor });
  };

  return {
    fila, pacienteAtual, selecionarPaciente,
    formTriagem, handleChange, salvarTriagem
  };
}