const mapa = L.map('map').setView([-25.7718, -49.7164], 15);

// Camadas de mapa base
const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(mapa);

const osmHOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
  maxZoom: 30,
  attribution: '© OpenStreetMap contributors, Tiles style by HOT - OSM France'
});

const baseMaps = {
  "Modelo 1": osm,
  "Modelo 2": osmHOT
};

// Pontos por categoria
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
  { nome:"Pratense", coord:[-25.769404657904666, -49.71923999997251], tipo: "patrocinio", descricao: "Auto Escola Pratense", tags: "escola carro patrocinadora patrocinio moto caminhao onibus"},
{ nome:"Med Farma", coord:[-25.767701164581393, -49.72753602968245], tipo: "patrocinio", descricao: "Farmacia Med Farma", tags: "Farmacia Remedio Remédio"},
{ nome:"Vida Marinha", coord:[-25.76797424604152, -49.718871103628295], tipo: "patrocinio", descricao: "Vida Marinha", tags: "Roupa Vida Marinha"},
{ nome:"Wizard", coord:[-25.769453259353373, -49.71606736263043], tipo: "patrocinio", descricao: "Wizard", tags: "Ingles escola idiomas disney"},
{ nome:"Vetor", coord:[-25.768593456347624, -49.72112940052666], tipo: "patrocinio", descricao: "Instituto de Odontologia Vetor", tags: "Dente vetor odontologia carie aparelho"},
{ nome:"UNIFAEL", coord:[-25.75918848775419, -49.74121155651842], tipo: "patrocinio", descricao: "Unifael", tags: "Universidade FAEL escola"},
{ nome:"Spaço VIP Noivas", coord:[-25.763118128972078, -49.721369636600286], tipo: "patrocinio", descricao: "Spaço VIP Noivas", tags: "Noivas VIP Terno vestido casamento"},
{ nome:"Fênix ", coord:[-25.764652072158007, -49.728517029578484], tipo: "patrocinio", descricao: "Fênix tintas", tags: "Tinta cor pintura"},
{ nome:"CVC", coord:[-25.768108695838595, -49.7192005841902], tipo: "patrocinio", descricao: "Agencia de viagens", tags: "Agencia Viagens Transporte CVC"},
{ nome:"Algodao Doce", coord:[-25.766054795763505, -49.71099954689562], tipo: "patrocinio", descricao: "Casa do Algodao Doce", tags: "Algodao doce "},
{ nome:"VHX", coord:[-25.761187061852553, -49.72958428063137], tipo: "patrocinio", descricao: "O atacado da construcao", tags: "Construção atacado material materiais construcao"},
{ nome:"Estátua General Carneiro", coord:[-25.7676985018339, -49.7169126939526], tipo: "placasestatuas", descricao: "Estátua General Carneiro", tags: 
"o estado do parana ao heroi heróe heroe herói da lapa general gomes carneiro 1846 1894 MCMXXVIII Antônio Ernesto Gomes Carneiro (Serro, 28 de novembro de 1846 - Lapa, 9 de fevereiro de 1894) foi um militar brasileiro, com participação na Guerra do Paraguai e na Revolução Federalista. Nasceu em Serro, Minas Gerais, em 28 de novembro de 1846, onde iniciou seus estudos, os quais deu seguimento no Seminário de Diamantina e em Curvelo.Em 1864 cursava Humanidades, no mosteiro dos Beneditinos, no Rio de Janeiro, quando eclodiu a Guerra do Paraguai, decidindo então alistar-se como soldado, no Primeiro Corpo de Voluntários da Pátria.Na guerra conquistou a graduação de Primeiro Sargento e Alferes, por bravura. Foi ferido três vezes em combate (Estero Bellaco, Piquissiri e Lomas Valentinas). Mal se restabelecia e já se apresentava para nova missão.Após o final do conflito, matriculou-se na Escola Militar, em 1872, tendo atingido as seguintes promoções militares:Tenente em 1875;Capitão em 1877;Major em 1887;Tenente-coronel em 1890;Coronel em 1892.Em 1881 acompanhou o Imperador D. Pedro II em sua viagem a Minas Gerais.Chefiou a Comissão Construtora de Linhas Telegráficas na Marcha para o Oeste, de 1890 a 1892, tornando-se o responsável pelo recrutamento do então tenente Cândido Rondon.Convocado para a região sul durante a Revolução Federalista, foi nomeado comandante do 5º Distrito Militar, mas depois por ordens de Floriano Peixoto passou o comando para o Marechal Pego Junior. Carneiro conhecia Pego por suas ideias monarquistas e temeu que este se unisse aos revoltosos, mas isso não ocorreu. Por outro lado, Pego Junior e Vicente Machado, então governador do Paraná, fugiram do estado covardemente e suas tropas, que contavam com mais de mil homens, ficaram desorientadas, acabaram por desertar ou perder-se na fuga. O Paraná e a capital Curitiba estavam sem exército e governantes, só a Lapa estava guarnecida, Carneiro e suas tropas foram cercados na cidade, em um dos mais célebres episódios da vida militar brasileira, conhecido como Cerco da Lapa.Cerco da LapaO Coronel Gomes Carneiro e os Heróis do cerco da Lapa.Foram vinte e seis dias de resistência, com um efetivo militar de 639 praças e patriotas (civis voluntários). Eles foram cercados por três mil homens comandados por Gumercindo Saraiva. A capitulação ocorreu após a morte de Carneiro e pela falta de comida e de munição. A resistência definiu o vencedor, pois atrasou o avanço dos federalistas e permitiu que as tropas legalistas se organizassem e posteriormente derrotassem os revoltosos.O então Coronel Gomes Carneiro foi ferido, morrendo dois dias depois, em 9 de fevereiro de 1894, ainda dando ordens.[1] Um dia antes, sem o saber, fora promovido a General de Brigada, por bravura. Seus restos mortais se encontram no Panteão dos Heróis, na cidade de Lapa, junto com todos os combatentes, que morreram no cerco ou posteriormente.HomenagenEm sua homenagem foram batizados como General Carneiro um município no Paraná e outro no Mato Grosso. Em logradouros públicos, Gomes Carneiro foi homenageado, com deu nome dado a uma avenida de Sorocaba, em São Paulo,a uma rua na Zona Sul do Rio de Janeiro[2] e outra na cidade de Santa Maria (Rio Grande do Sul)[3] .Personagem históricaNa obra O Triste Fim de Policarpo Quaresma, o escritor Lima Barreto abandona momentaneamente a ficção e lhe faz um insuspeito elogio:... só a Lapa resistia tenazmente, uma das poucas páginas dignas e limpas de todo aquele enxurro de paixões. A pequena cidade tinha dentro de suas trincheiras o Coronel Gomes Carneiro, uma energia, uma vontade, verdadeiramente isso, porque era sereno, confiante e justo. Não se desmanchou em violências de apavorado e soube tornar verdade a gasta frase grandiloquente: resistir até a morte.Ao saber da queda da Lapa, Marechal Floriano Peixoto exclamou: Se a Lapa caiu, Gomes Carneiro morreu!Foi, por seu valor inconteste, designado Patrono do Sétimo Regimento de Infantaria, na cidade rio-grandense de Santa Maria, uma das maiores e mais famosas unidades do Exército Brasileiro. 28/11/1846 28 11 novembro 09/02/1894 47 09 fevereiro"},
{ nome:"Linha do trem", coord:[-25.760303870672747, -49.73364022694987], tipo: "placasestatuas", descricao: "Rodovia do Xisto", tags: "rodovia do xisto trem vagao ferro linha ferrea"},
{ nome:"Passarela BR", coord:[-25.757324308865858, -49.73024510326732], tipo: "placasestatuas", descricao: "Passarela na Rod Xisto", tags: "escola emilia magalhaes ferreira do amaral Passarela amarelo grade bosch rodolapa intec agricola metalurgica rodovia do xisto"},
{ nome:"Placa Memoria Ferroviaria", coord:[-25.76780925262605, -49.73840143485134], tipo: "placasestatuas", descricao: "Placa", tags: "A memória é a consciencia inserida ao tempo. Fernando Pessoa. Inauguração do centro de memoria ferroviaria. Sebastião pires furiatti 31 agosto 2017 e recuperação da estação ferroviaria da lapa obra de uma parceria entre prefeitura municipal da lapa e exercio brasileir oo funcionamento sera o apoio do iphanpr instituto do patrimonio historico e artistico nacional, 10ª sup. regiona pr  IHGPR institulo historico geografico do parana ABPF associação brasileira da preservacao ferroviaria "},
{ nome:"Placa 2ª Guerra mundial", coord:[-25.771187310332955, -49.71655872062561], tipo: "placasestatuas", descricao: "Lapeanos guerra", tags: "Lapeanos que há 45 anos lutaram na europa, em defesa do brasil e pela liberdade no mundo 08 maio 08/05 1990 André Bill Hammerschmidt João Maria Mateus Siben Pinheiro Silva da simborski ukan vieira de oliveira ferreira de lima vaz padilha joaquin josé antonio dos santos berberino dequech josé cardoso oliveira dubiel halaiko kochinski lourenço pimentel pichibonski prestes colaço amaral juvenal juvencio lauro amaral silveira ludovico belinoski kochiba rodrigues ookunski prince sahia diniz ferreira iurkiv pires de lima buen farias padrilha conçalves sebastiao pedro paulo namur miguel"},
];

// Agrupar marcadores por categoria
const grupos = {
  QG_TCHA: L.layerGroup(),
  turistico: L.layerGroup(),
  patrocinio: L.layerGroup(),
  placasestatuas: L.layerGroup()
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
  })
};



locais.forEach(local => {
  // Escolhe o ícone de acordo com o tipo
  let iconePersonalizado = iconesPorTipo[local.tipo] || undefined;

  const marcador = L.marker(local.coord, {
    icon: iconePersonalizado
  }).bindPopup(`<b>${local.nome}</b><br>${local.descricao}<br>${local.coord}`);

  // Adiciona ao grupo correto
  if (grupos[local.tipo]) {
    grupos[local.tipo].addLayer(marcador);
  }

  // Cria item na lista lateral
  const item = document.createElement("li");
  item.textContent = local.nome;
  item.textContent2 = local.descricao;
  item.textContent3 = local.tipo;
  item.textContent4 = local.tags;
  item._marcador = marcador; // << ADICIONADO
  item.onclick = () => mapa.setView(local.coord, 17);
  document.getElementById("lista-referencias").appendChild(item);
});


// Adicionar ao mapa
grupos.QG_TCHA.addTo(mapa);
grupos.turistico.addTo(mapa);
grupos.patrocinio.addTo(mapa);
grupos.placasestatuas.addTo(mapa);

// Controle de camadas
const overlayMaps = {
  "QG TCHÁ": grupos.QG_TCHA,
  "Turísticos": grupos.turistico,
  "Patrocinadores": grupos.patrocinio,
  "Placas/Estatuas": grupos.placasestatuas
};

L.control.layers(baseMaps, overlayMaps).addTo(mapa);

// Filtro por texto
document.getElementById("filtro").addEventListener("keyup", function () {
  const val = this.value.toLowerCase();
  const palavras = val.split(" ");

  document.querySelectorAll("#lista-referencias li").forEach(item => {
    const campos = [
      item.textContent.toLowerCase(),
      item.textContent2.toLowerCase(),
      item.textContent3.toLowerCase(),
      item.textContent4.toLowerCase()
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

// Mostrar ou esconder o botão conforme digita
campoFiltro.addEventListener("input", function () {
  botaoLimpar.style.display = this.value.length > 0 ? "block" : "none";
});

// Clicar no ❌ limpa o campo e reaplica o filtro
botaoLimpar.addEventListener("click", function () {
  campoFiltro.value = "";
  botaoLimpar.style.display = "none";
  campoFiltro.dispatchEvent(new Event("keyup")); // reaplica o filtro
});


// Ícones de veículos
const iconeCarro = L.icon({ iconUrl: 'imagens/carro.png', iconSize: [32, 32], iconAnchor: [16, 32] });
const iconeMoto = L.icon({ iconUrl: 'imagens/moto.png', iconSize: [32, 32], iconAnchor: [16, 32] });

const veiculosDinamicos = [
  { tipo: "carro", coord: [-25.7720, -49.7120], marcador: null },
  { tipo: "moto", coord: [-25.7740, -49.7160], marcador: null }
];

veiculosDinamicos.forEach(v => {
  const icon = v.tipo === "carro" ? iconeCarro : iconeMoto;
  v.marcador = L.marker(v.coord, { icon }).addTo(mapa);
});

// Movimento aleatório a cada 2s
setInterval(() => {
  veiculosDinamicos.forEach(v => {
    v.coord[0] += (Math.random() - 0.5) * 0.0005;
    v.coord[1] += (Math.random() - 0.5) * 0.0005;
    v.marcador.setLatLng(v.coord);
  });
}, 2000);
// Ícone do usuário baseado na escolha
const tipoUsuario = localStorage.getItem("tipoUsuario") || "visitante";
const nomeUsuario = localStorage.getItem("nomeUsuario") || "Usuário"; // Recupera o nome
let marcadorUsuario = null;

if ("geolocation" in navigator) {
    navigator.geolocation.watchPosition(
        (pos) => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;

            if (!marcadorUsuario) {
                let iconeUsuario;

                if (tipoUsuario === "carro") {
                    iconeUsuario = L.icon({
                        iconUrl: 'imagens/carro.png',
                        iconSize: [32, 32],
                        iconAnchor: [16, 32]
                    });
                } else if (tipoUsuario === "moto") {
                    iconeUsuario = L.icon({
                        iconUrl: 'imagens/moto.png',
                        iconSize: [32, 32],
                        iconAnchor: [16, 32]
                    });
                } else {
                    iconeUsuario = L.divIcon({
                        html: `<div style="background:blue; width:14px; height:14px; border-radius:50%; border:2px solid white"></div>`
                    });
                }

                // Use crases para interpolação de string
                marcadorUsuario = L.marker([lat, lng], { icon: iconeUsuario }).addTo(mapa).bindPopup(`<b>${nomeUsuario}</b>`);
                mapa.setView([lat, lng], 16);
            } else {
                marcadorUsuario.setLatLng([lat, lng]);
            }
        },
        (erro) => console.error("Erro ao obter localização:", erro),
        { enableHighAccuracy: true }
    );
}
const toggleButton = document.getElementById('toggle-menu');
const aside = document.querySelector('aside');

toggleButton.addEventListener('click', () => {
  aside.classList.toggle('hidden');

  if (aside.classList.contains('hidden')) {
    toggleButton.textContent = '☰';
    toggleButton.style.left = '10px';
  } else {
    toggleButton.textContent = '✖';
    toggleButton.style.left = '260px'; // ao lado do menu
  }
});

const socket = new WebSocket('wss://' + window.location.host);

let userId = Date.now().toString(); // ID simples
let userName = localStorage.getItem("nomeUsuario") || "Visitante";
let userVehicle = localStorage.getItem("tipoUsuario") || "visitante";

socket.addEventListener('open', () => {
    socket.send(JSON.stringify({
        type: 'register',
        id: userId,
        name: userName,
        vehicle: userVehicle,
        lat: 0,
        lng: 0
    }));
});

// Atualizar posição em tempo real
navigator.geolocation.watchPosition((position) => {
    socket.send(JSON.stringify({
        type: 'update',
        id: userId,
        name: userName,
        vehicle: userVehicle,
        lat: position.coords.latitude,
        lng: position.coords.longitude
    }));
});


// Receber posições de todo mundo
socket.addEventListener('message', (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'locations') {
        // Aqui você atualiza seu mapa com os dados de todos
        console.log(data.locations); 
        // Exemplo: limpar marcadores antigos e criar novos
    }
});
const outrosUsuarios = {};

socket.addEventListener('message', (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'locations') {
        data.locations.forEach((usuario) => {
            if (usuario.id === userId) return;

            const coords = [usuario.lat, usuario.lng];

            if (outrosUsuarios[usuario.id]) {
                outrosUsuarios[usuario.id].setLatLng(coords);
            } else {
                let icone;
                if (usuario.vehicle === "carro") {
                    icone = iconeCarro;
                } else if (usuario.vehicle === "moto") {
                    icone = iconeMoto;
                } else {
                    icone = L.divIcon({
                        html: `<div style="background:red; width:12px; height:12px; border-radius:50%; border:2px solid white"></div>`
                    });
                }

                const marker = L.marker(coords, { icon: icone })
                  .addTo(mapa)
                  .bindPopup(`<b>${usuario.name}</b> (${usuario.vehicle})`);
                outrosUsuarios[usuario.id] = marker;
            }
        });
    }
});
