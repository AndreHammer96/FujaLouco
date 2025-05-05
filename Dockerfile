FROM python:3.9-slim

WORKDIR /app

# Adicione após o WORKDIR /app
RUN mkdir -p /app/frontend/imagens

# Instala dependências
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copia TODOS os arquivos
COPY . .

# Instala servidor HTTP simples para o frontend
RUN apt-get update && apt-get install -y python3-pip && \
    pip install fastapi uvicorn aiofiles

# Porta do Socket.IO (WebSocket)
EXPOSE 8000

# Porta do frontend HTTP
EXPOSE 8080

# Comando de inicialização
CMD ["sh", "-c", "python websocket_server.py & cd /app && uvicorn file_server:app --host 0.0.0.0 --port $FRONTEND_PORT"]

