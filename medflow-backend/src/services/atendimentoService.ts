import { PrismaClient } from '@prisma/client';
import { whatsappQueue } from './whatsappService';

const prisma = new PrismaClient();

export class AtendimentoService {
  
  async listar() {
    return await prisma.atendimento.findMany({
      include: { paciente: true, servico: true, exames: true },
      orderBy: { createdAt: 'asc' }
    });
  }

  async buscarCpf(cpf: string) {
    const paciente = await prisma.paciente.findUnique({ where: { cpf } });
    if (!paciente) {
      throw new Error('Paciente nao encontrado');
    }
    return paciente;
  }

  async salvarLaudoExame(exameId: string, laudoPdf: string, resultado: string) {
    // 1. Atualiza apenas o exame específico com o PDF e finaliza ele
    const exameAtualizado = await prisma.exame.update({
      where: { id: exameId },
      data: {
        status: 'FINALIZADO',
        laudoPdf: laudoPdf, 
      }
    });

    // 2. Anexa o laudo em texto ao prontuário do atendimento
    const atendimentoAtual = await prisma.atendimento.findUnique({
      where: { id: exameAtualizado.atendimentoId }
    });

    const novoSintomas = (atendimentoAtual?.sintomas || '') +
      `\n\n--- LAUDO DO EXAME: ${exameAtualizado.exame} ---\n${resultado || 'Vide PDF anexo.'}`;

    // 3. Atualiza o atendimento principal para o paciente voltar ao consultório
    await prisma.atendimento.update({
      where: { id: exameAtualizado.atendimentoId },
      data: {
        status: 'AGUARDANDO_RETORNO',
        sintomas: novoSintomas
      }
    });

    return exameAtualizado;
  }

  async criarAtendimento(dados: any) {
    const {
      nome, cpf, data_nascimento, sexo, whatsapp, cep, endereco, numero,
      bairro, cidade, uf, nome_mae, nome_responsavel, cpf_responsavel,
      parentesco, convenio, numero_guia, servicoId, status
    } = dados;

    if (!cpf) {
      throw new Error('O CPF e obrigatorio'); 
    }

    let paciente = await prisma.paciente.findUnique({ where: { cpf } });

    if (paciente) {
      const atendimentoAberto = await prisma.atendimento.findFirst({
        where: {
          pacienteId: paciente.id,
          status: { in: ['ABERTO', 'AGUARDANDO_TRIAGEM', 'AGENDADO'] }
        }
      });

      if (atendimentoAberto) {
        throw new Error('Paciente ja possui atendimento ativo');
      }

      paciente = await prisma.paciente.update({
        where: { id: paciente.id },
        data: {
          nome: nome || paciente.nome,
          whatsapp: whatsapp || paciente.whatsapp,
          cep: cep || paciente.cep,
          endereco: endereco || paciente.endereco,
          numero: numero || paciente.numero,
          bairro: bairro || paciente.bairro,
          cidade: cidade || paciente.cidade,
          uf: uf || paciente.uf
        }
      });
    } else {
      paciente = await prisma.paciente.create({
        data: {
          nome, cpf, data_nascimento: data_nascimento ? new Date(data_nascimento) : new Date('1900-01-01'),
          sexo: sexo || 'N/A', whatsapp: whatsapp || '', cep: cep || '',
          endereco: endereco || '', numero: numero || '', bairro: bairro || '',
          cidade: cidade || '', uf: uf || '', nome_mae: nome_mae || '',
          nome_responsavel: nome_responsavel || '', cpf_responsavel: cpf_responsavel || '',
          parentesco: parentesco || ''
        }
      });
    }

    const atendimento = await prisma.atendimento.create({
      data: {
        pacienteId: paciente.id,
        convenio: convenio || 'PARTICULAR',
        numero_guia,
        status: status || 'AGENDADO',
        servicoId: servicoId || null
      },
      include: { paciente: true }
    });

    if (paciente.whatsapp) {
      whatsappQueue.adicionar(paciente.whatsapp, 'agendamento_confirmado', [paciente.nome]);
    }

    return atendimento;
  }

  async atualizarStatus(id: string, dados: any) {
    const { status, sintomas, diagnostico, prescricao } = dados;

    const atendimento = await prisma.atendimento.update({
      where: { id },
      data: { status, sintomas, diagnostico, prescricao },
      include: { paciente: true }
    });

    if (status === 'AGUARDANDO_RETORNO' && atendimento.paciente?.whatsapp) {
      whatsappQueue.adicionar(atendimento.paciente.whatsapp, 'exames_finalizados', [atendimento.paciente.nome]);
    }

    return atendimento;
  }

  async solicitarExame(atendimentoId: string, dados: any) {
    const { categoria, exame, prioridade, justificativa, observacoes } = dados;

    const novoExame = await prisma.exame.create({
      data: { atendimentoId, categoria, exame, prioridade, justificativa, observacoes }
    });

    return novoExame;
  }

  async deletar(id: string) {
    await prisma.atendimento.delete({ where: { id } });
  }
}