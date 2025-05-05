from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

app = FastAPI()

# Configuração para servir todos os arquivos estáticos
frontend_path = os.path.join(os.path.dirname(__file__), 'frontend')
app.mount("/static", StaticFiles(directory=frontend_path), name="static")

# Rota para o arquivo principal
@app.get("/")
async def serve_index():
    return FileResponse(os.path.join(frontend_path, 'index.html'))

# Rota catch-all para outras páginas
@app.get("/{filename}")
async def serve_page(filename: str):
    file_path = os.path.join(frontend_path, filename)
    if os.path.exists(file_path):
        return FileResponse(file_path)
    return FileResponse(os.path.join(frontend_path, 'index.html'))

# Rota especial para Leaflet
@app.get("/leaflet/{file_path:path}")
async def serve_leaflet(file_path: str):
    return FileResponse(os.path.join(frontend_path, 'leaflet', file_path))

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("FRONTEND_PORT", 3000))
    print(f"✅ Estrutura mantida - Servindo de: {frontend_path}")
    print(f"📄 Arquivos disponíveis: {os.listdir(frontend_path)}")
    uvicorn.run(app, host="0.0.0.0", port=port)