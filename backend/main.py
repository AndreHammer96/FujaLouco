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

    port = int(os.environ.get("PORT", 8000))  # usa 8000 se PORT não existir
    uvicorn.run("backend.main:app", host="0.0.0.0", port=port, reload=False)

# Rota WebSocket
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()