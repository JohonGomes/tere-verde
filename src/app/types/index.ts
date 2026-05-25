export interface User {
  id: string;
  name: string;
  email: string;
  role: "visitor" | "admin";
  cpf: string;
  profilePic?: string;
  createdAt: string;
}

export type TrailDifficulty = "Fácil" | "Médio" | "Difícil" | "Muito Difícil";

export interface Trail {
  id: string;
  parkId: string;
  nome: string;
  dificuldade: TrailDifficulty;
  duracao: string;
  distancia: string;
  descricao: string;
  imagem: string;
  likes: number;
  likedByUser?: boolean;
  detalhes?: {
    descricaoCompleta: string;
    dificuldadeDetalhes: string;
    recomendacoes: string[];
    fotos: string[];
  };
}

export interface Park {
  id: string;
  nome: string;
  descricao: string;
  altitude: string;
  area: string;
  imagem: string;
  limiteCapacidadeDiaria: number;
  funcionamento: string;
  comoChegar: {
    carro: string;
    onibus: string;
  };
  ingressoBase: number;
}

export interface EventEntity {
  id: string;
  parkId: string;
  nome: string;
  descricao: string;
  data: string;
  preco: number;
  imagem: string;
  limiteCapacidadeDiaria: number;
}

export interface Restaurant {
  id: string;
  nome: string;
  tipo: string;
  descricao: string;
  notaMedia: number;
  avaliacoesContagem: number;
  imagem: string;
}

export interface Lodging {
  id: string;
  nome: string;
  tipo: string;
  descricao: string;
  notaMedia: number;
  avaliacoesContagem: number;
  imagem: string;
}

export type TicketType = "trail" | "park" | "event";

export interface Ticket {
  id: string;
  userId: string;
  userName: string;
  userCpf: string;
  tipoItem: TicketType;
  itemId: string;
  itemName: string;
  dataReserva: string;
  dataCompra: string;
  quantidade: number;
  valorTotal: number;
  status: "ativo" | "utilizado" | "cancelado";
  qrCodeUrl: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userPic?: string;
  tipoDestino: "trail" | "park" | "event";
  destinoId: string;
  conteudo: string;
  imagem?: string;
  status: "Pendente" | "Aprovado" | "Reprovado";
  createdAt: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userPic?: string;
  tipoDestino: "restaurant" | "lodging";
  destinoId: string;
  nota: number; // 1-5
  comentario: string;
  createdAt: string;
}
