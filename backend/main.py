from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
import threading
import os
import websocket_server  # você já tem esse arquivo
import uvicorn

app = FastAPI()

# Serve arquivos da pasta frontend/
app.mount("/", StaticFiles(directory="frontend", html=True), name="frontend")

# Roda o WebSocket em uma thread separada
def start_ws():
    websocket_server.run_websocket_server()  # sua função WebSocket

threading.Thread(target=start_ws, daemon=True).start()

# Executa FastAPI na porta esperada
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))  # Caso a variável PORT não esteja configurada, usa 8000 como fallback

# Inicia o Uvicorn na porta configurada
    uvicorn.run(app, host="0.0.0.0", port=port)