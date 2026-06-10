import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class PacienteService {
  async buscarPorCpf(cpf: string) {
    const paciente = await prisma.paciente.findUnique({ where: { cpf } });
    if (!paciente) throw new Error('Paciente não encontrado');
    return paciente;
  }

  // Aqui no futuro você pode colocar o criarPaciente, atualizarPaciente, listarPacientes...
}