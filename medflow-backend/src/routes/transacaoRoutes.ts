import { Router } from 'express';
import { TransacaoController } from '../controllers/transacaoController';

const transacaoRoutes = Router();
const transacaoController = new TransacaoController();

transacaoRoutes.get('/', transacaoController.listar);
transacaoRoutes.post('/', transacaoController.criar);
transacaoRoutes.put('/:id', transacaoController.atualizar);
transacaoRoutes.delete('/:id', transacaoController.deletar);

export { transacaoRoutes };