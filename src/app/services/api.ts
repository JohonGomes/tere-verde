import { 
  User, Trail, Park, EventEntity, Restaurant, Lodging, Ticket, Comment, Review, TicketType
} from "../types";

const BASE_URL = "http://localhost:3000/api";

// Helper para montar cabeçalhos HTTP com token de autenticação JWT
const getHeaders = () => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const token = localStorage.getItem("tere_verde_token");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

export const ApiService = {
  // ==========================================
  // 🔑 AUTENTICAÇÃO REAL
  // ==========================================
  login: async (email: string, password?: string): Promise<{ user: User; token: string }> => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password: password || "SenhaSegura123" })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "E-mail ou senha incorretos.");
    }
    return res.json();
  },

  register: async (name: string, email: string, cpf: string, role: "visitor" | "admin" = "visitor"): Promise<{ user: User; token: string }> => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, cpf, password: "SenhaSegura123", role })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Erro ao realizar cadastro.");
    }
    return res.json();
  },

  updateProfile: async (userId: string, name: string, cpf: string): Promise<User> => {
    const res = await fetch(`${BASE_URL}/auth/profile/update`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({ name, cpf })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Erro ao atualizar dados do perfil.");
    }
    const data = await res.json();
    return data.user;
  },

  // ==========================================
  // 🏞️ PARQUES & TRILHAS REAL
  // ==========================================
  getParks: async (): Promise<Park[]> => {
    const res = await fetch(`${BASE_URL}/parks`);
    if (!res.ok) throw new Error("Erro ao buscar parques do banco de dados.");
    const data = await res.json();
    return data.map((p: any) => ({
      ...p,
      ingressoBase: Number(p.ingressoBase)
    }));
  },

  getTrails: async (parkId?: string): Promise<Trail[]> => {
    const res = await fetch(`${BASE_URL}/trails`);
    if (!res.ok) throw new Error("Erro ao buscar catálogo de trilhas.");
    const data: Trail[] = await res.json();
    
    // Mapear likes dinamicamente. Se o usuário curtiu a trilha, marcamos
    // Essa simulação pode persistir localmente no frontend, ou ler do banco
    const mapped = data.map(t => ({
      ...t,
      likedByUser: localStorage.getItem(`liked_${t.id}`) === "true"
    }));

    if (parkId) {
      return mapped.filter(t => t.parkId === parkId);
    }
    return mapped;
  },

  likeTrail: async (trailId: string, userId: string): Promise<Trail> => {
    const res = await fetch(`${BASE_URL}/trails/like/${trailId}`, {
      method: "POST",
      headers: getHeaders()
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Erro ao curtir trilha.");
    }
    const data = await res.json();
    
    // Salvar estado da curtida no localStorage do browser apenas para controle visual rápido
    localStorage.setItem(`liked_${trailId}`, String(data.liked));

    // Buscar lista atualizada
    const trails = await ApiService.getTrails();
    const updatedTrail = trails.find(t => t.id === trailId);
    if (!updatedTrail) throw new Error("Trilha não encontrada.");
    return updatedTrail;
  },

  // ==========================================
  // 📅 EVENTOS REAL
  // ==========================================
  getEvents: async (parkId?: string): Promise<EventEntity[]> => {
    const res = await fetch(`${BASE_URL}/events`);
    if (!res.ok) throw new Error("Erro ao carregar eventos.");
    const data = await res.json();
    const mapped = data.map((e: any) => ({
      ...e,
      preco: Number(e.preco)
    }));
    if (parkId) {
      return mapped.filter((e: any) => e.parkId === parkId);
    }
    return mapped;
  },

  // ==========================================
  // 🍕 RESTAURANTES & HOSPEDAGENS REAL
  // ==========================================
  getRestaurants: async (): Promise<Restaurant[]> => {
    const res = await fetch(`${BASE_URL}/restaurants`);
    if (!res.ok) throw new Error("Erro ao carregar restaurantes.");
    const data = await res.json();
    return data.map((r: any) => ({
      ...r,
      notaMedia: Number(r.notaMedia)
    }));
  },

  getLodgings: async (): Promise<Lodging[]> => {
    const res = await fetch(`${BASE_URL}/lodgings`);
    if (!res.ok) throw new Error("Erro ao carregar hospedagens.");
    const data = await res.json();
    return data.map((l: any) => ({
      ...l,
      notaMedia: Number(l.notaMedia)
    }));
  },

  // ==========================================
  // 💬 COMENTÁRIOS / DEPOIMENTOS REAL (RN01)
  // ==========================================
  getComments: async (tipoDestino: "trail" | "park" | "event", destinoId: string): Promise<Comment[]> => {
    // Mapear destinoId amigável para o targetName esperado pelo banco de dados
    let targetName = destinoId;
    if (destinoId === "trilha-pedra-do-sino") targetName = "Pedra do Sino";
    else if (destinoId === "trilha-cartao-postal") targetName = "Cartão Postal";
    else if (destinoId === "trilha-veu-noiva") targetName = "Véu da Noiva";
    else if (destinoId === "parque-nacional") targetName = "Parque Nacional da Serra dos Órgãos";
    else if (destinoId === "parque-tres-picos") targetName = "Parque Estadual dos Três Picos";
    else if (destinoId === "parque-municipal") targetName = "Parque Natural Municipal Montanhas";

    const res = await fetch(`${BASE_URL}/comments?targetName=${encodeURIComponent(targetName)}&targetType=${tipoDestino}`);
    if (!res.ok) throw new Error("Erro ao carregar comentários.");
    const data = await res.json();

    // Mapear propriedades para se manterem compatíveis com o frontend
    return data.map((c: any) => ({
      id: c.id,
      userId: c.userId,
      userName: c.userName,
      userPic: c.userPic,
      tipoDestino: c.targetType,
      destinoId: destinoId, // Manter o ID do roteador local
      conteudo: c.content,
      status: c.status,
      createdAt: c.createdAt
    }));
  },

  getCommentsForDest: async (tipoDestino: "trail" | "park" | "event", destinoId: string): Promise<Comment[]> => {
    return ApiService.getComments(tipoDestino, destinoId);
  },

  getPendingComments: async (): Promise<Comment[]> => {
    const res = await fetch(`${BASE_URL}/comments`, { headers: getHeaders() });
    if (!res.ok) throw new Error("Erro ao buscar comentários sob moderação.");
    const data = await res.json();

    // Filtra apenas os pendentes e mapeia
    return data
      .filter((c: any) => c.status === "Pendente")
      .map((c: any) => ({
        id: c.id,
        userId: c.userId,
        userName: c.userName,
        userPic: c.userPic,
        tipoDestino: c.targetType,
        destinoId: c.targetName === "Pedra do Sino" ? "trilha-pedra-do-sino" : c.targetName,
        conteudo: c.content,
        status: c.status,
        createdAt: c.createdAt
      }));
  },

  addComment: async (payload: {
    userName: string;
    userEmail: string;
    userProfilePic?: string;
    tipoDestino: "trail" | "park" | "event";
    nomeDestino: string;
    conteudo: string;
    imagem?: string;
  }): Promise<Comment> => {
    let targetName = payload.nomeDestino;
    if (payload.nomeDestino === "trilha-pedra-do-sino") targetName = "Pedra do Sino";
    else if (payload.nomeDestino === "trilha-cartao-postal") targetName = "Cartão Postal";
    else if (payload.nomeDestino === "trilha-veu-noiva") targetName = "Véu da Noiva";
    else if (payload.nomeDestino === "parque-nacional") targetName = "Parque Nacional da Serra dos Órgãos";
    else if (payload.nomeDestino === "parque-tres-picos") targetName = "Parque Estadual dos Três Picos";
    else if (payload.nomeDestino === "parque-municipal") targetName = "Parque Natural Municipal Montanhas";

    const res = await fetch(`${BASE_URL}/comments`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        targetName,
        targetType: payload.tipoDestino,
        content: payload.conteudo
      })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Erro ao publicar depoimento.");
    }
    const data = await res.json();
    const c = data.comment;

    return {
      id: c.id,
      userId: c.userId,
      userName: c.userName,
      userPic: c.userPic,
      tipoDestino: c.targetType,
      destinoId: payload.nomeDestino,
      conteudo: c.content,
      status: c.status,
      createdAt: c.createdAt
    };
  },

  moderateComment: async (commentId: string, status: "Aprovado" | "Reprovado"): Promise<Comment> => {
    const res = await fetch(`${BASE_URL}/comments/moderate/${commentId}`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify({ status })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Erro ao moderar comentário.");
    }
    return { id: commentId, status } as any;
  },

  // ==========================================
  // ⭐️ AVALIAÇÕES ESTRELAS REAL (RN02)
  // ==========================================
  getReviews: async (tipoDestino: "restaurant" | "lodging", destinoId: string): Promise<Review[]> => {
    const mappedType = tipoDestino === "restaurant" ? "Restaurante" : "Hospedagem";
    const res = await fetch(`${BASE_URL}/reviews?targetId=${destinoId}&targetType=${mappedType}`);
    if (!res.ok) throw new Error("Erro ao buscar avaliações.");
    const data = await res.json();

    return data.map((r: any) => ({
      id: r.id,
      userId: r.userId,
      userName: r.userName,
      userPic: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100",
      tipoDestino: tipoDestino,
      destinoId: r.targetId,
      nota: r.rating,
      comentario: r.comment,
      createdAt: r.createdAt
    }));
  },

  addReview: async (userId: string, userName: string, userPic: string | undefined, tipoDestino: "restaurant" | "lodging", destinoId: string, nota: number, comentario: string): Promise<Review> => {
    const mappedType = tipoDestino === "restaurant" ? "Restaurante" : "Hospedagem";
    const res = await fetch(`${BASE_URL}/reviews`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        targetId: destinoId,
        targetType: mappedType,
        rating: nota,
        comment: comentario
      })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Erro ao registrar avaliação.");
    }
    const data = await res.json();
    const r = data.review;

    return {
      id: r.id,
      userId: r.userId,
      userName: r.userName,
      userPic: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100",
      tipoDestino: tipoDestino,
      destinoId: r.targetId,
      nota: r.rating,
      comentario: r.comment,
      createdAt: r.createdAt
    };
  },

  // ==========================================
  // 🎟️ INGRESSOS & RECEPÇÃO REAL (RN03)
  // ==========================================
  buyTicket: async (params: {
    userId: string;
    userName: string;
    userCpf: string;
    itemId: string;
    itemName: string;
    itemType: TicketType;
    quantidade: number;
    dataReserva: string;
    valorTotal: number;
  }): Promise<Ticket> => {
    const res = await fetch(`${BASE_URL}/parks/tickets/buy`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        targetId: params.itemId,
        targetType: params.itemType === "park" ? "park" : "event",
        date: params.dataReserva,
        quantity: params.quantidade,
        totalPrice: params.valorTotal
      })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Capacidade diária esgotada para esta data!");
    }
    const data = await res.json();
    const t = data.ticket;

    return {
      id: t.id,
      userId: t.userId,
      userName: params.userName,
      userCpf: params.userCpf,
      tipoItem: params.itemType,
      itemId: t.targetId,
      itemName: params.itemName,
      dataReserva: t.date,
      dataCompra: t.createdAt || new Date().toISOString(),
      quantidade: t.quantity,
      valorTotal: Number(t.totalPrice),
      status: t.status === "active" ? "ativo" : "cancelado",
      qrCodeUrl: t.qrCode
    };
  },

  getTicketsByUser: async (userId: string): Promise<Ticket[]> => {
    const res = await fetch(`${BASE_URL}/parks/tickets`, { headers: getHeaders() });
    if (!res.ok) throw new Error("Erro ao buscar seus ingressos.");
    const data = await res.json();

    return data.map((t: any) => ({
      id: t.id,
      userId: t.userId,
      userName: t.userName,
      userCpf: t.userCpf,
      tipoItem: t.targetType,
      itemId: t.targetId,
      itemName: t.targetType === "park" ? "Acesso Diário - Parque" : "Ingresso para Evento",
      dataReserva: t.date,
      dataCompra: t.date,
      quantidade: t.quantity,
      valorTotal: Number(t.totalPrice),
      status: t.checkedIn ? "utilizado" : (t.status === "active" ? "ativo" : "cancelado"),
      qrCodeUrl: t.qrCode
    }));
  },

  getAllTickets: async (): Promise<Ticket[]> => {
    const res = await fetch(`${BASE_URL}/parks/tickets`, { headers: getHeaders() });
    if (!res.ok) throw new Error("Erro ao carregar ingressos.");
    const data = await res.json();

    return data.map((t: any) => ({
      id: t.id,
      userId: t.userId,
      userName: t.userName,
      userCpf: t.userCpf,
      tipoItem: t.targetType,
      itemId: t.targetId,
      itemName: t.targetType === "park" ? "Acesso Diário - Parque" : "Ingresso para Evento",
      dataReserva: t.date,
      dataCompra: t.date,
      quantidade: t.quantity,
      valorTotal: Number(t.totalPrice),
      status: t.checkedIn ? "utilizado" : (t.status === "active" ? "ativo" : "cancelado"),
      qrCodeUrl: t.qrCode
    }));
  },

  checkInTicket: async (query: string): Promise<Ticket> => {
    const resAll = await fetch(`${BASE_URL}/parks/tickets`, { headers: getHeaders() });
    if (!resAll.ok) throw new Error("Erro de conexão na busca para check-in.");
    const tickets: any[] = await resAll.json();

    const normalizedQuery = query.replace(/[^\w\d]/g, "").toUpperCase();
    const found = tickets.find(t => {
      const ticketQr = t.qrCode.toUpperCase();
      const ticketCpf = t.userCpf.replace(/[^\d]/g, "");
      return ticketQr === query || ticketQr === normalizedQuery || ticketCpf === query || ticketCpf === normalizedQuery;
    });

    if (!found) {
      throw new Error("Nenhum ingresso ativo encontrado com este QR Code ou CPF.");
    }

    const resCheck = await fetch(`${BASE_URL}/parks/tickets/check-in/${found.id}`, {
      method: "POST",
      headers: getHeaders()
    });

    if (!resCheck.ok) {
      const err = await resCheck.json();
      throw new Error(err.message || "Erro ao efetuar check-in.");
    }

    return {
      id: found.id,
      userId: found.userId,
      userName: found.userName,
      userCpf: found.userCpf,
      tipoItem: found.targetType,
      itemId: found.targetId,
      itemName: found.targetType === "park" ? "Acesso Diário" : "Ingresso",
      dataReserva: found.date,
      dataCompra: found.date,
      quantidade: found.quantity,
      valorTotal: Number(found.totalPrice),
      status: "utilizado",
      qrCodeUrl: found.qrCode
    };
  },

  // ==========================================
  // 📊 RELATÓRIOS REAIS
  // ==========================================
  getSalesReport: async (): Promise<any[]> => {
    const res = await fetch(`${BASE_URL}/parks/tickets`, { headers: getHeaders() });
    if (!res.ok) throw new Error("Erro ao carregar relatórios.");
    const tickets: any[] = await res.json();
    
    const activeTickets = tickets.filter(t => t.status === "active" || t.checkedIn);
    const summary: Record<string, { name: string; quantity: number; revenue: number }> = {};
    
    activeTickets.forEach(t => {
      const itemName = t.targetType === "park" ? "Acesso Diário - Parque" : "Ingresso para Evento";
      if (!summary[itemName]) {
        summary[itemName] = { name: itemName, quantity: 0, revenue: 0 };
      }
      summary[itemName].quantity += t.quantity;
      summary[itemName].revenue += Number(t.totalPrice);
    });

    return Object.values(summary);
  },

  // ==========================================
  // 🛠️ CRUD GERENCIAL ADMIN REAL
  // ==========================================
  createEntity: async (tipo: "park" | "trail" | "event" | "restaurant" | "lodging", entity: any): Promise<any> => {
    let url = `${BASE_URL}`;
    if (tipo === "park") url += `/parks`;
    else if (tipo === "trail") url += `/trails`;
    else if (tipo === "event") url += `/events`;
    else if (tipo === "restaurant") url += `/restaurants`;
    else if (tipo === "lodging") url += `/lodgings`;

    const res = await fetch(url, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(entity)
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || `Erro ao adicionar ${tipo}.`);
    }
    return res.json();
  },

  updateEntity: async (tipo: "park" | "trail" | "event" | "restaurant" | "lodging", id: string, entity: any): Promise<any> => {
    let url = `${BASE_URL}`;
    if (tipo === "park") url += `/parks/${id}`;
    else if (tipo === "trail") url += `/trails/${id}`;
    else if (tipo === "event") url += `/events/${id}`;
    else if (tipo === "restaurant") url += `/restaurants/${id}`;
    else if (tipo === "lodging") url += `/lodgings/${id}`;

    const res = await fetch(url, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(entity)
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || `Erro ao atualizar ${tipo}.`);
    }
    return entity;
  },

  deleteEntity: async (tipo: "park" | "trail" | "event" | "restaurant" | "lodging", id: string): Promise<boolean> => {
    let url = `${BASE_URL}`;
    if (tipo === "park") url += `/parks/${id}`;
    else if (tipo === "trail") url += `/trails/${id}`;
    else if (tipo === "event") url += `/events/${id}`;
    else if (tipo === "restaurant") url += `/restaurants/${id}`;
    else if (tipo === "lodging") url += `/lodgings/${id}`;

    const res = await fetch(url, {
      method: "DELETE",
      headers: getHeaders()
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || `Erro ao excluir ${tipo}.`);
    }
    return true;
  }
};
