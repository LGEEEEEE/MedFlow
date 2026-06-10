import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ExameService {
  async solicitarExame(atendimentoId: string, dados: any) {
    const { categoria, exame, prioridade, justificativa, observacoes } = dados;
    return await prisma.exame.create({
      data: { atendimentoId, categoria, exame, prioridade, justificativa, observacoes }
    });
  }

  async salvarLaudo(exameId: string, laudoPdf: string, resultado: string) {
    const exameAtualizado = await prisma.exame.update({
      where: { id: exameId },
      data: { status: 'FINALIZADO', laudoPdf }
    });

    // Atualiza o atendimento para aguardar retorno
    await prisma.atendimento.update({
      where: { id: exameAtualizado.atendimentoId },
      data: { status: 'AGUARDANDO_RETORNO' }
    });

    return exameAtualizado;
  }
}