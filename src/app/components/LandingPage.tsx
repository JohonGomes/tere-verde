import { Calendar, Mountain, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "motion/react";
import { SocialLinks } from "./SocialLinks";
import { Header } from "./Header";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { IntroducaoSection } from "./sections/IntroducaoSection";
import { ParquesSection } from "./sections/ParquesSection";
import { EventosTempoSection } from "./sections/EventosTempoSection";
import { GaleriaFotosSection } from "./sections/GaleriaFotosSection";
import { RecarregueEnergiasSection } from "./sections/RecarregueEnergiasSection";
import { HorarioFuncionamentoSection } from "./sections/HorarioFuncionamentoSection";
import { ScaleIn } from "./AnimatedText";
import { SectionDivider } from "./SectionDivider";
import { TicketPurchaseModal } from "./TicketPurchaseModal";
import type { PageType } from "../App";

interface LandingPageProps {
  onNavigate: (page: PageType) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  const [purchaseOpen, setPurchaseOpen] = useState(false);
  const [purchaseItemType, setPurchaseItemType] = useState<"park" | "event">("park");
  const [purchaseItemId, setPurchaseItemId] = useState<string>("");

  const handleOpenPurchase = (type: "park" | "event", id: string = "") => {
    setPurchaseItemType(type);
    setPurchaseItemId(id);
    setPurchaseOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onNavigate={onNavigate} />
      <CarrosselBannersSection />
      <SectionDivider fromColor="#FFFFFF" toColor="#FFFFFF" height="h-0" />
      <IntroducaoSection />
      <SectionDivider fromColor="#FFFFFF" toColor="#E8EBE9" />
      <ParquesSection onNavigate={onNavigate} />
      <SectionDivider fromColor="#E8EBE9" toColor="#E8F2EF" />
      <EventosTempoSection />
      <SectionDivider fromColor="#E8F2EF" toColor="#F5F1ED" />
      <GaleriaFotosSection />
      <SectionDivider fromColor="#F5F1ED" toColor="#EDF2F3" />
      <RecarregueEnergiasSection />
      <SectionDivider fromColor="#EDF2F3" toColor="rgb(47 92 74 / 0.9)" />
      <IngressosSection onBuy={handleOpenPurchase} />
      <SectionDivider fromColor="rgb(47 92 74 / 0.9)" toColor="#E8F2EF" />
      <HorarioFuncionamentoSection />
      <SectionDivider fromColor="#E8F2EF" toColor="rgb(244 246 245 / 0.5)" />
      <Footer />

      <TicketPurchaseModal
        open={purchaseOpen}
        onOpenChange={setPurchaseOpen}
        defaultItemId={purchaseItemId}
        defaultItemType={purchaseItemType}
      />

      <div vw="true" className="enabled">
        <div vw-access-button="true" className="active"></div>
        <div vw-plugin-wrapper="true">
          <div className="vw-plugin-top-wrapper"></div>
        </div>
      </div>
    </div>
  );
}

function CarrosselBannersSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000 })]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const banners = [
    {
      id: 1,
      titulo: "Explore a beleza natural de Teresópolis",
      descricao: "Da subida desafiadora da Pedra do Sino ao frescor das cachoeiras escondidas",
      imagem: "https://images.unsplash.com/photo-1604991274937-b93f0c37f5e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920",
      cta: "Explorar Trilhas"
    },
    {
      id: 2,
      titulo: "Travessia Petrópolis-Teresópolis",
      descricao: "Uma das trilhas mais clássicas e desafiadoras do Brasil",
      imagem: "https://images.unsplash.com/photo-1682347812423-45911f8e6ef1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920",
      cta: "Saiba Mais"
    },
    {
      id: 3,
      titulo: "Eventos e Cultura Serrana",
      descricao: "Descubra a gastronomia, música e tradições de Teresópolis",
      imagem: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920",
      cta: "Ver Eventos"
    }
  ];

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section className="relative w-full overflow-hidden">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {banners.map((banner) => (
            <div key={banner.id} className="flex-[0_0_100%] min-w-0 relative h-[70vh] md:h-[80vh]">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('${banner.imagem}')` }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-background"></div>
              </div>
              <div className="relative container mx-auto px-4 md:px-6 h-full flex flex-col justify-center items-center text-center">
                <motion.h2
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg max-w-4xl"
                >
                  {banner.titulo}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl drop-shadow-md"
                >
                  {banner.descricao}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    <Mountain className="mr-2 h-5 w-5" />
                    {banner.cta}
                  </Button>
                </motion.div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={scrollPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={scrollNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            className={`h-2 rounded-full transition-all ${
              index === selectedIndex ? "w-8 bg-white" : "w-2 bg-white/50"
            }`}
            onClick={() => emblaApi && emblaApi.scrollTo(index)}
          />
        ))}
      </div>
    </section>
  );
}

function IngressosSection({ onBuy }: { onBuy: (type: "park" | "event", id?: string) => void }) {
  return (
    <section className="py-12 md:py-20 bg-primary/90 text-primary-foreground relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1604991274937-b93f0c37f5e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920')] bg-cover bg-center opacity-15"></div>
      <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
        <h2 className="text-2xl md:text-4xl font-bold mb-4">Garanta sua Experiência na Natureza</h2>
        <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
          Adquira ingressos para trilhas guiadas, eventos especiais e acesso aos parques naturais de Teresópolis
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          <ScaleIn delay={0}>
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardHeader>
                <CardTitle>Trilha Guiada</CardTitle>
                <p className="text-white/80 text-sm">Dia Completo</p>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold mb-2">R$ 120</p>
                <p className="text-sm opacity-80">Inclui guia e equipamentos</p>
              </CardContent>
              <CardFooter>
                <Button variant="secondary" className="w-full cursor-pointer" onClick={() => onBuy("event", "e-observacao")}>Reservar</Button>
              </CardFooter>
            </Card>
          </ScaleIn>

          <ScaleIn delay={0.1}>
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardHeader>
                <CardTitle>Parque Nacional</CardTitle>
                <p className="text-white/80 text-sm">Acesso Diário</p>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold mb-2">R$ 35</p>
                <p className="text-sm opacity-80">Entrada individual</p>
              </CardContent>
              <CardFooter>
                <Button variant="secondary" className="w-full cursor-pointer" onClick={() => onBuy("park", "parque-nacional")}>Comprar</Button>
              </CardFooter>
            </Card>
          </ScaleIn>

          <ScaleIn delay={0.2}>
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardHeader>
                <CardTitle>Evento Especial</CardTitle>
                <p className="text-white/80 text-sm">Festival de Inverno</p>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold mb-2">R$ 80</p>
                <p className="text-sm opacity-80">3 dias de programação</p>
              </CardContent>
              <CardFooter>
                <Button variant="secondary" className="w-full cursor-pointer" onClick={() => onBuy("event", "e-inverno")}>Garantir</Button>
              </CardFooter>
            </Card>
          </ScaleIn>

          <ScaleIn delay={0.3}>
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardHeader>
                <CardTitle>Passe Mensal</CardTitle>
                <p className="text-white/80 text-sm">Acesso Ilimitado</p>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold mb-2">R$ 280</p>
                <p className="text-sm opacity-80">Todos os parques</p>
              </CardContent>
              <CardFooter>
                <Button variant="secondary" className="w-full cursor-pointer" onClick={() => onBuy("park", "tres-picos")}>Assinar</Button>
              </CardFooter>
            </Card>
          </ScaleIn>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="sobre" className="bg-muted/50 border-t border-border py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Mountain className="h-6 w-6 text-primary" />
              <h3 className="font-semibold text-lg">Terê Verde</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Plataforma digital para visitantes, moradores e gestores de Teresópolis explorarem as belezas naturais da cidade.
            </p>
            <div className="space-y-2">
              <p className="text-xs font-medium text-foreground">Siga-nos nas redes sociais:</p>
              <SocialLinks size="lg" variant="outline" />
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Explore</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#eventos" className="hover:text-primary transition-colors">Eventos</a></li>
              <li><a href="#galeria" className="hover:text-primary transition-colors">Galeria</a></li>
              <li><a href="#restaurantes" className="hover:text-primary transition-colors">Gastronomia</a></li>
              <li><a href="#horarios" className="hover:text-primary transition-colors">Horários</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Sobre Teresópolis</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">História</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Como Chegar</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Onde Ficar</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contato</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Parques Disponíveis</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Parque Nacional Serra dos Órgãos</li>
              <li>Parque Estadual dos Três Picos</li>
              <li>Parque Natural Municipal Montanhas de Teresópolis</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left text-sm text-muted-foreground">
              <p>&copy; 2026 Terê Verde. Versão 2.0 - Todos os direitos reservados.</p>
              <p className="mt-1">Aplicação web para gestão de trilhas e eventos da cidade de Teresópolis, RJ.</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Conecte-se:</span>
              <SocialLinks size="md" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
