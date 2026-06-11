import { useTriagem } from '../hooks/useTriagem';
import { Toaster } from 'react-hot-toast';

export default function Triagem() {
  const {
    fila, pacienteAtual, selecionarPaciente,
    formTriagem, handleChange, salvarTriagem
  } = useTriagem();

  return (
    <div className="fade-animation" style={{ padding: '30px', minHeight: 'calc(100vh - 70px)' }}>
      <Toaster position="top-right" />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ margin: 0, color: '#2c3e50' }}>Triagem e Enfermagem</h2>
          <p style={{ color: '#7f8c8d', margin: '5px 0 0 0' }}>Classificação de risco e recolha de sinais vitais.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '25px', alignItems: 'start' }}>
        
        {/* COLUNA ESQUERDA: Fila de Espera */}
        <section className="panel">
          <h3 style={{ margin: '0 0 15px 0', color: '#1e293b', fontSize: '16px' }}>Aguardando Triagem ({fila.length})</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {fila.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '14px', padding: '20px 0' }}>Fila vazia.</p>
            ) : (
              fila.map(paciente => (
                <div
                  key={paciente.id}
                  onClick={() => selecionarPaciente(paciente)}
                  style={{
                    padding: '15px', 
                    backgroundColor: pacienteAtual?.id === paciente.id ? '#eff6ff' : '#fff',
                    border: `1px solid ${pacienteAtual?.id === paciente.id ? '#3b82f6' : '#e2e8f0'}`,
                    borderRadius: '8px', cursor: 'pointer', transition: '0.2s',
                    boxShadow: pacienteAtual?.id === paciente.id ? '0 2px 4px rgba(59, 130, 246, 0.1)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <strong style={{ color: '#1e293b', fontSize: '14px' }}>{paciente.paciente?.nome || paciente.nome}</strong>
                    <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#3b82f6' }}>#{paciente.id.substring(0, 5).toUpperCase()}</span>
                  </div>
                  <span style={{ fontSize: '12px', color: '#64748b', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>
                    {paciente.convenio || 'PARTICULAR'}
                  </span>
                </div>
              ))
            )}
          </div>
        </section>

        {/* COLUNA DIREITA: Formulário de Sinais Vitais */}
        <section className="panel" style={{ minHeight: '400px' }}>
          {!pacienteAtual ? (
            <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', flexDirection: 'column', gap: '10px', padding: '50px 0' }}>
              <i className="bi bi-clipboard2-pulse" style={{ fontSize: '48px', color: '#cbd5e1' }}></i>
              <p>Selecione um paciente na fila ao lado para iniciar a triagem.</p>
            </div>
          ) : (
            <div className="fade-animation">
              <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '15px', marginBottom: '20px' }}>
                <h3 style={{ margin: '0 0 5px 0', color: '#1e3a8a', fontSize: '18px' }}>Ficha de Sinais Vitais</h3>
                <p style={{ margin: 0, color: '#475569', fontSize: '14px' }}>Paciente: <strong>{pacienteAtual.paciente?.nome || pacienteAtual.nome}</strong></p>
              </div>

              <form onSubmit={salvarTriagem} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px' }}>
                  <div>
                    <label className="form-label">Pressão (PA)</label>
                    <input type="text" className="form-input" placeholder="Ex: 120/80" value={formTriagem.pressao} onChange={handleChange('pressao')} required />
                  </div>
                  <div>
                    <label className="form-label">Temp. (ºC)</label>
                    <input type="number" step="0.1" className="form-input" placeholder="Ex: 36.5" value={formTriagem.temperatura} onChange={handleChange('temperatura')} required />
                  </div>
                  <div>
                    <label className="form-label">SpO2 (%)</label>
                    <input type="number" className="form-input" placeholder="Ex: 98" value={formTriagem.saturacao} onChange={handleChange('saturacao')} required />
                  </div>
                  <div>
                    <label className="form-label">Peso (kg)</label>
                    <input type="number" step="0.1" className="form-input" placeholder="Ex: 70" value={formTriagem.peso} onChange={handleChange('peso')} />
                  </div>
                </div>

                <div>
                  <label className="form-label">Queixa Principal / Observações</label>
                  <textarea
                    className="form-input"
                    rows="4"
                    placeholder="Descreva os sintomas relatados pelo paciente..."
                    value={formTriagem.queixa}
                    onChange={handleChange('queixa')}
                    required
                    style={{ resize: 'vertical' }}
                  ></textarea>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                  <button type="submit" className="btn-primary" style={{ padding: '12px 24px', fontSize: '14px' }}>
                    Registar Triagem e Chamar Médico
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