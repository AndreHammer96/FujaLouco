# Usa imagem com Python 3.10
FROM python:3.10-slim

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos do projeto para o container
COPY . .

# Instala as dependências (incluindo websockets)
RUN pip install --no-cache-dir -r requirements.txt

# Expõe as portas necessárias
EXPOSE 8000
EXPOSE 8001

# Comando para rodar o servidor HTTP (para os arquivos estáticos) e o servidor WebSocket
CMD ["sh", "-c", "python3 -m http.server 8000 & python3 websocket_server.py"]
