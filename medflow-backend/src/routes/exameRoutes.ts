import { Router } from 'express';
import { ExameController } from '../controllers/exameController';

const exameRoutes = Router();
const exameController = new ExameController();

// Rota para solicitar exame de um atendimento específico
// Caminho final da API: POST /exames/:atendimentoId/solicitar
exameRoutes.post('/:atendimentoId/solicitar', exameController.solicitar);

// Rota para anexar o PDF e o laudo do exame
// Caminho final da API: PUT /exames/:exameId/laudo
exameRoutes.put('/:exameId/laudo', exameController.salvarLaudo);

export { exameRoutes };