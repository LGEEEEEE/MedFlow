import { useExames } from '../hooks/useExames';
import { Toaster } from 'react-hot-toast';

export default function Exames() {
  const {
    pedidosPendentes, exameAtual, selecionarExame,
    resultado, setResultado,
    setLaudoPdf,
    salvarLaudo
  } = useExames();

  const renderBadgePrioridade = (prioridade) => {
    if (prioridade === 'Vermelho') return <span style={{ backgroundColor: '#fee2e2', color: '#ef4444', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>EMERGÊNCIA</span>;
    if (prioridade === 'Amarelo') return <span style={{ backgroundColor: '#fef3c7', color: '#f59e0b', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>URGENTE</span>;
    return <span style={{ backgroundColor: '#d1fae5', color: '#10b981', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>ROTINA</span>;
  };

  return (
    <div className="fade-animation" style={{ padding: '30px', minHeight: 'calc(100vh - 70px)' }}>
      <Toaster position="top-right" />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ margin: 0, color: '#2c3e50' }}>SADT - Exames e Laudos</h2>
          <p style={{ color: '#7f8c8d', margin: '5px 0 0 0' }}>Centro de diagnóstico laboratorial e de imagem.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', alignItems: 'start' }}>
        
        {/* COLUNA ESQUERDA: Fila de Pedidos */}
        <section className="panel">
          <h3 style={{ margin: '0 0 15px 0', color: '#1e293b', fontSize: '16px' }}>Pedidos Pendentes ({pedidosPendentes.length})</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '70vh', overflowY: 'auto' }}>
            {pedidosPendentes.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#94a3b8', padding: '30px 0' }}>Nenhum exame pendente no momento.</p>
            ) : (
              pedidosPendentes.map(pedido => (
                <div 
                  key={pedido.id} 
                  onClick={() => selecionarExame(pedido)}
                  style={{ 
                    padding: '15px', 
                    backgroundColor: exameAtual?.id === pedido.id ? '#eff6ff' : '#fff',
                    border: `1px solid ${exameAtual?.id === pedido.id ? '#3b82f6' : '#e2e8f0'}`,
                    borderRadius: '8px', cursor: 'pointer', transition: '0.2s' 
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <strong style={{ color: '#1e3a8a', fontSize: '14px' }}>{pedido.exame}</strong>
                    {renderBadgePrioridade(pedido.prioridade)}
                  </div>
                  <div style={{ fontSize: '13px', color: '#475569', marginBottom: '4px' }}>
                    <strong>Paciente:</strong> {pedido.paciente?.nome || 'Desconhecido'}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    <strong>Categoria:</strong> {pedido.categoria}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* COLUNA DIREITA: Anexar Laudo */}
        <section className="panel" style={{ minHeight: '400px' }}>
          {!exameAtual ? (
            <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', flexDirection: 'column', gap: '10px', padding: '50px 0' }}>
              <i className="bi bi-file-earmark-medical" style={{ fontSize: '48px', color: '#cbd5e1' }}></i>
              <p>Selecione um pedido na fila para anexar o laudo.</p>
            </div>
          ) : (
            <div className="fade-animation">
              <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '15px', marginBottom: '20px' }}>
                <h3 style={{ margin: '0 0 5px 0', color: '#1e3a8a', fontSize: '18px' }}>Emitir Laudo</h3>
                <p style={{ margin: 0, color: '#475569', fontSize: '14px' }}>
                  A anexar resultado para: <strong>{exameAtual.exame}</strong>
                </p>
              </div>

              <div style={{ backgroundColor: '#f8fafc', padding: '15px', borderRadius: '6px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                <strong style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase' }}>Justificativa Médica:</strong>
                <p style={{ margin: '5px 0 0 0', fontSize: '13px', color: '#334155' }}>{exameAtual.justificativa || 'Não informada'}</p>
              </div>

              <form onSubmit={salvarLaudo} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label className="form-label">Anotações do Técnico / Resultado Parcial</label>
                  <textarea 
                    className="form-input" 
                    rows="4" 
                    placeholder="Registe aqui as observações ou os valores de referência..."
                    value={resultado} 
                    onChange={e => setResultado(e.target.value)} 
                    style={{ resize: 'vertical' }}
                    required
                  ></textarea>
                </div>

                <div>
                  <label className="form-label">Anexar Ficheiro PDF (Laudo Completo)</label>
                  <input 
                    type="file" 
                    accept="application/pdf" 
                    onChange={e => setLaudoPdf(e.target.files[0])} 
                    className="form-input" 
                    style={{ padding: '10px', backgroundColor: '#f8fafc' }}
                  />
                  <small style={{ color: '#94a3b8', display: 'block', marginTop: '5px' }}>Opcional. Apenas ficheiros .pdf</small>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                  <button type="submit" className="btn-primary" style={{ padding: '12px 24px' }}>
                    Guardar e Enviar para o Médico
                  </button>
                </div>
              </form>
            </div>
          )}
        </section>

      </div>
    </div>
  );
}