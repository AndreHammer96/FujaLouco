from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import json
from datetime import datetime
import os


# Servir arquivos estáticos do frontend
app.mount("/frontend", StaticFiles(directory="frontend"), name="frontend")

# Templates do HTML (Jinja precisa disso para renderizar)
templates = Jinja2Templates(directory="frontend")

connected_clients = {}

@app.get("/")
async def get_index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/mapa.html")
async def get_mapa(request: Request):
    return templates.TemplateResponse("mapa.html", {"request": request})

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    client_id = str(id(websocket))
    connected_clients[client_id] = {'ws': websocket, 'last_data': None}
    print(f"{datetime.now().isoformat()} - Conectado: {client_id}")

    try:
        while True:
            data = await websocket.receive_text()
            try:
                json_data = json.loads(data)
                connected_clients[client_id]['last_data'] = json_data

                for cid, client in connected_clients.items():
                    if cid != client_id:
                        await client['ws'].send_text(data)
            except:
                print("Erro ao processar mensagem")
    except WebSocketDisconnect:
        print(f"{datetime.now().isoformat()} - Cliente desconectado: {client_id}")
        del connected_clients[client_id]
        
@app.get("/health")
app = FastAPI()
async def health():
    return {"status": "ok"}