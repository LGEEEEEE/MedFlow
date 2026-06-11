import { useState, useEffect } from 'react';
import { api } from '../services/api';
import toast from 'react-hot-toast';

export function useFinanceiro() {
  const [extrato, setExtrato] = useState([]);
  const [modalTransacao, setModalTransacao] = useState(false);
  const [formTransacao, setFormTransacao] = useState({
    descricao: '', fonte: '', valor: '', tipo: 'entrada', data: new Date().toISOString().split('T')[0]
  });
  const [filtroData, setFiltroData] = useState({ inicio: '', fim: '' });

  const carregarTransacoes = async () => {
    try {
      const res = await api.get('/transacoes');
      setExtrato(res.data || []);
    } catch (error) {
      toast.error('Erro ao carregar o fluxo de caixa.');
    }
  };

  useEffect(() => {
    carregarTransacoes();
  }, []);

  const salvarTransacao = async (e) => {
    e.preventDefault();
    try {
      if (formTransacao.id) {
        await api.put(`/transacoes/${formTransacao.id}`, formTransacao);
        toast.success('Transação atualizada!');
      } else {
        await api.post('/transacoes', formTransacao);
        toast.success('Transação registrada!');
      }
      setModalTransacao(false);
      setFormTransacao({ descricao: '', fonte: '', valor: '', tipo: 'entrada', data: new Date().toISOString().split('T')[0] });
      carregarTransacoes();
    } catch (error) {
      toast.error('Erro ao salvar transação.');
    }
  };

  const excluirTransacao = async (id) => {
    if (window.confirm('Deseja realmente excluir este registro financeiro?')) {
      try {
        await api.delete(`/transacoes/${id}`);
        carregarTransacoes();
        toast.success('Registro excluído.');
      } catch (error) {
        toast.error('Erro ao excluir.');
      }
    }
  };

  const editarTransacao = (t) => {
    setFormTransacao({ ...t, data: t.data.split('T')[0] });
    setModalTransacao(true);
  };

  const imprimirRelatorio = () => {
    window.print();
  };

  const extratoFiltrado = extrato.filter(item => {
    if (!filtroData.inicio && !filtroData.fim) return true;
    if (filtroData.inicio && item.data < filtroData.inicio) return false;
    if (filtroData.fim && item.data > filtroData.fim) return false;
    return true;
  });

  return {
    extratoFiltrado,
    filtroData, setFiltroData,
    modalTransacao, setModalTransacao,
    formTransacao, setFormTransacao,
    salvarTransacao, excluirTransacao, editarTransacao, imprimirRelatorio
  };
}