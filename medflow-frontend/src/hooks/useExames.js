import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

const PORT = import.meta.env.VITE_PORT || 3001;
const URLPADRAO = `http://localhost:${PORT}`;

export function useExames() {
  const [pedidosPendentes, setPedidosPendentes] = useState([]);
  const [exameAtual, setExameAtual] = useState(null);
  const [resultado, setResultado] = useState('');
  const [laudoPdf, setLaudoPdf] = useState(null);

  const carregarFilaSADT = async () => {
    try {
      const res = await api.get('/atendimentos');
      const atendimentosTotais = res.data.dados || res.data || [];

      let examesExtraidos = [];

      atendimentosTotais.forEach(atendimento => {
        if (atendimento.status === 'AGUARDANDO_EXAME' && atendimento.exames && atendimento.exames.length > 0) {
          atendimento.exames.forEach(exame => {
            examesExtraidos.push({
              ...exame,
              paciente: atendimento.paciente,
              medicoSintomas: atendimento.sintomas
            });
          });
        }
      });

      // Ordena a fila por prioridade clínica
      examesExtraidos.sort((a, b) => {
        if (a.prioridade === 'Vermelho') return -1;
        if (b.prioridade === 'Vermelho') return 1;
        if (a.prioridade === 'Amarelo') return -1;
        if (b.prioridade === 'Amarelo') return 1;
        return 0;
      });

      setPedidosPendentes(examesExtraidos);
    } catch (error) {
      toast.error('Erro ao carregar a fila de exames.');
    }
  };

  useEffect(() => {
    carregarFilaSADT();

    const socket = io(api.defaults.baseURL || URLPADRAO);
    socket.on('novo_exame_sadt', carregarFilaSADT);
    socket.on('atualizar_fila', carregarFilaSADT);

    return () => socket.disconnect();
  }, []);

  const selecionarExame = (exame) => {
    setExameAtual(exame);
    setResultado('');
    setLaudoPdf(null);
  };

  const salvarLaudo = async (e) => {
    e.preventDefault();
    if (!exameAtual) return;

    try {
      // Usamos FormData para conseguir enviar o ficheiro PDF para o backend
      const formData = new FormData();
      formData.append('resultado', resultado);
      if (laudoPdf) {
        formData.append('pdf', laudoPdf);
      }

      await api.put(`/exames/${exameAtual.id}/laudo`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('Laudo anexado com sucesso! O médico já pode visualizar o resultado.');
      setExameAtual(null);
      setResultado('');
      setLaudoPdf(null);
      carregarFilaSADT();
    } catch (error) {
      toast.error('Falha ao guardar o laudo do exame.');
    }
  };

  return {
    pedidosPendentes, exameAtual, selecionarExame,
    resultado, setResultado,
    laudoPdf, setLaudoPdf,
    salvarLaudo
  };
}