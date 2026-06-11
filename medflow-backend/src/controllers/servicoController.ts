import { Request, Response } from 'express';
import { ServicoService } from '../services/servicoService';

const servicoService = new ServicoService();

export class ServicoController {
  async listar(req: Request, res: Response) {
    try {
      const servicos = await servicoService.listar();
      return res.json(servicos);
    } catch (error) {
      return res.status(500).json({ erro: 'Erro ao listar serviços' });
    }
  }

  async criar(req: Request, res: Response) {
    try {
      const servico = await servicoService.criar(req.body);
      return res.status(201).json(servico);
    } catch (error) {
      return res.status(500).json({ erro: 'Erro ao cadastrar serviço' });
    }
  }
}