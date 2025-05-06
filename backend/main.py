# main.py
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
import uvicorn
import threading
import websocket_server  # seu arquivo com função iniciar_websocket()

app = FastAPI()

# monta sua pasta de frontend
app.mount("/", StaticFiles(directory="frontend", html=True), name="frontend")

def iniciar_websocket():
    websocket_server.run_websocket_server()  # você implementa isso no websocket_server.py

# inicia o websocket em uma thread separada
threading.Thread(target=iniciar_websocket, daemon=True).start()

if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
