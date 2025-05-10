const mapa = L.map('map').setView([-25.7718, -49.7164], 15);

// 1. Primeiro declare TODAS as variáveis globais
let marcadorUsuario = null;
let socket = null;
const outrosUsuarios = {};
const userId = 'user-' + Math.random().toString(36).substr(2, 9);
const nomeUsuario = localStorage.getItem("nomeUsuario") || "Usuário";
const tipoUsuario = localStorage.getItem("tipoUsuario") || "visitante";

// 2. Configuração do Mapa Base
const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(mapa);

const baseMaps = {
  "OpenStreetMap": osm
};

// 3. Ícones
const icones = {
  carro: L.icon({
    iconUrl: 'imagens/carro.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32]
  }),
  moto: L.icon({
    iconUrl: 'imagens/moto.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32]
  }),
  visitante: L.icon({
    iconUrl: 'imagens/pessoa.png',
    iconSize: [24, 24],
    iconAnchor: [12, 24]
  })
};
function getVehicleIcon(vehicleType) {
    return icones[vehicleType] ;
}
// 4. Função WebSocket mais robusta
function setupWebSocket() {
  const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
  const host = window.location.host;
  const wsUrl = protocol + host + '/ws';

  socket = new WebSocket(wsUrl);

  socket.onopen = () => {
    console.log('Conectado ao servidor WebSocket');
    sendPosition();
  };
  setInterval(() => {
    if (socket?.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
            type: 'ping',
            id: userId
        }));
    }
}, 30000); // a cada 30 segundos

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
		if (data.type === 'ping') {
			if (data.id !== userId && outrosUsuarios[data.id]) {
				outrosUsuarios[data.id].lastUpdate = Date.now();
			}
			return; // Não precisa processar mais nada
		}
		
      if (data.type === 'disconnect') {
        if (outrosUsuarios[data.id]) {
          mapa.removeLayer(outrosUsuarios[data.id].marker);
          if (outrosUsuarios[data.id].listaItem) {
            outrosUsuarios[data.id].listaItem.remove();
          }
          delete outrosUsuarios[data.id];
          console.log(`Usuário desconectado: ${data.id}`);
        }
        return;
      }

      if (data.id === userId) return;

      const now = Date.now();

      if (!outrosUsuarios[data.id]) {
        const marker = L.marker([data.lat, data.lng], {
          icon: getVehicleIcon(data.vehicle)
        }).addTo(mapa).bindPopup(`<b>${data.name}</b>`);

        const item = document.createElement("li");
        item.textContent = `[M] ${data.name}`;
        item.textContent2 = "usuário conectado";
        item.textContent3 = data.vehicle;
        item.textContent4 = "";
        item._marcador = marker;
        item.dataset.tipo = "usuario";

        item.onclick = () => {
          mapa.setView([data.lat, data.lng], 17);
          marker.openPopup();
        };

        document.getElementById("lista-referencias").appendChild(item);

        outrosUsuarios[data.id] = {
          marker: marker,
          lastUpdate: now,
          listaItem: item
        };
        console.log('Novo marcador criado para:', data.id);
      } else {
        outrosUsuarios[data.id].marker.setLatLng([data.lat, data.lng]);
        outrosUsuarios[data.id].marker.bindPopup(`<b>${data.name}</b>`);
        outrosUsuarios[data.id].lastUpdate = now;
        console.log('Marcador atualizado para:', data.id);
      }
    } catch (e) {
      console.error('Erro ao processar mensagem:', e);
    }
  };

  socket.onerror = (error) => {
    console.error('Erro no WebSocket:', error);
  };

  socket.onclose = () => {
    console.log('Conexão WebSocket fechada. Reconectando em 5s...');
    setTimeout(setupWebSocket, 5000);
  };
}

function removerInativos() {
  const now = Date.now();
  const TIMEOUT = 120000; //remover usuarios a cada 120 segundos
  Object.keys(outrosUsuarios).forEach(id => {
    if (now - outrosUsuarios[id].lastUpdate > TIMEOUT) {
      mapa.removeLayer(outrosUsuarios[id].marker);
      if (outrosUsuarios[id].listaItem) {
        outrosUsuarios[id].listaItem.remove();
      }
      delete outrosUsuarios[id];
      console.log(`Removido usuário inativo: ${id}`);
    }
  });
}

// Verifica a cada 10 segundos
setInterval(removerInativos, 10000);

// Função auxiliar para enviar posição
function sendPosition() {
    if (!marcadorUsuario) {
        console.log('Marcador do usuário não está pronto');
        return;
    }
    
    if (socket?.readyState !== WebSocket.OPEN) {
        console.log('WebSocket não está conectado');
        return;
    }

    const pos = marcadorUsuario.getLatLng();
    const message = JSON.stringify({
        type: 'update',
        id: userId,
        name: nomeUsuario,
        vehicle: tipoUsuario,
        lat: pos.lat,
        lng: pos.lng,
        timestamp: Date.now()
    });
    
    console.log('Enviando posição:', message); // Log para depuração
    socket.send(message);
}

// 5. Geolocalização corrigida
function setupGeolocation() {
  if ("geolocation" in navigator) {
    navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        if (!marcadorUsuario) {
          marcadorUsuario = L.marker([lat, lng], {
            icon: icones[tipoUsuario] 
          }).addTo(mapa)
            .bindPopup(`<b>${nomeUsuario}</b>`);
          mapa.setView([lat, lng], 16);
        } else {
          marcadorUsuario.setLatLng([lat, lng]); // Corrigido: usando lat/lng diretamente
        }

        sendPosition(); // Envia a posição atualizada
      },
      (erro) => console.error("Erro na geolocalização:", erro),
      { enableHighAccuracy: true }
    );
  }
}


// 7. Configuração dos pontos estáticos (mantido igual)
const locais = [
  { nome: "Quartel General TCHA", coord: [-25.7718, -49.7164], tipo: "QG_TCHA", descricao: "Aqui onde a magia acontece rs.", tags: "2025 leozina arroz feijao" },
  { nome: "Teatro São João", coord: [-25.76803, -49.7171], tipo: "turistico", descricao: "Um teatro histórico." , tags: "antigo"},
  { nome: "Santuário de São Benedito", coord: [-25.7734, -49.7164], tipo: "turistico", descricao: "Igreja Santuário" , tags: "gigante"},
  { nome: "Monumento ao Tropeiro", coord: [-25.752535, -49.724339], tipo: "turistico", descricao: "Homenagem aos tropeiros." , tags: "tropeiro cavalo passagem"},
  { nome: "Portal dos 250 Anos", coord: [-25.754197, -49.724070], tipo: "turistico", descricao: "Marco dos 250 anos.", tags: "250 idade lapa" },
  { nome: "Casa Vermelha", coord: [-25.767005, -49.718767], tipo: "turistico", descricao: "Arquitetura peculiar.", tags: "antigamente" },
  { nome: "Praça General Carneiro", coord: [-25.767698474243968, -49.71692353809461], tipo: "turistico", descricao: "Ponto central.", tags: "busto estatua" },
  { nome: "Igreja Matriz", coord: [-25.767586119493156, -49.716562389662045], tipo: "turistico", descricao: "Principal igreja.", tags: "pedras"},
  { nome: "Museu Histórico de Lapa", coord: [-25.768159457291883, -49.717108812509125], tipo: "turistico", descricao: "História local." , tags: "historia"},
  { nome: "Panteon dos Heróis", coord: [-25.768567239819202, -49.71645188455341], tipo: "turistico", descricao: "Heróis da Revolução.", tags: "herois guerreiros enterrados" },
  { nome: "Casa Lacerda", coord: [-25.76844829221286, -49.71626514774258], tipo: "turistico", descricao: "Casa histórica." , tags: "nomes sei la"},
  { nome: "Museu da Moda", coord: [-25.768942143722818, -49.71667512754407], tipo: "turistico", descricao: "Vestimentas antigas.", tags: "moda antigo 1900" },
  { nome: "Casa da Memória", coord: [-25.768910742536967, -49.71646792690578], tipo: "turistico", descricao: "Memória da cidade." , tags: "memoria"},
  { nome: "Câmara Municipal", coord: [-25.771448862609812, -49.71643678902009], tipo: "turistico", descricao: "Poder legislativo.", tags: "camara" },
  { nome: "Quebra Pote", coord: [-25.769394966735444, -49.715193012331085], tipo: "turistico", descricao: "Conflito antigo.", tags: "quebra pote agua brinquedos escorregador banco ponte"},
  { nome: "Cristo Redentor", coord: [-25.776625061597496, -49.69884784990426], tipo: "turistico", descricao: "Vista panorâmica." , tags: "cristo"},
  { nome: "Gruta do Monge", coord: [-25.7815849227753, -49.6969123587656], tipo: "turistico", descricao: "Local religioso." , tags: "Gritador coroa santa trilha"},
  { nome: "Estação Ferroviária", coord: [-25.767843745284207, -49.73845492277281], tipo: "turistico", descricao: "Antiga estação." , tags: "Trem antigo"},
  { nome: "Estação Eng. Bley", coord: [-25.610691507692664, -49.73723776688024], tipo: "turistico", descricao: "Estação histórica." , tags: "Trem"},
  
  
  { nome: "Carro03", coord: [-25.768877696895192, -49.71688734099888], tipo: "fixos", descricao: "Ponto estratégico", tags: "ponto estratégico centro lapa prefeitura" },
{ nome: "Carro04", coord: [-25.776713687482637, -49.717241849190415], tipo: "fixos", descricao: "Ponto estratégico", tags: "ponto estratégico parque parquinho avenida" },
  { nome: "Carro07", coord: [-25.768562952762675, -49.70672582394665], tipo: "fixos", descricao: "Ponto estratégico", tags: "ponto estratégico jbs" },
  { nome: "Carro03", coord: [-25.768877696895192, -49.71688734099888], tipo: "fixos", descricao: "Ponto estratégico", tags: "ponto estratégico centro lapa prefeitura" },
  { nome: "Carro05", coord: [-25.76338372819463, -49.71495701994529], tipo: "fixos", descricao: "Ponto estratégico", tags: "ponto estratégico escola colegio" },
  { nome: "Carro01", coord: [-25.753951151378235, -49.723885421177705], tipo: "fixos", descricao: "Ponto estratégico", tags: "ponto estratégico gincana" },
  { nome: "Carro02", coord: [-25.76597165674314, -49.72819539231667], tipo: "fixos", descricao: "Ponto estratégico", tags: "ponto estratégico lucas pao padaria" },
  { nome: "Mercado Leosir", coord: [-25.761695869178368, -49.729136279152755], tipo: "fixos", descricao: "Ponto estratégico", tags: "ponto estratégico mercado jk juscelino jucelino leosir" },
  { nome: "Carro06", coord: [-25.768263224981514, -49.73492127994326], tipo: "fixos", descricao: "Ponto estratégico", tags: "ponto estratégico estacao" }
  ];

const grupos = {
  QG_TCHA: L.layerGroup(),
  turistico: L.layerGroup(),
  patrocinio: L.layerGroup(),
  placasestatuas: L.layerGroup(),
  fixos: L.layerGroup()
};

const iconesPorTipo = {
  QG_TCHA: L.icon({
    iconUrl: 'imagens/pin1.png',
    iconSize: [22, 30],
    iconAnchor: [16, 32]
  }),
  turistico: L.icon({
    iconUrl: 'imagens/pin2.png',
    iconSize: [22, 30],
    iconAnchor: [16, 32]
  }),
  patrocinio: L.icon({
    iconUrl: 'imagens/pin3.png',
    iconSize: [22, 30],
    iconAnchor: [16, 16]
  }),
  placasestatuas: L.icon({
    iconUrl: 'imagens/pin4.png',
    iconSize: [13, 18],
    iconAnchor: [13, 13]
  }),
  fixos: L.icon({
    iconUrl: 'imagens/pin6.png',
    iconSize: [22, 30],
    iconAnchor: [16, 32]
  })
};

locais.forEach(local => {
  let iconePersonalizado = iconesPorTipo[local.tipo] || undefined;
  const marcador = L.marker(local.coord, {
    icon: iconePersonalizado
  }).bindPopup(`<b>${local.nome}</b><br>${local.descricao}<br>${local.coord}`);

  if (grupos[local.tipo]) {
    grupos[local.tipo].addLayer(marcador);
  }

  const item = document.createElement("li");
  item.textContent = `[L] ${local.nome}`;
  item.textContent2 = local.descricao;
  item.textContent3 = local.tipo;
  item.textContent4 = local.tags;
  item._marcador = marcador;
  item.onclick = () => mapa.setView(local.coord, 17);
  document.getElementById("lista-referencias").appendChild(item);
});

// Adicionar grupos ao mapa (mantido igual)
Object.values(grupos).forEach(grupo => grupo.addTo(mapa));

// 8. Controles do mapa (mantido igual)
const overlayMaps = {
  "QG OS TCHÁ": grupos.QG_TCHA,
  "Turísticos": grupos.turistico,
  "Patrocinadores": grupos.patrocinio,
  "Placas/Estatuas": grupos.placasestatuas,
  "Pontos Estratégicos": grupos.fixos
};

L.control.layers(baseMaps, overlayMaps).addTo(mapa);

// Atualiza visibilidade da lista de acordo com o controle de camadas
mapa.on('overlayadd', function (e) {
  const tipoGrupo = Object.keys(overlayMaps).find(key => overlayMaps[key] === e.layer);
  atualizarListaPorTipo(tipoGrupo, true);
});

mapa.on('overlayremove', function (e) {
  const tipoGrupo = Object.keys(overlayMaps).find(key => overlayMaps[key] === e.layer);
  atualizarListaPorTipo(tipoGrupo, false);
});

function atualizarListaPorTipo(tipo, mostrar) {
  document.querySelectorAll("#lista-referencias li").forEach(item => {
    // Só afeta locais fixos (itens com textContent3 definido e sem '[M]')
    if (item.textContent3 === tipo && !item.textContent.startsWith("[M]")) {
      item.style.display = mostrar ? "block" : "none";
    }
  });
}

// Filtro por texto
document.getElementById("filtro").addEventListener("keyup", function () {
  const val = this.value.toLowerCase();
  const palavras = val.split(" ");

  document.querySelectorAll("#lista-referencias li").forEach(item => {
    const campos = [
      item.textContent.toLowerCase(),
      item.textContent2?.toLowerCase() || "",
      item.textContent3?.toLowerCase() || "",
      item.textContent4?.toLowerCase() || ""
    ].join(" ");

    const corresponde = palavras.every(palavra => campos.includes(palavra));
    item.style.display = corresponde ? "block" : "none";

    // Mostrar ou esconder marcador no mapa
    if (item._marcador) {
      if (corresponde) {
        item._marcador.addTo(mapa); // mostrar
      } else {
        mapa.removeLayer(item._marcador); // esconder
      }
    }
  });
});

const campoFiltro = document.getElementById("filtro");
const botaoLimpar = document.getElementById("limpar-filtro");

// 10. Menu lateral (mantido igual)
const toggleButton = document.getElementById('toggle-menu');
const aside = document.querySelector('aside');

toggleButton.addEventListener('click', () => {
  aside.classList.toggle('hidden');
  toggleButton.textContent = aside.classList.contains('hidden') ? '☰' : '✖';
  toggleButton.style.left = aside.classList.contains('hidden') ? '10px' : '260px';
});

// 11. Inicialização - ORDEM CORRETA
setupWebSocket();
setupGeolocation();
setInterval(sendPosition, 5000);