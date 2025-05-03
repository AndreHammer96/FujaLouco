import logging
import sys
import os

logging.basicConfig(level=logging.INFO, stream=sys.stdout)
logger = logging.getLogger(__name__)

logger.info("Início do script main.py")
logger.info(f"Diretório de trabalho: {os.getcwd()}")
logger.info(f"Conteúdo do diretório: {os.listdir()}")

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import json
from datetime import datetime

app = FastAPI()

# ... restante do seu código ...

from fastapi import FastAPI
from fastapi.responses import JSONResponse
# from fastapi.websockets import WebSocket, WebSocketDisconnect
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
logger.info(f"Variável de ambiente PORT: {os.environ.get('PORT')}")

app = FastAPI()

@app.get("/")
async def root():
    return JSONResponse({"message": "Hello World from Root"})

@app.get("/health", response_class=JSONResponse)
async def health():
    logger.info("Health check solicitado")
    return {"status": "ok"}

# connected_clients = {}

# @app.websocket("/ws")
# async def websocket_endpoint(websocket: WebSocket):
#     await websocket.accept()
#     client_id = str(id(websocket))
#     connected_clients[client_id] = {'ws': websocket, 'last_data': None}
#     logger.info(f"{datetime.now().isoformat()} - Conectado: {client_id}")

#     try:
#         while True:
#             data = await websocket.receive_text()
#             try:
#                 json_data = json.loads(data)
#                 connected_clients[client_id]['last_data'] = json_data

#                 for cid, client in connected_clients.items():
#                     if cid != client_id:
#                         await client['ws'].send_text(data)
#             except json.JSONDecodeError:
#                 logger.error("Erro ao decodificar mensagem JSON")
#             except Exception as e:
#                 logger.error(f"Erro ao processar mensagem: {e}")
#     except WebSocketDisconnect:
#         logger.info(f"{datetime.now().isoformat()} - Cliente desconectado: {client_id}")
#         del connected_clients[client_id]

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000)) # Use 8000 como padrão se PORT não estiver definido
    uvicorn.run(app, host="0.0.0.0", port=port)