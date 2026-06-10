import { Request, Response } from 'express';
import { PacienteService } from '../services/pacienteService';

const pacienteService = new PacienteService();

export class PacienteController {
  async buscarCpf(req: Request, res: Response) {
    try {
      const { cpf } = req.params;
      const paciente = await pacienteService.buscarPorCpf(cpf as string);
      return res.json(paciente);
    } catch (error: any) {
      if (error.message === 'Paciente não encontrado') {
        return res.status(404).json({ error: error.message });
      }
      return res.status(500).json({ erro: 'Erro ao buscar paciente' });
    }
  }
}