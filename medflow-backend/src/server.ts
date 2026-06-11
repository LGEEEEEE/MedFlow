import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import { router } from './routes';
// 1. Importando o middleware de erro
import { errorMiddleware } from './middlewares/errorMiddleware'; 

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3001;

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  },
  transports: ['websocket', 'polling']
});

app.set('io', io);

app.use(cors());
app.use(express.json());

// Injeta o arquivo principal de rotas
app.use(router);

// 2. INJEÇÃO DO MIDDLEWARE DE ERRO 
// IMPORTANTE: Tem que ficar exatamente aqui, DEPOIS das rotas!
app.use(errorMiddleware);

io.on('connection', (socket) => {
  console.log(`Plugin WebSockets: Cliente conectado [${socket.id}]`);
  
  socket.on('disconnect', () => {
    console.log(`Plugin WebSockets: Cliente desconectado [${socket.id}]`);
  });
});

server.listen(PORT, () => {
  console.log(`Servidor MedFlow rodando com sucesso na porta ${PORT}`);
});