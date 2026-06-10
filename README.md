# 🏥 MedFlow - Sistema de Gestão Clínica e Atendimento

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)

O **MedFlow** é um sistema completo (SaaS) para gestão de clínicas médicas, projetado para controlar o fluxo de pacientes de ponta a ponta. Desde a recepção e triagem até o consultório médico, laudos de exames e gestão financeira, tudo funciona em tempo real com atualizações instantâneas.

---

## ✨ Funcionalidades Principais

* 🩺 **Recepção e Fila (Kanban em Tempo Real):** Agendamentos, controle de chegada e acompanhamento visual do status de cada paciente através de painéis Kanban dinâmicos.
* 🌡️ **Triagem (Enfermagem):** Coleta de sinais vitais e queixas, atualizando automaticamente a fila do médico.
* 👨‍⚕️ **Painel Médico (Consultório):** Prontuário eletrônico inteligente com geração automática de relatórios, histórico de consultas e emissão de pedidos de exames.
* 🔬 **Módulo SADT (Exames):** Fila de pedidos de exames, inserção de laudos técnicos e envio de PDFs diretamente para o prontuário do paciente.
* 💰 **Gestão Financeira e Faturamento:** Fluxo de caixa detalhado, cálculo de repasses médicos (60/40), geração de lote TISS e retenção de convênios.
* ⚙️ **Painel Administrativo:** Gestão de equipe (níveis de acesso), controle de estoque de insumos e tabela de serviços.
* 📱 **Notificações via WhatsApp:** Envio automático de mensagens aos pacientes em eventos-chave (agendamentos e exames liberados).

---

## 🛠 Tecnologias Utilizadas

* **Frontend:** React.js, Vite, Socket.io-client, Axios.
* **Backend:** Node.js, Express, TypeScript, Socket.io (Fila em tempo real), JWT (Autenticação).
* **Banco de Dados:** PostgreSQL / MySQL (Gerenciado via Prisma ORM).
* **Infraestrutura:** Docker e Docker Compose.

---

## ⚙️ Pré-requisitos

Antes de iniciar, certifique-se de ter instalado em sua máquina:
* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (Versão 18+ recomendada)
* [Docker](https://www.docker.com/) e Docker Compose

---

## 🚀 Como Configurar e Rodar o Projeto

### 1. Clone o repositório
```bash
git clone [https://github.com/seu-usuario/medflow.git](https://github.com/seu-usuario/medflow.git)
cd medflow
2. Configuração das Variáveis de Ambiente (.env)
Você precisará criar e configurar os arquivos .env tanto no Frontend quanto no Backend.

No Backend (backend/.env):
Crie um arquivo .env na pasta do backend e insira as variáveis:

Snippet de código
# Porta do Servidor Node
PORT=3001

# Conexão com o Banco de Dados (Substitua pelos dados do seu BD ou Docker)
DATABASE_URL="postgresql://usuario:senha@localhost:5432/medflow?schema=public"

# Chave secreta para geração dos tokens de login
JWT_SECRET="CHAVE_SECRETA_PRODUCAO"

# Token da API Oficial do WhatsApp (Meta)
WA_TOKEN="seu_token_do_whatsapp_aqui"
No Frontend (frontend/.env):
Crie um arquivo .env na pasta do frontend (Vite exige o prefixo VITE_):

Snippet de código
# Porta padrão da API Backend
VITE_PORT=3001

# URL completa da API
VITE_API_URL="http://localhost:3001"
3. Rodando com Docker (Recomendado)
A maneira mais fácil de subir o banco de dados e o backend simultaneamente é utilizando o Docker. Na raiz do projeto (onde está o docker-compose.yml), execute:

Bash
# Sobe os containers em segundo plano
docker-compose up -d

# Aplica as migrations do Prisma no banco de dados
docker-compose exec backend npx prisma migrate dev --name init
docker-compose exec backend npx prisma generate
4. Rodando o Frontend (Modo de Desenvolvimento)
Abra um novo terminal, entre na pasta do frontend e rode:

Bash
cd frontend
npm install
npm run dev
O Vite iniciará o frontend geralmente na porta 5173. Acesse no seu navegador: http://localhost:5173.

🔐 Acesso ao Sistema
Ao rodar a aplicação pela primeira vez e acessar a tela de login, você pode entrar utilizando as credenciais master automáticas (configuradas no AuthController):

E-mail: admin@medflow.com

Senha: (Qualquer senha de sua escolha no primeiro login)

Perfil: Administrador

A partir do painel Admin, você pode criar novos acessos para Médicos, Recepcionistas e Técnicos de Laboratório.

👨‍💻 Autores
Luiz Gustavo Balbino e Marcio Henrique Sodre Desenvolvido com ❤️ e muita dedicação.