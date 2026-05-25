import { Star, MapPin, Utensils } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { AnimatedText, ScaleIn } from "../AnimatedText";
import { useState } from "react";
import { ReviewModal } from "../ReviewModal";

export function RecarregueEnergiasSection() {
  const [selectedEst, setSelectedEst] = useState<any | null>(null);
  const [reviewOpen, setReviewOpen] = useState(false);

  const estabelecimentos = [
    {
      id: 1,
      idStr: "rest-manjericao",
      tipo: "Restaurante",
      nome: "Sabor da Serra",
      descricao: "Gastronomia regional com vista para as montanhas. Experimente a truta fresca e os pratos com couve serrana",
      avaliacao: 4.8,
      especialidade: "Truta grelhada",
      imagem: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600"
    },
    {
      id: 2,
      idStr: "lodge-hotel-serrador",
      tipo: "Pousada",
      nome: "Recanto das Montanhas",
      descricao: "Hospedagem aconchegante em meio à natureza. Café da manhã colonial e acesso direto às trilhas",
      avaliacao: 4.9,
      especialidade: "Vista para a Serra",
      imagem: "https://images.unsplash.com/photo-1566073771259-6a8506099945?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600"
    },
    {
      id: 3,
      idStr: "rest-viva-italia",
      tipo: "Restaurante",
      nome: "Bistrô Artesanal",
      descricao: "Culinária artesanal com ingredientes locais. Queijos e geleias da região em ambiente rústico-chique",
      avaliacao: 4.7,
      especialidade: "Fondue de queijos",
      imagem: "https://images.unsplash.com/photo-1552566626-52f8b828add9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600"
    },
    {
      id: 4,
      idStr: "lodge-chale-vale",
      tipo: "Pousada",
      nome: "Chalé Vista Verde",
      descricao: "Chalés privativos com lareira, hidromassagem e vista panorâmica. Perfeito para casais",
      avaliacao: 4.8,
      especialidade: "Suíte com lareira",
      imagem: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600"
    }
  ];

  return (
    <section id="restaurantes" className="py-12 md:py-20 bg-[#EDF2F3] dark:bg-[#1A2328]">
      <div className="container mx-auto px-4 md:px-6">
        <AnimatedText>
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-bold mb-4">Recarregue suas Energias</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Onde comer e descansar após a trilha. Sabores da serra e aconchego que você merece depois da aventura (RN02)
            </p>
          </div>
        </AnimatedText>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {estabelecimentos.map((local, index) => (
            <ScaleIn key={local.id} delay={index * 0.1}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
                <div className="h-48 overflow-hidden relative">
                  <ImageWithFallback
                    src={local.imagem}
                    alt={local.nome}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-3 left-3 bg-primary/90 backdrop-blur-sm">
                    {local.especialidade}
                  </Badge>
                </div>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-xs">
                      {local.tipo === "Restaurante" ? (
                        <>
                          <Utensils className="h-3 w-3 mr-1" />
                          {local.tipo}
                        </>
                      ) : (
                        <>🏡 {local.tipo}</>
                      )}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{local.avaliacao}</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg">{local.nome}</CardTitle>
                  <CardDescription className="line-clamp-2">{local.descricao}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full cursor-pointer hover:bg-primary/5 hover:text-primary transition-all font-semibold"
                    onClick={() => {
                      setSelectedEst({
                        id: local.idStr,
                        nome: local.nome,
                        tipo: local.tipo
                      });
                      setReviewOpen(true);
                    }}
                  >
                    <Star className="h-4 w-4 mr-2 text-yellow-500 fill-yellow-500 animate-pulse" />
                    Avaliar Estabelecimento
                  </Button>
                </CardFooter>
              </Card>
            </ScaleIn>
          ))}
        </div>
      </div>

      <ReviewModal 
        open={reviewOpen} 
        onOpenChange={setReviewOpen}
        establishment={selectedEst}
      />
    </section>
  );
}
