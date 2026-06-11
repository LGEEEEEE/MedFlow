import { Router } from 'express';
import { UsuarioController } from '../controllers/usuarioController';

const usuarioRoutes = Router();
const usuarioController = new UsuarioController();

usuarioRoutes.get('/', usuarioController.listar);
usuarioRoutes.post('/', usuarioController.criar);
usuarioRoutes.put('/:id', usuarioController.atualizar);
usuarioRoutes.delete('/:id', usuarioController.remover);

export { usuarioRoutes };