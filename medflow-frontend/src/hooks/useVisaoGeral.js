import { useState, useEffect } from 'react';
import { api } from '../services/api';
import toast from 'react-hot-toast';

export function useVisaoGeral() {
  const [metricas, setMetricas] = useState({
    atendimentosHoje: 0,
    faturamentoMes: 0,
    alertasEstoque: 0,
    usuariosAtivos: 0
  });

  const carregarDados = async () => {
    try {
      // Melhoria de arquitetura: Promise.all carrega tudo em paralelo, deixando a tela mais rápida
      const [resUsuarios, resEstoque, resTransacoes, resAtendimentos] = await Promise.all([
        api.get('/usuarios').catch(() => ({ data: [] })),
        api.get('/produtos').catch(() => ({ data: [] })),
        api.get('/transacoes').catch(() => ({ data: [] })),
        api.get('/atendimentos').catch(() => ({ data: [] }))
      ]);

      const usuariosData = resUsuarios.data || [];
      const estoqueData = resEstoque.data || [];
      const extratoData = resTransacoes.data || [];
      const atendimentosTotais = resAtendimentos.data?.dados || resAtendimentos.data || [];

      const hoje = new Date().toLocaleDateString();
      const contagemHoje = atendimentosTotais.filter(a => new Date(a.createdAt).toLocaleDateString() === hoje).length;

      const contagemAlertas = estoqueData.filter(item => (item.amount || item.quantidade) < 20).length;
      const faturamentoCalculado = extratoData.filter(e => e.tipo === 'entrada').reduce((acc, curr) => acc + curr.valor, 0);

      setMetricas({
        atendimentosHoje: contagemHoje,
        faturamentoMes: faturamentoCalculado,
        alertasEstoque: contagemAlertas,
        usuariosAtivos: usuariosData.length
      });
    } catch (error) {
      toast.error('Erro ao carregar as métricas do painel.');
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  return { metricas };
}  