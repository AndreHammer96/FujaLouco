from flask import Flask
from flask_socketio import SocketIO
import os

print(f"✅ Variáveis carregadas: PORT={os.getenv('PORT')}, FRONTEND_PORT={os.getenv('FRONTEND_PORT')}")

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

@socketio.on('connect')
def handle_connect():
    print('Cliente conectado')

@socketio.on('disconnect')
def handle_disconnect():
    print('Cliente desconectado')

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))
    print(f"🟢 WebSocket na porta {port}")
    socketio.run(app, host='0.0.0.0', port=port)