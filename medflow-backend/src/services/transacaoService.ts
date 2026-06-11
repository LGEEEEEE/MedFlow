import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class TransacaoService {
  async listar() {
    // Ordena pelas mais recentes
    return await prisma.transacao.findMany({
      orderBy: { data: 'desc' }
    });
  }

  async criar(dados: any) {
    const { descricao, fonte, valor, tipo, data } = dados;
    
    return await prisma.transacao.create({
      data: { 
        descricao, 
        fonte, 
        tipo,
        valor: parseFloat(valor),
        data: data ? new Date(data) : new Date() 
      }
    });
  }

  async atualizar(id: string, dados: any) {
    const { descricao, fonte, valor, tipo, data } = dados;
    
    return await prisma.transacao.update({
      where: { id },
      data: { 
        descricao, 
        fonte, 
        tipo,
        valor: valor ? parseFloat(valor) : undefined,
        data: data ? new Date(data) : undefined
      }
    });
  }

  async deletar(id: string) {
    return await prisma.transacao.delete({ 
      where: { id } 
    });
  }
}