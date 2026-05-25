import { useState, useEffect } from "react";
import { ApiService } from "../../services/api";
import { Restaurant } from "../../types";
import { Header } from "../Header";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ReviewModal } from "../ReviewModal";
import { Utensils, Star, MapPin, Search, Compass, ExternalLink } from "lucide-react";
import { FadeIn, ScaleIn } from "../AnimatedText";
import { SocialLinks } from "../SocialLinks";
import type { PageType } from "../../App";

interface RestaurantesPageProps {
  onNavigate: (page: PageType) => void;
}

export function RestaurantesPage({ onNavigate }: RestaurantesPageProps) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRest, setSelectedRest] = useState<any | null>(null);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Reload restaurants on modal close to refresh the rating average
  const handleOpenModalChange = (open: boolean) => {
    setReviewOpen(open);
    if (!open) {
      fetchRestaurants();
    }
  };

  const fetchRestaurants = async () => {
    try {
      const data = await ApiService.getRestaurants();
      setRestaurants(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const filteredRest = restaurants.filter(r => 
    r.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.tipo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Header onNavigate={onNavigate} />

      {/* Hero */}
      <div className="relative h-[35vh] bg-cover bg-center flex items-center justify-center text-center" 
           style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920')" }}>
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 container mx-auto px-4 text-white">
          <FadeIn>
            <h1 className="text-3xl md:text-5xl font-bold mb-3 flex items-center justify-center gap-2">
              <Utensils className="h-8 w-8 md:h-12 md:w-12 text-primary" />
              Gastronomia Serrana
            </h1>
            <p className="text-sm md:text-lg max-w-xl mx-auto opacity-95">
              Experimente a truta fresca grelhada, fondues tradicionais e o melhor dos orgânicos locais de Teresópolis.
            </p>
          </FadeIn>
        </div>
      </div>

      {/* Busca */}
      <section className="py-6 bg-muted/40 border-b">
        <div className="container mx-auto px-4 md:px-6">
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar por prato, tipo de culinária ou restaurante..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-background"
            />
          </div>
        </div>
      </section>

      {/* Grid Restaurantes */}
      <section className="py-12">
        <div className="container mx-auto px-4 md:px-6">
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Carregando parceiros...</div>
          ) : filteredRest.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground italic">Nenhum restaurante encontrado.</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {filteredRest.map((rest, index) => (
                <ScaleIn key={rest.id} delay={index * 0.08}>
                  <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full group border border-border/80">
                    <div className="h-48 overflow-hidden relative">
                      <img
                        src={rest.imagem}
                        alt={rest.nome}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge className="absolute top-3 left-3 bg-primary/95 backdrop-blur-sm">
                        {rest.tipo}
                      </Badge>
                    </div>

                    <CardContent className="p-5 flex-1 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                            {rest.nome}
                          </h3>
                          <div className="flex items-center gap-1 shrink-0 bg-yellow-400/10 border border-yellow-400/20 px-2 py-0.5 rounded text-xs font-semibold text-yellow-600">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            {rest.notaMedia} ({rest.avaliacoesContagem})
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                          {rest.descricao}
                        </p>
                      </div>

                      <div className="space-y-3 pt-6 border-t mt-6">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <MapPin className="h-4 w-4 text-primary" />
                          <span>Teresópolis, Centro - Como chegar</span>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            onClick={() => {
                              setSelectedRest({
                                id: rest.id,
                                nome: rest.nome,
                                tipo: "Restaurante"
                              });
                              setReviewOpen(true);
                            }}
                            className="bg-primary hover:bg-primary/95 flex-1 font-semibold text-xs cursor-pointer"
                          >
                            <Star className="h-4 w-4 mr-1.5 text-yellow-400 fill-yellow-400" />
                            Avaliar (1-5★)
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => window.open("https://maps.google.com", "_blank")}
                            className="text-xs font-medium cursor-pointer"
                            title="Ver direções de mapa"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </ScaleIn>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Review Dialog */}
      {selectedRest && (
        <ReviewModal
          open={reviewOpen}
          onOpenChange={handleOpenModalChange}
          establishment={selectedRest}
        />
      )}

      {/* Footer */}
      <footer className="bg-muted/50 border-t border-border py-8 mt-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Utensils className="h-5 w-5 text-primary" />
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
