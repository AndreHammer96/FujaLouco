from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os
import logging

# Configuração robusta de logs
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Caminho absoluto garantido
frontend_path = os.path.join(os.path.dirname(__file__), 'frontend')
logger.info(f"✅ Frontend path: {os.path.abspath(frontend_path)}")
logger.info(f"📂 Conteúdo: {os.listdir(frontend_path)}")

# Servidor de arquivos estáticos
app.mount("/", StaticFiles(directory=frontend_path, html=True), name="frontend")

# Rota fallback
@app.get("/{full_path:path}")
async def serve_spa(full_path: str):
    return FileResponse(os.path.join(frontend_path, 'index.html'))

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("FRONTEND_PORT", 3000))
    logger.info(f"🚀 Iniciando servidor frontend na porta {port}")
    uvicorn.run(
        "file_server:app",
        host="0.0.0.0",
        port=port,
        log_level="info",
        reload=False
    )