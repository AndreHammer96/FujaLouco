from flask_socketio import SocketIO, emit
from flask import Flask
import os
from datetime import datetime

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

connected_clients = {}

@socketio.on('connect')
def handle_connect():
    client_id = id(request.sid)
    connected_clients[client_id] = {'last_data': None}
    print(f"{datetime.now().isoformat()} - Novo cliente conectado: {client_id}")

@socketio.on('disconnect')
def handle_disconnect():
    client_id = id(request.sid)
    if client_id in connected_clients:
        del connected_clients[client_id]
    print(f"{datetime.now().isoformat()} - Cliente {client_id} desconectado")

@socketio.on('message')
def handle_message(data):
    client_id = id(request.sid)
    print(f"{datetime.now().isoformat()} - Mensagem recebida: {data}")
    
    # Validação
    if not all(k in data for k in ['id', 'lat', 'lng', 'type']):
        print("Mensagem inválida")
        return
        
    # Armazena dados
    connected_clients[client_id]['last_data'] = data
    
    # Envia para outros clientes
    emit('update', data, broadcast=True, include_self=False)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))
    print(f"🟢 Iniciando servidor na porta {port}")
    socketio.run(app, host='0.0.0.0', port=port)