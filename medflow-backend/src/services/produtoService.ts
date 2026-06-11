import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ProdutoService {
  async listar() {
    return await prisma.produto.findMany();
  }

  async criar(dados: any) {
    const { nome, quantidade, unidade, precoCusto, validade } = dados;

    return await prisma.produto.create({
      data: {
        nome,
        quantidade: Number(quantidade),
        unidade: unidade || 'un', 
        precoCusto: Number(precoCusto || 0), 
        validade: validade ? new Date(validade) : null
      }
    });
  }

  async baixaAutomatica(id: string, quantidade: number) {

    return await prisma.produto.update({
      where: { id },
      data: {
        quantidade: {
          decrement: Number(quantidade || 1)
        }
      }
    });
  }
}