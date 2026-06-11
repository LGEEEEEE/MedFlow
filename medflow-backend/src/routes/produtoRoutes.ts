import { Router } from 'express';
import { ProdutoController } from '../controllers/produtoController';

const produtoRoutes = Router();
const produtoController = new ProdutoController();

produtoRoutes.get('/', produtoController.listar);
produtoRoutes.post('/', produtoController.criar);
produtoRoutes.put('/:id/baixa', produtoController.baixaAutomatica);

export { produtoRoutes };