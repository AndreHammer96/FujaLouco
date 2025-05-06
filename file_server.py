from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os
import logging

# Configura logs detalhados
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Caminho absoluto garantido
frontend_path = os.path.abspath(os.path.join(os.path.dirname(__file__), 'frontend')
logger.info(f"📍 Pasta frontend: {frontend_path}")
logger.info(f"📄 Arquivos: {os.listdir(frontend_path)}")

# Servidor de arquivos estáticos
app.mount("/", StaticFiles(directory=frontend_path, html=True), name="frontend")

# Fallback para SPA
@app.get("/{full_path:path}")
async def serve_spa():
    index_path = os.path.join(frontend_path, 'index.html')
    if not os.path.exists(index_path):
        logger.error(f"❌ index.html não encontrado em {index_path}")
    return FileResponse(index_path)

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("FRONTEND_PORT", 3000))
    logger.info(f"🚀 Iniciando servidor na porta {port}")
    uvicorn.run(
        "file_server:app",
        host="0.0.0.0",
        port=port,
        reload=True,
        log_level="info"
    )