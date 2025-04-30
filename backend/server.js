const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());

// Log de todas as rotas adicionadas
app.use((req, res, next) => {
  console.log(`Rota sendo acessada: ${req.method} ${req.url}`);
  next();
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let clients = [];

wss.on("connection", (ws) => {
  // ... seu código WebSocket ...
});

function broadcastLocations() {
  // ... sua função broadcastLocations ...
}

app.use(express.static(path.join(__dirname, "../frontend")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// Log das rotas definidas
console.log("Rotas definidas:", app._router.stack.filter(r => r.route).map(r => r.route.path));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});
