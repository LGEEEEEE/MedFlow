import { useEquipe } from '../../hooks/useEquipe';

export default function AdminEquipe() {
  const {
    usuarios, modalUsuario, setModalUsuario, formUsuario,
    handleChange, salvarUsuario, excluirUsuario, abrirEdicao
  } = useEquipe();

  return (
    <div className="fade-animation panel-white">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: '0 0 20px 0', color: '#2c3e50', fontSize: '18px' }}>Usuários Cadastrados</h3>
        <button onClick={() => setModalUsuario(true)} className="btn-primary no-print">+ Novo Usuário</button>
      </div>
      <table className="medflow-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>CPF/Registro</th>
            <th>Contato</th>
            <th>Cargo</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map(u => (
            <tr key={u.id}>
              <td>{u.nome}</td>
              <td>{u.cpf || 'N/A'}<br /><small>{u.registro || 'Sem Registro'}</small></td>
              <td>{u.telefone || 'N/A'}</td>
              <td>{u.cargo}</td>
              <td>
                <button onClick={() => abrirEdicao(u)} style={{ background: '#f39c12', color: '#fff', marginRight: '5px' }} className="btn-style">Editar</button>
                <button onClick={() => excluirUsuario(u.id)} style={{ background: '#e74c3c', color: '#fff' }} className="btn-style">Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalUsuario && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ maxWidth: '600px' }}>
            <h3 style={{ margin: '0 0 20px 0', color: '#2c3e50', fontSize: '18px' }}>Cadastrar Novo Usuário</h3>
            <form onSubmit={salvarUsuario} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div className="input-group">
                  <label className="label-style">Nome Completo</label>
                  <input type="text" value={formUsuario.nome} onChange={handleChange('nome')} required className="input-style" />
                </div>
                <div className="input-group">
                  <label className="label-style">E-mail (Login)</label>
                  <input type="email" value={formUsuario.email} onChange={handleChange('email')} required className="input-style" />
                </div>
                <div className="input-group">
                  <label className="label-style">CPF</label>
                  <input type="text" value={formUsuario.cpf} onChange={handleChange('cpf')} className="input-style" placeholder="000.000.000-00" maxLength="14" />
                </div>
                <div className="input-group">
                  <label className="label-style">Registro Profissional (CRM/Coren)</label>
                  <input type="text" value={formUsuario.registro} onChange={handleChange('registro')} className="input-style" />
                </div>
                <div className="input-group">
                  <label className="label-style">Telefone</label>
                  <input type="text" value={formUsuario.telefone} onChange={handleChange('telefone')} className="input-style" placeholder="(00) 00000-0000" maxLength="15" />
                </div>
                <div className="input-group">
                  <label className="label-style">Especialidade/Depto</label>
                  <input type="text" value={formUsuario.especialidade} onChange={handleChange('especialidade')} className="input-style" />
                </div>
                <div className="input-group">
                  <label className="label-style">Perfil de Acesso (Cargo)</label>
                  <select value={formUsuario.cargo} onChange={handleChange('cargo')} required className="input-style">
                    <option value="RECEPCAO">Recepção</option>
                    <option value="TRIAGEM">Triagem</option>
                    <option value="MEDICO">Médico</option>
                    <option value="EXAMES">SADT / Exames</option>
                    <option value="ADMIN">Administrador</option>
                  </select>
                </div>
                <div className="input-group">
                  <label className="label-style">Senha Provisória</label>
                  <input type="password" value={formUsuario.senha} onChange={handleChange('senha')} required className="input-style" />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px', gridColumn: '1 / -1' }}>
                <button type="button" onClick={() => setModalUsuario(false)} className="btn-danger">Cancelar</button>
                <button type="submit" className="btn-primary">Salvar Usuário</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}