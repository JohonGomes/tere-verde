import { 
  User, Trail, Park, EventEntity, Restaurant, Lodging, Ticket, Comment, Review 
} from "../types";

// Chaves para o LocalStorage
const KEYS = {
  USERS: "tere_verde_users",
  PARKS: "tere_verde_parks",
  TRAILS: "tere_verde_trails",
  EVENTS: "tere_verde_events",
  RESTAURANTS: "tere_verde_restaurants",
  LODGINGS: "tere_verde_lodgings",
  TICKETS: "tere_verde_tickets",
  COMMENTS: "tere_verde_comments",
  REVIEWS: "tere_verde_reviews",
};

// Dados Mock Iniciais
const INITIAL_USERS: User[] = [
  {
    id: "user-admin",
    name: "Administrador Terê Verde",
    email: "admin@tereverde.com",
    role: "admin",
    cpf: "000.000.000-00",
    profilePic: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
    createdAt: new Date().toISOString(),
  },
  {
    id: "user-visitor",
    name: "João Silva",
    email: "visitante@tereverde.com",
    role: "visitor",
    cpf: "123.456.789-00",
    profilePic: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100",
    createdAt: new Date().toISOString(),
  }
];

const INITIAL_PARKS: Park[] = [
  {
    id: "parque-nacional",
    nome: "Parque Nacional da Serra dos Órgãos",
    descricao: "Criado em 1939, protege a exuberante biodiversidade da Serra do Mar e formações rochosas icônicas como o Dedo de Deus e a Pedra do Sino.",
    altitude: "2.263m",
    area: "20.024 hectares",
    imagem: "https://images.unsplash.com/photo-1682347812423-45911f8e6ef1?w=800",
    limiteCapacidadeDiaria: 300,
    funcionamento: "Terça a Domingo, das 8h às 17h",
    comoChegar: {
      carro: "Pela BR-116 sentido Teresópolis. A entrada principal fica na Av. Rotariana, s/n, Soberbo.",
      onibus: "A partir da Rodoviária Novo Rio via linhas diretas para Teresópolis, depois táxi ou aplicativo até a portaria."
    },
    ingressoBase: 35.00
  },
  {
    id: "parque-tres-picos",
    nome: "Parque Estadual dos Três Picos",
    descricao: "O maior parque estadual do Rio de Janeiro, famoso pelos imponentes picos de granito e vales de tirar o fôlego.",
    altitude: "2.366m",
    area: "65.113 hectares",
    imagem: "https://images.unsplash.com/photo-1604991274937-b93f0c37f5e9?w=800",
    limiteCapacidadeDiaria: 150,
    funcionamento: "Diariamente, das 8h às 17h",
    comoChegar: {
      carro: "Acesso principal pela RJ-130 (Estrada Teresópolis-Friburgo), Km 46, entrada para o Vale dos Frades.",
      onibus: "Linhas intermunicipais até a RJ-130 e transporte local/táxi até a entrada do Vale."
    },
    ingressoBase: 0.00
  },
  {
    id: "parque-municipal",
    nome: "Parque Natural Municipal Montanhas de Teresópolis",
    descricao: "Área de conservação municipal perfeita para caminhadas leves, observação de aves e piqueniques em família, com vista para a Pedra da Tartaruga.",
    altitude: "1.160m",
    area: "4.397 hectares",
    imagem: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=800",
    limiteCapacidadeDiaria: 200,
    funcionamento: "Terça a Domingo, das 8h às 16h",
    comoChegar: {
      carro: "Acesso pelo bairro Granja Florestal. Sinalização clara até a sede do parque.",
      onibus: "Linhas urbanas regulares do centro de Teresópolis até o ponto final no bairro da Granja."
    },
    ingressoBase: 0.00
  }
];

const INITIAL_TRAILS: Trail[] = [
  {
    id: "trilha-pedra-do-sino",
    parkId: "parque-nacional",
    nome: "Pedra do Sino",
    dificuldade: "Difícil",
    duracao: "8-10 horas",
    distancia: "14 km",
    descricao: "Trilha icônica com vista panorâmica da região serrana. O ponto culminante do parque oferece uma das vistas mais espetaculares da Serra dos Órgãos, com 360° de paisagens montanhosas.",
    imagem: "https://images.unsplash.com/photo-1682347812423-45911f8e6ef1?w=800",
    likes: 128,
    detalhes: {
      descricaoCompleta: "A Pedra do Sino, com 2.263 metros de altitude, é o ponto culminante do Parque Nacional da Serra dos Órgãos. A trilha é considerada uma das mais desafiadoras e recompensadoras do parque, oferecendo vistas panorâmicas incomparáveis da região serrana. O percurso passa por diferentes altitudes e ecossistemas, desde a floresta atlântica até os campos de altitude.",
      dificuldadeDetalhes: "Trilha de nível difícil que exige bom condicionamento físico. Inclui trechos íngremes, caminhadas longas em pedras e trechos com exposição à altura.",
      recomendacoes: [
        "Começar a trilha bem cedo, preferencialmente às 6h da manhã",
        "Levar no mínimo 3 litros de água por pessoa",
        "Protetor solar, boné e agasalho para o topo (pode fazer frio)",
        "Calçado de trekking com boa aderência",
        "Lanches energéticos e frutas"
      ],
      fotos: [
        "https://images.unsplash.com/photo-1682347812423-45911f8e6ef1?w=600",
        "https://images.unsplash.com/photo-1604991274937-b93f0c37f5e9?w=600",
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600"
      ]
    }
  },
  {
    id: "trilha-travessia",
    parkId: "parque-nacional",
    nome: "Travessia Petrópolis-Teresópolis",
    dificuldade: "Muito Difícil",
    duracao: "3 dias",
    distancia: "30 km",
    descricao: "Uma das trilhas de montanhismo mais clássicas e espetaculares do Brasil, cruzando o coração da Serra dos Órgãos.",
    imagem: "https://images.unsplash.com/photo-1604991274937-b93f0c37f5e9?w=800",
    likes: 245,
    detalhes: {
      descricaoCompleta: "Considerada uma das travessias mais icônicas do Brasil, a Petrópolis-Teresópolis atravessa 30 km de montanhas, campos de altitude e mata atlântica. Durante três dias, os aventureiros passam por paisagens espetaculares incluindo o Morro do Açu e a Pedra do Sino.",
      dificuldadeDetalhes: "Travessia de nível muito difícil. Exige excelente preparo físico, navegação e acampamento de alta montanha. Trechos expostos com cabos de aço.",
      recomendacoes: [
        "Reserva obrigatória dos abrigos/camping com antecedência",
        "Contratar guia credenciado é altamente recomendado",
        "Equipamento de montanhismo e frio extremo",
        "Acompanhar atentamente a previsão do tempo"
      ],
      fotos: [
        "https://images.unsplash.com/photo-1604991274937-b93f0c37f5e9?w=600",
        "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=600"
      ]
    }
  },
  {
    id: "trilha-veu-noiva",
    parkId: "parque-nacional",
    nome: "Cachoeira Véu da Noiva",
    dificuldade: "Fácil",
    duracao: "2 horas",
    distancia: "3 km",
    descricao: "Trilha leve com cachoeira de 40 metros. Ideal para famílias e iniciantes, oferece banho em piscinas naturais de águas cristalinas.",
    imagem: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800",
    likes: 89,
    detalhes: {
      descricaoCompleta: "A trilha até a Cachoeira Véu da Noiva é uma das mais acessíveis do parque, perfeita para famílias e pessoas que estão começando no trekking. A cachoeira tem aproximadamente 40 metros de altura e forma piscinas naturais ideais para banho.",
      dificuldadeDetalhes: "Trilha de nível fácil, com poucos trechos de subida leve. O caminho é bem marcado e mantido.",
      recomendacoes: [
        "Levar roupa de banho e toalha",
        "Protetor solar e repelente contra insetos",
        "Calçado confortável que possa molhar"
      ],
      fotos: [
        "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600",
        "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=600"
      ]
    }
  },
  {
    id: "trilha-cabeca-peixe",
    parkId: "parque-tres-picos",
    nome: "Trilha do Cabeça de Peixe",
    dificuldade: "Difícil",
    duracao: "6-7 horas",
    distancia: "8 km",
    descricao: "Subida íngreme e desafiadora por floresta fechada, culminando em uma vista incrível dos Três Picos de Friburgo.",
    imagem: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
    likes: 54,
    detalhes: {
      descricaoCompleta: "A subida da Cabeça de Peixe é uma das trilhas mais técnicas dos Três Picos, passando por trechos de escalaminhada pesada e matas virgens.",
      dificuldadeDetalhes: "Nível difícil. Exige força nos membros superiores nos trechos de corda/raiz e muita atenção.",
      recomendacoes: [
        "Levar luvas para os trechos de cordas",
        "Hidratação reforçada",
        "Calçado profissional com excelente aderência"
      ],
      fotos: [
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600"
      ]
    }
  },
  {
    id: "trilha-tartaruga",
    parkId: "parque-municipal",
    nome: "Trilha da Pedra da Tartaruga",
    dificuldade: "Fácil",
    duracao: "1.5 horas",
    distancia: "2 km",
    descricao: "Trilha curta e leve que leva até o platô da Pedra da Tartaruga, famosa área para prática de rapel e camping familiar.",
    imagem: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800",
    likes: 92,
    detalhes: {
      descricaoCompleta: "Uma caminhada agradável por estradas de terra e caminhos sombreados no Parque Municipal, proporcionando visuais espetaculares da Serra e das formações rochosas locais.",
      dificuldadeDetalhes: "Nível fácil. Ideal para iniciantes, crianças e idosos com mobilidade ativa.",
      recomendacoes: [
        "Ótimo para observação do pôr do sol",
        "Levar lanche para piquenique no topo",
        "Uso de repelente recomendado"
      ],
      fotos: [
        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600",
        "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600"
      ]
    }
  }
];

const INITIAL_EVENTS: EventEntity[] = [
  {
    id: "event-inverno",
    parkId: "parque-nacional",
    nome: "Festival de Inverno Terê Verde",
    descricao: "Três dias de palestras sobre ecologia, apresentações acústicas ao pôr do sol e oficinas gastronômicas de culinária serrana.",
    data: "2026-07-15",
    preco: 80.00,
    imagem: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800",
    limiteCapacidadeDiaria: 100
  },
  {
    id: "event-lua-cheia",
    parkId: "parque-municipal",
    nome: "Trilha Noturna da Lua Cheia",
    descricao: "Caminhada guiada sob a luz do luar até a Pedra da Tartaruga, com observação astronômica e lanche coletivo.",
    data: "2026-06-20",
    preco: 40.00,
    imagem: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    limiteCapacidadeDiaria: 45
  }
];

const INITIAL_RESTAURANTS: Restaurant[] = [
  {
    id: "rest-manjericao",
    nome: "Restaurante Manjericão",
    tipo: "Culinária Saudável & Contemporânea",
    descricao: "Pratos orgânicos e sofisticados preparados com ingredientes frescos cultivados localmente na região serrana.",
    notaMedia: 4.8,
    avaliacoesContagem: 24,
    imagem: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600"
  },
  {
    id: "rest-viva-italia",
    nome: "Viva Itália Teresópolis",
    tipo: "Massas & Gastronomia Italiana",
    descricao: "Experiência italiana tradicional com massas artesanais feitas na casa, rodízio de pizzas no forno a lenha e gelateria própria.",
    notaMedia: 4.6,
    avaliacoesContagem: 31,
    imagem: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600"
  }
];

const INITIAL_LODGINGS: Lodging[] = [
  {
    id: "lodge-chale-vale",
    nome: "Chalé dos Frades Aconchegante",
    tipo: "Chalé & Pousada Ecológica",
    descricao: "Localizado no coração do Vale dos Frades, com lareira, banheira de hidromassagem externa e vista panorâmica incrível das montanhas.",
    notaMedia: 4.9,
    avaliacoesContagem: 18,
    imagem: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=600"
  },
  {
    id: "lodge-hotel-serrador",
    nome: "Hotel Recanto do Serrador",
    tipo: "Hotel Fazenda",
    descricao: "Estrutura completa com piscina aquecida, trilhas internas, passeios a cavalo e pensão completa ideal para fins de semana.",
    notaMedia: 4.5,
    avaliacoesContagem: 29,
    imagem: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600"
  }
];

const INITIAL_TICKETS: Ticket[] = [
  {
    id: "ticket-1",
    userId: "user-visitor",
    userName: "João Silva",
    userCpf: "123.456.789-00",
    tipoItem: "event",
    itemId: "event-lua-cheia",
    itemName: "Trilha Noturna da Lua Cheia",
    dataReserva: "2026-06-20",
    dataCompra: new Date().toISOString(),
    quantidade: 2,
    valorTotal: 80.00,
    status: "ativo",
    qrCodeUrl: "TVERDE-E-LUACHEIA-1234"
  },
  {
    id: "ticket-2",
    userId: "user-visitor",
    userName: "João Silva",
    userCpf: "123.456.789-00",
    tipoItem: "park",
    itemId: "parque-nacional",
    itemName: "Acesso Diário - Parque Nacional",
    dataReserva: "2026-05-20",
    dataCompra: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    quantidade: 1,
    valorTotal: 35.00,
    status: "utilizado",
    qrCodeUrl: "TVERDE-P-PARNASO-9988"
  }
];

const INITIAL_COMMENTS: Comment[] = [
  {
    id: "comment-1",
    userId: "user-visitor",
    userName: "João Silva",
    userPic: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100",
    tipoDestino: "trail",
    destinoId: "trilha-pedra-do-sino",
    conteudo: "Uma subida desafiadora, mas a vista lá de cima vale cada centavo e gota de suor! O topo na Pedra do Sino é mágico.",
    status: "Aprovado",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "comment-2",
    userId: "user-visitor",
    userName: "João Silva",
    userPic: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100",
    tipoDestino: "trail",
    destinoId: "trilha-veu-noiva",
    conteudo: "Água extremamente gelada, mas deliciosa! Trilha muito rápida e tranquila para crianças.",
    status: "Aprovado",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "comment-pending-1",
    userId: "user-visitor",
    userName: "João Silva",
    userPic: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100",
    tipoDestino: "trail",
    destinoId: "trilha-pedra-do-sino",
    conteudo: "Vou fazer a trilha no próximo final de semana! Alguém sabe se o abrigo 4 já está aberto?",
    status: "Pendente",
    createdAt: new Date().toISOString()
  }
];

const INITIAL_REVIEWS: Review[] = [
  {
    id: "review-1",
    userId: "user-visitor",
    userName: "João Silva",
    userPic: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100",
    tipoDestino: "restaurant",
    destinoId: "rest-manjericao",
    nota: 5,
    comentario: "Atendimento exemplar e a salada com queijo de cabra artesanal estava incrível! Ambiente super integrado à natureza.",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Helper genérico de inicialização
function getOrInitialize<T>(key: string, initialData: T[]): T[] {
  if (typeof window === "undefined") return initialData;
  const stored = localStorage.getItem(key);
  if (!stored) {
    localStorage.setItem(key, JSON.stringify(initialData));
    return initialData;
  }
  return JSON.parse(stored);
}

function saveToLocalStorage<T>(key: string, data: T[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(data));
}

// Inicializadores
const getLocalUsers = () => getOrInitialize(KEYS.USERS, INITIAL_USERS);
const getLocalParks = () => getOrInitialize(KEYS.PARKS, INITIAL_PARKS);
const getLocalTrails = () => getOrInitialize(KEYS.TRAILS, INITIAL_TRAILS);
const getLocalEvents = () => getOrInitialize(KEYS.EVENTS, INITIAL_EVENTS);
const getLocalRestaurants = () => getOrInitialize(KEYS.RESTAURANTS, INITIAL_RESTAURANTS);
const getLocalLodgings = () => getOrInitialize(KEYS.LODGINGS, INITIAL_LODGINGS);
const getLocalTickets = () => getOrInitialize(KEYS.TICKETS, INITIAL_TICKETS);
const getLocalComments = () => getOrInitialize(KEYS.COMMENTS, INITIAL_COMMENTS);
const getLocalReviews = () => getOrInitialize(KEYS.REVIEWS, INITIAL_REVIEWS);

// API MOCK SERVICE EXPORTS (Laravel API Ready interfaces)
export const ApiService = {
  // --- AUTENTICAÇÃO ---
  login: async (email: string, password?: string): Promise<{ user: User; token: string }> => {
    // Simula atraso da rede
    await new Promise(r => setTimeout(r, 600));
    const users = getLocalUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      throw new Error("E-mail ou senha incorretos.");
    }
    // Token JWT simulado
    const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.simulated_jwt_for_${user.id}`;
    return { user, token };
  },

  register: async (name: string, email: string, cpf: string, role: "visitor" | "admin" = "visitor"): Promise<{ user: User; token: string }> => {
    await new Promise(r => setTimeout(r, 600));
    const users = getLocalUsers();
    
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error("E-mail já cadastrado.");
    }
    if (users.some(u => u.cpf === cpf)) {
      throw new Error("CPF já cadastrado.");
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      role,
      cpf,
      profilePic: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 999999)}?w=100`,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveToLocalStorage(KEYS.USERS, users);

    const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.simulated_jwt_for_${newUser.id}`;
    return { user: newUser, token };
  },

  updateProfile: async (userId: string, name: string, cpf: string): Promise<User> => {
    await new Promise(r => setTimeout(r, 400));
    const users = getLocalUsers();
    const index = users.findIndex(u => u.id === userId);
    if (index === -1) throw new Error("Usuário não encontrado.");
    
    users[index] = { ...users[index], name, cpf };
    saveToLocalStorage(KEYS.USERS, users);
    return users[index];
  },

  // --- PARQUES & TRILHAS ---
  getParks: async (): Promise<Park[]> => {
    return getLocalParks();
  },

  getTrails: async (parkId?: string): Promise<Trail[]> => {
    const trails = getLocalTrails();
    if (parkId) {
      return trails.filter(t => t.parkId === parkId);
    }
    return trails;
  },

  likeTrail: async (trailId: string, userId: string): Promise<Trail> => {
    const trails = getLocalTrails();
    const index = trails.findIndex(t => t.id === trailId);
    if (index === -1) throw new Error("Trilha não encontrada.");
    
    const trail = trails[index];
    if (trail.likedByUser) {
      trail.likes = Math.max(0, trail.likes - 1);
      trail.likedByUser = false;
    } else {
      trail.likes += 1;
      trail.likedByUser = true;
    }
    
    trails[index] = trail;
    saveToLocalStorage(KEYS.TRAILS, trails);
    return trail;
  },

  // --- EVENTOS ---
  getEvents: async (parkId?: string): Promise<EventEntity[]> => {
    const events = getLocalEvents();
    if (parkId) {
      return events.filter(e => e.parkId === parkId);
    }
    return events;
  },

  // --- RESTAURANTES & HOSPEDAGENS ---
  getRestaurants: async (): Promise<Restaurant[]> => {
    return getLocalRestaurants();
  },

  getLodgings: async (): Promise<Lodging[]> => {
    return getLocalLodgings();
  },

  // --- COMENTÁRIOS (COM MODERAÇÃO RN01) ---
  getComments: async (tipoDestino: "trail" | "park" | "event", destinoId: string): Promise<Comment[]> => {
    const comments = getLocalComments();
    return comments.filter(c => c.tipoDestino === tipoDestino && c.destinoId === destinoId && c.status === "Aprovado");
  },

  getPendingComments: async (): Promise<Comment[]> => {
    const comments = getLocalComments();
    return comments.filter(c => c.status === "Pendente");
  },

  addComment: async (userId: string, userName: string, userPic: string | undefined, tipoDestino: "trail" | "park" | "event", destinoId: string, conteudo: string): Promise<Comment> => {
    const comments = getLocalComments();
    
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      userId,
      userName,
      userPic,
      tipoDestino,
      destinoId,
      conteudo,
      status: "Pendente", // Regra de Negócio RN01: entra pendente por padrão
      createdAt: new Date().toISOString()
    };

    comments.unshift(newComment);
    saveToLocalStorage(KEYS.COMMENTS, comments);
    return newComment;
  },

  moderateComment: async (commentId: string, status: "Aprovado" | "Reprovado"): Promise<Comment> => {
    const comments = getLocalComments();
    const index = comments.findIndex(c => c.id === commentId);
    if (index === -1) throw new Error("Comentário não encontrado.");
    
    comments[index].status = status;
    saveToLocalStorage(KEYS.COMMENTS, comments);
    return comments[index];
  },

  // --- AVALIAÇÕES (RESTAURANTES/HOSPEDAGENS RN02) ---
  getReviews: async (tipoDestino: "restaurant" | "lodging", destinoId: string): Promise<Review[]> => {
    const reviews = getLocalReviews();
    return reviews.filter(r => r.tipoDestino === tipoDestino && r.destinoId === destinoId);
  },

  addReview: async (userId: string, userName: string, userPic: string | undefined, tipoDestino: "restaurant" | "lodging", destinoId: string, nota: number, comentario: string): Promise<Review> => {
    const reviews = getLocalReviews();
    
    const newReview: Review = {
      id: `review-${Date.now()}`,
      userId,
      userName,
      userPic,
      tipoDestino,
      destinoId,
      nota,
      comentario,
      createdAt: new Date().toISOString()
    };

    reviews.unshift(newReview);
    saveToLocalStorage(KEYS.REVIEWS, reviews);

    // Atualiza nota média do estabelecimento
    if (tipoDestino === "restaurant") {
      const rests = getLocalRestaurants();
      const idx = rests.findIndex(r => r.id === destinoId);
      if (idx !== -1) {
        const itemReviews = reviews.filter(r => r.tipoDestino === "restaurant" && r.destinoId === destinoId);
        const sum = itemReviews.reduce((a, b) => a + b.nota, 0);
        rests[idx].notaMedia = Number((sum / itemReviews.length).toFixed(1));
        rests[idx].avaliacoesContagem = itemReviews.length;
        saveToLocalStorage(KEYS.RESTAURANTS, rests);
      }
    } else {
      const lodges = getLocalLodgings();
      const idx = lodges.findIndex(l => l.id === destinoId);
      if (idx !== -1) {
        const itemReviews = reviews.filter(r => r.tipoDestino === "lodging" && r.destinoId === destinoId);
        const sum = itemReviews.reduce((a, b) => a + b.nota, 0);
        lodges[idx].notaMedia = Number((sum / itemReviews.length).toFixed(1));
        lodges[idx].avaliacoesContagem = itemReviews.length;
        saveToLocalStorage(KEYS.LODGINGS, lodges);
      }
    }

    return newReview;
  },

  // --- INGRESSOS & RESERVAS (CAPACIDADE LIMITADA RN03) ---
  buyTicket: async (userId: string, userName: string, userCpf: string, tipoItem: TicketType, itemId: string, itemName: string, date: string, quantity: number, pricePerItem: number): Promise<Ticket> => {
    await new Promise(r => setTimeout(r, 600));
    
    const tickets = getLocalTickets();

    // Validar Capacidade Máxima do Parque/Evento (RN03)
    let maxCapacity = 300;
    if (tipoItem === "park") {
      const park = getLocalParks().find(p => p.id === itemId);
      if (park) maxCapacity = park.limiteCapacidadeDiaria;
    } else if (tipoItem === "event") {
      const ev = getLocalEvents().find(e => e.id === itemId);
      if (ev) maxCapacity = ev.limiteCapacidadeDiaria;
    } else {
      // Para trilhas, o limite padrão baseia-se no parque
      const trail = getLocalTrails().find(t => t.id === itemId);
      if (trail) {
        const park = getLocalParks().find(p => p.id === trail.parkId);
        if (park) maxCapacity = Math.floor(park.limiteCapacidadeDiaria * 0.4); // 40% da capacidade total do parque
      }
    }

    // Calcula quantidade total já vendida para esta data e item
    const soldTickets = tickets
      .filter(t => t.itemId === itemId && t.dataReserva === date && t.status !== "cancelado")
      .reduce((acc, curr) => acc + curr.quantidade, 0);

    if (soldTickets + quantity > maxCapacity) {
      throw new Error(`Ingressos esgotados para esta data! Capacidade disponível: ${maxCapacity - soldTickets} ingressos.`);
    }

    const newTicket: Ticket = {
      id: `ticket-${Math.floor(100000 + Math.random() * 900000)}`,
      userId,
      userName,
      userCpf,
      tipoItem,
      itemId,
      itemName,
      dataReserva: date,
      dataCompra: new Date().toISOString(),
      quantidade: quantity,
      valorTotal: pricePerItem * quantity,
      status: "ativo",
      qrCodeUrl: `TVERDE-${tipoItem.toUpperCase().substring(0, 3)}-${itemId.toUpperCase().substring(0, 5)}-${Math.floor(1000 + Math.random() * 9000)}`
    };

    tickets.unshift(newTicket);
    saveToLocalStorage(KEYS.TICKETS, tickets);
    return newTicket;
  },

  getTicketsByUser: async (userId: string): Promise<Ticket[]> => {
    return getLocalTickets().filter(t => t.userId === userId);
  },

  getAllTickets: async (): Promise<Ticket[]> => {
    return getLocalTickets();
  },

  checkInTicket: async (query: string): Promise<Ticket> => {
    await new Promise(r => setTimeout(r, 500));
    const tickets = getLocalTickets();
    
    // Busca por QR Code exato ou por CPF (limpa caracteres)
    const normalizedQuery = query.replace(/[^\w\d]/g, "").toUpperCase();
    const index = tickets.findIndex(t => {
      const ticketQr = t.qrCodeUrl.toUpperCase();
      const ticketCpf = t.userCpf.replace(/[^\d]/g, "");
      return ticketQr === query || ticketQr === normalizedQuery || ticketCpf === query || ticketCpf === normalizedQuery;
    });

    if (index === -1) {
      throw new Error("Nenhum ingresso ativo encontrado com este QR Code ou CPF.");
    }

    const ticket = tickets[index];
    if (ticket.status === "utilizado") {
      throw new Error(`Este ingresso já foi utilizado em ${new Date(ticket.dataReserva).toLocaleDateString()}!`);
    }
    if (ticket.status === "cancelado") {
      throw new Error("Este ingresso foi cancelado pelo cliente/administrador.");
    }

    ticket.status = "utilizado";
    tickets[index] = ticket;
    saveToLocalStorage(KEYS.TICKETS, tickets);
    return ticket;
  },

  // --- RELATÓRIOS CONSOLIDADOS (RF07) ---
  getSalesReport: async (): Promise<any[]> => {
    const tickets = getLocalTickets().filter(t => t.status !== "cancelado");
    
    // Retorna resumo por item vendido
    const summary: Record<string, { name: string; quantity: number; revenue: number }> = {};
    
    tickets.forEach(t => {
      if (!summary[t.itemName]) {
        summary[t.itemName] = { name: t.itemName, quantity: 0, revenue: 0 };
      }
      summary[t.itemName].quantity += t.quantidade;
      summary[t.itemName].revenue += t.valorTotal;
    });

    return Object.values(summary);
  },

  // --- CRUD GERAL ADMIN (RF03) ---
  createEntity: async (tipo: "park" | "trail" | "event" | "restaurant" | "lodging", entity: any): Promise<any> => {
    await new Promise(r => setTimeout(r, 400));
    
    if (tipo === "park") {
      const parks = getLocalParks();
      const newPark: Park = { id: `park-${Date.now()}`, ...entity };
      parks.push(newPark);
      saveToLocalStorage(KEYS.PARKS, parks);
      return newPark;
    } else if (tipo === "trail") {
      const trails = getLocalTrails();
      const newTrail: Trail = { id: `trail-${Date.now()}`, likes: 0, ...entity };
      trails.push(newTrail);
      saveToLocalStorage(KEYS.TRAILS, trails);
      return newTrail;
    } else if (tipo === "event") {
      const events = getLocalEvents();
      const newEvent: EventEntity = { id: `event-${Date.now()}`, ...entity };
      events.push(newEvent);
      saveToLocalStorage(KEYS.EVENTS, events);
      return newEvent;
    } else if (tipo === "restaurant") {
      const rests = getLocalRestaurants();
      const newRest: Restaurant = { id: `rest-${Date.now()}`, notaMedia: 0, avaliacoesContagem: 0, ...entity };
      rests.push(newRest);
      saveToLocalStorage(KEYS.RESTAURANTS, rests);
      return newRest;
    } else if (tipo === "lodging") {
      const lodges = getLocalLodgings();
      const newLodge: Lodging = { id: `lodge-${Date.now()}`, notaMedia: 0, avaliacoesContagem: 0, ...entity };
      lodges.push(newLodge);
      saveToLocalStorage(KEYS.LODGINGS, lodges);
      return newLodge;
    }
  },

  updateEntity: async (tipo: "park" | "trail" | "event" | "restaurant" | "lodging", id: string, entity: any): Promise<any> => {
    await new Promise(r => setTimeout(r, 400));
    
    if (tipo === "park") {
      const parks = getLocalParks();
      const idx = parks.findIndex(p => p.id === id);
      if (idx === -1) throw new Error("Parque não encontrado.");
      parks[idx] = { ...parks[idx], ...entity };
      saveToLocalStorage(KEYS.PARKS, parks);
      return parks[idx];
    } else if (tipo === "trail") {
      const trails = getLocalTrails();
      const idx = trails.findIndex(t => t.id === id);
      if (idx === -1) throw new Error("Trilha não encontrada.");
      trails[idx] = { ...trails[idx], ...entity };
      saveToLocalStorage(KEYS.TRAILS, trails);
      return trails[idx];
    } else if (tipo === "event") {
      const events = getLocalEvents();
      const idx = events.findIndex(e => e.id === id);
      if (idx === -1) throw new Error("Evento não encontrado.");
      events[idx] = { ...events[idx], ...entity };
      saveToLocalStorage(KEYS.EVENTS, events);
      return events[idx];
    } else if (tipo === "restaurant") {
      const rests = getLocalRestaurants();
      const idx = rests.findIndex(r => r.id === id);
      if (idx === -1) throw new Error("Restaurante não encontrado.");
      rests[idx] = { ...rests[idx], ...entity };
      saveToLocalStorage(KEYS.RESTAURANTS, rests);
      return rests[idx];
    } else if (tipo === "lodging") {
      const lodges = getLocalLodgings();
      const idx = lodges.findIndex(l => l.id === id);
      if (idx === -1) throw new Error("Hospedagem não encontrada.");
      lodges[idx] = { ...lodges[idx], ...entity };
      saveToLocalStorage(KEYS.LODGINGS, lodges);
      return lodges[idx];
    }
  },

  deleteEntity: async (tipo: "park" | "trail" | "event" | "restaurant" | "lodging", id: string): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 400));
    
    if (tipo === "park") {
      const parks = getLocalParks();
      const filtered = parks.filter(p => p.id !== id);
      saveToLocalStorage(KEYS.PARKS, filtered);
    } else if (tipo === "trail") {
      const trails = getLocalTrails();
      const filtered = trails.filter(t => t.id !== id);
      saveToLocalStorage(KEYS.TRAILS, filtered);
    } else if (tipo === "event") {
      const events = getLocalEvents();
      const filtered = events.filter(e => e.id !== id);
      saveToLocalStorage(KEYS.EVENTS, filtered);
    } else if (tipo === "restaurant") {
      const rests = getLocalRestaurants();
      const filtered = rests.filter(r => r.id !== id);
      saveToLocalStorage(KEYS.RESTAURANTS, filtered);
    } else if (tipo === "lodging") {
      const lodges = getLocalLodgings();
      const filtered = lodges.filter(l => l.id !== id);
      saveToLocalStorage(KEYS.LODGINGS, filtered);
    }
    return true;
  }
};
