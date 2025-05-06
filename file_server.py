from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os
import logging

# Configuração robusta
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# CORREÇÃO AQUI ↓ (parênteses balanceados)
frontend_path = os.path.abspath(os.path.join(os.path.dirname(__file__), 'frontend'))
logger.info(f"✅ Pasta frontend confirmada: {frontend_path}")
logger.info(f"📄 Conteúdo: {os.listdir(frontend_path)}")

# Servidor de arquivos
app.mount("/", StaticFiles(directory=frontend_path, html=True), name="frontend")

@app.get("/{full_path:path}")
async def serve_spa(full_path: str):
    return FileResponse(os.path.join(frontend_path, 'index.html'))

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("FRONTEND_PORT", 3000))
    logger.info(f"🚀 Iniciando servidor frontend na porta {port}")
    uvicorn.run(app, host="0.0.0.0", port=port)
    
    
print(f"Diretório atual: {os.getcwd()}")