import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class UsuarioController {
  
  // LISTAR: Garante que todos os campos estão vindo do banco
  async listar(req: Request, res: Response) {
    try {
      const usuarios = await prisma.usuario.findMany({
        select: { 
          id: true, 
          nome: true, 
          email: true, 
          cargo: true, 
          createdAt: true,
          cpf: true,
          whatsapp: true,
          registro: true, // Adicionado para coincidir com seu front
          telefone: true  // Adicionado para coincidir com seu front
        }
      });
      return res.json(usuarios);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ erro: 'Erro ao listar usuários' });
    }
  }

  async atualizar(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { nome, email, cargo, cpf, whatsapp, registro, telefone } = req.body;

    const usuario = await prisma.usuario.update({
      where: { id: id as string },
      data: { nome, email, cargo, cpf, whatsapp, registro, telefone }
    });
    return res.json(usuario);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ erro: 'Erro ao atualizar usuário' });
  }
}

  
  async criar(req: Request, res: Response) {
    try {
      const { nome, email, senha, cargo, cpf, whatsapp, registro, telefone } = req.body;
      
      const usuario = await prisma.usuario.create({
        data: { 
          nome, 
          email, 
          senha, 
          cargo, 
          cpf, 
          whatsapp, 
          registro, 
          telefone 
        }
      });
      return res.json(usuario);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ erro: 'Erro ao cadastrar profissional' });
    }
  }

  // REMOVER: Com tipagem correta para o TypeScript
  async remover(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.usuario.delete({ 
        where: { id: id as string } 
      });
      return res.status(204).send();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ erro: 'Erro ao remover acesso' });
    }
  }
}