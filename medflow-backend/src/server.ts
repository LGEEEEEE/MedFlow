import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import { router } from './routes';

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3001;

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Compartilha o 'io' dentro do Express para os controllers usarem req.app.get('io')
app.set('io', io);

app.use(cors());
app.use(express.json());

// Injeta o arquivo principal de rotas
app.use(router);

// Evento de conexão do Socket.io (útil para debugar se o front conectou)
io.on('connection', (socket) => {
  console.log(`Plugin WebSockets: Cliente conectado [${socket.id}]`);
  
  socket.on('disconnect', () => {
    console.log(`Plugin WebSockets: Cliente desconectado [${socket.id}]`);
  });
});

server.listen(PORT, () => {
  console.log(`Servidor MedFlow rodando com sucesso na porta ${PORT}`);
});