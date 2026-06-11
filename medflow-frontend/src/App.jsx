import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Recepcao from './pages/Recepcao';
import PainelMedico from './pages/PainelMedico';
import Triagem from './pages/Triagem';
import Exames from './pages/Exames';
import PainelAdmin from './pages/PainelAdmin';
import Logo from './components/Logo';
import './App.css';

// ------------------------------------------------------------------
// 1. COMPONENTE DE PROTEÇÃO DE ROTAS (Verifica o token e o cargo)
// ------------------------------------------------------------------
function ProtectedRoute({ children, allowedRoles }) {
  const user = JSON.parse(localStorage.getItem('@MedFlow:user'));
  
  if (!user) {
    return <Navigate to="/" />;
  }

  if (!allowedRoles.includes(user.cargo)) {
    return <Navigate to="/dashboard_redirect" />;
  }

  return children;
}

// ------------------------------------------------------------------
// 2. REDIRECIONAMENTO INTELIGENTE PÓS-LOGIN
// ------------------------------------------------------------------
function DashboardRedirect() {
  const user = JSON.parse(localStorage.getItem('@MedFlow:user'));
  if (!user) return <Navigate to="/" />;

  switch (user.cargo) {
    case 'ADMIN': return <Navigate to="/admin" />;
    case 'RECEPCAO': return <Navigate to="/recepcao" />;
    case 'MEDICO': return <Navigate to="/medico" />;
    case 'TRIAGEM': return <Navigate to="/triagem" />;
    case 'EXAMES': return <Navigate to="/exames" />;
    default: return <Navigate to="/" />;
  }
}

// ------------------------------------------------------------------
// 3. BARRA DE NAVEGAÇÃO SUPERIOR (Aparece apenas nas áreas operacionais)
// ------------------------------------------------------------------
function NavBarOperacional() {
  const location = useLocation();
  const isLogin = location.pathname === '/';
  const isAdmin = location.pathname.startsWith('/admin');

  // Não exibe a barra no Login e nem no PainelAdmin (que já tem menu lateral)
  if (isLogin || isAdmin) return null;

  const deslogar = () => {
    localStorage.removeItem('@MedFlow:user');
    localStorage.removeItem('@MedFlow:token');
    window.location.href = '/';
  };

  return (
    <nav style={navStyle}>
      <div style={logoStyle}>
        <Logo width="120" />
      </div>
      <div style={navLinks}>
        <Link to="/recepcao" style={location.pathname === '/recepcao' ? linkActive : linkStyle}>Recepção</Link>
        <Link to="/triagem" style={location.pathname === '/triagem' ? linkActive : linkStyle}>Triagem</Link>
        <Link to="/medico" style={location.pathname === '/medico' ? linkActive : linkStyle}>Consultório</Link>
        <Link to="/exames" style={location.pathname === '/exames' ? linkActive : linkStyle}>SADT (Exames)</Link>
        <button onClick={deslogar} style={btnSair}><i className="bi bi-box-arrow-right"></i> Sair</button>
      </div>
    </nav>
  );
}

// ------------------------------------------------------------------
// 4. GERENCIADOR DE LAYOUT
// ------------------------------------------------------------------
function LayoutManager({ children }) {
  return (
    <>
      <NavBarOperacional />
      {children}
    </>
  );
}

// ------------------------------------------------------------------
// 5. ROTAS PRINCIPAIS DA APLICAÇÃO
// ------------------------------------------------------------------
export default function App() {
  return (
    <BrowserRouter>
      <LayoutManager>
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/" element={<Login />} />
          <Route path="/dashboard_redirect" element={<DashboardRedirect />} />
          
          {/* Rotas Operacionais (Clínica) */}
          <Route path="/recepcao" element={<ProtectedRoute allowedRoles={['RECEPCAO', 'ADMIN']}><Recepcao /></ProtectedRoute>} />
          <Route path="/medico" element={<ProtectedRoute allowedRoles={['MEDICO', 'ADMIN']}><PainelMedico /></ProtectedRoute>} />
          <Route path="/triagem" element={<ProtectedRoute allowedRoles={['TRIAGEM', 'ADMIN']}><Triagem /></ProtectedRoute>} />
          <Route path="/exames" element={<ProtectedRoute allowedRoles={['EXAMES', 'ADMIN']}><Exames /></ProtectedRoute>} />
          
          {/* Rota Administrativa Unificada */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <PainelAdmin />
            </ProtectedRoute>
          } />

          {/* Fallback 404 */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </LayoutManager>
    </BrowserRouter>
  );
}

// ------------------------------------------------------------------
// ESTILOS LOCAIS DA NAVBAR
// ------------------------------------------------------------------
const navStyle = { backgroundColor: '#2c3e50', padding: '15px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' };
const logoStyle = { display: 'flex', alignItems: 'center' };
const navLinks = { display: 'flex', gap: '15px', alignItems: 'center' };
const linkStyle = { color: '#bdc3c7', textDecoration: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', transition: '0.3s', fontSize: '14px' };
const linkActive = { ...linkStyle, backgroundColor: '#34495e', color: '#fff' };
const btnSair = { padding: '8px 16px', backgroundColor: 'transparent', color: '#e74c3c', border: '1px solid #e74c3c', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', transition: '0.3s' };