import { useState } from "react";
import { Header } from "../Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { Mail, Phone, MessageSquare, Compass, Send } from "lucide-react";
import { FadeIn, SlideIn } from "../AnimatedText";
import { SocialLinks } from "../SocialLinks";
import type { PageType } from "../../App";

interface FaleConoscoPageProps {
  onNavigate: (page: PageType) => void;
}

export function FaleConoscoPage({ onNavigate }: FaleConoscoPageProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    // Simulate sending message to backing support
    setTimeout(() => {
      setSending(false);
      toast.success("Mensagem enviada com sucesso! Nossa equipe entrará em contato em breve.");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    }, 1000);
  };

  const handleWhatsApp = () => {
    // Open whatsapp simulation
    window.open("https://wa.me/5521999999999?text=Olá,%20gostaria%20de%20tirar%20uma%20dúvida%20sobre%20as%20trilhas%20de%20Teresópolis!", "_blank");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onNavigate={onNavigate} />

      {/* Hero Header */}
      <div className="relative h-[30vh] bg-cover bg-center flex items-center justify-center text-center" 
           style={{ backgroundImage: "url('https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920')" }}>
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 container mx-auto px-4 text-white">
          <FadeIn>
            <h1 className="text-3xl md:text-5xl font-bold mb-3 flex items-center justify-center gap-2">
              <MessageSquare className="h-8 w-8 md:h-12 md:w-12 text-primary" />
              Fale Conosco
            </h1>
            <p className="text-sm md:text-lg max-w-xl mx-auto opacity-95">
              Dúvidas sobre reservas, sugestões de trilhas ou suporte comercial? Estamos à sua inteira disposição.
            </p>
          </FadeIn>
        </div>
      </div>

      {/* Seção Fale Conosco */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
            
            {/* Info Lateral */}
            <SlideIn>
              <div className="bg-primary/5 rounded-xl border border-primary/10 p-8 flex flex-col justify-between h-full space-y-6">
                <div className="space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">
                    Canais de Atendimento
                  </span>
                  <h3 className="text-2xl font-bold text-foreground">
                    Suporte Terê Verde
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Você pode nos enviar um e-mail preenchendo o formulário ao lado ou iniciar um bate-papo expresso diretamente em nosso WhatsApp de atendimento oficial ao turista.
                  </p>
                </div>

                {/* Blocos de contato */}
                <div className="space-y-4 font-medium text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">E-mail para suporte</p>
                      <p className="text-foreground">contato@tereverde.com</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Telefone comercial</p>
                      <p className="text-foreground">(21) 2742-9988</p>
                    </div>
                  </div>
                </div>

                {/* WhatsApp Button */}
                <Button 
                  onClick={handleWhatsApp} 
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold w-full py-6 cursor-pointer"
                >
                  <MessageSquare className="h-5 w-5 mr-2 animate-pulse" />
                  Chamar no WhatsApp
                </Button>
              </div>
            </SlideIn>

            {/* Formulário de Contato */}
            <SlideIn delay={0.1}>
              <Card className="border border-border/80 shadow-md">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Enviar Mensagem</CardTitle>
                  <CardDescription>Preencha os campos abaixo e responderemos em até 24 horas.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <Label htmlFor="cont-name">Nome Completo</Label>
                      <Input
                        id="cont-name"
                        placeholder="João Silva"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        disabled={sending}
                      />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="cont-email">E-mail</Label>
                      <Input
                        id="cont-email"
                        type="email"
                        placeholder="joao@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={sending}
                      />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="cont-sub">Assunto</Label>
                      <Input
                        id="cont-sub"
                        placeholder="Dúvidas sobre o QR Code / Parques"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        required
                        disabled={sending}
                      />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="cont-msg">Sua Mensagem</Label>
                      <Textarea
                        id="cont-msg"
                        placeholder="Escreva detalhadamente sua dúvida ou sugestão..."
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        disabled={sending}
                      />
                    </div>

                    <Button type="submit" className="w-full bg-primary hover:bg-primary/95 font-semibold cursor-pointer" disabled={sending}>
                      <Send className="h-4 w-4 mr-2" />
                      {sending ? "Enviando..." : "Enviar Mensagem"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </SlideIn>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 border-t border-border py-8 mt-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Compass className="h-5 w-5 text-primary" />
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
