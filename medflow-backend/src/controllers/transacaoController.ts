import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class TransacaoController {
  async listar(req: Request, res: Response) {
    try {
      // Ordena pelas mais recentes
      const transacoes = await prisma.transacao.findMany({
        orderBy: { data: 'desc' }
      });
      return res.json(transacoes);
    } catch (error) {
      return res.status(500).json({ erro: 'Erro ao listar transações' });
    }
  }

  async criar(req: Request, res: Response) {
    try {
      const { descricao, fonte, valor, tipo, data } = req.body;
      const transacao = await prisma.transacao.create({
        data: { 
          descricao, 
          fonte, 
          tipo,
          valor: parseFloat(valor),
          data: data ? new Date(data) : new Date() 
        }
      });
      return res.json(transacao);
    } catch (error) {
      return res.status(500).json({ erro: 'Erro ao criar transação' });
    }
  }

  async atualizar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { descricao, fonte, valor, tipo, data } = req.body;
      const transacao = await prisma.transacao.update({
        where: { id },
        data: { 
          descricao, 
          fonte, 
          tipo,
          valor: parseFloat(valor),
          data: data ? new Date(data) : undefined
        }
      });
      return res.json(transacao);
    } catch (error) {
      return res.status(500).json({ erro: 'Erro ao atualizar transação' });
    }
  }

  async deletar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.transacao.delete({ where: { id } });
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ erro: 'Erro ao deletar transação' });
    }
  }
}