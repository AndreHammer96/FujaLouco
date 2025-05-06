from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os
import logging

# Configuração robusta
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Caminho absoluto garantido
frontend_path = os.path.abspath('frontend')
logger.info(f"✅ Pasta frontend: {frontend_path}")
logger.info(f"📄 Arquivos encontrados: {os.listdir(frontend_path)}")

# Configuração de servidor de arquivos
app.mount("/", StaticFiles(directory=frontend_path, html=True), name="frontend")

# Rota fallback para SPA
@app.get("/{full_path:path}")
async def serve_spa(request: Request):
    return FileResponse(f"{frontend_path}/index.html")

def run_server():
    import uvicorn
    port = int(os.environ.get("FRONTEND_PORT", 3000))
    logger.info(f"🚀 Iniciando servidor na porta {port}")
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=port,
        log_level="info",
        reload=False
    )

if __name__ == "__main__":
    run_server()