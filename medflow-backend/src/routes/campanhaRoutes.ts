import { Router } from 'express';
import { CampanhaController } from '../controllers/campanhaController';

const campanhaRoutes = Router();
const campanhaController = new CampanhaController();

campanhaRoutes.get('/', campanhaController.listar);
campanhaRoutes.post('/disparar', campanhaController.disparar);

export { campanhaRoutes };