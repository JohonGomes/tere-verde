import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { ApiService } from "../services/api";
import { Park, EventEntity } from "../types";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "sonner";
import { Calendar, User, Ticket, AlertTriangle, Check } from "lucide-react";
import confetti from "canvas-confetti";

interface TicketPurchaseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenAuth?: () => void; // callback para abrir modal de login se deslogado
  defaultItemId?: string;
  defaultItemType?: "park" | "event";
}

export function TicketPurchaseModal({ 
  open, 
  onOpenChange, 
  onOpenAuth,
  defaultItemId,
  defaultItemType = "park"
}: TicketPurchaseModalProps) {
  const { user } = useAuth();
  
  // Data lists
  const [parks, setParks] = useState<Park[]>([]);
  const [events, setEvents] = useState<EventEntity[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [itemType, setItemType] = useState<"park" | "event">(defaultItemType);
  const [selectedId, setSelectedId] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [submitting, setSubmitting] = useState(false);

  // Load choices
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const p = await ApiService.getParks();
        const e = await ApiService.getEvents();
        setParks(p);
        setEvents(e);
        
        // Define seleções iniciais
        if (defaultItemId) {
          setSelectedId(defaultItemId);
          setItemType(defaultItemType);
        } else if (defaultItemType === "park" && p.length > 0) {
          setSelectedId(p[0].id);
        } else if (defaultItemType === "event" && e.length > 0) {
          setSelectedId(e[0].id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      loadOptions();
      // Define data padrão como amanhã
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setDate(tomorrow.toISOString().split("T")[0]);
      setQuantity(1);
    }
  }, [open, defaultItemId, defaultItemType]);

  // Acha item selecionado
  const selectedPark = itemType === "park" ? parks.find(p => p.id === selectedId) : null;
  const selectedEvent = itemType === "event" ? events.find(e => e.id === selectedId) : null;
  
  const unitPrice = selectedPark ? selectedPark.ingressoBase : selectedEvent ? selectedEvent.preco : 0;
  const limitCap = selectedPark ? selectedPark.limiteCapacidadeDiaria : selectedEvent ? selectedEvent.limiteCapacidadeDiaria : 0;
  const itemName = selectedPark ? selectedPark.nome : selectedEvent ? selectedEvent.nome : "";
  const totalValue = unitPrice * quantity;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Você precisa estar logado para comprar.");
      return;
    }

    if (!selectedId || !date || quantity <= 0) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setSubmitting(true);
    try {
      await ApiService.buyTicket({
        userId: user.id,
        userName: user.name,
        userCpf: user.cpf,
        itemId: selectedId,
        itemName: itemName,
        itemType: itemType,
        quantidade: quantity,
        dataReserva: date,
        valorTotal: totalValue,
      });

      toast.success("Ingresso comprado com sucesso!");
      
      // Confetes premium!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      onOpenChange(false);
    } catch (err: any) {
      // Exibe erro de capacidade cheia (RN03)
      toast.error(err.message || "Erro ao realizar compra.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px] rounded-xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-primary flex items-center gap-2">
            <Ticket className="h-5.5 w-5.5 text-primary shrink-0" />
            Adquirir Ingressos
          </DialogTitle>
          <DialogDescription>Reserve sua entrada com antecedência e garanta sua vaga.</DialogDescription>
        </DialogHeader>

        {!user ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mx-auto text-yellow-600">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <p className="font-bold text-foreground">Login Necessário (RN02)</p>
              <p className="text-sm text-muted-foreground px-4">Apenas usuários cadastrados podem reservar ingressos nos parques e trilhas.</p>
            </div>
            <Button className="w-full bg-primary hover:bg-primary/95" onClick={() => {
              onOpenChange(false);
              if (onOpenAuth) onOpenAuth();
            }}>
              Entrar ou Cadastrar-se
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            {/* Escolher categoria se não tiver defaultItemId */}
            {!defaultItemId && (
              <div className="grid grid-cols-2 gap-2 p-1 bg-muted rounded-lg text-sm mb-2">
                <button
                  type="button"
                  onClick={() => {
                    setItemType("park");
                    if (parks.length > 0) setSelectedId(parks[0].id);
                  }}
                  className={`py-1.5 rounded-md font-semibold transition-all ${itemType === "park" ? "bg-white dark:bg-zinc-800 shadow text-primary" : "text-muted-foreground"}`}
                >
                  Parques
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setItemType("event");
                    if (events.length > 0) setSelectedId(events[0].id);
                  }}
                  className={`py-1.5 rounded-md font-semibold transition-all ${itemType === "event" ? "bg-white dark:bg-zinc-800 shadow text-primary" : "text-muted-foreground"}`}
                >
                  Eventos
                </button>
              </div>
            )}

            {/* Dropdown de Itens */}
            <div className="space-y-1">
              <Label>Selecione a Atração</Label>
              <Select value={selectedId} onValueChange={setSelectedId} disabled={loading}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {itemType === "park" ? (
                    parks.map(p => (
                      <SelectItem key={p.id} value={p.id}>{p.nome}</SelectItem>
                    ))
                  ) : (
                    events.map(e => (
                      <SelectItem key={e.id} value={e.id}>{e.nome}</SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Seleção de Data */}
            <div className="space-y-1">
              <Label htmlFor="t-date" className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-muted-foreground" /> Data da Visita
              </Label>
              <Input
                id="t-date"
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            {/* Seleção de Quantidade */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="t-qty">Quantidade</Label>
                <Input
                  id="t-qty"
                  type="number"
                  min={1}
                  max={10}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                  required
                />
              </div>

              <div className="space-y-1 flex flex-col justify-end text-right">
                <span className="text-xs text-muted-foreground">Preço Unitário</span>
                <span className="font-bold text-foreground">R$ {unitPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Capacidade Máxima e Info */}
            <div className="p-3 bg-primary/5 rounded-lg border border-primary/10 text-xs flex justify-between items-center text-muted-foreground">
              <span>Capacidade Limite do Parque:</span>
              <span className="font-semibold text-primary">{limitCap} pessoas/dia</span>
            </div>

            <div className="border-t pt-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-muted-foreground block font-medium">Faturamento Total</span>
                <span className="text-2xl font-extrabold text-primary">R$ {totalValue.toFixed(2)}</span>
              </div>
              <Button type="submit" className="bg-primary hover:bg-primary/95 px-6 font-bold" disabled={submitting}>
                {submitting ? "Confirmando..." : "Confirmar Compra"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
