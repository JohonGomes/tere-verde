import { useState, useEffect } from "react";
import { ApiService } from "../../services/api";
import { EventEntity } from "../../types";
import { Header } from "../Header";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { TicketPurchaseModal } from "../TicketPurchaseModal";
import { Calendar, MapPin, Compass, DollarSign, Clock, Users } from "lucide-react";
import { FadeIn, ScaleIn } from "../AnimatedText";
import { SocialLinks } from "../SocialLinks";
import type { PageType } from "../../App";

interface EventosPageProps {
  onNavigate: (page: PageType) => void;
}

export function EventosPage({ onNavigate }: EventosPageProps) {
  const [events, setEvents] = useState<EventEntity[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventEntity | null>(null);
  const [purchaseOpen, setPurchaseOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await ApiService.getEvents();
        setEvents(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header onNavigate={onNavigate} />

      {/* Hero Cover */}
      <div className="relative h-[35vh] bg-cover bg-center flex items-center justify-center text-center" 
           style={{ backgroundImage: "url('https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920')" }}>
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 container mx-auto px-4 text-white">
          <FadeIn>
            <h1 className="text-3xl md:text-5xl font-bold mb-3 flex items-center justify-center gap-2">
              <Calendar className="h-8 w-8 md:h-12 md:w-12 text-primary" />
              Eventos & Oficinas
            </h1>
            <p className="text-sm md:text-lg max-w-xl mx-auto opacity-95">
              Palestras sobre ecologia, trilhas guiadas à luz da lua e o melhor da cultura e culinária serrana.
            </p>
          </FadeIn>
        </div>
      </div>

      {/* Seção Principal de Eventos */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Carregando calendário de eventos...</div>
          ) : events.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground italic">Nenhum evento agendado no momento. Volte mais tarde!</div>
          ) : (
            <div className="space-y-8 max-w-4xl mx-auto">
              {events.map((event, index) => (
                <ScaleIn key={event.id} delay={index * 0.08}>
                  <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border border-border/80">
                    <div className="grid md:grid-cols-3">
                      {/* Event Banner */}
                      <div className="h-56 md:h-full relative overflow-hidden">
                        <img
                          src={event.imagem}
                          alt={event.nome}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                        <Badge className="absolute top-3 left-3 bg-primary/95 font-semibold">
                          R$ {event.preco.toFixed(2)}
                        </Badge>
                      </div>

                      {/* Content */}
                      <div className="p-6 md:p-8 md:col-span-2 flex flex-col justify-between">
                        <div className="space-y-4">
                          <div>
                            <span className="text-xs font-bold text-primary tracking-widest uppercase">
                              Agenda Ecológica
                            </span>
                            <h3 className="text-2xl font-bold text-foreground mt-1">
                              {event.nome}
                            </h3>
                          </div>

                          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                            {event.descricao}
                          </p>

                          {/* Event info block */}
                          <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground border-t border-b py-3 font-medium">
                            <span className="flex items-center gap-1.5">
                              <Calendar className="h-4 w-4 text-primary" />
                              {new Date(event.data).toLocaleDateString("pt-BR", {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              })}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <MapPin className="h-4 w-4 text-primary" />
                              Teresópolis, RJ
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Users className="h-4 w-4 text-primary" />
                              Limite: {event.limiteCapacidadeDiaria} pessoas
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Clock className="h-4 w-4 text-primary" />
                              A partir das 09h00
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-6">
                          <Button
                            onClick={() => {
                              setSelectedEvent(event);
                              setPurchaseOpen(true);
                            }}
                            className="bg-primary hover:bg-primary/95 flex-1 font-semibold cursor-pointer"
                          >
                            <DollarSign className="h-4 w-4 mr-2" />
                            Garantir Vaga / Ingresso
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              // Link externo simulado de redes sociais do evento
                              window.open("https://instagram.com", "_blank");
                            }}
                            className="sm:w-32 cursor-pointer font-medium"
                          >
                            Redes Sociais
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </ScaleIn>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Modal de Compra de Ingressos */}
      {selectedEvent && (
        <TicketPurchaseModal
          open={purchaseOpen}
          onOpenChange={setPurchaseOpen}
          defaultItemType="event"
          defaultItemId={selectedEvent.id}
        />
      )}

      {/* Footer */}
      <footer className="bg-muted/50 border-t border-border py-8 mt-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <span className="font-semibold">Terê Verde</span>
            </div>
            <div className="text-sm text-muted-foreground text-center">
              <p>&copy; 2026 Terê Verde - Todos os direitos reservados</p>
            </div>
            <SocialLinks size="md" variant="ghost" />
          </div>
        </div>
      </footer>
    </div>
  );
}
