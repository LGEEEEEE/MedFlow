import { useCadastro } from '../../hooks/useCadastro';

export default function ModalCadastro({ fecharModal, atualizarFila }) {
  // Conectando com o nosso Hook
  const { form, handleChange, handleCep, handleSalvar } = useCadastro(fecharModal, atualizarFila);

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h2 style={{ marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
          Cadastro do Paciente
        </h2>

        <form onSubmit={handleSalvar} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={gridStyle}>
            <input type="text" placeholder="Nome Completo" value={form.nome} onChange={handleChange('nome')} required maxLength="100" style={inputStyle} />
            <input type="text" placeholder="CPF" value={form.cpf} onChange={handleChange('cpf')} required style={inputStyle} />

            <input type="date" value={form.dataNascimento} onChange={handleChange('dataNascimento')} required style={inputStyle} />
            <select value={form.sexo} onChange={handleChange('sexo')} required style={inputStyle}>
              <option value="">Sexo...</option>
              <option value="M">Masculino</option>
              <option value="F">Feminino</option>
            </select>

            <input type="email" placeholder="E-mail" value={form.email} onChange={handleChange('email')} maxLength="100" style={inputStyle} />
            <input type="text" placeholder="WhatsApp" value={form.whatsapp} onChange={handleChange('whatsapp')} required style={inputStyle} />

            <input type="text" placeholder="CEP" value={form.cep} onChange={handleCep} required style={inputStyle} />
            <input type="text" placeholder="Endereço" value={form.endereco} onChange={handleChange('endereco')} required maxLength="150" style={inputStyle} />
            <input type="text" placeholder="Número" value={form.numero} onChange={handleChange('numero')} required maxLength="20" style={inputStyle} />
            <input type="text" placeholder="Bairro" value={form.bairro} onChange={handleChange('bairro')} required maxLength="100" style={inputStyle} />
            <input type="text" placeholder="Cidade" value={form.cidade} onChange={handleChange('cidade')} required maxLength="100" style={inputStyle} />
            <input type="text" placeholder="UF" value={form.uf} onChange={handleChange('uf')} required maxLength="2" style={inputStyle} />

            <input type="text" placeholder="Nome da Mãe" value={form.nomeMae} onChange={handleChange('nomeMae')} maxLength="100" style={inputStyle} />
            <input type="text" placeholder="Responsável/Acompanhante" value={form.responsavel} onChange={handleChange('responsavel')} maxLength="100" style={inputStyle} />
            <input type="text" placeholder="CPF do Responsável" value={form.cpfResponsavel} onChange={handleChange('cpfResponsavel')} style={inputStyle} />
            <input type="text" placeholder="Parentesco" value={form.parentesco} onChange={handleChange('parentesco')} maxLength="50" style={inputStyle} />

            <select value={form.convenio} onChange={handleChange('convenio')} style={inputStyle}>
              <option value="PARTICULAR">Particular</option>
              <option value="AMIL">Amil</option>
              <option value="BRADESCO">Bradesco Saúde</option>
              <option value="UNIMED">Unimed</option>
              <option value="HAPVIDA_GNDI">Hapvida NotreDame Intermédica</option>
              <option value="SULAMERICA">SulAmérica Saúde</option>
              <option value="PORTO_SEGURO">Porto Saúde</option>
              <option value="PREVENT_SENIOR">Prevent Senior</option>
              <option value="MEDSENIOR">Medsenior</option>
              <option value="ASSIM">Assim Saúde</option>
              <option value="ALICE">Alice Saúde</option>
              <option value="SAO_CRISTOVAO">São Cristóvão Saúde</option>
              <option value="TRASMONTANO">Trasmontano</option>
              <option value="ALLIANZ">Allianz Saúde</option>
              <option value="SANTA_HELENA">Santa Helena Saúde</option>
              <option value="BIO_SAUDE">Bio Saúde</option>
              <option value="BLUE_MED">Blue Med</option>
              <option value="TOTAL_MEDCARE">Total Medcare</option>
              <option value="UNIHOSP">Unihosp</option>

              {/* Adicione os outros convênios aqui */}
            </select>
            <input type="text" placeholder="Nº Carteirinha" value={form.numCarteirinha} onChange={handleChange('numCarteirinha')} maxLength="30" style={inputStyle} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <button type="button" onClick={fecharModal} style={btnSairStyle}>Sair</button>
            <button type="submit" style={btnSalvarStyle}>Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
}


const overlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
const modalStyle = { backgroundColor: 'white', padding: '30px', borderRadius: '8px', width: '800px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' };
const gridStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' };
const inputStyle = { padding: '10px', border: '1px solid #ccc', borderRadius: '4px', width: '100%', boxSizing: 'border-box' };
const btnSairStyle = { padding: '10px 20px', cursor: 'pointer', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: '#fff' };
const btnSalvarStyle = { padding: '10px 20px', cursor: 'pointer', border: 'none', borderRadius: '4px', backgroundColor: '#3498db', color: 'white', fontWeight: 'bold' };