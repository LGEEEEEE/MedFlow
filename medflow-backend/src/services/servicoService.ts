import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ServicoService {
  async listar() {
    return await prisma.servico.findMany();
  }

  async criar(dados: any) {
    const { nome, valor, categoria, descricao } = dados;
    
    return await prisma.servico.create({
      data: { 
        nome, 
        valor: parseFloat(valor), 
        categoria, 
        descricao 
      }
    });
  }
}