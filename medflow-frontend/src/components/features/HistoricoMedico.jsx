import { useHistoricoMedico } from '../../hooks/useHistoricoMedico';

export default function HistoricoMedico() {
  const { 
    filtroBusca, setFiltroBusca, 
    detalheHistorico, setDetalheHistorico, 
    historicoFiltrado 
  } = useHistoricoMedico();

  return (
    <>
      <section className="panel" style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, color: '#1e293b' }}>Prontuários Finalizados</h3>
          <input 
            type="text" 
            placeholder="Buscar por Nome ou CPF..." 
            value={filtroBusca} 
            onChange={(e) => setFiltroBusca(e.target.value)} 
            style={{ padding: '10px 15px', borderRadius: '6px', border: '1px solid #cbd5e1', width: '350px', fontSize: '13px' }} 
          />
        </div>
        <table className="medflow-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
              <th style={thStyle}>Data</th>
              <th style={thStyle}>Paciente</th>
              <th style={thStyle}>CPF</th>
              <th style={thStyle}>Convênio</th>
              <th style={thStyle}>Ação</th>
            </tr>
          </thead>
          <tbody>
            {historicoFiltrado.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>Nenhum registo encontrado.</td></tr>
            ) : (
              historicoFiltrado.map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={tdStyle}>{new Date(item.createdAt).toLocaleDateString('pt-BR')}</td>
                  <td style={tdStyle}>{item.paciente?.nome}</td>
                  <td style={tdStyle}>{item.paciente?.cpf}</td>
                  <td style={tdStyle}>{item.convenio}</td>
                  <td style={{ padding: '12px' }}>
                    <button onClick={() => setDetalheHistorico(item)} style={btnVerProntuario}>Ver Prontuário</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

      {/* MODAL DE DETALHES DO PRONTUÁRIO */}
      {detalheHistorico && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '15px', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, color: '#1e293b', fontSize: '18px' }}>Prontuário: {detalheHistorico.paciente?.nome}</h2>
              <button onClick={() => setDetalheHistorico(null)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748b' }}>&times;</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={infoBoxStyle}>
                <h4 style={infoTitleStyle}>Data do Atendimento</h4>
                <p style={infoTextStyle}>{new Date(detalheHistorico.createdAt).toLocaleString('pt-BR')}</p>
              </div>
              <div style={infoBoxStyle}>
                <h4 style={infoTitleStyle}>Relatório Médico</h4>
                <p style={{ ...infoTextStyle, whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>{detalheHistorico.sintomas || 'Não registado'}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Estilos isolados do Histórico
const thStyle = { padding: '12px', textAlign: 'left', color: '#475569', fontSize: '13px' };
const tdStyle = { padding: '12px', fontSize: '14px', color: '#1e293b' };
const btnVerProntuario = { padding: '6px 12px', backgroundColor: '#334155', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' };
const overlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
const modalStyle = { backgroundColor: '#fff', padding: '25px', borderRadius: '8px', width: '600px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', boxSizing: 'border-box' };
const infoBoxStyle = { backgroundColor: '#f8fafc', padding: '15px', borderRadius: '6px', border: '1px solid #e2e8f0' };
const infoTitleStyle = { margin: '0 0 5px 0', color: '#475569', fontSize: '13px', textTransform: 'uppercase' };
const infoTextStyle = { margin: 0, fontSize: '14px', color: '#1e293b' };