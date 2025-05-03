import sys
import os
import uvicorn

print("Início do script main.py")
print(f"Diretório de trabalho: {os.getcwd()}")
print(f"Conteúdo do diretório: {os.listdir()}")
print(f"Variável de ambiente PORT: {os.environ.get('PORT')}")

# TENTE INICIALIZAR O UVICORN DIRETAMENTE AQUI (PARA TESTE)
port = int(os.environ.get("PORT", 8000))
uvicorn.run("main:app", host="0.0.0.0", port=port)