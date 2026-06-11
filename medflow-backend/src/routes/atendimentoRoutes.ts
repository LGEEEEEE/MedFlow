import { Router } from 'express';
import { AtendimentoController } from '../controllers/atendimentoController';

const atendimentoRoutes = Router();
const atendimentoController = new AtendimentoController();

// Remova o prefixo '/atendimentos' destas rotas, pois ele já está no router principal
atendimentoRoutes.get('/', atendimentoController.listar);
atendimentoRoutes.post('/', atendimentoController.criar);
atendimentoRoutes.put('/:id/status', atendimentoController.atualizarStatus);
atendimentoRoutes.post('/:id/exames', atendimentoController.solicitarExame);
atendimentoRoutes.delete('/:id', atendimentoController.deletar);
atendimentoRoutes.get('/pacientes/:cpf', atendimentoController.buscarCpf);
atendimentoRoutes.put('/exames/:exameId/laudo', atendimentoController.salvarLaudoExame);

export { atendimentoRoutes };