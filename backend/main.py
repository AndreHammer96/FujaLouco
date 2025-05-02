from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Request
from fastapi.responses import HTMLResponse, JSONResponse
# from fastapi.staticfiles import StaticFiles
# from fastapi.templating import Jinja2Templates
import json
from datetime import datetime
import os
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# # Servir arquivos estáticos do frontend
# app.mount("/frontend", StaticFiles(directory="frontend"), name="frontend")

# # Templates do HTML (Jinja precisa disso para renderizar)
# templates = Jinja2Templates(directory="frontend")

connected_clients = {}

@app.get("/")
async def get_index(request: Request):
    return JSONResponse({"message": "Hello World from Root"}) # Alterado para JSONResponse para simplificar

@app.get("/mapa.html")
async def get_mapa(request: Request):
    return JSONResponse({"message": "Mapa"}) # Alterado para JSONResponse para simplificar

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    client_id = str(id(websocket))
    connected_clients[client_id] = {'ws': websocket, 'last_data': None}
    logger.info(f"{datetime.now().isoformat()} - Conectado: {client_id}")

    try:
        while True:
            data = await websocket.receive_text()
            try:
                json_data = json.loads(data)
                connected_clients[client_id]['last_data'] = json_data

                for cid, client in connected_clients.items():
                    if cid != client_id:
                        await client['ws'].send_text(data)
            except json.JSONDecodeError:
                logger.error("Erro ao decodificar mensagem JSON")
            except Exception as e:
                logger.error(f"Erro ao processar mensagem: {e}")
    except WebSocketDisconnect:
        logger.info(f"{datetime.now().isoformat()} - Cliente desconectado: {client_id}")
        del connected_clients[client_id]

@app.get("/health", response_class=JSONResponse)
async def health():
    logger.info("Health check solicitado")
    return {"status": "ok"}