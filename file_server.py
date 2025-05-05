from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

app = FastAPI()

# Configuração correta para SPA (Single Page Application)
app.mount("/assets", StaticFiles(directory="frontend"), name="static")

@app.get("/")
async def serve_index():
    return FileResponse('frontend/index.html')

@app.get("/{full_path:path}")
async def serve_spa(full_path: str):
    return FileResponse('frontend/index.html')

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("FRONTEND_PORT", 3000))  # Porta alterada
    print(f"🌐 Frontend rodando em http://0.0.0.0:{port}")
    uvicorn.run(app, host="0.0.0.0", port=port)
    
print("Estrutura do frontend:", os.listdir("frontend"))
print("Variáveis de ambiente:", dict(os.environ))