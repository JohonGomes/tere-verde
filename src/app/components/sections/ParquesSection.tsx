import { useState, useEffect, useRef } from "react";
import { MapPin, Mountain, Trees, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { AnimatedText, ScaleIn } from "../AnimatedText";
import { ApiService } from "../../services/api";
import { Park } from "../../types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Button } from "../ui/button";
import { TicketPurchaseModal } from "../TicketPurchaseModal";

const STATIC_PARQUES = [
  {
    id: "parque-nacional",
    nome: "Parque Nacional",
    nomeCompleto: "Parque Nacional da Serra dos Órgãos",
    descricao: "O park abriga as trilhas mais icônicas da região, incluindo a Pedra do Sino e a Travessia Petrópolis-Teresópolis",
    area: "20.024 hectares",
    trilhas: 12,
    imagem: "https://images.unsplash.com/photo-1682347810591-be423d4ad8ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    destaque: "Principal"
  },
  {
    id: "parque-montanhas",
    nome: "Parque Montanhas",
    nomeCompleto: "Parque Natural Municipal Montanhas de Teresópolis",
    descricao: "Área de preservação municipal com trilhas leves e cachoeiras de fácil acesso para toda a família",
    area: "3.568 hectares",
    trilhas: 8,
    imagem: "https://images.unsplash.com/photo-1604990830224-5aeb2863fbbe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    destaque: "Família"
  },
  {
    id: "parque-tres-picos",
    nome: "Parque Três Picos",
    nomeCompleto: "Parque Estadual dos Três Picos",
    descricao: "Maior unidade de conservação do estado do Rio de Janeiro, com biodiversidade excepcional da Mata Atlântica",
    area: "46.350 hectares",
    trilhas: 15,
    imagem: "https://images.unsplash.com/photo-1682347813709-e0e59e834b04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    destaque: "Maior"
  }
];

interface ParquesSectionProps {
  onNavigate?: (page: any) => void;
}

export function ParquesSection({ onNavigate }: ParquesSectionProps) {
  const [parques, setParques] = useState<any[]>(STATIC_PARQUES);
  const [selectedCustomPark, setSelectedCustomPark] = useState<any>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [buyModalOpen, setBuyModalOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      // Rolagem suave correspondente a 75% da largura visível
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth"
      });
    }
  };

  const handleSelectPark = (parkId: string) => {
    if (parkId === "parque-nacional" || parkId === "parque-tres-picos" || parkId === "parque-municipal") {
      if (onNavigate) {
        onNavigate(parkId);
      }
    } else {
      const p = parques.find(item => item.id === parkId);
      if (p) {
        setSelectedCustomPark(p);
        setDetailModalOpen(true);
      }
    }
  };

  useEffect(() => {
    const fetchDynamicData = async () => {
      try {
        const [dbParks, dbTrails] = await Promise.all([
          ApiService.getParks(),
          ApiService.getTrails()
        ]);

        const dbMapped = (dbParks || []).map(p => {
          const numTrilhas = (dbTrails || []).filter(t => t.parkId === p.id).length;
          
          let tagDestaque = "Ecológico";
          if (p.id === "parque-nacional") tagDestaque = "Principal";
          else if (p.nome.toLowerCase().includes("montanha") || p.id === "parque-municipal") tagDestaque = "Família";
          else if (p.nome.toLowerCase().includes("picos") || p.id === "parque-tres-picos") tagDestaque = "Maior";

          const defaultImg = "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600";

          return {
            id: p.id,
            nome: p.nome,
            nomeCompleto: p.nome.includes("Parque") ? p.nome : `Parque ${p.nome}`,
            descricao: p.descricao,
            area: p.area || "N/A",
            trilhas: numTrilhas,
            imagem: p.imagem || defaultImg,
            destaque: tagDestaque
          };
        });

        // Mesclar lista estática com a do banco
        // Para cada item estático: se existir no banco (por id ou nome aproximado), usa o do banco. Senão, mantém o estático.
        const merged = STATIC_PARQUES.map(sp => {
          const found = dbMapped.find(dbp => dbp.id === sp.id || dbp.nome.toLowerCase().includes(sp.nome.toLowerCase()));
          return found ? found : sp;
        });

        // Adiciona os itens dinâmicos do banco que não estão na lista estática
        dbMapped.forEach(dbp => {
          if (!merged.some(m => m.id === dbp.id || m.nome.toLowerCase().includes(dbp.nome.toLowerCase()))) {
            merged.push(dbp);
          }
        });

        setParques(merged);
      } catch (err) {
        console.warn("Usando parques estáticos devido a erro no fetch:", err);
      }
    };

    fetchDynamicData();
  }, []);

  const showScroll = parques.length > 3;

  return (
    <section id="parques" className="py-12 md:py-20 bg-[#E8EBE9] dark:bg-[#1A2621]">
      <div className="container mx-auto px-4 md:px-6">
        <AnimatedText>
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-bold mb-4 flex items-center justify-center gap-2">
              <Trees className="h-6 w-6 md:h-8 md:w-8 text-primary" />
              Parques de Teresópolis
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Unidades de conservação que protegem a biodiversidade e oferecem experiências únicas na natureza
            </p>
          </div>
        </AnimatedText>

        <div className="relative group/slider px-4">
          {/* Botão de Rolar para Esquerda */}
          {showScroll && (
            <button
              onClick={() => scroll("left")}
              className="absolute left-[-20px] top-1/2 -translate-y-1/2 bg-white/90 dark:bg-zinc-800/90 text-foreground p-3 rounded-full shadow-lg border border-border/40 hover:bg-white hover:scale-110 active:scale-95 transition-all z-20 hidden md:flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300"
              aria-label="Rolar para esquerda"
            >
              <ChevronLeft className="h-5 w-5 text-primary" />
            </button>
          )}

          {/* Container de Rolagem */}
          <div 
            ref={scrollRef}
            className={
              showScroll 
                ? "flex flex-row overflow-x-auto gap-5 pb-6 scroll-smooth snap-x snap-mandatory scrollbar-none justify-start md:justify-center" 
                : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            }
            style={{ scrollbarWidth: "none" }}
          >
            {parques.map((parque, index) => (
              <ScaleIn 
                key={parque.id} 
                delay={index * 0.05}
                className={showScroll ? "w-[285px] md:w-[310px] shrink-0 snap-start" : ""}
              >
                <Card 
                  onClick={() => handleSelectPark(parque.id)}
                  className="overflow-hidden hover:shadow-lg transition-all duration-300 group flex flex-col h-[415px] justify-between border border-border/50 bg-card cursor-pointer"
                >
                  <div>
                    <div className="h-40 overflow-hidden relative">
                      <ImageWithFallback
                        src={parque.imagem}
                        alt={parque.nomeCompleto}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <Badge className="absolute top-2.5 right-2.5 bg-primary/95 backdrop-blur-sm text-[10px] px-2 py-0.5">
                        {parque.destaque}
                      </Badge>
                    </div>
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-lg line-clamp-1">{parque.nome}</CardTitle>
                      <p className="text-[11px] text-muted-foreground line-clamp-1">{parque.nomeCompleto}</p>
                    </CardHeader>
                    <CardContent className="px-4 py-0">
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">{parque.descricao}</p>
                    </CardContent>
                  </div>
                  <CardContent className="p-4 pt-0 space-y-3">
                    <div className="flex items-center justify-between text-xs pt-3 border-t border-border/60">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span className="font-medium truncate max-w-[100px]">{parque.area}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Mountain className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span className="font-medium">{parque.trilhas} {parque.trilhas === 1 ? "trilha" : "trilhas"}</span>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full text-xs font-semibold h-8 border-primary/30 group-hover:bg-primary group-hover:text-white transition-all duration-300 pointer-events-none"
                    >
                      Explorar Parque
                    </Button>
                  </CardContent>
                </Card>
              </ScaleIn>
            ))}
          </div>

          {/* Botão de Rolar para Direita */}
          {showScroll && (
            <button
              onClick={() => scroll("right")}
              className="absolute right-[-20px] top-1/2 -translate-y-1/2 bg-white/90 dark:bg-zinc-800/90 text-foreground p-3 rounded-full shadow-lg border border-border/40 hover:bg-white hover:scale-110 active:scale-95 transition-all z-20 hidden md:flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300"
              aria-label="Rolar para direita"
            >
              <ChevronRight className="h-5 w-5 text-primary" />
            </button>
          )}
        </div>

        {showScroll && (
          <div className="flex justify-center gap-1.5 mt-4 text-xs text-muted-foreground animate-pulse">
            <span>Arrastar ou usar as setas laterais para navegar</span>
            <span>→</span>
          </div>
        )}
      </div>

      {/* Modal de Detalhes para Parques Dinâmicos */}
      {selectedCustomPark && (
        <Dialog open={detailModalOpen} onOpenChange={setDetailModalOpen}>
          <DialogContent className="sm:max-w-[480px] rounded-xl p-6">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-primary">
                {selectedCustomPark.nomeCompleto || selectedCustomPark.nome}
              </DialogTitle>
              <DialogDescription>
                Informações detalhadas sobre o parque ecológico.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 my-4">
              {selectedCustomPark.imagem && (
                <div className="h-48 rounded-lg overflow-hidden">
                  <img src={selectedCustomPark.imagem} alt={selectedCustomPark.nome} className="w-full h-full object-cover" />
                </div>
              )}

              <p className="text-sm text-muted-foreground leading-relaxed">
                {selectedCustomPark.descricao}
              </p>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border">
                <div>
                  <span className="text-xs text-muted-foreground block">Altitude Máxima</span>
                  <span className="text-sm font-semibold">{selectedCustomPark.altitude || "N/A"}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Área Protegida</span>
                  <span className="text-sm font-semibold">{selectedCustomPark.area || "N/A"}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Funcionamento</span>
                  <span className="text-sm font-semibold">{selectedCustomPark.funcionamento || "N/A"}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Ingresso Base</span>
                  <span className="text-sm font-semibold text-primary">R$ {Number(selectedCustomPark.ingressoBase || selectedCustomPark.ingresso_base || 0).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button variant="outline" onClick={() => setDetailModalOpen(false)}>
                Fechar
              </Button>
              <Button onClick={() => {
                setDetailModalOpen(false);
                setBuyModalOpen(true);
              }}>
                Comprar Ingresso
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Modal de compra para o parque selecionado */}
      {selectedCustomPark && (
        <TicketPurchaseModal
          open={buyModalOpen}
          onOpenChange={setBuyModalOpen}
          defaultItemId={selectedCustomPark.id}
          defaultItemType="park"
        />
      )}
    </section>
  );
}
