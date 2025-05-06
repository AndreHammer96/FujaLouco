import os
import uvicorn
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from starlette.middleware.cors import CORSMiddleware

app = FastAPI()

# Permitir CORS (útil para testes locais e Railway)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Caminho da pasta 'frontend'
frontend_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "frontend")

# Servir tudo da pasta frontend
app.mount("/frontend", StaticFiles(directory=frontend_dir), name="frontend")

# Página inicial (index.html ou mapa.html)
@app.get("/")
async def get_index():
    return FileResponse(os.path.join(frontend_dir, "index.html"))  # ou "mapa.html" se preferir

# WebSocket para localização em tempo real
clients = []

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    clients.append(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            for client in clients:
                if client != websocket:
                    await client.send_text(data)
    except WebSocketDisconnect:
        clients.remove(websocket)

# Executar localmente ou no Railway
if __name__ == "__main__":
    print("Início do script main.py")
    print(f"Diretório de trabalho: {os.getcwd()}")
    print(f"Conteúdo do diretório: {os.listdir()}")
    print(f"Variável de ambiente PORT: {os.environ.get('PORT')}")

    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)
