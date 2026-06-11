import { Request, Response } from 'express';
import { CampanhaService } from '../services/campanhaService';

const campanhaService = new CampanhaService();

export class CampanhaController {
  async listar(req: Request, res: Response) {
    try {
      const campanhas = await campanhaService.listar();
      return res.json(campanhas);
    } catch (error) {
      return res.status(500).json({ erro: 'Erro ao listar campanhas' });
    }
  }

  async disparar(req: Request, res: Response) {
    try {
      const novaCampanha = await campanhaService.disparar(req.body);
      return res.status(201).json(novaCampanha);
    } catch (error) {
      return res.status(500).json({ erro: 'Falha no disparo da campanha' });
    }
  }
}