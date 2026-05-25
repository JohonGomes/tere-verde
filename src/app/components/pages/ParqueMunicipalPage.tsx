import { MapPin, Mountain, Droplets, Camera } from "lucide-react";
import { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { FadeIn, SlideIn } from "../AnimatedText";
import { Header } from "../Header";
import { SocialLinks } from "../SocialLinks";
import { InteractionsSection } from "../InteractionsSection";
import type { PageType } from "../../App";

interface ParqueMunicipalPageProps {
  onNavigate: (page: PageType) => void;
}

interface Trilha {
  nome: string;
  dificuldade: string;
  duracao: string;
  distancia: string;
  descricao: string;
  imagem: string;
  detalhes?: {
    descricaoCompleta: string;
    dificuldadeDetalhes: string;
    recomendacoes: string[];
    fotos: string[];
  };
}

export function ParqueMunicipalPage({ onNavigate }: ParqueMunicipalPageProps) {
  const [trilhaSelecionada, setTrilhaSelecionada] = useState<Trilha | null>(null);

  const trilhas: Trilha[] = [
    {
      nome: "Trilha da Primavera",
      dificuldade: "Fácil",
      duracao: "1-2 horas",
      distancia: "2 km",
      descricao: "Trilha leve ideal para famílias e iniciantes. Percurso bem sinalizado através de mata nativa com mirantes naturais e áreas de descanso, perfeito para observação de aves e flora local.",
      imagem: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
      detalhes: {
        descricaoCompleta: "A Trilha da Primavera é perfeita para quem está começando no trekking ou para famílias com crianças. O percurso de 2 km é totalmente sinalizado e passa por diversos pontos de interesse da mata atlântica. Durante a primavera (setembro a dezembro), o caminho fica repleto de flores silvestres, daí o nome da trilha.",
        dificuldadeDetalhes: "Trilha de nível fácil, praticamente plana, com piso bem mantido. Adequada para todas as idades. Não requer equipamentos especiais além de calçado confortável.",
        recomendacoes: [
          "Ideal para crianças a partir de 4 anos",
          "Levar água e lanche leve",
          "Binóculos para observação de aves",
          "Repelente e protetor solar",
          "Câmera fotográfica - ótimas oportunidades",
          "Melhor época: primavera (setembro a dezembro)"
        ],
        fotos: [
          "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600",
          "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=600",
          "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600"
        ]
      }
    },
    {
      nome: "Cartão Postal",
      dificuldade: "Moderado",
      duracao: "3 horas",
      distancia: "4 km",
      descricao: "Vista panorâmica da cidade de Teresópolis. Trilha moderada que leva ao principal mirante do parque, oferecendo vista 180° da cidade e montanhas ao redor, especialmente bonita ao pôr do sol.",
      imagem: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800",
      detalhes: {
        descricaoCompleta: "A trilha Cartão Postal recebe este nome devido à vista espetacular que proporciona de Teresópolis e região. É uma das trilhas mais procuradas do parque, especialmente no final da tarde quando o pôr do sol cria um espetáculo de cores sobre as montanhas. O mirante no topo tem estrutura com bancos para descanso e contemplação.",
        dificuldadeDetalhes: "Trilha de nível moderado com alguns trechos de subida mais acentuada. Requer condicionamento físico básico. Nos últimos 500 metros há degraus construídos em pedra.",
        recomendacoes: [
          "Chegar 1 hora antes do pôr do sol para melhores fotos",
          "Levar lanterna para o retorno se for no fim de tarde",
          "Mínimo 1,5 litros de água por pessoa",
          "Agasalho leve para o mirante (venta bastante)",
          "Evitar em dias nublados - visibilidade prejudicada",
          "Respeitar horário de fechamento do parque"
        ],
        fotos: [
          "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=600",
          "https://images.unsplash.com/photo-1511497584788-876760111969?w=600",
          "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600"
        ]
      }
    },
    {
      nome: "Pedra da Tartaruga",
      dificuldade: "Moderado",
      duracao: "4 horas",
      distancia: "5 km",
      descricao: "Formação rochosa com mirante natural. A trilha serpenteia por mata atlântica bem preservada até uma formação rochosa que lembra uma tartaruga, com vista privilegiada do vale.",
      imagem: "https://images.unsplash.com/photo-1511497584788-876760111969?w=800",
      detalhes: {
        descricaoCompleta: "A Pedra da Tartaruga é uma formação rochosa natural que, vista de determinado ângulo, lembra o casco de uma tartaruga gigante. A trilha até lá é uma das mais bonitas do parque, atravessando áreas densas de mata atlântica com rica biodiversidade. O topo da formação oferece vista de 270° do vale e das montanhas circundantes.",
        dificuldadeDetalhes: "Trilha de nível moderado com variação de altitude de aproximadamente 300 metros. Alguns trechos exigem uso das mãos para apoio em pedras. Recomendado para pessoas com experiência básica em trilhas.",
        recomendacoes: [
          "Calçado de trekking com boa aderência",
          "Bastões de caminhada são úteis nas subidas",
          "Levar 2 litros de água por pessoa",
          "Lanche energético para consumir no topo",
          "Evitar em dias chuvosos - pedras ficam escorregadias",
          "Cuidado extra na descida - maioria dos acidentes ocorre nesta fase"
        ],
        fotos: [
          "https://images.unsplash.com/photo-1511497584788-876760111969?w=600",
          "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600",
          "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600"
        ]
      }
    }
  ];

  const cachoeiras = [
    { nome: "Cachoeira do Imbuí", altura: "30m", descricao: "Cachoeira com acesso fácil e piscina natural" },
    { nome: "Cascata dos Fetos", altura: "12m", descricao: "Pequena cascata cercada por samambaias" },
    { nome: "Poço Verde", altura: "8m", descricao: "Piscina natural com água cristalina e verde" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header onNavigate={onNavigate} />

      {/* Hero Banner */}
      <div className="relative h-[70vh] bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920')" }}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-background"></div>
        <div className="relative container mx-auto px-4 md:px-6 h-full flex flex-col justify-center items-center text-center">
          <FadeIn>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
              Parque Natural Municipal Montanhas de Teresópolis
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl drop-shadow-md">
              Natureza acessível para toda a família
            </p>
          </FadeIn>
        </div>
      </div>

      {/* Descrição + Vídeo */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-8">
            <SlideIn direction="left">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Descrição</h2>
                <p className="text-muted-foreground leading-relaxed">
                  O Parque Natural Municipal Montanhas de Teresópolis, criado em 2009, é uma unidade de conservação
                  municipal que protege importantes áreas de Mata Atlântica no entorno da cidade. Com trilhas bem
                  sinalizadas e infraestrutura preparada para visitação.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  Ideal para famílias, idosos e iniciantes, oferece trilhas leves, cachoeiras acessíveis,
                  áreas de piquenique e mirantes com vistas espetaculares.
                </p>
                <div className="flex flex-wrap gap-3 mt-6">
                  <Badge variant="secondary" className="text-sm px-3 py-1">
                    <Mountain className="mr-2 h-3 w-3" />
                    Altitude: 900-1.200m
                  </Badge>
                  <Badge variant="secondary" className="text-sm px-3 py-1">
                    <MapPin className="mr-2 h-3 w-3" />
                    Área: 3.600 hectares
                  </Badge>
                </div>
              </div>
            </SlideIn>

            <SlideIn direction="right">
              <div className="bg-muted rounded-lg aspect-video flex items-center justify-center">
                <div className="text-center">
                  <Camera className="h-16 w-16 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">Vídeo sobre o parque</p>
                </div>
              </div>
            </SlideIn>
          </div>
        </div>
      </section>

      {/* Exibição das Trilhas */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Trilhas Principais</h2>
          <div className="space-y-12">
            {trilhas.map((trilha, index) => (
              <FadeIn key={index} delay={index * 0.1}>
                <Card className="overflow-hidden">
                  <div className={`grid md:grid-cols-2 gap-0 ${index % 2 === 1 ? 'md:grid-flow-dense' : ''}`}>
                    <div className={`${index % 2 === 1 ? 'md:col-start-2' : ''}`}>
                      <img
                        src={trilha.imagem}
                        alt={trilha.nome}
                        className="w-full h-full object-cover min-h-[300px]"
                        loading="lazy"
                      />
                    </div>
                    <CardContent className="p-8 flex flex-col justify-center">
                      <h3 className="text-2xl font-bold mb-3 text-primary">{trilha.nome}</h3>
                      <Badge variant={
                        trilha.dificuldade === "Fácil" ? "default" :
                        trilha.dificuldade === "Moderado" ? "secondary" :
                        "destructive"
                      } className="w-fit mb-4">
                        {trilha.dificuldade}
                      </Badge>
                      <p className="text-muted-foreground mb-4 leading-relaxed">{trilha.descricao}</p>
                      <div className="flex flex-wrap gap-4 text-sm mb-4">
                        <span><strong>Duração:</strong> {trilha.duracao}</span>
                        <span><strong>Distância:</strong> {trilha.distancia}</span>
                      </div>
                      <Button variant="default" className="w-fit" onClick={() => setTrilhaSelecionada(trilha)}>
                        Saiba mais
                      </Button>
                    </CardContent>
                  </div>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Cachoeiras */}
      {cachoeiras.length > 0 && (
        <section className="py-12 md:py-16 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center flex items-center justify-center gap-3">
              <Droplets className="h-8 w-8 text-primary" />
              Cachoeiras
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {cachoeiras.slice(0, 3).map((cachoeira, index) => (
                <FadeIn key={index} delay={index * 0.1}>
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="text-xl font-semibold mb-2">{cachoeira.nome}</h3>
                      <p className="text-sm text-primary font-medium mb-3">{cachoeira.altura}</p>
                      <p className="text-sm text-muted-foreground">{cachoeira.descricao}</p>
                    </CardContent>
                  </Card>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Galeria de Fotos */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Galeria de Fotos</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400",
              "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=400",
              "https://images.unsplash.com/photo-1511497584788-876760111969?w=400",
              "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400",
              "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400",
              "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=400",
              "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400",
              "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400"
            ].map((img, index) => (
              <FadeIn key={index} delay={index * 0.05}>
                <div className="aspect-square rounded-lg overflow-hidden">
                  <img
                    src={img}
                    alt={`Foto ${index + 1} do Parque Municipal`}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300 cursor-pointer"
                    loading="lazy"
                  />
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Como Chegar */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center flex items-center justify-center gap-3">
            <MapPin className="h-8 w-8 text-primary" />
            Como Chegar
          </h2>
          <Card>
            <CardContent className="pt-6 space-y-6">
              <div>
                <h4 className="font-semibold text-lg mb-2">Localização:</h4>
                <p className="text-muted-foreground">
                  Estrada Teresópolis-Friburgo (RJ-130), km 6, Albuquerque, Teresópolis, RJ.
                  A apenas 10 minutos do centro da cidade.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2">De carro:</h4>
                <p className="text-muted-foreground">
                  Do centro de Teresópolis, seguir pela Av. Lúcio Meira em direção a Nova Friburgo.
                  Estacionamento gratuito disponível na entrada do parque.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2">Transporte público:</h4>
                <p className="text-muted-foreground">
                  Ônibus da linha "Albuquerque" sai do terminal rodoviário de Teresópolis.
                  Descer no km 6 da RJ-130.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2">Horário de funcionamento:</h4>
                <p className="text-muted-foreground">
                  Todos os dias, das 8h às 17h. Última entrada às 16h.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2">Ingresso:</h4>
                <p className="text-muted-foreground">
                  R$ 10,00 (inteira) | R$ 5,00 (meia-entrada). Crianças até 5 anos não pagam.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Modal de Detalhes da Trilha */}
      <Dialog open={!!trilhaSelecionada} onOpenChange={(open) => !open && setTrilhaSelecionada(null)}>
        <DialogContent className="sm:max-w-6xl w-[92vw] max-h-[92vh] overflow-y-auto">
          {trilhaSelecionada && trilhaSelecionada.detalhes && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{trilhaSelecionada.nome}</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="flex flex-wrap gap-2">
                  <Badge variant={
                    trilhaSelecionada.dificuldade === "Fácil" ? "default" :
                    trilhaSelecionada.dificuldade === "Moderado" ? "secondary" :
                    "destructive"
                  }>
                    {trilhaSelecionada.dificuldade}
                  </Badge>
                  <Badge variant="outline">{trilhaSelecionada.distancia}</Badge>
                  <Badge variant="outline">{trilhaSelecionada.duracao}</Badge>
                </div>

                <div className="bg-muted rounded-lg aspect-video flex items-center justify-center">
                  <div className="text-center">
                    <Camera className="h-16 w-16 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">Vídeo da trilha</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Descrição Completa</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {trilhaSelecionada.detalhes.descricaoCompleta}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Dificuldade</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {trilhaSelecionada.detalhes.dificuldadeDetalhes}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Recomendações</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {trilhaSelecionada.detalhes.recomendacoes.map((rec, idx) => (
                      <li key={idx}>{rec}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Galeria de Fotos</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {trilhaSelecionada.detalhes.fotos.map((foto, idx) => (
                      <img
                        key={idx}
                        src={foto}
                        alt={`${trilhaSelecionada.nome} - Foto ${idx + 1}`}
                        className="w-full aspect-square object-cover rounded-lg"
                        loading="lazy"
                      />
                    ))}
                  </div>
                </div>

                {/* Interações de Comentários, Likes e Fotos (RF04) */}
                <InteractionsSection
                  destinoNome={trilhaSelecionada.nome}
                  destinoTipo="trail"
                />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="bg-muted/50 border-t border-border py-8">
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

      {/* VLibras */}
      <div vw="true" className="enabled">
        <div vw-access-button="true" className="active"></div>
        <div vw-plugin-wrapper="true">
          <div className="vw-plugin-top-wrapper"></div>
        </div>
      </div>
    </div>
  );
}
