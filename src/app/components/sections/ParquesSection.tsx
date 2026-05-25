import { MapPin, Mountain, Trees } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { AnimatedText, ScaleIn } from "../AnimatedText";

export function ParquesSection() {
  const parques = [
    {
      id: 1,
      nome: "Parque Nacional",
      nomeCompleto: "Parque Nacional da Serra dos Órgãos",
      descricao: "O parque abriga as trilhas mais icônicas da região, incluindo a Pedra do Sino e a Travessia Petrópolis-Teresópolis",
      area: "20.024 hectares",
      trilhas: 12,
      imagem: "https://images.unsplash.com/photo-1682347810591-be423d4ad8ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
      destaque: "Principal"
    },
    {
      id: 2,
      nome: "Parque Montanhas",
      nomeCompleto: "Parque Natural Municipal Montanhas de Teresópolis",
      descricao: "Área de preservação municipal com trilhas leves e cachoeiras de fácil acesso para toda a família",
      area: "3.568 hectares",
      trilhas: 8,
      imagem: "https://images.unsplash.com/photo-1604990830224-5aeb2863fbbe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
      destaque: "Família"
    },
    {
      id: 3,
      nome: "Parque Três Picos",
      nomeCompleto: "Parque Estadual dos Três Picos",
      descricao: "Maior unidade de conservação do estado do Rio de Janeiro, com biodiversidade excepcional da Mata Atlântica",
      area: "46.350 hectares",
      trilhas: 15,
      imagem: "https://images.unsplash.com/photo-1682347813709-e0e59e834b04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
      destaque: "Maior"
    }
  ];

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
              Três unidades de conservação protegem a biodiversidade e oferecem experiências únicas na natureza
            </p>
          </div>
        </AnimatedText>

        <div className="grid md:grid-cols-3 gap-6">
          {parques.map((parque, index) => (
            <ScaleIn key={parque.id} delay={index * 0.1}>
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
              <div className="h-48 overflow-hidden relative">
                <ImageWithFallback
                  src={parque.imagem}
                  alt={parque.nomeCompleto}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <Badge className="absolute top-3 right-3 bg-primary/90 backdrop-blur-sm">
                  {parque.destaque}
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-xl">{parque.nome}</CardTitle>
                <p className="text-xs text-muted-foreground">{parque.nomeCompleto}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{parque.descricao}</p>
                <div className="flex items-center justify-between text-sm pt-2 border-t">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="font-medium">{parque.area}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Mountain className="h-4 w-4 text-primary" />
                    <span className="font-medium">{parque.trilhas} trilhas</span>
                  </div>
                </div>
              </CardContent>
              </Card>
            </ScaleIn>
          ))}
        </div>
      </div>
    </section>
  );
}
