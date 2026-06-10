import { Router } from 'express';
import { AtendimentoController } from '../controllers/atendimentoController';

const atendimentoRoutes = Router();
const atendimentoController = new AtendimentoController();

atendimentoRoutes.get('/atendimentos', atendimentoController.listar);
atendimentoRoutes.post('/atendimentos', atendimentoController.criar);
atendimentoRoutes.put('/atendimentos/:id/status', atendimentoController.atualizarStatus);
atendimentoRoutes.post('/atendimentos/:id/exames', atendimentoController.solicitarExame);
atendimentoRoutes.delete('/atendimentos/:id', atendimentoController.deletar);
atendimentoRoutes.get('/pacientes/:cpf', atendimentoController.buscarCpf);
atendimentoRoutes.put('/exames/:exameId/laudo', atendimentoController.salvarLaudoExame);

export { atendimentoRoutes };