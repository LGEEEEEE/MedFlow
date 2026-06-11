import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class UsuarioService {
  async listar() {
    return await prisma.usuario.findMany({
      select: { 
        id: true, 
        nome: true, 
        email: true, 
        cargo: true, 
        createdAt: true,
        cpf: true,
        whatsapp: true,
        registro: true, 
        telefone: true  
      }
    });
  }

  async criar(dados: any) {
    const { nome, email, senha, cargo, cpf, whatsapp, registro, telefone } = dados;
    
    return await prisma.usuario.create({
      data: { 
        nome, email, senha, cargo, cpf, whatsapp, registro, telefone 
      }
    });
  }

  async atualizar(id: string, dados: any) {
    const { nome, email, cargo, cpf, whatsapp, registro, telefone } = dados;

    return await prisma.usuario.update({
      where: { id },
      data: { nome, email, cargo, cpf, whatsapp, registro, telefone }
    });
  }

  async remover(id: string) {
    return await prisma.usuario.delete({ 
      where: { id } 
    });
  }
}