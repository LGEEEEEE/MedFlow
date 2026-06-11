import { useRecepcao } from '../hooks/useRecepcao';
import { Toaster } from 'react-hot-toast';

// Importação das Features Isoladas
import ModalCadastro from '../components/features/ModalCadastro';
import ModalConsulta from '../components/features/ModalConsulta';
import ModalExame from '../components/features/ModalExame';

export default function Recepcao() {
  const {
    atendimentos,
    modalNovoPaciente, setModalNovoPaciente,
    modalConsulta, setModalConsulta,
    modalExame, setModalExame,
    carregarKanban,
    cancelarAtendimento
  } = useRecepcao();

  const renderCardPaciente = (paciente) => (
    <div key={paciente.id} className="kanban-card">
      <div className="card-header-kanban">
        <span className="ficha-num">#{paciente.id.substring(0,6).toUpperCase()}</span>
        <span className="convenio-tag">{paciente.convenio || 'PARTICULAR'}</span>
      </div>
      <h4>{paciente.paciente?.nome || 'Paciente não identificado'}</h4>
      <p style={{ fontSize: '13px', color: '#7f8c8d', margin: 0 }}>
        Status: <strong>{paciente.status.replace('_', ' ')}</strong>
      </p>
      <div className="card-actions">
        <button className="btn-action" style={{ background: '#e74c3c', color: 'white' }} onClick={() => cancelarAtendimento(paciente.id)}>Excluir</button>
      </div>
    </div>
  );

  return (
    <div className="fade-animation" style={{ padding: '30px', minHeight: 'calc(100vh - 70px)' }}>
      <Toaster position="top-right" />
      
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ margin: 0, color: '#2c3e50' }}>Recepção</h2>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button className="btn-cancel" onClick={() => setModalConsulta(true)}>Marcar Consulta</button>
          <button className="btn-cancel" onClick={() => setModalExame(true)}>Agendar Exame</button>
          <button className="btn-primary" onClick={() => setModalNovoPaciente(true)}>+ Novo Paciente</button>
        </div>
      </header>

      <main className="kanban-board">
        <div className="kanban-column" style={{ borderTop: '4px solid #f39c12' }}>
          <div className="kanban-header">Aguardando ({atendimentos.aguardando.length})</div>
          <div className="kanban-cards">
            {atendimentos.aguardando.map(p => renderCardPaciente(p))}
          </div>
        </div>

        <div className="kanban-column" style={{ borderTop: '4px solid #9b59b6' }}>
          <div className="kanban-header">Em Atendimento ({atendimentos.emAtendimento.length})</div>
          <div className="kanban-cards">
            {atendimentos.emAtendimento.map(p => renderCardPaciente(p))}
          </div>
        </div>

        <div className="kanban-column" style={{ borderTop: '4px solid #2ecc71' }}>
          <div className="kanban-header">Finalizado ({atendimentos.finalizado.length})</div>
          <div className="kanban-cards">
            {atendimentos.finalizado.map(p => renderCardPaciente(p))}
          </div>
        </div>
      </main>

      {/* Injeção dos Modais Inteligentes */}
      {modalNovoPaciente && <ModalCadastro fecharModal={() => setModalNovoPaciente(false)} atualizarFila={carregarKanban} />}
      {modalConsulta && <ModalConsulta fecharModal={() => setModalConsulta(false)} atualizarFila={carregarKanban} />}
      {modalExame && <ModalExame fecharModal={() => setModalExame(false)} atualizarFila={carregarKanban} />}
    </div>
  );
}