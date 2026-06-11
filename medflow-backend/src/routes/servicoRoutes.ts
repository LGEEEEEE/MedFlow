import { Router } from 'express';
import { ServicoController } from '../controllers/servicoController';

const servicoRoutes = Router();
const servicoController = new ServicoController();

servicoRoutes.get('/', servicoController.listar);
servicoRoutes.post('/', servicoController.criar);

export { servicoRoutes };