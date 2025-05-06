from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, HTMLResponse
import os

app = FastAPI()

# Configuração robusta
frontend_path = os.path.abspath(os.path.join(os.path.dirname(__file__), 'frontend')
print(f"🔍 Frontend path: {frontend_path}")
print(f"📂 Conteúdo: {os.listdir(frontend_path)}")

# Serve arquivos estáticos
app.mount("/", StaticFiles(directory=frontend_path, html=True), name="frontend")

# Rota fallback
@app.get("/{full_path:path}")
async def serve_spa(request: Request):
    return FileResponse(f"{frontend_path}/index.html")

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("FRONTEND_PORT", 3000))
    print(f"🚀 Iniciando frontend na porta {port}")
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=port,
        log_level="debug",
        reload=True  # Apenas para desenvolvimento
    )