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

interface ParqueTresPicosPageProps {
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

export function ParqueTresPicosPage({ onNavigate }: ParqueTresPicosPageProps) {
  const [trilhaSelecionada, setTrilhaSelecionada] = useState<Trilha | null>(null);

  const trilhas: Trilha[] = [
    {
      nome: "Pico do Açu",
      dificuldade: "Muito Difícil",
      duracao: "10-12 horas",
      distancia: "16 km",
      descricao: "Trilha técnica para o pico mais alto do parque, com altitude de 2.310m. Exige preparo físico e experiência em montanhismo, oferecendo vistas panorâmicas incomparáveis da região serrana.",
      imagem: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      detalhes: {
        descricaoCompleta: "O Pico do Açu, com 2.310 metros de altitude, é o ponto mais alto do Parque Estadual dos Três Picos. A trilha é extremamente desafiadora e requer experiência prévia em montanhismo e escalada. O percurso inclui trechos técnicos com uso de cordas e equipamentos de segurança, atravessando formações rochosas impressionantes e campos de altitude.",
        dificuldadeDetalhes: "Trilha de nível muito difícil, classificada como técnica. Requer conhecimentos de escalada, uso de equipamentos de segurança (cordas, mosquetões) e excelente condicionamento físico. Não recomendada para iniciantes.",
        recomendacoes: [
          "Obrigatória a presença de guia experiente e certificado",
          "Equipamentos de escalada e segurança são essenciais",
          "Preparo físico específico com antecedência de 6 meses",
          "Autorização prévia do INEA necessária",
          "Partir antes do amanhecer (recomendado às 4h)",
          "Condições climáticas devem ser perfeitas - sem previsão de chuva"
        ],
        fotos: [
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600",
          "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600",
          "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=600"
        ]
      }
    },
    {
      nome: "Pedra da Cabeça do Dragão",
      dificuldade: "Difícil",
      duracao: "6-8 horas",
      distancia: "10 km",
      descricao: "Formação rochosa com vista espetacular. A trilha passa por mata densa e trechos rochosos, culminando em um dos mirantes mais impressionantes do parque com vista 360°.",
      imagem: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=800",
      detalhes: {
        descricaoCompleta: "A Pedra da Cabeça do Dragão é uma formação rochosa única que se destaca na paisagem. A trilha oferece uma combinação perfeita de mata atlântica preservada e trechos rochosos desafiadores. O mirante no topo proporciona vista 360° de toda a região, incluindo outros picos da Serra dos Órgãos.",
        dificuldadeDetalhes: "Trilha de nível difícil com trechos íngremes e passagens rochosas que exigem uso das mãos. Boa experiência em trilhas de montanha é recomendada.",
        recomendacoes: [
          "Guia local é altamente recomendado",
          "Calçado apropriado com excelente aderência",
          "Luvas para proteção nas passagens rochosas",
          "Mínimo de 2,5 litros de água por pessoa",
          "Evitar em dias de chuva - pedras ficam escorregadias",
          "Começar cedo para evitar o sol forte"
        ],
        fotos: [
          "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=600",
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600",
          "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600"
        ]
      }
    },
    {
      nome: "Cachoeira do Salomão",
      dificuldade: "Moderado",
      duracao: "4 horas",
      distancia: "6 km",
      descricao: "Trilha até cachoeira com piscina natural. Percurso moderado por mata atlântica preservada, culminando em queda d'água de 80 metros com área para banho.",
      imagem: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800",
      detalhes: {
        descricaoCompleta: "A Cachoeira do Salomão é uma das mais impressionantes do Parque Estadual dos Três Picos. Com 80 metros de altura, forma um poço profundo ideal para banho. A trilha atravessa mata atlântica bem preservada, com diversos pontos de observação da fauna e flora locais.",
        dificuldadeDetalhes: "Trilha de nível moderado com alguns trechos de subida. Caminho bem marcado, mas com pequenas travessias de riachos e trechos úmidos que exigem atenção.",
        recomendacoes: [
          "Levar roupa de banho, toalha e roupa extra",
          "Calçado que possa molhar (papete de trekking ideal)",
          "Saco impermeável para proteger pertences",
          "Repelente natural e protetor solar",
          "Não pular das pedras próximas à cachoeira",
          "Respeitar sinalização de segurança"
        ],
        fotos: [
          "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600",
          "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=600",
          "https://images.unsplash.com/photo-1520218508822-998633d997e6?w=600"
        ]
      }
    }
  ];

  const cachoeiras = [
    { nome: "Cachoeira do Salomão", altura: "80m", descricao: "Queda d'água impressionante com piscina natural" },
    { nome: "Cachoeira da Grama", altura: "35m", descricao: "Cachoeira de fácil acesso em meio à vegetação nativa" },
    { nome: "Poço do Marimbondo", altura: "15m", descricao: "Piscina natural cristalina cercada por pedras" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header onNavigate={onNavigate} />

      {/* Hero Banner */}
      <div className="relative h-[70vh] bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920')" }}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-background"></div>
        <div className="relative container mx-auto px-4 md:px-6 h-full flex flex-col justify-center items-center text-center">
          <FadeIn>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
              Parque Estadual dos Três Picos
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl drop-shadow-md">
              A maior unidade de conservação integral do Estado do Rio de Janeiro
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
                  O Parque Estadual dos Três Picos é a maior unidade de conservação integral do Estado do Rio de Janeiro,
                  criado em 2002. O parque protege importante área de Mata Atlântica, com altitude variando de 300m a
                  2.310m no Pico do Açu.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  Com paisagens deslumbrantes, abriga nascentes de rios importantes, cachoeiras espetaculares e
                  uma biodiversidade única da Serra dos Órgãos.
                </p>
                <div className="flex flex-wrap gap-3 mt-6">
                  <Badge variant="secondary" className="text-sm px-3 py-1">
                    <Mountain className="mr-2 h-3 w-3" />
                    Altitude: 2.310m
                  </Badge>
                  <Badge variant="secondary" className="text-sm px-3 py-1">
                    <MapPin className="mr-2 h-3 w-3" />
                    Área: 46.350 hectares
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
              "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
              "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=400",
              "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400",
              "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400",
              "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400",
              "https://images.unsplash.com/photo-1511497584788-876760111969?w=400",
              "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=400",
              "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400"
            ].map((img, index) => (
              <FadeIn key={index} delay={index * 0.05}>
                <div className="aspect-square rounded-lg overflow-hidden">
                  <img
                    src={img}
                    alt={`Foto ${index + 1} do Parque Três Picos`}
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
                <h4 className="font-semibold text-lg mb-2">De carro saindo do Rio de Janeiro:</h4>
                <p className="text-muted-foreground">
                  Pela RJ-116, sentido Nova Friburgo/Cachoeiras de Macacu. Acesso principal pela Estrada RJ-116,
                  km 57. Distância aproximada: 100 km (2h de viagem).
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2">De Teresópolis:</h4>
                <p className="text-muted-foreground">
                  Seguir pela RJ-130 até Cachoeiras de Macacu, depois RJ-116. Aproximadamente 50 km (1h15).
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2">Importante:</h4>
                <p className="text-muted-foreground">
                  Visitação requer autorização prévia do INEA. Contato obrigatório com a administração do parque
                  para trilhas técnicas. Recomenda-se ir com guia especializado.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2">Ingresso:</h4>
                <p className="text-muted-foreground">
                  Gratuito, mas requer agendamento prévio pelo site do INEA.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

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
                    trilhaSelecionada.dificuldade === "Moderado" ? "secondary" :
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

                    <div>
                      <h3 className="text-lg font-semibold mb-2">Recomendações</h3>
                      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        {trilhaSelecionada.detalhes.recomendacoes.map((rec, idx) => (
                          <li key={idx}>{rec}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Galeria de Fotos */}
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
