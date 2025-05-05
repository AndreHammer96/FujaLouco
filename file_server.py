from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

app = FastAPI()

# Configuração à prova de erros
frontend_dir = os.path.join(os.path.dirname(__file__), "frontend")
os.makedirs(frontend_dir, exist_ok=True)

app.mount("/static", StaticFiles(directory=frontend_dir), name="static")

@app.get("/")
@app.get("/{full_path:path}")
async def serve_spa(full_path: str = ""):
    index_path = os.path.join(frontend_dir, "index.html")
    if not os.path.exists(index_path):
        raise Exception(f"Arquivo index.html não encontrado em: {index_path}")
    return FileResponse(index_path)

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("FRONTEND_PORT", 3000))
    print(f"✅ Frontend path: {frontend_dir}")
    print(f"🌐 Servindo em http://0.0.0.0:{port}")
    uvicorn.run(app, host="0.0.0.0", port=port)