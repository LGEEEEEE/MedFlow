import { Request, Response } from 'express';
import { AtendimentoService } from '../services/atendimentoService';

const atendimentoService = new AtendimentoService();

export class AtendimentoController {
  
  async listar(req: Request, res: Response) {
    try {
      const atendimentos = await atendimentoService.listar();
      return res.json(atendimentos);
    } catch (error) {
      return res.status(500).json({ erro: 'Erro ao listar atendimentos' });
    }
  }

  async buscarCpf(req: Request, res: Response) {
    try {
      const { cpf } = req.params;
      const paciente = await atendimentoService.buscarCpf(cpf as string);
      return res.json(paciente);
    } catch (error: any) {
      if (error.message === 'Paciente nao encontrado') {
        return res.status(404).json({ error: error.message });
      }
      return res.status(500).json({ erro: 'Erro ao buscar paciente' });
    }
  }

  async salvarLaudoExame(req: Request, res: Response) {
    try {
      const { exameId } = req.params;
      const { laudoPdf, resultado } = req.body;

      const exameAtualizado = await atendimentoService.salvarLaudoExame(exameId as string, laudoPdf, resultado);

      // Atualiza a tela de todo mundo (Infraestrutura/Rede fica no Controller)
      req.app.get('io').emit('atualizar_fila');

      return res.json(exameAtualizado);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ erro: 'Erro ao salvar o laudo' });
    }
  }

  async criar(req: Request, res: Response) {
    try {
      const atendimento = await atendimentoService.criarAtendimento(req.body);

      req.app.get('io').emit('atualizar_fila');
      return res.status(201).json(atendimento);
    } catch (error: any) {
      if (error.message === 'O CPF e obrigatorio' || error.message === 'Paciente ja possui atendimento ativo') {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ erro: 'Erro ao criar atendimento' });
    }
  }

  async atualizarStatus(req: Request, res: Response) {
  try {
    const { id } = req.params;
    
    // CORREÇÃO: Passe o req.body inteiro (que contém { status, sintomas })
    const atendimento = await atendimentoService.atualizarStatus(id as string, req.body);
    
    // Notifica o front-end
    const io = req.app.get('io');
    io.emit('status_atualizado');
    
    return res.json(atendimento);
  } catch (error) {
    console.error("Erro no controller ao atualizar status:", error);
    return res.status(500).json({ erro: 'Erro ao atualizar status' });
  }
}

  async solicitarExame(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const novoExame = await atendimentoService.solicitarExame(id as string, req.body);

      req.app.get('io').emit('novo_exame_sadt');
      return res.status(201).json(novoExame);
    } catch (error) {
      return res.status(500).json({ erro: 'Erro ao solicitar exame' });
    }
  }

  async deletar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await atendimentoService.deletar(id as string);
      
      req.app.get('io').emit('atualizar_fila');
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ erro: 'Erro ao deletar atendimento' });
    }
  }
}