import { MapPin, Mountain, Droplets, Camera } from "lucide-react";
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

interface ParqueDetalhePageProps {
  parkId: string;
  onNavigate: (page: PageType, parkId?: string) => void;
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

export function ParqueDetalhePage({ parkId, onNavigate }: ParqueDetalhePageProps) {
  const [parkData, setParkData] = useState<Park | null>(null);
  const [trilhaSelecionada, setTrilhaSelecionada] = useState<Trilha | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    ApiService.getParks()
      .then((parks) => {
        const found = parks.find((p) => p.id === parkId || p.nome.toLowerCase().includes(parkId.toLowerCase()));
        if (found) {
          setParkData(found);
        }
      })
      .catch((err) => console.error("Erro ao carregar dados do parque:", err))
      .finally(() => setLoading(false));
  }, [parkId]);

  // Fallbacks para o Parque Nacional
  const nacionalTrilhas: Trilha[] = [
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
          "Protetor solar e repelente",
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

  const nacionalCachoeiras = [
    { nome: "Véu da Noiva", altura: "40m", descricao: "Cachoeira com piscina natural e fácil acesso" },
    { nome: "Cachoeira Itaporani", altura: "60m", descricao: "Queda d'água impressionante em meio à mata fechada" },
    { nome: "Poço do Castelo", altura: "25m", descricao: "Piscina natural cristalina ideal para banho" }
  ];

  const nacionalGaleriaFotos = [
    "https://images.unsplash.com/photo-1682347812423-45911f8e6ef1?w=400",
    "https://images.unsplash.com/photo-1604991274937-b93f0c37f5e9?w=400",
    "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
    "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=400",
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400",
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400"
  ];

  const nacionalComoChegar = {
    carro: "Pela BR-116, sentido Teresópolis. A entrada principal fica na Av. Rotariana, s/n, Soberbo. Distância aproximada: 90 km (1h30 de viagem).",
    onibus: "A partir da Rodoviária Novo Rio, diversas empresas operam a linha Rio-Teresópolis. Do centro de Teresópolis, táxi ou aplicativo até a entrada do parque (aproximadamente 15 minutos)."
  };

  // Fallbacks para Três Picos
  const tresPicosTrilhas: Trilha[] = [
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

  const tresPicosCachoeiras = [
    { nome: "Cachoeira do Salomão", altura: "80m", descricao: "Queda d'água impressionante com piscina natural" },
    { nome: "Cachoeira da Grama", altura: "35m", descricao: "Cachoeira de fácil acesso em meio à vegetação nativa" },
    { nome: "Poço do Marimbondo", altura: "15m", descricao: "Piscina natural cristalina cercada por pedras" }
  ];

  const tresPicosGaleriaFotos = [
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
    "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=400",
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400",
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400",
    "https://images.unsplash.com/photo-1511497584788-876760111969?w=400",
    "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=400",
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400"
  ];

  const tresPicosComoChegar = {
    carro: "Pela RJ-116, sentido Nova Friburgo/Cachoeiras de Macacu. Acesso principal pela Estrada RJ-116, km 57. Distância aproximada: 100 km (2h de viagem).",
    onibus: "Seguir pela RJ-130 até Cachoeiras de Macacu, depois RJ-116. Aproximadamente 50 km (1h15)."
  };

  // Fallbacks para Parque Municipal
  const municipalTrilhas: Trilha[] = [
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
      descricao: "Formação rochosa com mirante natural. A trilha serpenteia por mata atlântica bem preservada até uma formação rochosa que lembra uma tartaruga, com vista privilegiada del vale.",
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

  const municipalCachoeiras = [
    { nome: "Cachoeira do Imbuí", altura: "30m", descricao: "Cachoeira com acesso fácil e piscina natural" },
    { nome: "Cascata dos Fetos", altura: "12m", descricao: "Pequena cascata cercada por samambaias" },
    { nome: "Poço Verde", altura: "8m", descricao: "Piscina natural com água cristalina e verde" }
  ];

  const municipalGaleriaFotos = [
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400",
    "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=400",
    "https://images.unsplash.com/photo-1511497584788-876760111969?w=400",
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400",
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400",
    "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=400",
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400",
    "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400"
  ];

  const municipalComoChegar = {
    carro: "Do centro de Teresópolis, seguir pela Av. Lúcio Meira em direção a Nova Friburgo. Estrada Teresópolis-Friburgo (RJ-130), km 6, Albuquerque. Estacionamento gratuito disponível na entrada do parque.",
    onibus: "Ônibus da linha \"Albuquerque\" sai do terminal rodoviário de Teresópolis. Descer no km 6 da RJ-130."
  };

  // Carregar dados dependendo do parkId recebido
  const isNacional = parkId === "parque-nacional";
  const isTresPicos = parkId === "parque-tres-picos";
  const isMunicipal = parkId === "parque-municipal" || parkId === "parque-montanhas";

  const defaultTrilhas = isNacional ? nacionalTrilhas : isTresPicos ? tresPicosTrilhas : isMunicipal ? municipalTrilhas : [];
  const defaultCachoeiras = isNacional ? nacionalCachoeiras : isTresPicos ? tresPicosCachoeiras : isMunicipal ? municipalCachoeiras : [];
  const defaultGaleriaFotos = isNacional ? nacionalGaleriaFotos : isTresPicos ? tresPicosGaleriaFotos : isMunicipal ? municipalGaleriaFotos : [];
  const defaultComoChegar = isNacional ? nacionalComoChegar : isTresPicos ? tresPicosComoChegar : isMunicipal ? municipalComoChegar : { carro: "", onibus: "" };

  const defaultNome = isNacional 
    ? "Parque Nacional da Serra dos Órgãos" 
    : isTresPicos 
    ? "Parque Estadual dos Três Picos" 
    : isMunicipal 
    ? "Parque Natural Municipal Montanhas de Teresópolis" 
    : "Parque Ecológico";

  const defaultDescricao = isNacional
    ? "O Parque Nacional da Serra dos Órgãos é uma das unidades de conservação mais importantes do Brasil, criado em 1939. Localizado na Serra do Mar, abriga a famosa Pedra do Sino (2.263m), o Dedo de Deus e outras formações rochosas icônicas.\n\nO parque preserva importantes remanescentes de Mata Atlântica, com rica biodiversidade incluindo espécies endêmicas e ameaçadas de extinção."
    : isTresPicos
    ? "O Parque Estadual dos Três Picos é a maior unidade de conservação integral do Estado do Rio de Janeiro, criado em 2002. O parque protege importante área de Mata Atlântica, com altitude variando de 300m a 2.310m no Pico do Açu.\n\nCom paisagens deslumbrantes, abriga nascentes de rios importantes, cachoeiras espetaculares e uma biodiversidade única da Serra dos Órgãos."
    : isMunicipal
    ? "O Parque Natural Municipal Montanhas de Teresópolis, criado em 2009, é uma unidade de conservação municipal que protege importantes áreas de Mata Atlântica no entorno da cidade. Com trilhas bem sinalizadas e infraestrutura preparada para visitação.\n\nIdeal para famílias, idosos e iniciantes, oferece trilhas leves, cachoeiras acessíveis, áreas de piquenique e mirantes com vistas espetaculares."
    : "Descrição detalhada deste lindo parque de Teresópolis.";

  const defaultAltitude = isNacional ? "2.263m" : isTresPicos ? "2.310m" : isMunicipal ? "900-1.200m" : "N/A";
  const defaultArea = isNacional ? "20.024 hectares" : isTresPicos ? "46.350 hectares" : isMunicipal ? "3.600 hectares" : "N/A";
  const defaultFuncionamento = isNacional ? "Terça a Domingo, 8h às 17h" : isTresPicos ? "Todos os dias, 8h às 17h" : isMunicipal ? "Todos os dias, das 8h às 17h. Última entrada às 16h." : "Terça a Domingo, das 8h às 17h";
  const defaultIngressoBase = isNacional ? 35.00 : isTresPicos ? 0.00 : isMunicipal ? 10.00 : 0.00;

  const nome = parkData?.nome || defaultNome;
  const descricao = parkData?.descricao || defaultDescricao;
  const altitude = parkData?.altitude || defaultAltitude;
  const area = parkData?.area || defaultArea;
  const funcionamento = parkData?.funcionamento || defaultFuncionamento;
  const ingressoBase = parkData?.ingressoBase !== undefined ? parkData.ingressoBase : defaultIngressoBase;

  const videoUrl = getEmbedUrl(parkData?.video || "https://www.youtube.com/embed/dQw4w9WgXcQ");
  const trilhas = (parkData?.principaisTrilhas && parkData.principaisTrilhas.length > 0) ? parkData.principaisTrilhas : defaultTrilhas;
  const cachoeiras = (parkData?.cachoeiras && parkData.cachoeiras.length > 0) ? parkData.cachoeiras : defaultCachoeiras;
  const galeriaFotos = (parkData?.galeriaFotos && parkData.galeriaFotos.length > 0) ? parkData.galeriaFotos : defaultGaleriaFotos;
  const comoChegar = parkData?.comoChegar || defaultComoChegar;

  const descricaoParagrafos = descricao.split("\n\n");

  if (loading && !parkData) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header onNavigate={onNavigate} />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-lg text-muted-foreground animate-pulse">Carregando informações do parque...</p>
        </div>
      </div>
    );
  }

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
              Descubra a fauna, flora e belezas de Teresópolis
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
                    <p className="text-muted-foreground">Sem vídeo cadastrado</p>
                  </div>
                </div>
              )}
            </SlideIn>
          </div>
        </div>
      </section>

      {/* Exibição das Trilhas */}
      {trilhas.length > 0 && (
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
      )}

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
                      alt={`Foto ${index + 1} do Parque`}
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
              {comoChegar?.carro && (
                <div>
                  <h4 className="font-semibold text-lg mb-2">De carro:</h4>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {comoChegar.carro}
                  </p>
                </div>
              )}
              {comoChegar?.onibus && (
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

                {/* Imagem ou Vídeo da Trilha */}
                <div className="rounded-lg overflow-hidden h-72">
                  <img
                    src={trilhaSelecionada.imagem || "https://images.unsplash.com/photo-1682347812423-45911f8e6ef1?w=800"}
                    alt={trilhaSelecionada.nome}
                    className="w-full h-full object-cover"
                  />
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

                    {/* Interações de Comentários, Likes e Fotos */}
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
