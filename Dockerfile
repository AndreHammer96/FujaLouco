# Usa imagem com Python 3.10
FROM python:3.10-slim

# Define o diretório de trabalho
WORKDIR /app

# Copia todos os arquivos do projeto para dentro da imagem Docker
COPY . .

# Expõe as portas usadas pelo servidor HTTP e WebSocket
EXPOSE 8000
EXPOSE 8001

# Comando que roda o servidor HTTP (para os arquivos estáticos) e o servidor WebSocket
CMD ["sh", "-c", "python3 -m http.server 8000 & python3 websocket_server.py"]
