from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

app = FastAPI()

# Serve TODOS os arquivos da pasta frontend diretamente na raiz
app.mount("/", StaticFiles(directory="frontend"), name="frontend")

# Rota fallback para SPA (opcional)
@app.get("/{full_path:path}")
async def serve_fallback():
    return FileResponse("frontend/index.html")

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("FRONTEND_PORT", 3000))
    print(f"✅ Servindo arquivos diretamente de /frontend")
    uvicorn.run(app, host="0.0.0.0", port=port)