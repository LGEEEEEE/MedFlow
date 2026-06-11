import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Link } from 'react-router-dom'; 
import Logo from '../components/Logo';

// Importação das funcionalidades fatiadas
import AdminVisaoGeral from '../components/features/AdminVisaoGeral';
import AdminFaturamento from '../components/features/AdminFaturamento';
import AdminEquipe from '../components/features/AdminEquipe';
import AdminFinanceiro from '../components/features/AdminFinanceiro';
import AdminEstoque from '../components/features/AdminEstoque';

export default function PainelAdmin() {
  const [abaAtiva, setAbaAtiva] = useState('dashboard');

  const deslogar = () => {
    localStorage.removeItem('@MedFlow:user');
    localStorage.removeItem('@MedFlow:token');
    window.location.href = '/';
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f4f7f6', fontFamily: 'system-ui, sans-serif', overflow: 'hidden' }}>
      <Toaster position="top-right" reverseOrder={false} />
      
      {/* Barra Lateral / Menu */}
      <aside style={{ width: '260px', backgroundColor: '#2c3e50', display: 'flex', flexDirection: 'column', boxShadow: '2px 0 5px rgba(0,0,0,0.1)', flexShrink: 0 }} className="no-print">
        
        {/* LOGO AO INVÉS DE TEXTO */}
        <div style={{ padding: '20px', backgroundColor: '#1a252f', borderBottom: '1px solid #34495e', display: 'flex', justifyContent: 'center' }}>
          <Logo width="140" />
        </div>
        
        <div style={{ overflowY: 'auto', flex: 1 }}>
          <nav style={{ display: 'flex', flexDirection: 'column', padding: '15px 0' }}>
            <span style={{ padding: '0 20px 10px', fontSize: '11px', color: '#7f8c8d', fontWeight: 'bold', letterSpacing: '1px' }}>GESTÃO DA CLÍNICA</span>
            
            <button className={`btn-menu ${abaAtiva === 'dashboard' ? 'active' : ''}`} onClick={() => setAbaAtiva('dashboard')}>Visão Geral</button>
            <button className={`btn-menu ${abaAtiva === 'faturamento' ? 'active' : ''}`} onClick={() => setAbaAtiva('faturamento')}>Faturamento (Guias)</button>
            <button className={`btn-menu ${abaAtiva === 'equipe' ? 'active' : ''}`} onClick={() => setAbaAtiva('equipe')}>Gestão de Equipe</button>
            <button className={`btn-menu ${abaAtiva === 'financeiro' ? 'active' : ''}`} onClick={() => setAbaAtiva('financeiro')}>Financeiro</button>
            <button className={`btn-menu ${abaAtiva === 'estoque' ? 'active' : ''}`} onClick={() => setAbaAtiva('estoque')}>Controle de Estoque</button>
            
            {/* ATALHOS PARA O ADMIN ACESSAR O SISTEMA */}
            <span style={{ padding: '25px 20px 10px', fontSize: '11px', color: '#7f8c8d', fontWeight: 'bold', letterSpacing: '1px' }}>ACESSO OPERACIONAL</span>
            <Link to="/recepcao" className="btn-link-operacional">Recepção</Link>
            <Link to="/triagem" className="btn-link-operacional">Triagem / Enfermagem</Link>
            <Link to="/medico" className="btn-link-operacional">Consultório Médico</Link>
            <Link to="/exames" className="btn-link-operacional">SADT (Exames)</Link>
          </nav>
        </div>

        {/* Botão de Sair fixo no rodapé da barra */}
        <div style={{ padding: '15px', borderTop: '1px solid #34495e' }}>
            <button onClick={deslogar} style={{ width: '100%', padding: '10px', background: 'transparent', color: '#e74c3c', border: '1px solid #e74c3c', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', transition: '0.2s' }}>Sair do Sistema</button>
        </div>
      </aside>

      {/* Área de Conteúdo Central */}
      <main style={{ flex: 1, padding: '30px', overflowY: 'auto', boxSizing: 'border-box' }}>
        <header style={{ marginBottom: '30px', borderBottom: '2px solid #dfe6e9', paddingBottom: '15px' }} className="no-print">
          <h1 style={{ margin: 0, color: '#2c3e50', fontSize: '24px' }}>
            {abaAtiva === 'dashboard' && 'Visão Geral do Sistema'}
            {abaAtiva === 'faturamento' && 'Gestão de Faturamento e Convênios'}
            {abaAtiva === 'equipe' && 'Controle de Acessos e Equipe'}
            {abaAtiva === 'financeiro' && 'Fluxo de Caixa e Relatórios'}
            {abaAtiva === 'estoque' && 'Inventário e Insumos Médicos'}
          </h1>
        </header>

        {abaAtiva === 'dashboard' && <AdminVisaoGeral />}
        {abaAtiva === 'faturamento' && <AdminFaturamento />}
        {abaAtiva === 'equipe' && <AdminEquipe />}
        {abaAtiva === 'financeiro' && <AdminFinanceiro />}
        {abaAtiva === 'estoque' && <AdminEstoque />}
      </main>
      
      <style dangerouslySetInnerHTML={{
        __html: `
          @media print {
            body * { visibility: hidden; }
            .print-area, .print-area * { visibility: visible; }
            .print-area { position: absolute; left: 0; top: 0; width: 100%; }
            .no-print { display: none !important; }
          }
        `}}
      />
    </div>
  );
}