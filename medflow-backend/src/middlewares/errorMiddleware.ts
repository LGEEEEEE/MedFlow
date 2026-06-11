import { Request, Response, NextFunction } from 'express';

export function errorMiddleware(err: Error, req: Request, res: Response, next: NextFunction) {
  // Dá até colocar um envio de log para o e-mail ou Telegram depois hein
  console.error(`[Erro Crítico MedFlow] - ${err.message}`);

  // Se for um erro conhecido que você disparou com "throw new Error"
  if (err instanceof Error) {
    return res.status(400).json({ error: err.message });
  }

  // Se for um erro inesperado do servidor
  return res.status(500).json({
    status: 'error',
    message: 'Erro interno no servidor'
  });
}