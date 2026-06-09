FROM node:18-alpine
WORKDIR /app

# A linha mágica que instala o OpenSSL no Alpine Linux
RUN apk add --no-cache openssl

COPY package*.json ./
RUN npm install
COPY . .
# Gera os clientes do Prisma antes de rodar
RUN npx prisma generate
EXPOSE 3001
CMD ["npm", "run", "dev"]