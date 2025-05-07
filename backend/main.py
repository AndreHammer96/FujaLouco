import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

app = FastAPI()

# Monta a pasta de arquivos estáticos
app.mount("/", StaticFiles(directory="frontend", html=True), name="frontend")

# Serve o index.html na raiz
@app.get("/")
async def read_index():
    return FileResponse("frontend/index.html")


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    # ⛔ Não use "backend.main:app", pois você já está dentro da pasta backend
    uvicorn.run("main:app", host="0.0.0.0", port=port)

# Rota WebSocket
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    
    
    class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await manager.broadcast(data)  # ← envia para todos
    except WebSocketDisconnect:
        manager.disconnect(websocket)