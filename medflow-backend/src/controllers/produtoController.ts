import { Request, Response } from 'express';
import { ProdutoService } from '../services/produtoService';

const produtoService = new ProdutoService();

export class ProdutoController {
  async listar(req: Request, res: Response) {
    try {
      const produtos = await produtoService.listar();
      return res.json(produtos);
    } catch (error) {
      return res.status(500).json({ erro: 'Erro ao listar estoque' });
    }
  }

  async criar(req: Request, res: Response) {
    try {
      const produto = await produtoService.criar(req.body);
      return res.json(produto);
    } catch (error) {
      console.error(error); 
      return res.status(500).json({ erro: 'Erro ao cadastrar produto' });
    }
  }

  async baixaAutomatica(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { quantidade } = req.body;

      const produto = await produtoService.baixaAutomatica(id as string, quantidade);

      return res.json(produto);
    } catch (error) {
      return res.status(500).json({ erro: 'Falha na baixa do estoque via sensor' });
    }
  }
}