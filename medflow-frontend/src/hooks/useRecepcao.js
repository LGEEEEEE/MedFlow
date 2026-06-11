import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

// Lê a porta do .env da mesma forma que configurámos na API
const PORT = import.meta.env.VITE_PORT || 3001;
const URLPADRAO = `http://localhost:${PORT}`;

export function useRecepcao() {
  const [atendimentos, setAtendimentos] = useState({
    aguardando: [],
    emAtendimento: [],
    finalizado: []
  });

  const [modalNovoPaciente, setModalNovoPaciente] = useState(false);
  const [modalConsulta, setModalConsulta] = useState(false);
  const [modalExame, setModalExame] = useState(false);

  const carregarKanban = async () => {
    try {
      const res = await api.get('/atendimentos');
      const dados = res.data.dados || res.data || [];

      // Ajuste os filtros aqui para incluir os status que estão a ser usados no sistema
      setAtendimentos({
        // Adicionei AGUARDANDO_ATENDIMENTO e EM_CONSULTA aqui
        aguardando: dados.filter(a => ['ABERTO', 'AGUARDANDO_TRIAGEM', 'AGENDADO', 'AGUARDANDO_ATENDIMENTO'].includes(a.status)),
        emAtendimento: dados.filter(a => ['EM_ATENDIMENTO', 'EM_TRIAGEM', 'AGUARDANDO_RETORNO', 'EM_CONSULTA', 'AGUARDANDO_EXAME'].includes(a.status)),
        finalizado: dados.filter(a => a.status === 'FINALIZADO')
      });
      
      // LOG DE SEGURANÇA: Se continuar a aparecer 0, abra o console (F12) e veja o que está a vir da API
      console.log('Dados recebidos da API:', dados);
    } catch (error) {
      toast.error('Erro ao carregar o quadro de receção.');
    }
  };

  useEffect(() => {
    carregarKanban();

    // Ligação em tempo real para o ecrã piscar/atualizar sozinho
    const socket = io(api.defaults.baseURL || URLPADRAO);
    socket.on('novo_atendimento', carregarKanban);
    socket.on('atualizar_fila', carregarKanban);
    socket.on('status_atualizado', carregarKanban);

    return () => {
      socket.disconnect();
    };
  }, []);

  const alterarStatus = async (id, novoStatus) => {
    try {
      await api.put(`/atendimentos/${id}/status`, { status: novoStatus });
      toast.success('Status do paciente atualizado!');
      carregarKanban();
    } catch (error) {
      toast.error('Falha ao atualizar o status.');
    }
  };

  const cancelarAtendimento = async (id) => {
    if (window.confirm('Deseja realmente cancelar este atendimento e retirá-lo da fila?')) {
      try {
        await api.delete(`/atendimentos/${id}`);
        toast.success('Atendimento cancelado.');
        carregarKanban();
      } catch (error) {
        toast.error('Erro ao cancelar o atendimento.');
      }
    }
  };

  return {
    atendimentos,
    modalNovoPaciente, setModalNovoPaciente,
    modalConsulta, setModalConsulta,
    modalExame, setModalExame,
    carregarKanban,
    alterarStatus,
    cancelarAtendimento
  };
}