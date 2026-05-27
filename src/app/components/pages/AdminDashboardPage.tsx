import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { ApiService } from "../../services/api";
import { Park, Trail, EventEntity, Restaurant, Lodging, Comment, Ticket } from "../../types";
import { Header } from "../Header";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Badge } from "../ui/badge";
import { toast } from "sonner";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from "recharts";
import { 
  ShieldCheck, MessageSquare, BarChart3, Plus, Edit2, Trash2, Check, X,
  Mountain, Calendar, UtensilsCrossed, Home, Trees, DollarSign, Ticket as TicketIcon, Users
} from "lucide-react";
import type { PageType } from "../../App";

interface AdminDashboardPageProps {
  onNavigate: (page: PageType) => void;
}

export function AdminDashboardPage({ onNavigate }: AdminDashboardPageProps) {
  const { user } = useAuth();
  
  // Dados de Entidades
  const [parks, setParks] = useState<Park[]>([]);
  const [trails, setTrails] = useState<Trail[]>([]);
  const [events, setEvents] = useState<EventEntity[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [lodgings, setLodgings] = useState<Lodging[]>([]);
  
  // Moderação e Vendas
  const [pendingComments, setPendingComments] = useState<Comment[]>([]);
  const [salesReport, setSalesReport] = useState<any[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalTickets, setTotalTickets] = useState(0);

  // Estados de Controle de Modais de CRUD
  const [crudType, setCrudType] = useState<"park" | "trail" | "event" | "restaurant" | "lodging" | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null); // Se tiver id, é edição; senão, é criação
  
  // Form State genérico
  const [formFields, setFormFields] = useState<any>({});

  // Carregar dados iniciais
  const loadDashboardData = async () => {
    // 1. Carregar Parques
    try {
      const p = await ApiService.getParks();
      setParks(p);
    } catch (err) {
      console.error("Erro ao carregar parques:", err);
    }

    // 2. Carregar Trilhas
    try {
      const t = await ApiService.getTrails();
      setTrails(t);
    } catch (err) {
      console.error("Erro ao carregar trilhas:", err);
    }

    // 3. Carregar Eventos
    try {
      const e = await ApiService.getEvents();
      setEvents(e);
    } catch (err) {
      console.error("Erro ao carregar eventos:", err);
    }

    // 4. Carregar Restaurantes
    try {
      const r = await ApiService.getRestaurants();
      setRestaurants(r);
    } catch (err) {
      console.error("Erro ao carregar restaurantes:", err);
    }

    // 5. Carregar Hospedagens
    try {
      const l = await ApiService.getLodgings();
      setLodgings(l);
    } catch (err) {
      console.error("Erro ao carregar hospedagens:", err);
    }

    // 6. Carregar Comentários Pendentes
    try {
      const c = await ApiService.getPendingComments();
      setPendingComments(c);
    } catch (err) {
      console.error("Erro ao carregar comentários pendentes:", err);
    }

    // 7. Carregar Relatórios de Vendas
    try {
      const rep = await ApiService.getSalesReport();
      setSalesReport(rep);
    } catch (err) {
      console.error("Erro ao carregar relatórios de vendas:", err);
    }

    // 8. Carregar Todos os Ingressos
    try {
      const allTix = await ApiService.getAllTickets();
      const rev = allTix.filter(tx => tx.status !== "cancelado").reduce((acc, curr) => acc + curr.valorTotal, 0);
      const qty = allTix.filter(tx => tx.status !== "cancelado").reduce((acc, curr) => acc + curr.quantidade, 0);
      setTotalRevenue(rev);
      setTotalTickets(qty);
    } catch (err) {
      console.error("Erro ao carregar ingressos/métricas:", err);
    }
  };

  useEffect(() => {
    if (!user || user.role !== "admin") {
      toast.error("Acesso restrito apenas para administradores.");
      onNavigate("home");
      return;
    }
    loadDashboardData();
  }, [user, onNavigate]);

  // --- Ações de Moderação ---
  const handleModerate = async (commentId: string, status: "Aprovado" | "Reprovado") => {
    try {
      await ApiService.moderateComment(commentId, status);
      toast.success(`Comentário ${status === "Aprovado" ? "aprovado e publicado" : "reprovado"}!`);
      // Recarrega comentários e painel
      loadDashboardData();
    } catch (err) {
      toast.error("Erro ao moderar comentário.");
    }
  };

  // --- Ações de CRUD (Abrir Modais) ---
  const openCreateModal = (type: "park" | "trail" | "event" | "restaurant" | "lodging") => {
    setCrudType(type);
    setSelectedId(null);
    
    // Inicializar campos padrão
    if (type === "park") {
      setFormFields({ nome: "", descricao: "", altitude: "", area: "", limiteCapacidadeDiaria: 200, funcionamento: "", ingressoBase: 0 });
    } else if (type === "trail") {
      setFormFields({ parkId: parks[0]?.id || "", nome: "", dificuldade: "Fácil", duracao: "", distancia: "", descricao: "", imagem: "" });
    } else if (type === "event") {
      setFormFields({ parkId: parks[0]?.id || "", nome: "", descricao: "", data: "", preco: 0, limiteCapacidadeDiaria: 50, imagem: "" });
    } else if (type === "restaurant") {
      setFormFields({ nome: "", tipo: "", descricao: "", imagem: "" });
    } else if (type === "lodging") {
      setFormFields({ nome: "", tipo: "", descricao: "", imagem: "" });
    }
    setModalOpen(true);
  };

  const openEditModal = (type: "park" | "trail" | "event" | "restaurant" | "lodging", entity: any) => {
    setCrudType(type);
    setSelectedId(entity.id);
    setFormFields({ ...entity });
    setModalOpen(true);
  };

  const handleDelete = async (type: "park" | "trail" | "event" | "restaurant" | "lodging", id: string) => {
    if (!confirm("Tem certeza que deseja excluir este item permanentemente?")) return;
    try {
      await ApiService.deleteEntity(type, id);
      toast.success("Item excluído com sucesso!");
      loadDashboardData();
    } catch (err) {
      toast.error("Erro ao excluir item.");
    }
  };

  const handleSaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!crudType) return;

    try {
      if (selectedId) {
        // Editar
        await ApiService.updateEntity(crudType, selectedId, formFields);
        toast.success("Cadastro atualizado com sucesso!");
      } else {
        // Criar
        await ApiService.createEntity(crudType, formFields);
        toast.success("Cadastro criado com sucesso!");
      }
      setModalOpen(false);
      loadDashboardData();
    } catch (err: any) {
      toast.error(err.message || "Erro ao salvar.");
    }
  };

  const COLORS = ["#2f5c4a", "#4a8a6f", "#84c4a7", "#b3dfcb", "#e6f4ed"];

  if (!user || user.role !== "admin") return null;

  return (
    <div className="min-h-screen bg-background">
      <Header onNavigate={onNavigate} />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
              <ShieldCheck className="h-8 w-8 text-primary" />
              Painel do Administrador
            </h2>
            <p className="text-muted-foreground mt-1">Gerencie a plataforma Terê Verde, modere conteúdos e analise as vendas.</p>
          </div>
          <Button variant="outline" className="border-primary/20 hover:bg-primary/5 text-primary gap-1.5" onClick={() => onNavigate("reception")}>
            Acessar Modo Recepção (Tablet)
          </Button>
        </div>

        <Tabs defaultValue="reports" className="space-y-6">
          <TabsList className="w-full flex flex-wrap gap-1 p-1 bg-muted rounded-xl h-auto">
            <TabsTrigger value="reports" className="flex items-center gap-1.5 py-2 px-3 flex-1 min-w-[120px]"><BarChart3 className="h-4.5 w-4.5" /> Relatórios</TabsTrigger>
            <TabsTrigger value="moderation" className="flex items-center gap-1.5 py-2 px-3 flex-1 min-w-[120px]"><MessageSquare className="h-4.5 w-4.5" /> Moderação ({pendingComments.length})</TabsTrigger>
            <TabsTrigger value="parks" className="flex items-center gap-1.5 py-2 px-3 flex-1 min-w-[120px]"><Trees className="h-4.5 w-4.5" /> Parques</TabsTrigger>
            <TabsTrigger value="trails" className="flex items-center gap-1.5 py-2 px-3 flex-1 min-w-[120px]"><Mountain className="h-4.5 w-4.5" /> Trilhas</TabsTrigger>
            <TabsTrigger value="events" className="flex items-center gap-1.5 py-2 px-3 flex-1 min-w-[120px]"><Calendar className="h-4.5 w-4.5" /> Eventos</TabsTrigger>
            <TabsTrigger value="services" className="flex items-center gap-1.5 py-2 px-3 flex-1 min-w-[120px]"><UtensilsCrossed className="h-4.5 w-4.5" /> Cidade</TabsTrigger>
          </TabsList>

          {/* TAB 1: RELATÓRIOS E MÉTRICAS */}
          <TabsContent value="reports" className="space-y-6">
            {/* Cards de KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs uppercase font-bold tracking-wide">Faturamento Total</CardDescription>
                  <CardTitle className="text-3xl font-extrabold text-primary flex items-center gap-1">
                    <DollarSign className="h-6 w-6 text-primary shrink-0" />
                    R$ {totalRevenue.toFixed(2)}
                  </CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs uppercase font-bold tracking-wide">Ingressos Vendidos</CardDescription>
                  <CardTitle className="text-3xl font-extrabold text-foreground flex items-center gap-1.5">
                    <TicketIcon className="h-6 w-6 text-foreground shrink-0" />
                    {totalTickets} passes
                  </CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs uppercase font-bold tracking-wide">Aguardando Moderação</CardDescription>
                  <CardTitle className="text-3xl font-extrabold text-foreground flex items-center gap-1.5">
                    <MessageSquare className="h-6 w-6 text-foreground shrink-0" />
                    {pendingComments.length} fotos/posts
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>

            {/* Gráfico de Vendas */}
            <Card className="shadow-lg border-primary/10">
              <CardHeader>
                <CardTitle>Vendas Consolidadas por Atração (RF07)</CardTitle>
                <CardDescription>Resumo analítico do total acumulado de vendas por parque, passeio ou evento.</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px] w-full pt-4">
                {salesReport.length === 0 ? (
                  <div className="flex h-full items-center justify-center text-muted-foreground">Nenhuma venda registrada até o momento.</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={salesReport} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                      <XAxis dataKey="name" tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} unit="R$" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: "var(--popover)", border: "1px solid var(--border)", borderRadius: "8px" }}
                        formatter={(value: any) => [`R$ ${value}`, "Faturamento"]}
                      />
                      <Bar dataKey="revenue" radius={[6, 6, 0, 0]} maxBarSize={50}>
                        {salesReport.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 2: MODERAÇÃO DE COMENTÁRIOS */}
          <TabsContent value="moderation" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Moderação de Conteúdo (RF06, RN01)</CardTitle>
                <CardDescription>Aprove ou reprove fotos e depoimentos postados por usuários. Apenas posts aprovados aparecem nas páginas públicas.</CardDescription>
              </CardHeader>
              <CardContent>
                {pendingComments.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg">
                    <MessageSquare className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-40" />
                    <p className="font-semibold">Nenhum item pendente de moderação</p>
                    <p className="text-sm">Todo o conteúdo enviado pelos visitantes está revisado.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingComments.map((comment) => (
                      <div key={comment.id} className="p-4 border rounded-xl flex flex-col md:flex-row items-start justify-between gap-4 bg-accent/5 hover:border-primary/25 transition-all">
                        <div className="space-y-2 max-w-3xl">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-foreground">{comment.userName}</span>
                            <span className="text-xs text-muted-foreground">Postado em {new Date(comment.createdAt).toLocaleDateString()}</span>
                            <Badge variant="outline" className="text-[10px] uppercase font-mono tracking-wider font-semibold">
                              {comment.tipoDestino === "trail" ? "Trilha" : comment.tipoDestino === "park" ? "Parque" : "Evento"}
                            </Badge>
                          </div>
                          <p className="text-sm text-foreground leading-relaxed italic bg-background/50 p-3 rounded-lg border">
                            "{comment.conteudo}"
                          </p>
                          {comment.imagem && (
                            <img src={comment.imagem} alt="Upload do usuário" className="w-24 h-24 object-cover rounded border" />
                          )}
                        </div>
                        <div className="flex gap-2 w-full md:w-auto shrink-0 pt-2 md:pt-0">
                          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white gap-1 flex-1 md:flex-initial" onClick={() => handleModerate(comment.id, "Aprovado")}>
                            <Check className="h-4 w-4" /> Aprovar
                          </Button>
                          <Button size="sm" variant="destructive" className="bg-red-600 hover:bg-red-700 text-white gap-1 flex-1 md:flex-initial" onClick={() => handleModerate(comment.id, "Reprovado")}>
                            <X className="h-4 w-4" /> Reprovar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 3: CRUD PARQUES */}
          <TabsContent value="parks" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row justify-between items-center pb-4">
                <div>
                  <CardTitle>Cadastro de Parques Naturais</CardTitle>
                  <CardDescription>Parques ecológicos listados na landing page do Terê Verde.</CardDescription>
                </div>
                <Button className="bg-primary hover:bg-primary/95 text-xs font-semibold gap-1" onClick={() => openCreateModal("park")}>
                  <Plus className="h-4 w-4" /> Novo Parque
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Parque</TableHead>
                        <TableHead>Altitude</TableHead>
                        <TableHead>Ingresso Base</TableHead>
                        <TableHead>Capacidade Diária</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {parks.map((park) => (
                        <TableRow key={park.id}>
                          <TableCell className="font-bold text-foreground">{park.nome}</TableCell>
                          <TableCell>{park.altitude}</TableCell>
                          <TableCell>R$ {park.ingressoBase.toFixed(2)}</TableCell>
                          <TableCell>{park.limiteCapacidadeDiaria} pessoas</TableCell>
                          <TableCell className="text-right space-x-1">
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => openEditModal("park", park)}>
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-red-600" onClick={() => handleDelete("park", park.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 4: CRUD TRILHAS */}
          <TabsContent value="trails" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row justify-between items-center pb-4">
                <div>
                  <CardTitle>Gerenciamento de Trilhas</CardTitle>
                  <CardDescription>Cadastro de travessias e percursos montanhosos dos parques.</CardDescription>
                </div>
                <Button className="bg-primary hover:bg-primary/95 text-xs font-semibold gap-1" onClick={() => openCreateModal("trail")}>
                  <Plus className="h-4 w-4" /> Nova Trilha
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Trilha</TableHead>
                        <TableHead>Parque Associado</TableHead>
                        <TableHead>Dificuldade</TableHead>
                        <TableHead>Distância</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {trails.map((trail) => (
                        <TableRow key={trail.id}>
                          <TableCell className="font-bold text-foreground">{trail.nome}</TableCell>
                          <TableCell className="text-xs max-w-[180px] truncate">{parks.find(p => p.id === trail.parkId)?.nome || trail.parkId}</TableCell>
                          <TableCell>
                            <Badge variant={
                              trail.dificuldade === "Fácil" ? "default" : 
                              trail.dificuldade === "Difícil" ? "secondary" : "destructive"
                            } className="text-[10px] font-semibold">{trail.dificuldade}</Badge>
                          </TableCell>
                          <TableCell>{trail.distancia}</TableCell>
                          <TableCell className="text-right space-x-1">
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => openEditModal("trail", trail)}>
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-red-600" onClick={() => handleDelete("trail", trail.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 5: CRUD EVENTOS */}
          <TabsContent value="events" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row justify-between items-center pb-4">
                <div>
                  <CardTitle>Eventos de Ecologia & Cultura</CardTitle>
                  <CardDescription>Festival de inverno, caminhadas sob lua cheia, oficinas, etc.</CardDescription>
                </div>
                <Button className="bg-primary hover:bg-primary/95 text-xs font-semibold gap-1" onClick={() => openCreateModal("event")}>
                  <Plus className="h-4 w-4" /> Novo Evento
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Evento</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Valor do Ingresso</TableHead>
                        <TableHead>Capacidade Máxima</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {events.map((ev) => (
                        <TableRow key={ev.id}>
                          <TableCell className="font-bold text-foreground">{ev.nome}</TableCell>
                          <TableCell>{new Date(ev.data).toLocaleDateString()}</TableCell>
                          <TableCell>R$ {ev.preco.toFixed(2)}</TableCell>
                          <TableCell>{ev.limiteCapacidadeDiaria} vagas</TableCell>
                          <TableCell className="text-right space-x-1">
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => openEditModal("event", ev)}>
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-red-600" onClick={() => handleDelete("event", ev.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 6: CRUD COMÉRCIO (RESTAURANTES & HOSPEDAGENS) */}
          <TabsContent value="services" className="space-y-6">
            {/* Restaurantes */}
            <Card>
              <CardHeader className="flex flex-row justify-between items-center pb-4">
                <div>
                  <CardTitle>Gastronomia & Restaurantes</CardTitle>
                  <CardDescription>Gerencie os estabelecimentos gastronômicos parceiros da cidade.</CardDescription>
                </div>
                <Button className="bg-primary hover:bg-primary/95 text-xs font-semibold gap-1" onClick={() => openCreateModal("restaurant")}>
                  <Plus className="h-4 w-4" /> Novo Restaurante
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Tipo Culinária</TableHead>
                        <TableHead>Nota Média</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {restaurants.map((rest) => (
                        <TableRow key={rest.id}>
                          <TableCell className="font-bold text-foreground">{rest.nome}</TableCell>
                          <TableCell>{rest.tipo}</TableCell>
                          <TableCell>{rest.notaMedia} ⭐ ({rest.avaliacoesContagem})</TableCell>
                          <TableCell className="text-right space-x-1">
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => openEditModal("restaurant", rest)}>
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-red-600" onClick={() => handleDelete("restaurant", rest.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Hospedagens */}
            <Card>
              <CardHeader className="flex flex-row justify-between items-center pb-4">
                <div>
                  <CardTitle>Hospedagem & Chalés</CardTitle>
                  <CardDescription>Pousadas, chalés ecológicos e hotéis da região de Teresópolis.</CardDescription>
                </div>
                <Button className="bg-primary hover:bg-primary/95 text-xs font-semibold gap-1" onClick={() => openCreateModal("lodging")}>
                  <Plus className="h-4 w-4" /> Nova Hospedagem
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Tipo Estadia</TableHead>
                        <TableHead>Nota Média</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {lodgings.map((lodge) => (
                        <TableRow key={lodge.id}>
                          <TableCell className="font-bold text-foreground">{lodge.nome}</TableCell>
                          <TableCell>{lodge.tipo}</TableCell>
                          <TableCell>{lodge.notaMedia} ⭐ ({lodge.avaliacoesContagem})</TableCell>
                          <TableCell className="text-right space-x-1">
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => openEditModal("lodging", lodge)}>
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-red-600" onClick={() => handleDelete("lodging", lodge.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* --- FORMULARIO DE CADASTRO/EDIÇÃO DINÂMICO (CRUDs) --- */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[480px] p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="capitalize font-bold text-primary text-xl">
              {selectedId ? "Editar" : "Cadastrar Novo"} {crudType === "park" ? "Parque" : crudType === "trail" ? "Trilha" : crudType === "event" ? "Evento" : crudType === "restaurant" ? "Restaurante" : "Estabelecimento de Hospedagem"}
            </DialogTitle>
            <DialogDescription>Preencha os campos abaixo com as informações necessárias.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveSubmit} className="space-y-4">
            {/* Parque CRUD Fields */}
            {crudType === "park" && (
              <>
                <div className="space-y-1">
                  <Label htmlFor="p-name">Nome do Parque</Label>
                  <Input id="p-name" value={formFields.nome || ""} onChange={(e) => setFormFields({ ...formFields, nome: e.target.value })} required />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="p-desc">Descrição Completa</Label>
                  <Textarea id="p-desc" value={formFields.descricao || ""} onChange={(e) => setFormFields({ ...formFields, descricao: e.target.value })} rows={3} required />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="p-alt">Altitude Máxima</Label>
                    <Input id="p-alt" value={formFields.altitude || ""} onChange={(e) => setFormFields({ ...formFields, altitude: e.target.value })} placeholder="Ex: 2.260m" required />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="p-area">Área Protegida</Label>
                    <Input id="p-area" value={formFields.area || ""} onChange={(e) => setFormFields({ ...formFields, area: e.target.value })} placeholder="Ex: 20.000 ha" required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="p-limit">Capacidade Diária</Label>
                    <Input id="p-limit" type="number" value={formFields.limiteCapacidadeDiaria || 200} onChange={(e) => setFormFields({ ...formFields, limiteCapacidadeDiaria: Number(e.target.value) })} required />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="p-price">Ingresso Base (R$)</Label>
                    <Input id="p-price" type="number" step="0.01" value={formFields.ingressoBase || 0} onChange={(e) => setFormFields({ ...formFields, ingressoBase: Number(e.target.value) })} required />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="p-func">Funcionamento</Label>
                  <Input id="p-func" value={formFields.funcionamento || ""} onChange={(e) => setFormFields({ ...formFields, funcionamento: e.target.value })} placeholder="Ex: Terça a Domingo, das 8h às 17h" required />
                </div>
              </>
            )}

            {/* Trilha CRUD Fields */}
            {crudType === "trail" && (
              <>
                <div className="space-y-1">
                  <Label htmlFor="t-name">Nome da Trilha</Label>
                  <Input id="t-name" value={formFields.nome || ""} onChange={(e) => setFormFields({ ...formFields, nome: e.target.value })} required />
                </div>
                <div className="space-y-1">
                  <Label>Parque Associado</Label>
                  <Select value={formFields.parkId} onValueChange={(val) => setFormFields({ ...formFields, parkId: val })}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um Parque" />
                    </SelectTrigger>
                    <SelectContent>
                      {parks.map(p => (
                        <SelectItem key={p.id} value={p.id}>{p.nome}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label>Dificuldade</Label>
                    <Select value={formFields.dificuldade} onValueChange={(val) => setFormFields({ ...formFields, dificuldade: val })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Fácil">Fácil</SelectItem>
                        <SelectItem value="Médio">Médio</SelectItem>
                        <SelectItem value="Difícil">Difícil</SelectItem>
                        <SelectItem value="Muito Difícil">Muito Difícil</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="t-dur">Duração</Label>
                    <Input id="t-dur" value={formFields.duracao || ""} onChange={(e) => setFormFields({ ...formFields, duracao: e.target.value })} placeholder="Ex: 4 horas" required />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="t-dist">Distância</Label>
                    <Input id="t-dist" value={formFields.distancia || ""} onChange={(e) => setFormFields({ ...formFields, distancia: e.target.value })} placeholder="Ex: 5 km" required />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="t-desc">Descrição Curta</Label>
                  <Textarea id="t-desc" value={formFields.descricao || ""} onChange={(e) => setFormFields({ ...formFields, descricao: e.target.value })} rows={2} required />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="t-img">URL da Imagem</Label>
                  <Input id="t-img" value={formFields.imagem || ""} onChange={(e) => setFormFields({ ...formFields, imagem: e.target.value })} placeholder="https://images.unsplash.com/..." required />
                </div>
              </>
            )}

            {/* Evento CRUD Fields */}
            {crudType === "event" && (
              <>
                <div className="space-y-1">
                  <Label htmlFor="e-name">Nome do Evento</Label>
                  <Input id="e-name" value={formFields.nome || ""} onChange={(e) => setFormFields({ ...formFields, nome: e.target.value })} required />
                </div>
                <div className="space-y-1">
                  <Label>Parque de Acolhimento</Label>
                  <Select value={formFields.parkId} onValueChange={(val) => setFormFields({ ...formFields, parkId: val })}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um Parque" />
                    </SelectTrigger>
                    <SelectContent>
                      {parks.map(p => (
                        <SelectItem key={p.id} value={p.id}>{p.nome}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="e-date">Data do Evento</Label>
                    <Input id="e-date" type="date" value={formFields.data || ""} onChange={(e) => setFormFields({ ...formFields, data: e.target.value })} required />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="e-price">Valor Ingresso (R$)</Label>
                    <Input id="e-price" type="number" value={formFields.preco || 0} onChange={(e) => setFormFields({ ...formFields, preco: Number(e.target.value) })} required />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="e-limit">Vagas Totais</Label>
                  <Input id="e-limit" type="number" value={formFields.limiteCapacidadeDiaria || 50} onChange={(e) => setFormFields({ ...formFields, limiteCapacidadeDiaria: Number(e.target.value) })} required />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="e-desc">Descrição do Evento</Label>
                  <Textarea id="e-desc" value={formFields.descricao || ""} onChange={(e) => setFormFields({ ...formFields, descricao: e.target.value })} rows={2} required />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="e-img">URL da Imagem</Label>
                  <Input id="e-img" value={formFields.imagem || ""} onChange={(e) => setFormFields({ ...formFields, imagem: e.target.value })} required />
                </div>
              </>
            )}

            {/* Restaurantes & Hospedagens CRUD Fields */}
            {(crudType === "restaurant" || crudType === "lodging") && (
              <>
                <div className="space-y-1">
                  <Label htmlFor="c-name">Nome Comercial</Label>
                  <Input id="c-name" value={formFields.nome || ""} onChange={(e) => setFormFields({ ...formFields, nome: e.target.value })} required />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="c-type">Subcategoria/Tipo</Label>
                  <Input id="c-type" value={formFields.tipo || ""} onChange={(e) => setFormFields({ ...formFields, tipo: e.target.value })} placeholder="Ex: Massas / Pousada Ecológica" required />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="c-desc">Descrição e Diferenciais</Label>
                  <Textarea id="c-desc" value={formFields.descricao || ""} onChange={(e) => setFormFields({ ...formFields, descricao: e.target.value })} rows={3} required />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="c-img">URL da Imagem</Label>
                  <Input id="c-img" value={formFields.imagem || ""} onChange={(e) => setFormFields({ ...formFields, imagem: e.target.value })} placeholder="https://images.unsplash.com/..." required />
                </div>
              </>
            )}

            <DialogFooter className="pt-4 border-t gap-2 sm:gap-0">
              <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancelar</Button>
              <Button type="submit" className="bg-primary hover:bg-primary/95">Salvar Alterações</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
