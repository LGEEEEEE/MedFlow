import { useFinanceiro } from '../../hooks/useFinanceiro';

export default function AdminFinanceiro() {
  const {
    extratoFiltrado,
    filtroData, setFiltroData,
    modalTransacao, setModalTransacao,
    formTransacao, setFormTransacao,
    salvarTransacao, excluirTransacao, editarTransacao, imprimirRelatorio
  } = useFinanceiro();

  return (
    <div className="fade-animation print-area panel-white">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: '0 0 20px 0', color: '#2c3e50', fontSize: '18px' }}>Extrato e Relatórios (Fluxo de Caixa)</h3>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }} className="no-print">
          <input type="date" value={filtroData.inicio} onChange={e => setFiltroData({ ...filtroData, inicio: e.target.value })} className="input-filter-style" />
          <span style={{ color: '#7f8c8d', fontWeight: 'bold' }}>até</span>
          <input type="date" value={filtroData.fim} onChange={e => setFiltroData({ ...filtroData, fim: e.target.value })} className="input-filter-style" />

          <button onClick={() => { setFormTransacao({ descricao: '', fonte: '', valor: '', tipo: 'entrada', data: new Date().toISOString().split('T')[0] }); setModalTransacao(true); }} className="btn-primary">+ Nova Transação</button>
          <button onClick={imprimirRelatorio} className="btn-success">Imprimir / Gerar PDF</button>
        </div>
      </div>

      <table className="medflow-table">
        <thead>
          <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dfe6e9' }}>
            <th>Data</th>
            <th>Descrição</th>
            <th>Fonte / Destino</th>
            <th>Valor</th>
            <th className="no-print">Ações</th>
          </tr>
        </thead>
        <tbody>
          {extratoFiltrado.length === 0 ? (
            <tr><td colSpan="5" style={{ padding: '30px', textAlign: 'center', color: '#95a5a6', fontStyle: 'italic' }}>Nenhuma transação encontrada no período selecionado.</td></tr>
          ) : (
            extratoFiltrado.map(item => (
              <tr key={item.id} style={{ borderBottom: '1px solid #f0f2f5' }}>
                <td style={{ padding: '15px', fontSize: '14px', color: '#34495e', verticalAlign: 'middle' }}>{item.data.split('T')[0].split('-').reverse().join('/')}</td>
                <td style={{ padding: '15px', fontSize: '14px', color: '#34495e', verticalAlign: 'middle' }}>{item.descricao}</td>
                <td style={{ padding: '15px', fontSize: '14px', color: '#34495e', verticalAlign: 'middle' }}>{item.fonte}</td>
                <td style={{ padding: '15px', fontSize: '14px', verticalAlign: 'middle', color: item.tipo === 'entrada' ? '#27ae60' : item.tipo === 'saida' ? '#e74c3c' : '#2980b9', fontWeight: 'bold' }}>
                  {item.tipo === 'saida' ? '- ' : item.tipo === 'entrada' ? '+ ' : ''}
                  R$ {Math.abs(item.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </td>
                <td style={{ padding: '15px', fontSize: '14px', verticalAlign: 'middle' }} className="no-print">
                  <button onClick={() => editarTransacao(item)} className="btn-style" style={{ background: '#f39c12', color: '#fff', marginRight: '5px' }}>Editar</button>
                  <button onClick={() => excluirTransacao(item.id)} className="btn-style" style={{ background: '#e74c3c', color: '#fff' }}>Excluir</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {modalTransacao && (
        <div className="modal-overlay no-print">
          <div className="modal-box">
            <h3 style={{ margin: '0 0 20px 0', color: '#2c3e50', fontSize: '18px' }}>{formTransacao.id ? 'Editar Transação' : 'Nova Receita / Despesa'}</h3>
            <form onSubmit={salvarTransacao} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div className="input-group">
                <label className="label-style">Tipo de Movimentação</label>
                <select value={formTransacao.tipo} onChange={e => setFormTransacao({ ...formTransacao, tipo: e.target.value })} className="input-style">
                  <option value="entrada">Receita (Entrada)</option>
                  <option value="saida">Despesa (Saída)</option>
                </select>
              </div>
              <div className="input-group">
                <label className="label-style">Descrição</label>
                <input type="text" value={formTransacao.descricao} onChange={e => setFormTransacao({ ...formTransacao, descricao: e.target.value })} required className="input-style" placeholder="Ex: Conta de Luz, Consulta Particular..." />
              </div>
              <div className="input-group">
                <label className="label-style">Fonte / Destino</label>
                <input type="text" value={formTransacao.fonte} onChange={e => setFormTransacao({ ...formTransacao, fonte: e.target.value })} required className="input-style" placeholder="Ex: Cartão, Pix, CEB..." />
              </div>
              <div className="input-group">
                <label className="label-style">Valor (R$)</label>
                <input type="number" step="0.01" value={formTransacao.valor} onChange={e => setFormTransacao({ ...formTransacao, valor: e.target.value })} required className="input-style" />
              </div>
              <div className="input-group">
                <label className="label-style">Data</label>
                <input type="date" value={formTransacao.data} onChange={e => setFormTransacao({ ...formTransacao, data: e.target.value })} required className="input-style" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setModalTransacao(false)} className="btn-danger">Cancelar</button>
                <button type="submit" className="btn-primary">Salvar Registro</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}