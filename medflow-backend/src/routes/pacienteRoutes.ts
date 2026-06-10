import { Router } from 'express';
import { PacienteController } from '../controllers/pacienteController';

const pacienteRoutes = Router();
const pacienteController = new PacienteController();

pacienteRoutes.get('/:cpf', pacienteController.buscarCpf);
// pacienteRoutes.post('/', pacienteController.criar);

export { pacienteRoutes };