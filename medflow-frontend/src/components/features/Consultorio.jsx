import { useConsultorio } from '../../hooks/useConsultorio';
import toast from 'react-hot-toast';

export default function Consultorio() {
  const {
    fila, pacienteAtual,
    ficha, setFicha, toggleArray, mascaraPA,
    relatorio, setRelatorio,
    modalSADT, setModalSADT, formSADT, setFormSADT,
    chamarPaciente, finalizarAtendimento, handleSalvarExame
  } = useConsultorio();

  // Listas de opções visuais
  const examesDisponiveis = {
    Laboratoriais: ['Hemograma Completo', 'Glicemia de Jejum', 'Colesterol Total e Fracoes', 'TSH e T4 Livre', 'Urina Tipo I (EAS)'],
    Imagem: ['Raio-X de Torax (PA e Perfil)', 'Tomografia Computadorizada de Cranio', 'Ressonancia Magnetica de Coluna', 'Ultrassonografia de Abdome Total'],
    Cardiologico: ['Eletrocardiograma (ECG)', 'Ecocardiograma Transtoracico', 'Holter 24h', 'Teste Ergometrico']
  };

  const condutasAltaList = [
    "Prescrevo sintomáticos para uso domiciliar, com orientações e efeitos colaterais",
    "Atestado médico com autorização de divulgação de CID",
    "Solicito exame complementar ambulatorial",
    "Encaminho ao ambulatório de especialidades",
    "Oriento paciente, sano dúvidas, reforço sinais de alarme que, se presentes, devem motivar retorno imediato ao pronto-socorro para reavaliação médica."
  ];

  const condutasInternacaoList = [
    "Antibioticoterapia endovenosa",
    "Controle álgico",
    "Vigilância clínica e avaliação com especialista",
    "Solicito vaga de UTI"
  ];

  // Renderizadores dinâmicos usando as novas classes CSS
  const renderPill = (field, value, label = value) => {
    const isActive = Array.isArray(ficha[field]) ? ficha[field].includes(value) : ficha[field] === value;
    return (
      <button key={value} onClick={() => Array.isArray(ficha[field]) ? toggleArray(field, value) : setFicha({ ...ficha, [field]: value })} className={`btn-pill ${isActive ? 'active' : ''}`}>
        {label}
      </button>
    );
  };

  const renderTab = (field, value, label = value) => {
    const isActive = ficha[field] === value;
    return (
      <div key={value} onClick={() => setFicha({ ...ficha, [field]: value, condutas: [] })} className={`btn-tab ${isActive ? 'active' : ''}`}>
        {label}
      </div>
    );
  };

  const copiarTexto = () => {
    navigator.clipboard.writeText(relatorio);
    toast.success('Prontuário copiado!');
  };


  const calcularIdade = (dataNascimento) => {
    if (!dataNascimento) return '--';
    const hoje = new Date();
    const nasc = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nasc.getFullYear();
    const mes = hoje.getMonth() - nasc.getMonth();

    if (mes < 0 || (mes === 0 && hoje.getDate() < nasc.getDate())) {
      idade--;
    }
    return idade;
  };

  return (
    <>
      {!pacienteAtual && (
        <section className="panel">
          <h3 style={{ color: '#1e293b', marginBottom: '20px' }}>Pacientes Aguardando Atendimento</h3>
          <table className="medflow-table">
            <thead>
              <tr>
                <th>Ficha</th>
                <th>Paciente</th>
                <th>Convênio</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {fila.length === 0 ? (
                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>Consultório vazio. Nenhum paciente na fila.</td></tr>
              ) : (
                fila.map(item => (
                  <tr key={item.id}>
                    <td style={{ fontWeight: 'bold', color: '#3b82f6' }}>#{item.id.substring(0, 5).toUpperCase()}</td>
                    <td>{item.paciente?.nome || item.nome || 'Paciente Externo'}</td>
                    <td>{item.convenio}</td>
                    <td>
                      <button onClick={() => chamarPaciente(item)} className="btn-primary" style={{ padding: '8px 16px', fontSize: '12px' }}>Chamar</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      )}

      {pacienteAtual && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 350px', gap: '25px', alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>

            <div className="box-style">
              <div className="box-header"><i className="fa-solid fa-user" style={{ marginRight: '8px' }}></i> IDENTIFICAÇÃO</div>
              <div className="box-body">
                <div className="form-row">
                  <div style={{ flex: 1 }}>
                    <label className="form-label">Nº DO ATENDIMENTO / INICIAIS</label>
                    <input type="text" className="form-input" value={`#${pacienteAtual.id.substring(0, 5).toUpperCase()} - ${pacienteAtual.paciente?.nome || pacienteAtual.nome}`} readOnly />
                  </div>
                </div>
                <div className="form-row">
                  <div>
                    <label className="form-label">IDADE</label>
                    <input type="text" className="form-input" style={{ width: '80px' }} value={calcularIdade(pacienteAtual.paciente?.data_nascimento)} readOnly />
                  </div>
                  <div>
                    <label className="form-label">SEXO</label>
                    <div className="pill-group">
                      {renderPill('sexo', 'M')}
                      {renderPill('sexo', 'F')}
                    </div>
                  </div>
                </div>
                <div className="form-row">
                  <div style={{ width: '100%' }}>
                    <label className="form-label">ACOMPANHANTE</label>
                    <div className="pill-group">
                      {['Sem acompanhante', 'Filho', 'Filha', 'Esposo', 'Esposa', 'Mãe', 'Pai', 'Outro'].map(p => renderPill('acompanhante', p))}
                    </div>
                  </div>
                </div>
                <div className="form-row">
                  <div style={{ width: '100%' }}>
                    <label className="form-label">TIPO DE ATENDIMENTO</label>
                    <div className="tab-group">
                      {renderTab('tipoAtendimento', '1º Atendimento')}
                      {renderTab('tipoAtendimento', 'Reavaliação / Alta')}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="box-style">
              <div className="box-header"><i className="fa-solid fa-file-medical" style={{ marginRight: '8px' }}></i> HISTÓRIA DA DOENÇA ATUAL</div>
              <div className="box-body">
                <div className="form-row">
                  <div style={{ flex: 1 }}>
                    <label className="form-label">QUEIXA PRINCIPAL</label>
                    <input type="text" className="form-input" placeholder="ex: tosse e congestão nasal..." value={ficha.queixa} onChange={e => setFicha({ ...ficha, queixa: e.target.value })} />
                  </div>
                </div>
                <div className="form-row">
                  <div>
                    <label className="form-label">HÁ QUANTO TEMPO</label>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <input type="number" className="form-input" style={{ width: '60px' }} value={ficha.tempoValor} onChange={e => setFicha({ ...ficha, tempoValor: e.target.value })} />
                      {['h', 'dias', 'sem.', 'meses'].map(p => renderPill('tempoUnidade', p))}
                    </div>
                  </div>
                  <div>
                    <label className="form-label">CARÁTER</label>
                    <div className="pill-group">
                      {['Súbito', 'Progressivo'].map(p => renderPill('carater', p))}
                    </div>
                  </div>
                </div>
                <div className="form-row">
                  <div style={{ flex: 1 }}>
                    <label className="form-label">SINAIS/SINTOMAS ASSOCIADOS</label>
                    <input type="text" className="form-input" placeholder="ex: odinofagia, mialgia..." value={ficha.sintomasAssoc} onChange={e => setFicha({ ...ficha, sintomasAssoc: e.target.value })} />
                  </div>
                </div>
                <div className="form-row">
                  <div style={{ width: '100%' }}>
                    <label className="form-label" style={{ color: '#e74c3c' }}><i className="fa-solid fa-triangle-exclamation"></i> SINAIS DE ALARME</label>
                    <div className="pill-group">
                      {['Febre', 'Dor torácica', 'Dispneia', 'Síncope/Lipotimia', 'Sangramentos', 'Alt. neurológicas', 'Vômitos incoercíveis'].map(p => renderPill('sinaisAlarme', p))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="box-style">
              <div className="box-header"><i className="fa-solid fa-staff-snake" style={{ marginRight: '8px' }}></i> COMORBIDADES / ANTECEDENTES</div>
              <div className="box-body">
                <div className="form-row">
                  <div style={{ width: '100%' }}>
                    <div className="pill-group">
                      {['Obesidade/Sobrepeso', 'HAS', 'DM2', 'DRC', 'ICC', 'DAC', 'AVC prévio', 'Tabagismo', 'Etilismo'].map(p => renderPill('morbidades', p))}
                    </div>
                  </div>
                </div>
                <div className="form-row">
                  <div style={{ width: '100%' }}>
                    <label className="form-label">ALERGIAS?</label>
                    <div className="pill-group">
                      {['Nega alergias', 'Sim'].map(p => renderPill('alergias', p))}
                    </div>
                  </div>
                </div>
                <div className="form-row">
                  <div style={{ width: '100%' }}>
                    <label className="form-label">MEDICAMENTOS EM USO</label>
                    <input type="text" className="form-input" placeholder="Ex: Elifore 100mg 1-0-0" value={ficha.medicamentos} onChange={e => setFicha({ ...ficha, medicamentos: e.target.value })} />
                  </div>
                </div>
              </div>
            </div>

            <div className="box-style">
              <div className="box-header"><i className="fa-solid fa-stethoscope" style={{ marginRight: '8px' }}></i> EXAME FÍSICO</div>
              <div className="box-body">
                <div className="form-row">
                  <div style={{ width: '100%' }}>
                    <label className="form-label"><i className="fa-solid fa-heart-pulse"></i> SINAIS VITAIS</label>
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#475569' }}>PA</span>
                      <input type="text" className="form-input" style={{ width: '80px' }} value={ficha.vitais.pa} onChange={e => setFicha({ ...ficha, vitais: { ...ficha.vitais, pa: mascaraPA(e.target.value) } })} />
                      <span style={{ fontSize: '12px', color: '#94a3b8' }}>mmHg</span>

                      <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#475569', marginLeft: '10px' }}>FC</span>
                      <input type="text" className="form-input" style={{ width: '60px' }} value={ficha.vitais.fc} onChange={e => setFicha({ ...ficha, vitais: { ...ficha.vitais, fc: e.target.value.replace(/\D/g, '') } })} />
                      <span style={{ fontSize: '12px', color: '#94a3b8' }}>bpm</span>

                      <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#475569', marginLeft: '10px' }}>SpO2</span>
                      <input type="text" className="form-input" style={{ width: '60px' }} value={ficha.vitais.sat} onChange={e => setFicha({ ...ficha, vitais: { ...ficha.vitais, sat: e.target.value.replace(/\D/g, '') } })} />
                      <span style={{ fontSize: '12px', color: '#94a3b8' }}>%</span>

                      <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#475569', marginLeft: '10px' }}>Temp.</span>
                      <input type="text" className="form-input" style={{ width: '60px' }} value={ficha.vitais.temp} onChange={e => setFicha({ ...ficha, vitais: { ...ficha.vitais, temp: e.target.value } })} />
                      <span style={{ fontSize: '12px', color: '#94a3b8' }}>ºC</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
                  {['ESTADO GERAL', 'CARDIOVASCULAR', 'RESPIRATÓRIO', 'ABDOME', 'EXTREMIDADES', 'NEUROLÓGICO'].map(sis => (
                    <div key={sis} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                      <input type="checkbox" checked={ficha.exameFisico.includes(sis)} onChange={() => toggleArray('exameFisico', sis)} style={{ width: '16px', height: '16px' }} />
                      <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#10b981' }}>Normal</span>
                      <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#1e3a8a', marginLeft: '5px' }}>{sis}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="box-style">
              <div className="box-header"><i className="fa-solid fa-brain" style={{ marginRight: '8px', color: '#ec4899' }}></i> IMPRESSÃO CLÍNICA / HIPÓTESE DIAGNÓSTICA</div>
              <div className="box-body">
                <div className="form-row">
                  <input type="text" className="form-input" style={{ flex: 2 }} placeholder="Ex: Pneumonia?" value={ficha.impressao} onChange={e => setFicha({ ...ficha, impressao: e.target.value })} />
                  <input type="text" className="form-input" style={{ flex: 1 }} placeholder="Observação (opcional)" value={ficha.observacao} onChange={e => setFicha({ ...ficha, observacao: e.target.value })} />
                </div>
              </div>
            </div>

            <div className="box-style">
              <div className="box-header"><i className="fa-solid fa-file-prescription" style={{ marginRight: '8px', color: '#f97316' }}></i> CONDUTA</div>
              <div className="box-body">
                <div className="tab-group" style={{ marginBottom: '20px' }}>
                  {renderTab('condutaTab', 'Alta', '✓ Alta')}
                  {renderTab('condutaTab', 'Ainda no PS')}
                  {renderTab('condutaTab', 'Internação')}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {(ficha.condutaTab === 'Alta' ? condutasAltaList : condutasInternacaoList).map(cond => (
                    <div key={cond} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '6px', backgroundColor: ficha.condutas.includes(cond) ? '#f0fdf4' : '#fff' }}>
                      <input type="checkbox" checked={ficha.condutas.includes(cond)} onChange={() => toggleArray('condutas', cond)} style={{ width: '16px', height: '16px', marginTop: '2px' }} />
                      <span style={{ fontSize: '13px', color: '#334155' }}>{cond}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* SIDEBAR DE AÇÕES E PRONTUÁRIO */}
          <div style={{ position: 'sticky', top: '0', height: 'calc(100vh - 100px)' }}>
            <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' }}>
                <h4 style={{ margin: 0, color: '#1e3a8a', fontSize: '15px' }}>PRONTUÁRIO</h4>
                <span style={{ fontSize: '12px', color: '#64748b' }}>{new Date().toLocaleDateString('pt-BR')}</span>
              </div>

              <textarea
                value={relatorio}
                onChange={e => setRelatorio(e.target.value)}
                style={{ flex: 1, width: '100%', padding: '15px', borderRadius: '6px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', resize: 'none', fontFamily: 'monospace', fontSize: '13px', lineHeight: '1.6', color: '#334155', boxSizing: 'border-box' }}
                placeholder="Texto gerado automaticamente — editável."
              />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' }}>
                <button onClick={() => setModalSADT(true)} style={{ padding: '12px', backgroundColor: '#fff', border: '1px solid #3b82f6', color: '#3b82f6', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>Solicitar Exame (SADT)</button>
                <button onClick={copiarTexto} style={{ padding: '12px', backgroundColor: '#e2e8f0', color: '#1e293b', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>Copiar texto</button>

                {/* Exames já realizados */}
                {pacienteAtual.exames && pacienteAtual.exames.length > 0 && (
                  <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#eef2f5', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#1e3a8a' }}>Exames Realizados</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {pacienteAtual.exames.map(ex => (
                        <div key={ex.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: '10px', borderRadius: '6px' }}>
                          <div>
                            <strong>{ex.exame}</strong> <br />
                            <small style={{ color: '#7f8c8d' }}>Status: {ex.status}</small>
                          </div>
                          {ex.laudoPdf ? (
                            <a href={ex.laudoPdf} target="_blank" rel="noopener noreferrer" style={{ padding: '8px 15px', backgroundColor: '#e74c3c', color: '#fff', textDecoration: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '13px' }}>Abrir PDF</a>
                          ) : (
                            <span style={{ fontSize: '12px', color: '#95a5a6' }}>Sem PDF anexo</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <button onClick={finalizarAtendimento} className="btn-primary" style={{ padding: '14px', fontSize: '14px' }}>Encerrar atendimento</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE SOLICITAÇÃO DE EXAMES (SADT) */}
      {modalSADT && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '15px', marginBottom: '15px' }}>
              <h3 style={{ margin: 0, color: '#1e293b' }}>Guia de Solicitação SADT</h3>
              <button onClick={() => setModalSADT(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748b' }}>&times;</button>
            </div>
            <form onSubmit={handleSalvarExame} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label className="form-label">Prioridade</label>
                  <select value={formSADT.prioridade} onChange={e => setFormSADT({ ...formSADT, prioridade: e.target.value })} className="form-input">
                    <option value="Verde">Verde</option>
                    <option value="Amarelo">Amarelo</option>
                    <option value="Vermelho">Vermelho</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label className="form-label">Categoria do Exame</label>
                  <select value={formSADT.categoria} onChange={e => setFormSADT({ ...formSADT, categoria: e.target.value, exame: '' })} className="form-input" required>
                    <option value="">Selecione...</option>
                    <option value="Cardiologico">Cardiologico</option>
                    <option value="Laboratoriais">Laboratoriais</option>
                    <option value="Imagem">Imagem</option>
                  </select>
                </div>
              </div>
              {formSADT.categoria && (
                <div>
                  <label className="form-label">Procedimento / Exame</label>
                  <select value={formSADT.exame} onChange={e => setFormSADT({ ...formSADT, exame: e.target.value })} className="form-input" required>
                    <option value="">Selecione o Exame Específico...</option>
                    {examesDisponiveis[formSADT.categoria].map((exameStr, index) => (
                      <option key={index} value={exameStr}>{exameStr}</option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label className="form-label">Justificativa Clínica</label>
                <textarea rows="2" value={formSADT.justificativa} onChange={e => setFormSADT({ ...formSADT, justificativa: e.target.value })} className="form-input" style={{ resize: 'vertical' }} required />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px', paddingTop: '15px', borderTop: '1px solid #e2e8f0' }}>
                <button type="button" onClick={() => setModalSADT(false)} className="btn-cancel">Cancelar</button>
                <button type="submit" className="btn-primary" style={{ fontSize: '13px' }}>Enviar ao Laboratório</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}