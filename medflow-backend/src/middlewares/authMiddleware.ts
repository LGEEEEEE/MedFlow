import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Isso aqui ensina para o TypeScript que a partir de agora 
// toda requisição do Express pode carregar um 'user'
declare global {
  namespace Express {
    interface Request {
      user?: string | jwt.JwtPayload;
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): any {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = jwt.verify(token, 'CHAVE_SECRETA_PRODUCAO');
    
    // Agora o TS não vai mais reclamar dessa linha!
    req.user = decoded; 
    
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
}