from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

app = FastAPI()

# Configuração mágica - serve tudo sem alterar caminhos
frontend_path = os.path.join(os.path.dirname(__file__), 'frontend')
app.mount("/", StaticFiles(directory=frontend_path, html=True), name="frontend")

# Fallback para SPA
@app.get("/{full_path:path}")
async def serve_spa(request: Request):
    return FileResponse(f"{frontend_path}/index.html")

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("FRONTEND_PORT", 3000))
    print(f"🌍 Servindo arquivos de: {frontend_path}")
    print(f"📄 Arquivos disponíveis: {os.listdir(frontend_path)}")
    uvicorn.run(app, host="0.0.0.0", port=port)
    
    print("✅ Teste de acesso ao index.html:", os.path.exists(f"{frontend_path}/index.html"))