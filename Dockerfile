FROM python:3.9-slim

# 1. Configura o diretório de trabalho
WORKDIR /app

# 2. Instala dependências do sistema
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    && rm -rf /var/lib/apt/lists/*

# 3. Copia TUDO mantendo sua estrutura exata
COPY . .

# 4. Verifica a cópia dos arquivos (DEBUG - pode remover depois)
RUN ls -laR /app/frontend > /app/file_structure.log

# 5. Corrige permissões
RUN chmod -R 755 /app/frontend && \
    chown -R nobody:nogroup /app

# 6. Instala dependências Python
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --no-cache-dir --upgrade uvicorn

# Verificação final
RUN echo "CONTEÚDO DO FRONTEND:" && \
    find /app/frontend -type f | grep -v ".log" && \
    echo "-------------------"

# 7. Comando de inicialização otimizado
CMD ["sh", "-c", "python websocket_server.py & cd /app && uvicorn file_server:app --host 0.0.0.0 --port ${FRONTEND_PORT}"]

# Adicione após o COPY . .
RUN echo "Verificando estrutura de arquivos:" && \
    ls -laR /app/frontend > /app/structure.log && \
    cat /app/structure.log
	
	
RUN pip install debugpy && \
    echo "import debugpy; debugpy.listen(5678); debugpy.wait_for_client()" >> /app/debug.py