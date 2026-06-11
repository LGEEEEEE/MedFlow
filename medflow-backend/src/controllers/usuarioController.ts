import { Request, Response } from 'express';
import { UsuarioService } from '../services/usuarioService';

const usuarioService = new UsuarioService();

export class UsuarioController {
  
  async listar(req: Request, res: Response) {
    try {
      const usuarios = await usuarioService.listar();
      return res.json(usuarios);
    } catch (error) {
      return res.status(500).json({ erro: 'Erro ao listar usuários' });
    }
  }

  async criar(req: Request, res: Response) {
    try {
      const usuario = await usuarioService.criar(req.body);
      return res.status(201).json(usuario);
    } catch (error) {
      return res.status(500).json({ erro: 'Erro ao criar usuário' });
    }
  }

  async atualizar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const usuario = await usuarioService.atualizar(id as string, req.body);
      return res.json(usuario);
    } catch (error) {
      return res.status(500).json({ erro: 'Erro ao atualizar usuário' });
    }
  }

  async remover(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await usuarioService.remover(id as string);
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ erro: 'Erro ao deletar usuário' });
    }
  }
}