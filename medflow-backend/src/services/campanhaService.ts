import { PrismaClient } from '@prisma/client';
import { whatsappQueue } from './whatsappService';

const prisma = new PrismaClient();

export class CampanhaService {
  async listar() {
    return await prisma.campanha.findMany();
  }

  async disparar(dados: any) {
    const { nome, tema, mensagem, desconto } = dados;
    
    // 1. Registra a campanha no banco de dados
    const novaCampanha = await prisma.campanha.create({
      data: { nome, tema, mensagem, desconto, status: 'ENVIADA' }
    });

    // 2. Busca todos os pacientes
    const pacientes = await prisma.paciente.findMany();
    
    // 3. Monta a mensagem e joga na fila do WhatsApp
    pacientes.forEach(p => {
      if (p.whatsapp) {
        const msgPersonalizada = `Olá ${p.nome}! 🩺\n\n${mensagem}\n\n${desconto ? `Use o cupom: ${desconto}` : ''}`;
        whatsappQueue.adicionar(p.whatsapp, msgPersonalizada);
      }
    });

    return novaCampanha;
  }
}