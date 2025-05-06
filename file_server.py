from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

app = FastAPI()

# Configuração robusta
frontend_path = os.path.abspath(os.path.join(os.path.dirname(__file__), 'frontend'))
print(f"🔍 Caminho absoluto do frontend: {frontend_path}")
print(f"📂 Conteúdo: {os.listdir(frontend_path)}")

# Servindo arquivos estáticos
app.mount("/", StaticFiles(directory=frontend_path, html=True), name="frontend")

# Fallback para SPA
@app.get("/{full_path:path}")
async def serve_spa():
    return FileResponse(os.path.join(frontend_path, 'index.html'))

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("FRONTEND_PORT", 3000))
    print(f"🚀 Iniciando servidor frontend na porta {port}")
    uvicorn.run(app, host="0.0.0.0", port=port, log_level="debug")