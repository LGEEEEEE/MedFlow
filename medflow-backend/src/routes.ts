import { Router } from 'express'; //importa o express
import { AuthController } from './controllers/AuthController'; //importa todos os controladores de autenticação para a sessão de rotas
import { AtendimentoController } from './controllers/atendimentoController'; //importa todos os controladores de atendimento para a sessão de rotas 
import { UsuarioController } from './controllers/usuarioController'; //importa todos os controladores de usuario para a sessão de rotas
import { ServicoController } from './controllers/servicoController'; //importa todos os controladores de serviço para a sessão de rotas
import { ProdutoController } from './controllers/produtoController'; //importa todos os controladores de produto para a sessão de rotas
import { CampanhaController } from './controllers/campanhaController'; //importa todos os controladores de campanha para a sessão de rotas
import { authMiddleware } from './middlewares/authMiddleware'; //importa todos os controladores de verificação com JWT para a sessão de rotas

const router = Router();

const authController = new AuthController();
const atendimentoController = new AtendimentoController();
const usuarioController = new UsuarioController();
const servicoController = new ServicoController();
const produtoController = new ProdutoController();
const campanhaController = new CampanhaController();

router.post('/login', authController.login);

router.use(authMiddleware);


//Rotas de atendimento

router.get('/atendimentos', atendimentoController.listar);
router.post('/atendimentos', atendimentoController.criar);
router.put('/atendimentos/:id/status', atendimentoController.atualizarStatus);
router.post('/atendimentos/:id/exames', atendimentoController.solicitarExame);
router.delete('/atendimentos/:id', atendimentoController.deletar);
router.get('/pacientes/:cpf', atendimentoController.buscarCpf);

//Rotas de usuario

router.get('/usuarios', usuarioController.listar);
router.post('/usuarios', usuarioController.criar);
router.delete('/usuarios/:id', usuarioController.remover);
router.put('/usuarios/:id', usuarioController.atualizar);

//rotas de serviço

router.get('/servicos', servicoController.listar);
router.post('/servicos', servicoController.criar);

//rotas de produtos

router.get('/produtos', produtoController.listar);
router.post('/produtos', produtoController.criar);
router.put('/produtos/:id/baixa', produtoController.baixaAutomatica);

//rotas de campanhas

router.get('/campanhas', campanhaController.listar);
router.post('/campanhas/disparar', campanhaController.disparar);

//exporta as rotas

export { router };