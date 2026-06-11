import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export function useFaturamento() {
  const [guias, setGuias] = useState([]);

  const carregarGuias = async () => {
    // No futuro, isso virá da sua API: await api.get('/faturamento/guias')
    // Por enquanto, mantemos os dados mockados do seu código original para não quebrar a tela
    setGuias([
      { id: '74892-A', carteirinha: 'GDF-938402-21', fatura: 'FAT-2026-001', paciente: 'Carlos Silva', convenio: 'GDF SAUDE', procedimento: 'Consulta Clínica', valor: 120.00, status: 'AGUARDANDO_ENVIO' },
      { id: '74893-B', carteirinha: 'SUL-294811-00', fatura: 'FAT-2026-002', paciente: 'Ana Paula Souza', convenio: 'SULAMERICA', procedimento: 'Raio-X de Tórax', valor: 250.00, status: 'ENVIADO' },
      { id: '74894-C', carteirinha: 'BRA-104958-33', fatura: 'FAT-2026-003', paciente: 'Marcos Almeida', convenio: 'BRADESCO', procedimento: 'Eletrocardiograma', valor: 180.00, status: 'PAGO' }
    ]);
  };

  useEffect(() => {
    carregarGuias();
  }, []);

  const alterarStatusGuia = (id, novoStatus) => {
    setGuias(prev => prev.map(g => g.id === id ? { ...g, status: novoStatus } : g));
    if (novoStatus === 'PAGO') toast.success('Guia baixada com sucesso!');
  };

  const dispararLoteTiss = () => {
    setGuias(prev => prev.map(g => g.status === 'AGUARDANDO_ENVIO' ? { ...g, status: 'ENVIADO' } : g));
    toast.success('Lote TISS gerado e enviado para a operadora!');
  };

  return { guias, alterarStatusGuia, dispararLoteTiss };
}