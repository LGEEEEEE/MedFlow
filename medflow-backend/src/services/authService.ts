import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
// Dica para o futuro: colocar essa chave no arquivo .env
const SECRET_KEY = 'CHAVE_SECRETA_PRODUCAO'; 

export class AuthService {
  async login(dados: any) {
    const { email, senha, cargo } = dados;

    // Regra de negócio: Criação/Validação do Admin Master
    if (email === 'admin@medflow.com') {
      let adminExiste = await prisma.usuario.findFirst({
        where: { email: 'admin@medflow.com' }
      });

      if (!adminExiste) {
        adminExiste = await prisma.usuario.create({
          data: {
            nome: 'Administrador Master',
            email: 'admin@medflow.com',
            senha: senha,
            cargo: 'ADMIN'
          }
        });
      }

      const token = jwt.sign({ id: adminExiste.id, cargo: 'ADMIN' }, SECRET_KEY, { expiresIn: '8h' });

      return {
        user: {
          id: adminExiste.id,
          nome: adminExiste.nome,
          email: adminExiste.email,
          cargo: 'ADMIN'
        },
        token
      };
    }

    // Regra de negócio: Fluxo normal de usuários da clínica
    const user = await prisma.usuario.findFirst({
      where: {
        email,
        senha,
        cargo
      }
    });

    if (!user) {
      // O throw avisa o Controller que deu erro de autenticação
      throw new Error('Credenciais invalidas ou cargo incorreto');
    }

    const token = jwt.sign({ id: user.id, cargo: user.cargo }, SECRET_KEY, { expiresIn: '8h' });

    return {
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        cargo: user.cargo
      },
      token
    };
  }
}