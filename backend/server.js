const WebSocket = require('ws');
const wss = new WebSocket.Server({ server });

const users = new Map(); // Armazena todos os usuários

wss.on('connection', (ws) => {
  console.log('Nova conexão WebSocket');
  
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      
      if (data.type === 'updateLocation') {
        // Atualiza a posição do usuário
        users.set(data.userId, {
          position: data.position,
          vehicle: data.vehicle,
          name: data.name
        });
        
        // Envia a lista ATUALIZADA para TODOS conectados
        broadcastUsers();
      }
    } catch (e) {
      console.error('Erro na mensagem:', e);
    }
  });

  ws.on('close', () => {
    console.log('Usuário desconectado');
    users.delete(ws.userId);
    broadcastUsers();
  });

  // Envia os usuários existentes para a nova conexão
  ws.send(JSON.stringify({
    type: 'initialUsers',
    users: Array.from(users.entries())
  }));
});

function broadcastUsers() {
  const usersData = JSON.stringify({
    type: 'updateUsers',
    users: Array.from(users.entries())
  });
  
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(usersData);
    }
  });
}