import { Header } from "../Header";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { MapPin, Phone, ShieldAlert, Award, Compass, Eye, Heart } from "lucide-react";
import { FadeIn, SlideIn, ScaleIn } from "../AnimatedText";
import { SocialLinks } from "../SocialLinks";
import type { PageType } from "../../App";

interface SobreCidadePageProps {
  onNavigate: (page: PageType) => void;
}

export function SobreCidadePage({ onNavigate }: SobreCidadePageProps) {
  const servicosUteis = [
    {
      categoria: "Saúde & Hospitais",
      nome: "Hospital das Clínicas de Teresópolis (HCTCO)",
      endereco: "Av. Delfim Moreira, 2011 - Vale do Paraíso",
      telefone: "(21) 2741-5000",
      emergencia: "192 (SAMU)"
    },
    {
      categoria: "Segurança & Emergência",
      nome: "30º Batalhão da Polícia Militar",
      endereco: "Rua Tenente Luiz Meirelles, s/n - Bom Retiro",
      telefone: "(21) 2742-7000",
      emergencia: "190 (Polícia Militar) / 193 (Bombeiros)"
    },
    {
      categoria: "Bancos & Câmbio",
      nome: "Agências do Centro (Banco do Brasil, Itaú, Bradesco)",
      endereco: "Av. Feliciano Sodré - Várzea",
      telefone: "Atendimento comercial local",
      emergencia: "Disponível caixas 24 horas no Centro"
    },
    {
      categoria: "Turismo & Informações",
      nome: "Centro de Atendimento ao Turista (CAT Soberbo)",
      endereco: "Av. Rotariana, s/n (Mirante do Soberbo)",
      telefone: "(21) 2742-3352 - Ramal 204",
      emergencia: "Atendimento Diário: 09h às 17h"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header onNavigate={onNavigate} />

      {/* Hero Cover */}
      <div className="relative h-[40vh] bg-cover bg-center flex items-center justify-center text-center" 
           style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920')" }}>
        <div className="absolute inset-0 bg-black/65"></div>
        <div className="relative z-10 container mx-auto px-4 text-white">
          <FadeIn>
            <h1 className="text-3xl md:text-5xl font-bold mb-3 flex items-center justify-center gap-2">
              ⛰️ Conheça Teresópolis
            </h1>
            <p className="text-sm md:text-lg max-w-xl mx-auto opacity-95">
              Capital Nacional do Montanhismo. Uma joia ecológica encravada no topo da Serra dos Órgãos fluminense.
            </p>
          </FadeIn>
        </div>
      </div>

      {/* História da Cidade */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <SlideIn>
            <h2 className="text-3xl font-bold mb-6 text-primary flex items-center gap-2 border-b pb-3">
              📚 Breve História de Teresópolis
            </h2>
            
            <div className="space-y-6 text-muted-foreground leading-relaxed text-base">
              <p>
                Fundada formalmente em 1891, a cidade deve seu nome a uma homenagem direta à imperatriz **Dona Teresa Cristina**, esposa de Dom Pedro II. A Família Imperial brasileira costumava subir a serra para desfrutar do clima agradável e das paisagens espetaculares durante os quentes verões fluminenses.
              </p>
              <p>
                Com o passar das décadas, Teresópolis tornou-se mundialmente famosa como o berço do montanhismo nacional, impulsionada pelo icônico pico **Dedo de Deus**, conquistado pela primeira vez em 1912. Desde então, montanhistas e escaladores de todos os continentes visitam a região serrana para testar seus limites em paredões rochosos históricos e trilhas exuberantes.
              </p>
              <p>
                Hoje, além das exuberantes florestas e reservas da biosfera, a cidade se destaca pela alta gastronomia serrana, produção de cervejas artesanais premiadas, agricultura familiar orgânica de ponta e infraestrutura aconchegante para receber casais, famílias e aventureiros de fim de semana.
              </p>
            </div>
          </SlideIn>
        </div>
      </section>

      {/* Atrações Rápidas (Cards de Parques) */}
      <section className="py-12 bg-muted/30 border-t border-b">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Nossos Três Grandes Parques</h2>
            <p className="text-muted-foreground text-sm mt-2">Visite nossas reservas naturais exuberantes</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                nome: "Serra dos Órgãos",
                desc: "Parnaso. Ideal para montanhismo de alto nível, Pedra do Sino e a Travessia clássica.",
                page: "parque-nacional"
              },
              {
                nome: "Três Picos",
                desc: "O maior parque estadual do RJ. Vales deslumbrantes e a famosa Cabeça de Peixe.",
                page: "parque-tres-picos"
              },
              {
                nome: "Parque Municipal",
                desc: "Caminhadas em família leves, rapel e vistas deslumbrantes da Pedra da Tartaruga.",
                page: "parque-municipal"
              }
            ].map((p, i) => (
              <ScaleIn key={p.nome} delay={i * 0.1}>
                <Card className="hover:shadow-md transition-shadow text-center p-6 flex flex-col justify-between h-full border-border">
                  <div>
                    <h3 className="text-lg font-bold text-primary mb-2">{p.nome}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">{p.desc}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onNavigate(p.page as PageType)}
                    className="w-full font-semibold cursor-pointer"
                  >
                    Ver Parque
                  </Button>
                </Card>
              </ScaleIn>
            ))}
          </div>
        </div>
      </section>

      {/* Telefones e Serviços Úteis */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <SlideIn>
            <h2 className="text-3xl font-bold mb-3 text-primary flex items-center gap-2">
              🚨 Guia de Utilidade Pública
            </h2>
            <p className="text-muted-foreground text-sm mb-8">
              Guarde os contatos e endereços dos serviços essenciais municipais de suporte e emergência.
            </p>

            <div className="space-y-6">
              {servicosUteis.map((s, idx) => (
                <div key={idx} className="p-5 rounded-lg border border-border bg-background hover:shadow-sm transition-all flex flex-col md:flex-row justify-between gap-4">
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded">
                      {s.categoria}
                    </span>
                    <h4 className="text-lg font-bold text-foreground mt-1">
                      {s.nome}
                    </h4>
                    <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
                      {s.endereco}
                    </p>
                  </div>

                  <div className="flex flex-col justify-center items-start md:items-end gap-1.5 border-t md:border-t-0 pt-3 md:pt-0 border-border">
                    <span className="text-sm text-muted-foreground flex items-center gap-1.5 font-medium">
                      <Phone className="h-4 w-4 text-primary" />
                      {s.telefone}
                    </span>
                    <span className="text-sm text-red-500 font-bold flex items-center gap-1.5">
                      <ShieldAlert className="h-4 w-4 text-red-500 animate-bounce" />
                      {s.emergencia}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </SlideIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 border-t border-border py-8 mt-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-semibold">Terê Verde - Teresópolis</span>
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
