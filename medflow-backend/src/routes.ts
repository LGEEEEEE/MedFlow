import { Router } from 'express';
import { authMiddleware } from './middlewares/authMiddleware';

// Importação das rotas modulares
import { authRoutes } from './routes/authRoutes';
import { pacienteRoutes } from './routes/pacienteRoutes';
import { exameRoutes } from './routes/exameRoutes';
import { atendimentoRoutes } from './routes/atendimentoRoutes';
import { usuarioRoutes } from './routes/usuarioRoutes';
import { produtoRoutes } from './routes/produtoRoutes';
import { servicoRoutes } from './routes/servicoRoutes';
import { transacaoRoutes } from './routes/transacaoRoutes';
import { campanhaRoutes } from './routes/campanhaRoutes';

const router = Router();

// ==========================================
// ROTAS PÚBLICAS (Não exigem token)
// ==========================================
router.use('/login', authRoutes);

// ==========================================
// MIDDLEWARE GLOBAL DE AUTENTICAÇÃO
// ==========================================
// Tudo que estiver abaixo desta linha precisa do token JWT
router.use(authMiddleware);

// ==========================================
// ROTAS PRIVADAS (Modulares)
// ==========================================
router.use('/pacientes', pacienteRoutes); 
router.use('/exames', exameRoutes);       
router.use('/atendimentos', atendimentoRoutes);
router.use('/usuarios', usuarioRoutes);
router.use('/produtos', produtoRoutes);
router.use('/servicos', servicoRoutes);
router.use('/transacoes', transacaoRoutes);
router.use('/campanhas', campanhaRoutes);

export { router };