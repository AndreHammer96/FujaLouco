FROM python:3.9-slim

WORKDIR /app

# 1. Instala dependências
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    && rm -rf /var/lib/apt/lists/*

# 2. Copia os arquivos
COPY . .

# 3. Configura permissões
RUN chmod -R 755 /app/frontend

# 4. Instala dependências Python
RUN pip install --no-cache-dir -r requirements.txt

# 5. Comando otimizado
CMD ["python", "main.py"]