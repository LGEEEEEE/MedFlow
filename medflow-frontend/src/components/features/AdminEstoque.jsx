import { useEstoque } from '../../hooks/useEstoque';

export default function AdminEstoque() {
  const { 
    estoque, modalEstoque, setModalEstoque, 
    formEstoque, setFormEstoque, salvarEstoque 
  } = useEstoque();

  return (
    <div className="fade-animation panel-white">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: '0 0 20px 0', color: '#2c3e50', fontSize: '18px' }}>Inventário da Clínica</h3>
        <button onClick={() => setModalEstoque(true)} className="btn-primary no-print">+ Entrada de Nota Fiscal</button>
      </div>
      
      <table className="medflow-table">
        <thead>
          <tr>
            <th>Código</th>
            <th>Produto / Insumo</th>
            <th>Quantidade Atual</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {estoque.map(item => (
            <tr key={item.id}>
              <td>#{item.id.toString().padStart(4, '0')}</td>
              <td><strong>{item.nome}</strong></td>
              <td>{item.amount || item.quantidade} un</td>
              <td>
                <span className={(item.amount || item.quantidade) < 20 ? 'badge-danger' : 'badge-success'}>
                  {(item.amount || item.quantidade) < 20 ? 'CRÍTICO / BAIXO' : 'NORMAL'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalEstoque && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3 style={{ margin: '0 0 20px 0', color: '#2c3e50', fontSize: '18px' }}>Entrada de Nota Fiscal / Estoque</h3>
            <form onSubmit={salvarEstoque} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '13px', color: '#7f8c8d', fontWeight: 'bold' }}>Nome do Insumo / Produto</label>
                <input 
                  type="text" 
                  value={formEstoque.nome} 
                  onChange={e => setFormEstoque({ ...formEstoque, nome: e.target.value })} 
                  placeholder="Ex: Gaze Estéril" 
                  required 
                  className="input-style" 
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '13px', color: '#7f8c8d', fontWeight: 'bold' }}>Quantidade Adicionada</label>
                <input 
                  type="number" 
                  value={formEstoque.quantidade} 
                  onChange={e => setFormEstoque({ ...formEstoque, quantidade: e.target.value })} 
                  placeholder="Apenas números" 
                  required 
                  className="input-style" 
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setModalEstoque(false)} className="btn-danger">Cancelar</button>
                <button type="submit" className="btn-primary">Gravar Estoque</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}