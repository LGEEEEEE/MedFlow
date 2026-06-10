import { Request, Response } from 'express';
import { ExameService } from '../services/exameService';

const exameService = new ExameService();

export class ExameController {
  async solicitar(req: Request, res: Response) {
    try {
      const { atendimentoId } = req.params;
      const novoExame = await exameService.solicitarExame(atendimentoId, req.body);

      // Dispara evento pro front-end (MedFlow) atualizar a tela do SADT
      req.app.get('io').emit('novo_exame_sadt');
      
      return res.status(201).json(novoExame);
    } catch (error) {
      return res.status(500).json({ erro: 'Erro ao solicitar exame' });
    }
  }

  async salvarLaudo(req: Request, res: Response) {
    try {
      const { exameId } = req.params;
      const { laudoPdf, resultado } = req.body;

      const exameAtualizado = await exameService.salvarLaudo(exameId as string, laudoPdf, resultado);

      // Atualiza a fila principal já que o paciente mudou de status
      req.app.get('io').emit('atualizar_fila');

      return res.json(exameAtualizado);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ erro: 'Erro ao salvar o laudo' });
    }
  }
}