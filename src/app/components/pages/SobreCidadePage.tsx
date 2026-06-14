import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { ApiService } from "../../services/api";
import { Header } from "../Header";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { MapPin, Phone, ShieldAlert, Edit2, Plus, Trash2 } from "lucide-react";
import { FadeIn, SlideIn, ScaleIn } from "../AnimatedText";
import { SocialLinks } from "../SocialLinks";
import { toast } from "sonner";
import type { PageType } from "../../App";

interface SobreCidadePageProps {
  onNavigate: (page: PageType, parkId?: string) => void;
}

interface ServicoUtil {
  categoria: string;
  nome: string;
  endereco: string;
  telefone: string;
  emergencia: string;
}

export function SobreCidadePage({ onNavigate }: SobreCidadePageProps) {
  const { user } = useAuth();

  // History State
  const [title, setTitle] = useState("Breve História de Teresópolis");
  const [paragraphs, setParagraphs] = useState<string[]>([
    "Fundada formalmente em 1891, a cidade deve seu nome a uma homenagem direta à imperatriz Dona Teresa Cristina, esposa de Dom Pedro II. A Família Imperial brasileira costumava subir a serra para desfrutar do clima agradável e das paisagens espetaculares durante os quentes verões fluminenses.",
    "Com o passar das décadas, Teresópolis tornou-se mundialmente famosa como o berço do montanhismo nacional, impulsionada pelo icônico pico Dedo de Deus, conquistado pela primeira vez em 1912. Desde então, montanhistas e escaladores de todos os continentes visitam a região serrana para testar seus limites em paredões rochosos históricos e trilhas exuberantes.",
    "Hoje, além das exuberantes florestas e reservas da biosfera, a cidade se destaca pela alta gastronomia serrana, produção de cervejas artesanais premiadas, agricultura familiar orgânica de ponta e infraestrutura aconchegante para receber casais, famílias e aventureiros de fim de semana."
  ]);

  const [servicosUteis, setServicosUteis] = useState<ServicoUtil[]>([
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
  ]);

  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const [isEditingServices, setIsEditingServices] = useState(false);
  const [editServices, setEditServices] = useState<ServicoUtil[]>([]);

  // Load content from settings DB
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const fetchedTitle = await ApiService.getSetting("city_history_title");
        const fetchedParagraphsStr = await ApiService.getSetting("city_history_paragraphs");
        const fetchedServicesStr = await ApiService.getSetting("city_services");
        
        if (fetchedTitle) setTitle(fetchedTitle);
        if (fetchedParagraphsStr) {
          try {
            setParagraphs(JSON.parse(fetchedParagraphsStr));
          } catch {
            setParagraphs(fetchedParagraphsStr.split("\n\n").filter(Boolean));
          }
        }
        if (fetchedServicesStr) {
          try {
            setServicosUteis(JSON.parse(fetchedServicesStr));
          } catch {
            console.error("Erro ao analisar city_services JSON");
          }
        }
      } catch (err) {
        console.error("Erro ao carregar conteúdo da cidade:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const handleSave = async () => {
    if (!editTitle.trim() || !editContent.trim()) {
      toast.error("Por favor, preencha o título e o conteúdo.");
      return;
    }

    try {
      const parsedParagraphs = editContent
        .split("\n\n")
        .map(p => p.trim())
        .filter(p => p.length > 0);

      await ApiService.updateSetting("city_history_title", editTitle.trim());
      await ApiService.updateSetting("city_history_paragraphs", JSON.stringify(parsedParagraphs));

      setTitle(editTitle.trim());
      setParagraphs(parsedParagraphs);
      setIsEditing(false);
      toast.success("História da cidade atualizada com sucesso!");
    } catch (err) {
      toast.error("Erro ao salvar alterações da história.");
    }
  };

  const handleStartEditServices = () => {
    setEditServices(JSON.parse(JSON.stringify(servicosUteis))); // Cópia profunda
    setIsEditingServices(true);
  };

  const handleServiceChange = (index: number, field: keyof ServicoUtil, value: string) => {
    const updated = [...editServices];
    updated[index] = { ...updated[index], [field]: value };
    setEditServices(updated);
  };

  const handleAddService = () => {
    setEditServices([
      ...editServices,
      {
        categoria: "Nova Categoria",
        nome: "Nome do Serviço",
        endereco: "Endereço do Local",
        telefone: "Contato",
        emergencia: "Emergência"
      }
    ]);
  };

  const handleRemoveService = (index: number) => {
    const updated = editServices.filter((_, idx) => idx !== index);
    setEditServices(updated);
  };

  const handleSaveServices = async () => {
    const invalid = editServices.some(
      s => !s.categoria.trim() || !s.nome.trim() || !s.endereco.trim() || !s.telefone.trim() || !s.emergencia.trim()
    );
    if (invalid) {
      toast.error("Por favor, preencha todos os campos de todos os serviços.");
      return;
    }

    try {
      await ApiService.updateSetting("city_services", JSON.stringify(editServices));
      setServicosUteis(editServices);
      setIsEditingServices(false);
      toast.success("Guia de utilidade pública atualizado com sucesso!");
    } catch (err) {
      toast.error("Erro ao salvar alterações do guia de utilidade.");
    }
  };

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
            <div className="flex justify-between items-center mb-6 border-b pb-3">
              <h2 className="text-2xl md:text-3xl font-bold text-primary flex items-center gap-2">
                📚 {title}
              </h2>
              {user?.role === "admin" && !isEditing && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => {
                    setEditTitle(title);
                    setEditContent(paragraphs.join("\n\n"));
                    setIsEditing(true);
                  }}
                  className="gap-1.5 text-xs font-semibold cursor-pointer"
                >
                  <Edit2 className="h-3.5 w-3.5" /> Editar História
                </Button>
              )}
            </div>
            
            {loading ? (
              <p className="text-sm text-muted-foreground text-center py-6">Carregando informações...</p>
            ) : isEditing ? (
              <div className="space-y-4 bg-muted/20 p-6 rounded-xl border border-border">
                <div className="space-y-1">
                  <Label htmlFor="edit-title">Título da Seção</Label>
                  <Input 
                    id="edit-title" 
                    value={editTitle} 
                    onChange={(e) => setEditTitle(e.target.value)} 
                    className="font-bold text-sm bg-background"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="edit-content">Conteúdo (Separe os parágrafos com duas quebras de linha/Enter)</Label>
                  <Textarea 
                    id="edit-content" 
                    value={editContent} 
                    onChange={(e) => setEditContent(e.target.value)} 
                    rows={10} 
                    className="bg-background text-xs leading-relaxed"
                  />
                </div>
                <div className="flex gap-2 justify-end pt-2">
                  <Button 
                    variant="ghost" 
                    onClick={() => setIsEditing(false)}
                    className="text-xs font-bold cursor-pointer"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleSave} 
                    className="bg-primary hover:bg-primary/95 text-xs font-bold cursor-pointer"
                  >
                    Salvar Alterações
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6 text-muted-foreground leading-relaxed text-sm md:text-base">
                {paragraphs.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>
            )}
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
                    onClick={() => onNavigate("parque-detalhe", p.page)}
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
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-2xl md:text-3xl font-bold text-primary flex items-center gap-2">
                🚨 Guia de Utilidade Pública
              </h2>
              {user?.role === "admin" && !isEditingServices && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handleStartEditServices}
                  className="gap-1.5 text-xs font-semibold cursor-pointer"
                >
                  <Edit2 className="h-3.5 w-3.5" /> Editar Guia
                </Button>
              )}
            </div>
            <p className="text-muted-foreground text-sm mb-8">
              Guarde os contatos e endereços dos serviços essenciais municipais de suporte e emergência.
            </p>

            {loading ? (
              <p className="text-sm text-muted-foreground text-center py-6">Carregando informações...</p>
            ) : isEditingServices ? (
              <div className="space-y-6 bg-muted/20 p-6 rounded-xl border border-border">
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                  {editServices.map((s, idx) => (
                    <div key={idx} className="p-4 border rounded-lg bg-background space-y-3 relative">
                      <button 
                        type="button" 
                        onClick={() => handleRemoveService(idx)}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-500/10 p-1.5 rounded transition-all border-none cursor-pointer"
                        title="Remover Serviço"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4 md:pt-0">
                        <div className="space-y-1">
                          <Label className="text-xs">Categoria</Label>
                          <Input 
                            value={s.categoria} 
                            onChange={(e) => handleServiceChange(idx, "categoria", e.target.value)}
                            className="text-xs h-8 bg-background"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Nome do Serviço</Label>
                          <Input 
                            value={s.nome} 
                            onChange={(e) => handleServiceChange(idx, "nome", e.target.value)}
                            className="text-xs h-8 bg-background"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs">Endereço</Label>
                        <Input 
                          value={s.endereco} 
                          onChange={(e) => handleServiceChange(idx, "endereco", e.target.value)}
                          className="text-xs h-8 bg-background"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs">Telefone comercial / de contato</Label>
                          <Input 
                            value={s.telefone} 
                            onChange={(e) => handleServiceChange(idx, "telefone", e.target.value)}
                            className="text-xs h-8 bg-background"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-red-500 font-bold">Número de Emergência</Label>
                          <Input 
                            value={s.emergencia} 
                            onChange={(e) => handleServiceChange(idx, "emergencia", e.target.value)}
                            className="text-xs h-8 text-red-500 font-semibold bg-background"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center border-t pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={handleAddService}
                    className="gap-1.5 text-xs font-semibold cursor-pointer"
                  >
                    <Plus className="h-4 w-4" /> Adicionar Novo Serviço
                  </Button>

                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      onClick={() => setIsEditingServices(false)}
                      className="text-xs font-bold cursor-pointer"
                    >
                      Cancelar
                    </Button>
                    <Button 
                      onClick={handleSaveServices} 
                      className="bg-primary hover:bg-primary/95 text-xs font-bold cursor-pointer"
                    >
                      Salvar Guia
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {servicosUteis.map((s, idx) => (
                  <div key={idx} className="p-5 rounded-lg border border-border bg-background hover:shadow-sm transition-all flex flex-col md:flex-row justify-between gap-4">
                    <div className="space-y-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded">
                        {s.categoria}
                      </span>
                      <h4 className="text-lg font-bold text-foreground mt-1 font-semibold">
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
            )}
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
