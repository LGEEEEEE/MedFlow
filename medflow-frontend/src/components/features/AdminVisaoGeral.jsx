import { useVisaoGeral } from '../../hooks/useVisaoGeral';

export default function AdminVisaoGeral() {
  const { metricas } = useVisaoGeral();

  return (
    <div className="fade-animation">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: '10px', borderBottom: '4px solid #3498db' }}>
          <span style={{ color: '#7f8c8d', fontSize: '13px', textTransform: 'uppercase', fontWeight: 'bold' }}>Pacientes Hoje</span>
          <span style={{ color: '#2c3e50', fontSize: '28px', fontWeight: 'bold' }}>{metricas.atendimentosHoje}</span>
        </div>
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: '10px', borderBottom: '4px solid #2ecc71' }}>
          <span style={{ color: '#7f8c8d', fontSize: '13px', textTransform: 'uppercase', fontWeight: 'bold' }}>Faturamento Previsto (Mês)</span>
          <span style={{ color: '#27ae60', fontSize: '28px', fontWeight: 'bold' }}>
            R$ {metricas.faturamentoMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: '10px', borderBottom: '4px solid #e74c3c' }}>
          <span style={{ color: '#7f8c8d', fontSize: '13px', textTransform: 'uppercase', fontWeight: 'bold' }}>Alertas de Estoque</span>
          <span style={{ color: '#c0392b', fontSize: '28px', fontWeight: 'bold' }}>
            {metricas.alertasEstoque} itens a acabar
          </span>
        </div>
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: '10px', borderBottom: '4px solid #f1c40f' }}>
          <span style={{ color: '#7f8c8d', fontSize: '13px', textTransform: 'uppercase', fontWeight: 'bold' }}>Utilizadores Ativos</span>
          <span style={{ color: '#2c3e50', fontSize: '28px', fontWeight: 'bold' }}>{metricas.usuariosAtivos}</span>
        </div>
      </div>

      <div className="panel-white" style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
        <h3 style={{ margin: '0 0 20px 0', color: '#2c3e50', fontSize: '18px' }}>Avisos do Sistema MedFlow</h3>
        <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <li style={{ padding: '12px', backgroundColor: '#fff3e0', borderLeft: '4px solid #e67e22', borderRadius: '4px', fontSize: '14px', color: '#d35400' }}>
            <strong>Estoque:</strong> O sistema detetou {metricas.alertasEstoque} itens em nível crítico. Necessária reposição.
          </li>
          <li style={{ padding: '12px', backgroundColor: '#e1f5fe', borderLeft: '4px solid #3498db', borderRadius: '4px', fontSize: '14px', color: '#2980b9' }}>
            <strong>Atualização:</strong> O módulo de disparo de WhatsApp foi ativado com sucesso para a Receção.
          </li>
          <li style={{ padding: '12px', backgroundColor: '#e8f8f5', borderLeft: '4px solid #2ecc71', borderRadius: '4px', fontSize: '14px', color: '#27ae60' }}>
            <strong>Financeiro:</strong> Lote de repasse dos convénios está pronto para ser sincronizado.
          </li>
        </ul>
      </div>
    </div>
  );
}