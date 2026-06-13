import { MapPin, Mountain, Droplets, Camera, X } from "lucide-react";
import { useState, useEffect } from "react";
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
import { ApiService } from "../../services/api";
import type { Park } from "../../types";

interface ParqueNacionalPageProps {
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

function getEmbedUrl(url?: string): string | null {
  if (!url) return null;
  if (url.includes("embed/")) return url;
  if (url.includes("watch?v=")) {
    return url.replace("watch?v=", "embed/");
  }
  if (url.includes("youtu.be/")) {
    const id = url.split("youtu.be/")[1]?.split("?")[0];
    return `https://www.youtube.com/embed/${id}`;
  }
  return url;
}

export function ParqueNacionalPage({ onNavigate }: ParqueNacionalPageProps) {
  const [parkData, setParkData] = useState<Park | null>(null);
  const [trilhaSelecionada, setTrilhaSelecionada] = useState<Trilha | null>(null);

  useEffect(() => {
    ApiService.getParks()
      .then((parks) => {
        const found = parks.find((p) => p.id === "parque-nacional");
        if (found) {
          setParkData(found);
        }
      })
      .catch((err) => console.error("Erro ao carregar dados do parque nacional:", err));
  }, []);

  const defaultTrilhas: Trilha[] = [
    {
      nome: "Pedra do Sino",
      dificuldade: "Difícil",
      duracao: "8-10 horas",
      distancia: "14 km",
      descricao: "Trilha icônica com vista panorâmica da região serrana. O ponto culminante do parque oferece uma das vistas mais espetaculares da Serra dos Órgãos, com 360° de paisagens montanhosas.",
      imagem: "https://images.unsplash.com/photo-1682347812423-45911f8e6ef1?w=800",
      detalhes: {
        descricaoCompleta: "A Pedra do Sino, com 2.263 metros de altitude, é o ponto culminante do Parque Nacional da Serra dos Órgãos. A trilha é considerada uma das mais desafiadoras e recompensadoras do parque, oferecendo vistas panorâmicas incomparáveis da região serrana. O percurso passa por diferentes altitudes e ecossistemas, desde a floresta atlântica até os campos de altitude.",
        dificuldadeDetalhes: "Trilha de nível difícil que exige bom condicionamento físico. Inclui trechos íngremes, escalaminhadas em pedras e passagens por correntes metálicas. Altitude elevada pode causar desconforto em algumas pessoas.",
        recomendacoes: [
          "Começar a trilha bem cedo, preferencialmente às 6h da manhã",
          "Levar no mínimo 3 litros de água por pessoa",
          "Protetor solar, boné e óculos de sol são essenciais",
          "Calçado de trekking com boa aderência",
          "Lanches energéticos e frutas",
          "Agasalho para o topo (temperatura pode cair significativamente)"
        ],
        fotos: [
          "https://images.unsplash.com/photo-1682347812423-45911f8e6ef1?w=600",
          "https://images.unsplash.com/photo-1604991274937-b93f0c37f5e9?w=600",
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600"
        ]
      }
    },
    {
      nome: "Travessia Petrópolis-Teresópolis",
      dificuldade: "Muito Difícil",
      duracao: "3 dias",
      distancia: "30 km",
      descricao: "Uma das trilhas mais clássicas e desafiadoras do Brasil. Percurso atravessa montanhas, florestas densas e oferece experiência completa de imersão na natureza selvagem da Serra dos Órgãos.",
      imagem: "https://images.unsplash.com/photo-1604991274937-b93f0c37f5e9?w=800",
      detalhes: {
        descricaoCompleta: "Considerada uma das travessias mais icônicas do Brasil, a Petrópolis-Teresópolis atravessa 30 km de montanhas, campos de altitude e mata atlântica. Durante três dias, os aventureiros passam por paisagens espetaculares incluindo a Pedra do Sino, Morro do Açu, Pedra do Queijo e inúmeros outros pontos panorâmicos.",
        dificuldadeDetalhes: "Travessia de nível muito difícil que exige excelente condicionamento físico e experiência prévia em trilhas de montanha. Inclui trechos técnicos com uso de cordas, grandes variações de altitude e necessidade de pernoite em abrigos rústicos ou camping.",
        recomendacoes: [
          "Obrigatório reservar os abrigos com antecedência junto ao ICMBio",
          "Experiência prévia em trilhas longas é fundamental",
          "Equipamento completo de camping e trekking",
          "Guia experiente é altamente recomendado para iniciantes na travessia",
          "Preparação física com antecedência mínima de 3 meses",
          "Verificar previsão do tempo - evitar períodos chuvosos"
        ],
        fotos: [
          "https://images.unsplash.com/photo-1604991274937-b93f0c37f5e9?w=600",
          "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=600",
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600"
        ]
      }
    },
    {
      nome: "Cachoeira Véu da Noiva",
      dificuldade: "Fácil",
      duracao: "2 horas",
      distancia: "3 km",
      descricao: "Trilha leve com cachoeira de 40 metros. Ideal para famílias e iniciantes, oferece banho em piscinas naturais e mirantes para contemplação da queda d'água.",
      imagem: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800",
      detalhes: {
        descricaoCompleta: "A trilha até a Cachoeira Véu da Noiva é uma das mais acessíveis do parque, perfeita para famílias com crianças e pessoas que estão começando no trekking. A cachoeira tem aproximadamente 40 metros de altura e forma piscinas naturais ideais para banho. O caminho é bem sinalizado e passa por trechos de mata atlântica preservada.",
        dificuldadeDetalhes: "Trilha de nível fácil, com poucos trechos de subida. O caminho é bem marcado e mantido. Adequada para todas as idades, desde que com mínimo de condicionamento físico.",
        recomendacoes: [
          "Levar roupa de banho e toalha",
          "Protetor solar and repelente",
          "Água e lanches leves",
          "Calçado confortável que possa molhar",
          "Chegada cedo evita aglomeração",
          "Respeitar as placas de segurança próximas à cachoeira"
        ],
        fotos: [
          "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600",
          "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=600",
          "https://images.unsplash.com/photo-1520218508822-998633d997e6?w=600"
        ]
      }
    }
  ];

  const defaultCachoeiras = [
    { nome: "Véu da Noiva", altura: "40m", descricao: "Cachoeira com piscina natural e fácil acesso" },
    { nome: "Cachoeira Itaporani", altura: "60m", descricao: "Queda d'água impressionante em meio à mata fechada" },
    { nome: "Poço do Castelo", altura: "25m", descricao: "Piscina natural cristalina ideal para banho" }
  ];

  const defaultGaleriaFotos = [
    "https://images.unsplash.com/photo-1682347812423-45911f8e6ef1?w=400",
    "https://images.unsplash.com/photo-1604991274937-b93f0c37f5e9?w=400",
    "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
    "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=400",
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400",
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400"
  ];

  const defaultComoChegar = {
    carro: "Pela BR-116, sentido Teresópolis. A entrada principal fica na Av. Rotariana, s/n, Soberbo. Distância aproximada: 90 km (1h30 de viagem).",
    onibus: "A partir da Rodoviária Novo Rio, diversas empresas operam a linha Rio-Teresópolis. Do centro de Teresópolis, táxi ou aplicativo até a entrada do parque (aproximadamente 15 minutos)."
  };

  const nome = parkData?.nome || "Parque Nacional da Serra dos Órgãos";
  const descricao = parkData?.descricao || "O Parque Nacional da Serra dos Órgãos é uma das unidades de conservação mais importantes do Brasil, criado em 1939. Localizado na Serra do Mar, abriga a famosa Pedra do Sino (2.263m), o Dedo de Deus e outras formações rochosas icônicas.\n\nO parque preserva importantes remanescentes de Mata Atlântica, com rica biodiversidade incluindo espécies endêmicas e ameaçadas de extinção.";
  const altitude = parkData?.altitude || "2.263m";
  const area = parkData?.area || "20.024 hectares";
  const funcionamento = parkData?.funcionamento || "Terça a Domingo, 8h às 17h";
  const ingressoBase = parkData?.ingressoBase !== undefined ? parkData.ingressoBase : 35.00;
  
  const videoUrl = getEmbedUrl(parkData?.video || "https://www.youtube.com/embed/dQw4w9WgXcQ");
  const trilhas = parkData?.principaisTrilhas || defaultTrilhas;
  const cachoeiras = parkData?.cachoeiras || defaultCachoeiras;
  const galeriaFotos = parkData?.galeriaFotos || defaultGaleriaFotos;
  const comoChegar = parkData?.comoChegar || defaultComoChegar;

  const descricaoParagrafos = descricao.split("\n\n");

  return (
    <div className="min-h-screen bg-background">
      <Header onNavigate={onNavigate} />

      {/* Hero Banner */}
      <div className="relative h-[70vh] bg-cover bg-center" style={{ backgroundImage: `url('${parkData?.imagem || "https://images.unsplash.com/photo-1682347812423-45911f8e6ef1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920"}')` }}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-background"></div>
        <div className="relative container mx-auto px-4 md:px-6 h-full flex flex-col justify-center items-center text-center">
          <FadeIn>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
              {nome}
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl drop-shadow-md">
              Uma das unidades de conservação mais importantes do Brasil
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
                {descricaoParagrafos.map((para, idx) => (
                  <p key={idx} className="text-muted-foreground leading-relaxed mt-4 first:mt-0">
                    {para}
                  </p>
                ))}
                <div className="flex flex-wrap gap-3 mt-6">
                  <Badge variant="secondary" className="text-sm px-3 py-1">
                    <Mountain className="mr-2 h-3 w-3" />
                    Altitude: {altitude}
                  </Badge>
                  <Badge variant="secondary" className="text-sm px-3 py-1">
                    <MapPin className="mr-2 h-3 w-3" />
                    Área: {area}
                  </Badge>
                </div>
              </div>
            </SlideIn>

            <SlideIn direction="right">
              {videoUrl ? (
                <div className="rounded-lg overflow-hidden aspect-video border border-border shadow-md">
                  <iframe
                    width="100%"
                    height="100%"
                    src={videoUrl}
                    title="Vídeo sobre o parque"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              ) : (
                <div className="bg-muted rounded-lg aspect-video flex items-center justify-center border border-border">
                  <div className="text-center">
                    <Camera className="h-16 w-16 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">Vídeo sobre o parque</p>
                  </div>
                </div>
              )}
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
                        src={trilha.imagem || "https://images.unsplash.com/photo-1682347812423-45911f8e6ef1?w=800"}
                        alt={trilha.nome}
                        className="w-full h-full object-cover min-h-[300px]"
                        loading="lazy"
                      />
                    </div>
                    <CardContent className="p-8 flex flex-col justify-center">
                      <h3 className="text-2xl font-bold mb-3 text-primary">{trilha.nome}</h3>
                      <Badge variant={
                        trilha.dificuldade === "Fácil" ? "default" :
                        trilha.dificuldade === "Difícil" ? "secondary" :
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
              {cachoeiras.map((cachoeira, index) => (
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
      {galeriaFotos.length > 0 && (
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Galeria de Fotos</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {galeriaFotos.map((img, index) => (
                <FadeIn key={index} delay={index * 0.05}>
                  <div className="aspect-square rounded-lg overflow-hidden">
                    <img
                      src={img}
                      alt={`Foto ${index + 1} do Parque Nacional`}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300 cursor-pointer"
                      loading="lazy"
                    />
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Como Chegar */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center flex items-center justify-center gap-3">
            <MapPin className="h-8 w-8 text-primary" />
            Como Chegar
          </h2>
          <Card>
            <CardContent className="pt-6 space-y-6">
              {comoChegar.carro && (
                <div>
                  <h4 className="font-semibold text-lg mb-2">De carro:</h4>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {comoChegar.carro}
                  </p>
                </div>
              )}
              {comoChegar.onibus && (
                <div>
                  <h4 className="font-semibold text-lg mb-2">De ônibus:</h4>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {comoChegar.onibus}
                  </p>
                </div>
              )}
              <div>
                <h4 className="font-semibold text-lg mb-2">Horário de funcionamento:</h4>
                <p className="text-muted-foreground">
                  {funcionamento}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2">Ingresso:</h4>
                <p className="text-muted-foreground">
                  {ingressoBase > 0 ? `R$ ${ingressoBase.toFixed(2)}` : "Entrada gratuita"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

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

      {/* Modal de Detalhes da Trilha */}
      <Dialog open={!!trilhaSelecionada} onOpenChange={() => setTrilhaSelecionada(null)}>
        <DialogContent className="sm:max-w-6xl w-[92vw] max-h-[92vh] overflow-y-auto">
          {trilhaSelecionada && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl md:text-3xl font-bold text-primary">
                  {trilhaSelecionada.nome}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* Badges de informação */}
                <div className="flex flex-wrap gap-3">
                  <Badge variant={
                    trilhaSelecionada.dificuldade === "Fácil" ? "default" :
                    trilhaSelecionada.dificuldade === "Difícil" ? "secondary" :
                    "destructive"
                  }>
                    {trilhaSelecionada.dificuldade}
                  </Badge>
                  <Badge variant="outline">
                    <Mountain className="mr-2 h-3 w-3" />
                    {trilhaSelecionada.distancia}
                  </Badge>
                  <Badge variant="outline">
                    Duração: {trilhaSelecionada.duracao}
                  </Badge>
                </div>

                {/* Vídeo */}
                <div className="bg-muted rounded-lg aspect-video flex items-center justify-center">
                  <div className="text-center">
                    <Camera className="h-16 w-16 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">Vídeo da trilha {trilhaSelecionada.nome}</p>
                  </div>
                </div>

                {/* Descrição Completa */}
                {trilhaSelecionada.detalhes && (
                  <>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Sobre a Trilha</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {trilhaSelecionada.detalhes.descricaoCompleta}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">Nível de Dificuldade</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {trilhaSelecionada.detalhes.dificuldadeDetalhes}
                      </p>
                    </div>

                    {trilhaSelecionada.detalhes.recomendacoes && trilhaSelecionada.detalhes.recomendacoes.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Recomendações</h3>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                          {trilhaSelecionada.detalhes.recomendacoes.map((rec, idx) => (
                            <li key={idx}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Galeria de Fotos */}
                    {trilhaSelecionada.detalhes.fotos && trilhaSelecionada.detalhes.fotos.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Galeria de Fotos</h3>
                        <div className="grid grid-cols-3 gap-3">
                          {trilhaSelecionada.detalhes.fotos.map((foto, idx) => (
                            <div key={idx} className="aspect-square rounded-lg overflow-hidden">
                              <img
                                src={foto}
                                alt={`Foto ${idx + 1} de ${trilhaSelecionada.nome}`}
                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-300 cursor-pointer"
                                loading="lazy"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Interações de Comentários, Likes e Fotos (RF04) */}
                    <InteractionsSection
                      destinoNome={trilhaSelecionada.nome}
                      destinoTipo="trail"
                    />
                  </>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

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
