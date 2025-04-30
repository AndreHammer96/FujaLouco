# Etapa de build
FROM node:18 AS build

# Define o diretório de trabalho para a etapa de build
WORKDIR /app

# Copia os arquivos de dependência do backend e instala as dependências
COPY backend/package.json backend/package-lock.json* ./backend/
WORKDIR /app/backend
RUN npm install

# Volta para o diretório de trabalho raiz da etapa de build
WORKDIR /app

# Copia a pasta frontend para a raiz do diretório de trabalho da etapa de build
COPY frontend ./frontend

# Copia o restante dos arquivos do backend
COPY backend ./backend

# Etapa de produção
FROM node:18

WORKDIR /app

# Copia a pasta backend da etapa de build
COPY --from=build /app/backend /app/backend

# Copia a pasta frontend da etapa de build
COPY --from=build /app/frontend /app/frontend

# Lista a estrutura de arquivos (para debug) NA ETAPA DE PRODUÇÃO
RUN ls -R /app

# Expõe a porta
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["node", "backend/server.js"]