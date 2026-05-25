import { useState, useEffect } from "react";
import { ApiService } from "../../services/api";
import { Lodging } from "../../types";
import { Header } from "../Header";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ReviewModal } from "../ReviewModal";
import { Home, Star, MapPin, Search, Compass, ExternalLink } from "lucide-react";
import { FadeIn, ScaleIn } from "../AnimatedText";
import { SocialLinks } from "../SocialLinks";
import type { PageType } from "../../App";

interface HospedagensPageProps {
  onNavigate: (page: PageType) => void;
}

export function HospedagensPage({ onNavigate }: HospedagensPageProps) {
  const [lodgings, setLodgings] = useState<Lodging[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLodge, setSelectedLodge] = useState<any | null>(null);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Reload lodgings on modal close to refresh rating averages
  const handleOpenModalChange = (open: boolean) => {
    setReviewOpen(open);
    if (!open) {
      fetchLodgings();
    }
  };

  const fetchLodgings = async () => {
    try {
      const data = await ApiService.getLodgings();
      setLodgings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLodgings();
  }, []);

  const filteredLodges = lodgings.filter(l => 
    l.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.tipo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Header onNavigate={onNavigate} />

      {/* Hero */}
      <div className="relative h-[35vh] bg-cover bg-center flex items-center justify-center text-center" 
           style={{ backgroundImage: "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920')" }}>
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 container mx-auto px-4 text-white">
          <FadeIn>
            <h1 className="text-3xl md:text-5xl font-bold mb-3 flex items-center justify-center gap-2">
              <span className="text-primary text-3xl md:text-5xl">🏡</span>
              Hospedagens e Pousadas
            </h1>
            <p className="text-sm md:text-lg max-w-xl mx-auto opacity-95">
              Chalés charmosos com lareira no Vale dos Frades, hotéis fazenda e refúgios tranquilos em meio à mata atlântica.
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
              placeholder="Pesquisar por pousada, chalé, hotel fazenda..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-background"
            />
          </div>
        </div>
      </section>

      {/* Grid Hospedagens */}
      <section className="py-12">
        <div className="container mx-auto px-4 md:px-6">
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Carregando estabelecimentos...</div>
          ) : filteredLodges.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground italic">Nenhuma pousada ou hotel encontrado.</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {filteredLodges.map((lodge, index) => (
                <ScaleIn key={lodge.id} delay={index * 0.08}>
                  <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full group border border-border/80">
                    <div className="h-48 overflow-hidden relative">
                      <img
                        src={lodge.imagem}
                        alt={lodge.nome}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge className="absolute top-3 left-3 bg-primary/95 backdrop-blur-sm">
                        {lodge.tipo}
                      </Badge>
                    </div>

                    <CardContent className="p-5 flex-1 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                            {lodge.nome}
                          </h3>
                          <div className="flex items-center gap-1 shrink-0 bg-yellow-400/10 border border-yellow-400/20 px-2 py-0.5 rounded text-xs font-semibold text-yellow-600">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            {lodge.notaMedia} ({lodge.avaliacoesContagem})
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                          {lodge.descricao}
                        </p>
                      </div>

                      <div className="space-y-3 pt-6 border-t mt-6">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <MapPin className="h-4 w-4 text-primary" />
                          <span>Teresópolis, Serra - Como chegar</span>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            onClick={() => {
                              setSelectedLodge({
                                id: lodge.id,
                                nome: lodge.nome,
                                tipo: "Hospedagem"
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
                            onClick={() => window.open("https://booking.com", "_blank")}
                            className="text-xs font-medium cursor-pointer"
                            title="Ver disponibilidade"
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
      {selectedLodge && (
        <ReviewModal
          open={reviewOpen}
          onOpenChange={handleOpenModalChange}
          establishment={selectedLodge}
        />
      )}

      {/* Footer */}
      <footer className="bg-muted/50 border-t border-border py-8 mt-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-semibold flex items-center gap-1">🏡 Terê Verde</span>
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
