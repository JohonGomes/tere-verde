import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { ApiService } from "../services/api";
import { Park, EventEntity } from "../types";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "sonner";
import { Calendar, Ticket, AlertTriangle, Check, CreditCard, QrCode, Barcode, ArrowLeft, Copy } from "lucide-react";
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

  // Multi-step & Payment simulation states
  const [step, setStep] = useState<"details" | "payment" | "success">("details");
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "card" | "boleto">("pix");

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
      setStep("details");
    }
  }, [open, defaultItemId, defaultItemType]);

  // Acha item selecionado
  const selectedPark = itemType === "park" ? parks.find(p => p.id === selectedId) : null;
  const selectedEvent = itemType === "event" ? events.find(e => e.id === selectedId) : null;
  
  const unitPrice = selectedPark ? selectedPark.ingressoBase : selectedEvent ? selectedEvent.preco : 0;
  const limitCap = selectedPark ? selectedPark.limiteCapacidadeDiaria : selectedEvent ? selectedEvent.limiteCapacidadeDiaria : 0;
  const itemName = selectedPark ? selectedPark.nome : selectedEvent ? selectedEvent.nome : "";
  const totalValue = unitPrice * quantity;

  // Handle local closing to reset steps
  const handleOpenChange = (isOpen: boolean) => {
    onOpenChange(isOpen);
    if (!isOpen) {
      setStep("details");
    }
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Você precisa estar logado para comprar.");
      return;
    }

    if (!selectedId || !date || quantity <= 0) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setStep("payment");
  };

  const handlePaymentConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Você precisa estar logado para comprar.");
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

      toast.success("Pagamento confirmado com sucesso!");
      
      // Confetes premium!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      setStep("success");
    } catch (err: any) {
      // Exibe erro de capacidade cheia (RN03)
      toast.error(err.message || "Erro ao realizar compra.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
        ) : step === "details" ? (
          <form onSubmit={handleProceedToPayment} className="space-y-4 mt-2">
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
                Ir para o Pagamento
              </Button>
            </div>
          </form>
        ) : step === "payment" ? (
          <form onSubmit={handlePaymentConfirm} className="space-y-4 mt-2">
            <button 
              type="button" 
              onClick={() => setStep("details")}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-2 transition-colors font-semibold bg-transparent border-none cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Voltar para os detalhes
            </button>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Forma de Pagamento</Label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("pix")}
                  className={`py-2 px-1 rounded-lg border flex flex-col items-center gap-1 transition-all text-[11px] font-bold ${paymentMethod === "pix" ? "border-primary bg-primary/5 text-primary" : "border-border hover:bg-accent/50 text-muted-foreground"}`}
                >
                  <QrCode className="h-4 w-4" />
                  Pix
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`py-2 px-1 rounded-lg border flex flex-col items-center gap-1 transition-all text-[11px] font-bold ${paymentMethod === "card" ? "border-primary bg-primary/5 text-primary" : "border-border hover:bg-accent/50 text-muted-foreground"}`}
                >
                  <CreditCard className="h-4 w-4" />
                  Cartão
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("boleto")}
                  className={`py-2 px-1 rounded-lg border flex flex-col items-center gap-1 transition-all text-[11px] font-bold ${paymentMethod === "boleto" ? "border-primary bg-primary/5 text-primary" : "border-border hover:bg-accent/50 text-muted-foreground"}`}
                >
                  <Barcode className="h-4 w-4" />
                  Boleto
                </button>
              </div>
            </div>

            {/* Pix Content */}
            {paymentMethod === "pix" && (
              <div className="space-y-3 py-1 text-center">
                <div className="mx-auto w-32 h-32 bg-white border border-border p-2 rounded-lg flex items-center justify-center shadow-sm">
                  <QrCode className="h-24 w-24 text-slate-800" />
                </div>
                <div className="space-y-1.5">
                  <p className="text-[11px] text-muted-foreground leading-relaxed">Escaneie o QR Code ou copie a chave Pix Copia e Cola abaixo.</p>
                  <div className="flex gap-1">
                    <Input 
                      readOnly 
                      value="00020126580014br.gov.bcb.pix0136tereverdepix2026hash520400005303986540510.005802BR5925TereVerdeReservas6009Teresopol62070503ingressos" 
                      className="text-[9px] font-mono select-all bg-muted/40 h-8 flex-1 truncate"
                    />
                    <Button 
                      type="button" 
                      size="sm" 
                      variant="outline" 
                      onClick={() => {
                        navigator.clipboard.writeText("00020126580014br.gov.bcb.pix0136tereverdepix2026hash520400005303986540510.005802BR5925TereVerdeReservas6009Teresopol62070503ingressos");
                        toast.success("Código Pix copiado!");
                      }}
                      className="h-8 px-2 cursor-pointer"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Card Content */}
            {paymentMethod === "card" && (
              <div className="space-y-2 py-1 text-left">
                <div className="space-y-0.5">
                  <Label htmlFor="card-name" className="text-[11px]">Nome no Cartão</Label>
                  <Input id="card-name" placeholder="Ex: João Silva" required className="h-8 text-xs" defaultValue={user.name} />
                </div>
                <div className="space-y-0.5">
                  <Label htmlFor="card-number" className="text-[11px]">Número do Cartão</Label>
                  <Input id="card-number" placeholder="4444 4444 4444 4444" required className="h-8 text-xs" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-0.5">
                    <Label htmlFor="card-exp" className="text-[11px]">Validade</Label>
                    <Input id="card-exp" placeholder="MM/AA" required className="h-8 text-xs" />
                  </div>
                  <div className="space-y-0.5">
                    <Label htmlFor="card-cvv" className="text-[11px]">CVV</Label>
                    <Input id="card-cvv" placeholder="123" required className="h-8 text-xs" />
                  </div>
                </div>
              </div>
            )}

            {/* Boleto Content */}
            {paymentMethod === "boleto" && (
              <div className="space-y-3 py-1">
                <div className="p-3 bg-muted/40 rounded-lg border text-left space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                    <Barcode className="h-4 w-4 text-primary shrink-0" />
                    Boleto Bancário
                  </div>
                  <div className="flex gap-1">
                    <Input 
                      readOnly 
                      value="34191.79001 01043.513184 91020.150008 7 9000000003500" 
                      className="text-[9px] font-mono select-all bg-background h-8 flex-1 truncate"
                    />
                    <Button 
                      type="button" 
                      size="sm" 
                      variant="outline" 
                      onClick={() => {
                        navigator.clipboard.writeText("34191.79001 01043.513184 91020.150008 7 9000000003500");
                        toast.success("Código do boleto copiado!");
                      }}
                      className="h-8 px-2 cursor-pointer"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    * Compensação bancária em até 2 dias úteis. Os ingressos estarão disponíveis no perfil após a compensação.
                  </p>
                </div>
              </div>
            )}

            <div className="border-t pt-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-muted-foreground block font-medium">Total a Pagar</span>
                <span className="text-xl font-extrabold text-primary">R$ {totalValue.toFixed(2)}</span>
              </div>
              <Button type="submit" className="bg-primary hover:bg-primary/95 px-6 font-bold cursor-pointer" disabled={submitting}>
                {submitting ? "Processando..." : "Confirmar e Pagar"}
              </Button>
            </div>
          </form>
        ) : (
          <div className="py-4 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto text-green-600">
              <Check className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-foreground">Pagamento Confirmado!</h3>
              <p className="text-xs text-muted-foreground px-4">
                Seu ingresso para <strong>{itemName}</strong> foi gerado e já está disponível em seu perfil.
              </p>
            </div>

            {/* Simulação do QR Code do Ingresso Reservado */}
            <div className="mx-auto w-32 h-32 bg-white border border-border p-2.5 rounded-lg flex flex-col items-center justify-center shadow-md animate-pulse">
              <QrCode className="h-24 w-24 text-slate-800" />
              <span className="text-[8px] text-zinc-500 font-mono mt-1">COD: TV-ING-{Math.floor(1000 + Math.random() * 9000)}</span>
            </div>

            <div className="p-2.5 bg-muted/50 rounded-lg text-left text-xs space-y-0.5 max-w-[280px] mx-auto border text-muted-foreground">
              <div><strong className="text-foreground">Atração:</strong> {itemName}</div>
              <div><strong className="text-foreground">Data:</strong> {date ? new Date(date + "T00:00:00").toLocaleDateString() : ""}</div>
              <div><strong className="text-foreground">Quantidade:</strong> {quantity} {quantity === 1 ? "pessoa" : "pessoas"}</div>
              <div><strong className="text-foreground">Valor Pago:</strong> R$ {totalValue.toFixed(2)}</div>
            </div>

            <Button 
              className="w-full bg-primary hover:bg-primary/95 font-bold cursor-pointer" 
              onClick={() => {
                onOpenChange(false);
                setStep("details");
              }}
            >
              Fechar e Ir para o Perfil
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
