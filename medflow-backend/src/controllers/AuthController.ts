import { Request, Response } from 'express';
import { AuthService } from '../services/authService';

const authService = new AuthService();

export class AuthController {
  async login(req: Request, res: Response) {
    try {
      // Passa os dados direto para o Service
      const resultado = await authService.login(req.body);
      
      // Se deu tudo certo, devolve o token e o user
      return res.json(resultado);

    } catch (error: any) {
      // Captura o erro disparado pelo Service
      if (error.message === 'Credenciais invalidas ou cargo incorreto') {
        return res.status(401).json({ error: error.message });
      }
      
      return res.status(500).json({ error: 'Erro interno no servidor' });
    }
  }
}