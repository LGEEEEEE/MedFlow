import { useState } from 'react';
import { Toaster } from 'react-hot-toast';

// Importando as Features isoladas
import Consultorio from '../components/features/Consultorio';
import HistoricoMedico from '../components/features/HistoricoMedico';

export default function PainelMedico() {
  const [abaAtiva, setAbaAtiva] = useState('consultorio');

  // Puxa o nome do médico logado para mostrar no cabeçalho
  const [medicoLogado] = useState(() => {
    const userStorage = localStorage.getItem('@MedFlow:user');
    return userStorage ? JSON.parse(userStorage) : null;
  });

  return (
    <div className="admin-container" style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <Toaster position="top-right" />

      {/* BARRA LATERAL ESQUERDA */}
      <aside className="sidebar" style={{ width: '250px', backgroundColor: '#1a252f', color: '#fff', flexShrink: 0 }}>
        <div className="logo-section" style={{ padding: '20px', display: 'flex', justifyContent: 'center', backgroundColor: '#2c3e50', borderBottom: '1px solid #1a252f' }}>
          <h2 style={{ margin: 0, fontSize: '16px', letterSpacing: '1px' }}>MENU MÉDICO</h2>
        </div>
        <nav className="menu-nav" style={{ marginTop: '20px', display: 'flex', flexDirection: 'column' }}>
          <button 
            style={{ ...menuBtnStyle, ...(abaAtiva === 'consultorio' ? menuBtnActiveStyle : {}) }} 
            onClick={() => setAbaAtiva('consultorio')}
          >
            Consultório
          </button>
          <button 
            style={{ ...menuBtnStyle, ...(abaAtiva === 'historico' ? menuBtnActiveStyle : {}) }} 
            onClick={() => setAbaAtiva('historico')}
          >
            Histórico de Prontuários
          </button>
        </nav>
      </aside>

      {/* ÁREA CENTRAL */}
      <main className="content" style={{ flex: 1, backgroundColor: '#f1f5f9', overflowY: 'auto', padding: '0' }}>
        <header className="content-header" style={{ backgroundColor: '#fff', borderBottom: '1px solid #e2e8f0', padding: '20px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ margin: 0, color: '#1e293b', fontSize: '22px' }}>
            {abaAtiva === 'consultorio' ? 'PAINEL MÉDICO' : 'HISTÓRICO CLÍNICO'}
          </h1>
          <div className="user-info">
            Médico(a): <strong>{medicoLogado?.nome || 'Profissional não identificado'}</strong>
          </div>
        </header>

        <div style={{ padding: '30px' }}>
          {abaAtiva === 'consultorio' && <Consultorio />}
          {abaAtiva === 'historico' && <HistoricoMedico />}
        </div>
      </main>
    </div>
  );
}

// Estilos do menu lateral
const menuBtnStyle = { background: 'none', border: 'none', color: '#cbd5e1', padding: '15px 20px', textAlign: 'left', width: '100%', cursor: 'pointer', fontSize: '14px', borderLeft: '3px solid transparent' };
const menuBtnActiveStyle = { backgroundColor: '#2c3e50', color: '#fff', borderLeftColor: '#3b82f6', fontWeight: 'bold' };