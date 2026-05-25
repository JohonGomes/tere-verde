import { useState, useEffect } from "react";
import { ApiService } from "../../services/api";
import { Trail } from "../../types";
import { Header } from "../Header";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { InteractionsSection } from "../InteractionsSection";
import { Mountain, Compass, Search, Clock, Award, Camera } from "lucide-react";
import { FadeIn, SlideIn } from "../AnimatedText";
import { SocialLinks } from "../SocialLinks";
import type { PageType } from "../../App";

interface TrilhasPageProps {
  onNavigate: (page: PageType) => void;
}

export function TrilhasPage({ onNavigate }: TrilhasPageProps) {
  const [trails, setTrails] = useState<Trail[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("todos");
  const [selectedTrail, setSelectedTrail] = useState<Trail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrails = async () => {
      try {
        const data = await ApiService.getTrails();
        setTrails(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrails();
  }, []);

  const filteredTrails = trails.filter(trail => {
    const matchesSearch = trail.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          trail.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = difficultyFilter === "todos" || 
                             trail.dificuldade.toLowerCase() === difficultyFilter.toLowerCase();
    return matchesSearch && matchesDifficulty;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header onNavigate={onNavigate} />

      {/* Hero Header */}
      <div className="relative h-[40vh] bg-cover bg-center flex items-center justify-center text-center" 
           style={{ backgroundImage: "url('https://images.unsplash.com/photo-1469474968028-56623f02e42e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920')" }}>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 container mx-auto px-4 text-white">
          <FadeIn>
            <h1 className="text-3xl md:text-5xl font-bold mb-3 flex items-center justify-center gap-2">
              <Compass className="h-8 w-8 md:h-12 md:w-12 text-primary" />
              Explorar Trilhas
            </h1>
            <p className="text-sm md:text-lg max-w-xl mx-auto opacity-95">
              Descubra as caminhadas e travessias mais incríveis da serra fluminense para todos os níveis de experiência.
            </p>
          </FadeIn>
        </div>
      </div>

      {/* Busca e Filtros */}
      <section className="py-8 bg-muted/40 border-b">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 max-w-5xl mx-auto">
            {/* Input Busca */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar por trilha ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-background"
              />
            </div>

            {/* Filtros Dificuldade */}
            <div className="flex flex-wrap gap-2">
              {["todos", "Fácil", "Moderado", "Difícil", "Muito Difícil"].map((difficulty) => (
                <button
                  key={difficulty}
                  onClick={() => setDifficultyFilter(difficulty)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    difficultyFilter === difficulty
                      ? "bg-primary border-primary text-primary-foreground shadow"
                      : "bg-background border-border text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {difficulty === "todos" ? "Todas" : difficulty}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Grid de Trilhas */}
      <section className="py-12">
        <div className="container mx-auto px-4 md:px-6">
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Carregando trilhas...</div>
          ) : filteredTrails.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground italic">Nenhuma trilha encontrada para os critérios selecionados.</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {filteredTrails.map((trail, index) => (
                <FadeIn key={trail.id} delay={index * 0.05}>
                  <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full group">
                    <div className="h-48 overflow-hidden relative">
                      <img
                        src={trail.imagem}
                        alt={trail.nome}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <Badge className="absolute top-3 left-3 bg-primary/95 backdrop-blur-sm">
                        {trail.dificuldade}
                      </Badge>
                    </div>
                    <CardContent className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                          {trail.nome}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-3 leading-relaxed">
                          {trail.descricao}
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between items-center text-xs text-muted-foreground border-t pt-4 font-medium">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" /> {trail.duracao}
                          </span>
                          <span className="flex items-center gap-1">
                            <Mountain className="h-3.5 w-3.5" /> {trail.distancia}
                          </span>
                          <span className="flex items-center gap-1 text-red-500 font-bold">
                            ❤️ {trail.likes}
                          </span>
                        </div>

                        <Button 
                          onClick={() => setSelectedTrail(trail)} 
                          className="w-full bg-primary hover:bg-primary/95 text-xs font-semibold cursor-pointer"
                        >
                          Conhecer Trilha
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </FadeIn>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Modal Detalhado da Trilha */}
      <Dialog open={!!selectedTrail} onOpenChange={() => setSelectedTrail(null)}>
        <DialogContent className="sm:max-w-6xl w-[92vw] max-h-[92vh] overflow-y-auto">
          {selectedTrail && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl md:text-3xl font-bold text-primary">
                  {selectedTrail.nome}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* Badges de informação */}
                <div className="flex flex-wrap gap-3">
                  <Badge variant={
                    selectedTrail.dificuldade === "Fácil" ? "default" :
                    selectedTrail.dificuldade === "Moderado" ? "secondary" :
                    "destructive"
                  }>
                    {selectedTrail.dificuldade}
                  </Badge>
                  <Badge variant="outline">
                    <Mountain className="mr-2 h-3 w-3" />
                    {selectedTrail.distancia}
                  </Badge>
                  <Badge variant="outline">
                    Duração: {selectedTrail.duracao}
                  </Badge>
                </div>

                {/* Imagem Cover */}
                <div className="rounded-lg overflow-hidden h-64 md:h-96">
                  <img
                    src={selectedTrail.imagem}
                    alt={selectedTrail.nome}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Detalhes Técnicos */}
                {selectedTrail.detalhes ? (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-bold mb-2">Sobre a Caminhada</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {selectedTrail.detalhes.descricaoCompleta}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold mb-2">Dificuldade e Requisitos</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {selectedTrail.detalhes.dificuldadeDetalhes}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold mb-2">Recomendações e Segurança</h3>
                      <ul className="list-disc list-inside space-y-1.5 text-muted-foreground">
                        {selectedTrail.detalhes.recomendacoes.map((rec, idx) => (
                          <li key={idx}>{rec}</li>
                        ))}
                      </ul>
                    </div>

                    {selectedTrail.detalhes.fotos && selectedTrail.detalhes.fotos.length > 0 && (
                      <div>
                        <h3 className="text-lg font-bold mb-3">Galeria de Fotos</h3>
                        <div className="grid grid-cols-3 gap-3">
                          {selectedTrail.detalhes.fotos.map((foto, idx) => (
                            <img
                              key={idx}
                              src={foto}
                              alt={`Foto ${idx} - ${selectedTrail.nome}`}
                              className="w-full aspect-square object-cover rounded-lg hover:scale-105 transition-transform cursor-pointer"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <h3 className="text-lg font-bold mb-2">Sobre a Caminhada</h3>
                    <p className="text-muted-foreground leading-relaxed">{selectedTrail.descricao}</p>
                  </div>
                )}

                {/* Likes e Depoimentos Moderação (RF04, RN01) */}
                <InteractionsSection
                  destinoNome={selectedTrail.nome}
                  destinoTipo="trail"
                />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="bg-muted/50 border-t border-border py-8 mt-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Mountain className="h-5 w-5 text-primary" />
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
