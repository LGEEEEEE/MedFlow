import { useAgendamento } from '../../hooks/useAgendamento';

export default function ModalExame({ fecharModal, atualizarFila }) {
  const { form, setForm, buscarPacientePorCpf, buscarCep, salvarAgendamento } = useAgendamento(fecharModal, atualizarFila, 'exame');

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ width: '700px', maxHeight: '90vh', overflowY: 'auto' }}>
        <h3 style={{ marginTop: 0, color: '#2c3e50', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Agendar Exame SADT</h3>
        <form onSubmit={salvarAgendamento} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>CPF (Digite para autocompletar)</label>
              <input type="text" placeholder="Apenas números" value={form.cpf} onChange={e => setForm({ ...form, cpf: e.target.value.replace(/\D/g, '').slice(0, 11) })} onBlur={(e) => buscarPacientePorCpf(e.target.value)} required style={{ ...inputStyle, border: '2px solid #3498db' }} />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Nome do Paciente</label>
              <input type="text" value={form.pacienteNome} onChange={e => setForm({ ...form, pacienteNome: e.target.value })} required style={inputStyle} />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Tipo de Exame</label>
              <select value={form.tipoExame} onChange={e => setForm({ ...form, tipoExame: e.target.value })} required style={inputStyle}>
                <option value="">Selecione...</option>
                <option value="HEMOGRAMA">Hemograma Completo</option>
                <option value="USG_ABDOME">Ultrassonografia de Abdome Total</option>
                <option value="RX_TORAX">Raio-X de Tórax</option>
                {/* Cole o resto dos seus options originais aqui! */}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Data do Exame</label>
              <input type="date" value={form.data} onChange={e => setForm({ ...form, data: e.target.value })} required style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>Preparo / Recomendações</label>
              <input type="text" placeholder="Ex: Jejum 8h" value={form.preparo} onChange={e => setForm({ ...form, preparo: e.target.value })} style={inputStyle} />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button type="button" onClick={fecharModal} className="btn-cancel">Cancelar</button>
            <button type="submit" className="btn-primary">Gravar Exame</button>
          </div>
        </form>
      </div>
    </div>
  );
}

const labelStyle = { display: 'block', fontSize: '13px', color: '#7f8c8d', marginBottom: '5px', fontWeight: '600' };
const inputStyle = { padding: '10px 12px', borderRadius: '6px', border: '1px solid #dfe6e9', fontSize: '14px', width: '100%', boxSizing: 'border-box' };