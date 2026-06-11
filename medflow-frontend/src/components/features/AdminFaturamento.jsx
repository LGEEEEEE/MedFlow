import { useFaturamento } from '../../hooks/useFaturamento';
import toast from 'react-hot-toast';

export default function AdminFaturamento() {
  const { guias, alterarStatusGuia, dispararLoteTiss } = useFaturamento();

  const getBadgeStatusGuia = (status) => {
    if (status === 'PAGO') return { padding: '4px 8px', backgroundColor: '#e8f8f5', color: '#16a085', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' };
    if (status === 'GLOSADO') return { padding: '4px 8px', backgroundColor: '#fdedec', color: '#c0392b', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' };
    if (status === 'ENVIADO') return { padding: '4px 8px', backgroundColor: '#eef2f5', color: '#2980b9', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' };
    return { padding: '4px 8px', backgroundColor: '#fff3e0', color: '#d35400', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' };
  };

  return (
    <div className="fade-animation panel-white">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: '0 0 20px 0', color: '#2c3e50', fontSize: '18px' }}>Guias TISS e Repasses de Planos de Saúde</h3>
        <div style={{ display: 'flex', gap: '10px' }} className="no-print">
          <button onClick={() => toast('Guias sincronizadas com o servidor.', { icon: '🔄' })} className="btn-secondary">Sincronizar Guias</button>
          <button onClick={dispararLoteTiss} className="btn-primary">Gerar Lote de Faturamento (XML TISS)</button>
        </div>
      </div>
      <table className="medflow-table">
        <thead>
          <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dfe6e9' }}>
            <th>Nº Guia</th>
            <th>Fatura</th>
            <th>Nº Carteirinha</th>
            <th>Paciente</th>
            <th>Convênio</th>
            <th>Procedimento</th>
            <th>Valor</th>
            <th>Status</th>
            <th className="no-print">Ações</th>
          </tr>
        </thead>
        <tbody>
          {guias.map(guia => (
            <tr key={guia.id} style={{ borderBottom: '1px solid #f0f2f5' }}>
              <td style={{ fontWeight: 'bold', color: '#2980b9' }}>{guia.id}</td>
              <td>{guia.fatura}</td>
              <td style={{ fontFamily: 'monospace' }}>{guia.carteirinha}</td>
              <td>{guia.paciente}</td>
              <td>{guia.convenio}</td>
              <td>{guia.procedimento}</td>
              <td style={{ fontWeight: 'bold' }}>R$ {guia.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td>
                <span style={getBadgeStatusGuia(guia.status)}>{guia.status.replace('_', ' ')}</span>
              </td>
              <td className="no-print">
                {guia.status === 'AGUARDANDO_ENVIO' && <button onClick={() => alterarStatusGuia(guia.id, 'ENVIADO')} className="btn-action-table">Incluir no Lote</button>}
                {guia.status === 'ENVIADO' && <button onClick={() => alterarStatusGuia(guia.id, 'PAGO')} className="btn-action-table-success">Dar Baixa (Pago)</button>}
                {guia.status === 'GLOSADO' && <button onClick={() => alterarStatusGuia(guia.id, 'AGUARDANDO_ENVIO')} className="btn-action-table-danger">Revisar Recusa</button>}
                {guia.status === 'PAGO' && <span style={{ fontSize: '12px', color: '#16a085', fontWeight: 'bold' }}>Finalizado</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}