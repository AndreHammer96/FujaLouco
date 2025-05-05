import asyncio
import websockets
import json
from datetime import datetime

connected_clients = {}  # Agora armazenará {client_id: {'ws': websocket, 'last_data': dict}}

async def handler(websocket):
    client_id = str(id(websocket))  # Convertendo para string para facilitar
    connected_clients[client_id] = {
        'ws': websocket,
        'last_data': None
    }
    print(f"{datetime.now().isoformat()} - Novo cliente conectado: {client_id}")

    try:
        async for message in websocket:
            try:
                data = json.loads(message)
                print(f"{datetime.now().isoformat()} - Mensagem recebida de {client_id}: {data}")
                
                # Validação dos dados obrigatórios
                if not all(k in data for k in ['id', 'lat', 'lng', 'type']):
                    print(f"{datetime.now().isoformat()} - Mensagem inválida: faltam campos obrigatórios")
                    continue
                    
                # Armazena os últimos dados do cliente
                connected_clients[client_id]['last_data'] = data
                
                # Prepara para enviar para outros clientes
                clients_to_remove = []
                
                for cid, client_data in list(connected_clients.items()):
                    if cid != client_id:
                        try:
                            await client_data['ws'].send(message)
                            print(f"{datetime.now().isoformat()} - Encaminhado para cliente {cid}")
                        except Exception as e:
                            print(f"{datetime.now().isoformat()} - Erro ao enviar para cliente {cid}: {str(e)}")
                            clients_to_remove.append(cid)
                
                # Remove clientes com erro
                for cid in clients_to_remove:
                    if cid in connected_clients:
                        disconnect_msg = json.dumps({
                            "type": "disconnect",
                            "id": connected_clients[cid]['last_data']['id'] if connected_clients[cid]['last_data'] else cid
                        })
                        del connected_clients[cid]
                        await broadcast_disconnect(disconnect_msg, cid)
                        print(f"{datetime.now().isoformat()} - Cliente {cid} removido devido a erro")
                        
            except json.JSONDecodeError:
                print(f"{datetime.now().isoformat()} - Mensagem inválida (não é JSON): {message}")
                
    except websockets.exceptions.ConnectionClosed as e:
        print(f"{datetime.now().isoformat()} - Cliente {client_id} desconectado: {str(e)}")
        if client_id in connected_clients and connected_clients[client_id]['last_data']:
            disconnect_msg = json.dumps({
                "type": "disconnect",
                "id": connected_clients[client_id]['last_data']['id']
            })
            await broadcast_disconnect(disconnect_msg, client_id)
    finally:
        if client_id in connected_clients:
            del connected_clients[client_id]
        print(f"{datetime.now().isoformat()} - Conexão com {client_id} finalizada")

async def broadcast_disconnect(message, excluded_client_id):
    """Envia mensagem de desconexão para todos os clientes exceto o excluído"""
    for cid, client_data in list(connected_clients.items()):
        if cid != excluded_client_id:
            try:
                await client_data['ws'].send(message)
                print(f"{datetime.now().isoformat()} - Notificação de desconexão enviada para {cid}")
            except:
                # Se falhar ao enviar, remove o cliente
                if cid in connected_clients:
                    del connected_clients[cid]

async def main():
    async with websockets.serve(handler, "0.0.0.0", 8001):
        print(f"{datetime.now().isoformat()} - Servidor WebSocket rodando em ws://0.0.0.0:8001")
        await asyncio.Future()  # Executa indefinidamente

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=int(os.environ.get('PORT', 8000)))
    
    print(f"🟢 WebSocket Server iniciado em ws://0.0.0.0:{os.getenv('PORT', 8000)}")
