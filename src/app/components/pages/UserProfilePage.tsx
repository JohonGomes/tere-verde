import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { ApiService } from "../../services/api";
import { Ticket } from "../../types";
import { Header } from "../Header";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";
import { toast } from "sonner";
import { User, Ticket as TicketIcon, Key, UserCheck, Calendar, ShieldAlert } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import type { PageType } from "../../App";

interface UserProfilePageProps {
  onNavigate: (page: PageType) => void;
}

export function UserProfilePage({ onNavigate }: UserProfilePageProps) {
  const { user, updateProfile, logout } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(true);
  
  // Profile edit states
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Modal QR Code
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  useEffect(() => {
    if (!user) {
      onNavigate("home");
      return;
    }
    
    setName(user.name);
    setCpf(user.cpf);

    const loadTickets = async () => {
      try {
        const data = await ApiService.getTicketsByUser(user.id);
        setTickets(data);
      } catch (err) {
        console.error("Erro ao carregar ingressos:", err);
      } finally {
        setLoadingTickets(false);
      }
    };

    loadTickets();
  }, [user, onNavigate]);

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length <= 11) {
      value = value
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
      setCpf(value);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !cpf) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }
    if (cpf.length < 14) {
      toast.error("CPF inválido.");
      return;
    }

    setSaving(true);
    try {
      await updateProfile(name, cpf);
      toast.success("Perfil atualizado com sucesso!");
      setEditing(false);
    } catch (err: any) {
      toast.error(err.message || "Erro ao atualizar perfil.");
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header onNavigate={onNavigate} />

      <main className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
        <div className="grid md:grid-cols-3 gap-8 items-start">
          {/* Card Esquerdo - Resumo Perfil */}
          <Card className="md:col-span-1 border-primary/10 shadow-lg">
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-3">
                {user.profilePic ? (
                  <img src={user.profilePic} alt={user.name} className="w-20 h-20 rounded-full object-cover" />
                ) : (
                  <User className="h-10 w-10 text-primary" />
                )}
              </div>
              <CardTitle className="text-xl font-bold">{user.name}</CardTitle>
              <CardDescription className="text-sm truncate">{user.email}</CardDescription>
              <Badge variant="outline" className="w-fit mx-auto mt-2 bg-primary/5 text-primary border-primary/20 capitalize font-medium">
                {user.role === "admin" ? "Administrador" : "Visitante"}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3 pt-2 text-sm border-t border-border mt-2">
              <div className="flex justify-between py-1.5 border-b border-border">
                <span className="text-muted-foreground font-medium">CPF:</span>
                <span className="font-mono text-foreground font-medium">{user.cpf}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-muted-foreground font-medium">Membro desde:</span>
                <span className="text-foreground font-medium">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button variant="outline" className="w-full" onClick={() => setEditing(!editing)}>
                {editing ? "Cancelar Edição" : "Editar Dados"}
              </Button>
              <Button variant="destructive" className="w-full bg-red-600 hover:bg-red-700" onClick={() => {
                logout();
                toast.success("Sessão encerrada.");
                onNavigate("home");
              }}>
                Sair da Conta
              </Button>
            </CardFooter>
          </Card>

          {/* Área Direita - Abas de Dados / Ingressos */}
          <div className="md:col-span-2">
            {editing ? (
              <Card className="shadow-lg border-primary/10">
                <CardHeader>
                  <CardTitle>Editar Perfil</CardTitle>
                  <CardDescription>Mantenha seus dados atualizados para garantir o check-in rápido.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSaveProfile}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-name">Nome Completo</Label>
                      <Input
                        id="edit-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={saving}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-cpf">CPF</Label>
                      <Input
                        id="edit-cpf"
                        value={cpf}
                        onChange={handleCpfChange}
                        placeholder="000.000.000-00"
                        disabled={saving}
                        required
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    <Button type="button" variant="ghost" onClick={() => setEditing(false)} disabled={saving}>
                      Cancelar
                    </Button>
                    <Button type="submit" className="bg-primary hover:bg-primary/95" disabled={saving}>
                      {saving ? "Salvando..." : "Salvar Alterações"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            ) : (
              <Tabs defaultValue="tickets" className="w-full">
                <TabsList className="w-full grid grid-cols-2 mb-6">
                  <TabsTrigger value="tickets" className="flex items-center gap-2">
                    <TicketIcon className="h-4.5 w-4.5" />
                    Meus Ingressos
                  </TabsTrigger>
                  <TabsTrigger value="security" className="flex items-center gap-2">
                    <Key className="h-4.5 w-4.5" />
                    Segurança
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="tickets" className="space-y-4">
                  <Card className="shadow-md">
                    <CardHeader>
                      <CardTitle>Histórico de Reservas</CardTitle>
                      <CardDescription>Mostre o QR Code impresso ou na tela do celular na recepção do parque.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {loadingTickets ? (
                        <div className="text-center py-8 text-muted-foreground">Carregando ingressos...</div>
                      ) : tickets.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg">
                          <TicketIcon className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-50" />
                          <p className="font-semibold">Nenhum ingresso comprado</p>
                          <p className="text-sm mt-1">Explore os Parques e Eventos para garantir seu passeio.</p>
                          <Button className="mt-4 bg-primary" onClick={() => onNavigate("home")}>Explorar</Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {tickets.map((ticket) => (
                            <div key={ticket.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg hover:bg-accent/5 transition-colors gap-4">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-bold text-foreground">{ticket.itemName}</h4>
                                  <Badge variant={
                                    ticket.status === "ativo" ? "default" :
                                    ticket.status === "utilizado" ? "secondary" : "destructive"
                                  } className="text-xs uppercase px-2 font-semibold">
                                    {ticket.status}
                                  </Badge>
                                </div>
                                <div className="text-xs text-muted-foreground space-y-0.5">
                                  <p className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    Data de Uso: {new Date(ticket.dataReserva).toLocaleDateString()}
                                  </p>
                                  <p>Quantidade: {ticket.quantidade} | Total: R$ {ticket.valorTotal.toFixed(2)}</p>
                                </div>
                              </div>
                              {ticket.status === "ativo" && (
                                <Button size="sm" variant="outline" className="text-xs w-full sm:w-auto" onClick={() => setSelectedTicket(ticket)}>
                                  Visualizar QR Code
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="security">
                  <Card className="shadow-md">
                    <CardHeader>
                      <CardTitle>Senha e Segurança</CardTitle>
                      <CardDescription>Gerencie o acesso à sua conta.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-3 p-4 border border-yellow-500/20 bg-yellow-500/5 rounded-lg text-yellow-800 dark:text-yellow-400">
                        <ShieldAlert className="h-5 w-5 shrink-0" />
                        <div className="text-sm">
                          <p className="font-semibold">Simulação de Segurança</p>
                          <p className="text-xs opacity-90 mt-0.5">Como esta é uma simulação de frontend integrada, os dados são armazenados localmente de forma segura. Nenhuma senha real é enviada para servidores.</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Senha Atual</Label>
                        <Input type="password" value="••••••••" disabled />
                      </div>
                      <div className="space-y-2">
                        <Label>Nova Senha</Label>
                        <Input type="password" placeholder="Mínimo 6 caracteres" disabled />
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end border-t pt-4">
                      <Button className="bg-primary" disabled>Alterar Senha</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      </main>

      {/* Modal QR Code */}
      <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
        <DialogContent className="max-w-[340px] text-center p-6 rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-primary font-bold">Ingresso Terê Verde</DialogTitle>
          </DialogHeader>
          {selectedTicket && (
            <div className="space-y-4 pt-2">
              <p className="text-sm font-semibold">{selectedTicket.itemName}</p>
              
              {/* QR Code Mocado Visualmente */}
              <div className="w-48 h-48 bg-white border border-border p-3 mx-auto flex flex-col justify-center items-center rounded-lg shadow-inner relative">
                {/* Bordas decorativas de QR code */}
                <div className="absolute top-2 left-2 w-8 h-8 border-t-4 border-l-4 border-black"></div>
                <div className="absolute top-2 right-2 w-8 h-8 border-t-4 border-r-4 border-black"></div>
                <div className="absolute bottom-2 left-2 w-8 h-8 border-b-4 border-l-4 border-black"></div>
                <div className="absolute bottom-2 right-2 w-8 h-8 border-b-4 border-r-4 border-black"></div>
                
                {/* Linhas simulando pixels de QR Code */}
                <div className="w-32 h-32 flex flex-wrap gap-[4px] p-2">
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-[12px] h-[12px] rounded-[1px] ${
                        (i * 7 + 13) % 3 === 0 || (i % 8 < 3 && i / 8 < 3) || (i % 8 >= 5 && i / 8 < 3) || (i % 8 < 3 && i / 8 >= 5)
                          ? "bg-black"
                          : "bg-transparent"
                      }`}
                    ></div>
                  ))}
                </div>
              </div>
              
              <p className="text-xs font-mono bg-accent/20 py-1.5 px-3 rounded text-muted-foreground select-all">
                {selectedTicket.qrCodeUrl}
              </p>
              <div className="text-xs text-muted-foreground space-y-0.5">
                <p>Titular: {selectedTicket.userName}</p>
                <p>CPF: {selectedTicket.userCpf}</p>
                <p>Validade: {new Date(selectedTicket.dataReserva).toLocaleDateString()}</p>
              </div>
              <Button className="w-full mt-2" onClick={() => setSelectedTicket(null)}>Fechar</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
