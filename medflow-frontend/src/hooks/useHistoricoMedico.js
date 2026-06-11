import { useState, useEffect } from 'react';
import { api } from '../services/api';
import toast from 'react-hot-toast';

export function useHistoricoMedico() {
  const [historicoTotal, setHistoricoTotal] = useState([]);
  const [filtroBusca, setFiltroBusca] = useState('');
  const [detalheHistorico, setDetalheHistorico] = useState(null);

  const carregarHistorico = async () => {
    try {
      const res = await api.get('/atendimentos');
      const listaTotal = res.data.dados || res.data || [];
      // Filtra apenas os que já finalizaram
      setHistoricoTotal(listaTotal.filter(item => item.status === 'FINALIZADO'));
    } catch (e) {
      toast.error('Erro ao carregar o histórico de pacientes.');
    }
  };

  useEffect(() => {
    carregarHistorico();
  }, []);

  const historicoFiltrado = historicoTotal.filter(h => {
    const nomePaciente = h.paciente?.nome || h.nome || '';
    const cpfPaciente = h.paciente?.cpf || '';
    const termoBusca = filtroBusca ? filtroBusca.toLowerCase() : '';
    
    return nomePaciente.toLowerCase().includes(termoBusca) || 
           cpfPaciente.includes(filtroBusca.replace(/\D/g, ''));
  });

  return {
    filtroBusca, setFiltroBusca,
    detalheHistorico, setDetalheHistorico,
    historicoFiltrado
  };
}