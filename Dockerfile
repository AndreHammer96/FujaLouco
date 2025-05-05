FROM python:3.9-slim

WORKDIR /app

# 1. Instala dependências básicas
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    && rm -rf /var/lib/apt/lists/*

# 2. Copia TUDO mantendo a estrutura atual
COPY . .

# 3. Garante permissões
RUN chmod -R 755 /app/frontend

# 4. Instala dependências Python
RUN pip install --no-cache-dir -r requirements.txt

# 5. Comando de inicialização
CMD ["sh", "-c", "python websocket_server.py & uvicorn file_server:app --host 0.0.0.0 --port ${FRONTEND_PORT}"]