import { useState } from "react";
import { ApiService } from "../../services/api";
import { Ticket } from "../../types";
import { Header } from "../Header";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { toast } from "sonner";
import { Search, CheckCircle, XCircle, QrCode, CreditCard, ShieldCheck } from "lucide-react";
import confetti from "canvas-confetti";
import type { PageType } from "../../App";

interface ReceptionPageProps {
  onNavigate: (page: PageType) => void;
}

export function ReceptionPage({ onNavigate }: ReceptionPageProps) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Resultado do Check-in
  const [checkedTicket, setCheckedTicket] = useState<Ticket | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleCpfFormatting = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    // Permite buscar por texto do QR Code também, então só formata se parecer com CPF (só dígitos)
    const digitsOnly = val.replace(/\D/g, "");
    
    if (digitsOnly.length > 0 && digitsOnly.length === val.length) {
      if (digitsOnly.length <= 11) {
        val = digitsOnly
          .replace(/(\d{3})(\d)/, "$1.$2")
          .replace(/(\d{3})(\d)/, "$1.$2")
          .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
      }
    }
    setQuery(val);
  };

  const handleCheckInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      toast.error("Por favor, informe o QR Code ou o CPF.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setCheckedTicket(null);

    try {
      const ticket = await ApiService.checkInTicket(query.trim());
      setCheckedTicket(ticket);
      toast.success("Check-in confirmado com sucesso!");
      
      // Efeito de confetes premium para celebrar o check-in bem-sucedido!
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 }
      });
      
      setQuery(""); // limpa a busca
    } catch (err: any) {
      setErrorMsg(err.message || "Ocorreu um erro no check-in.");
      toast.error(err.message || "Check-in falhou.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onNavigate={onNavigate} />

      <main className="container mx-auto px-4 py-8 md:py-16 max-w-3xl">
        <div className="text-center mb-8">
          <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/10 text-sm py-1.5 px-3 mb-3 gap-1.5 font-semibold">
            <ShieldCheck className="h-4.5 w-4.5" />
            Modo Recepção (Tablet)
          </Badge>
          <h2 className="text-3xl font-extrabold tracking-tight">Controle de Acesso de Visitantes</h2>
          <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
            Digite o CPF do titular ou escaneie o código do ingresso (QR Code) para realizar a liberação rápida.
          </p>
        </div>

        <div className="space-y-6">
          {/* Caixa de Busca Principal */}
          <Card className="shadow-xl border-primary/15 overflow-hidden">
            <CardHeader className="bg-primary/5 pb-6">
              <CardTitle className="text-lg flex items-center gap-2">
                <Search className="h-5 w-5 text-primary" />
                Buscar Ingresso Ativo
              </CardTitle>
              <CardDescription>Escaneie ou insira os dados abaixo para validação imediata.</CardDescription>
            </CardHeader>
            <form onSubmit={handleCheckInSubmit}>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reception-query" className="text-base font-semibold">QR Code ou CPF do Visitante</Label>
                  <div className="relative">
                    <QrCode className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="reception-query"
                      placeholder="Ex: TVERDE-E-LUACHEIA-1234 ou 123.456.789-00"
                      value={query}
                      onChange={handleCpfFormatting}
                      className="pl-10 h-12 text-lg font-medium"
                      disabled={loading}
                      autoFocus
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/40 border-t p-4 flex gap-3">
                <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/95 text-base h-12" disabled={loading}>
                  {loading ? "Validando..." : "Realizar Check-in"}
                </Button>
              </CardFooter>
            </form>
          </Card>

          {/* Resultado: Sucesso */}
          {checkedTicket && (
            <Card className="border-green-500/30 bg-green-500/5 shadow-lg overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-300">
              <CardHeader className="flex flex-row items-center gap-3 border-b border-green-500/10 pb-4">
                <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400 shrink-0" />
                <div>
                  <CardTitle className="text-green-800 dark:text-green-400 font-extrabold text-xl">Acesso Permitido!</CardTitle>
                  <CardDescription className="text-green-700/80 dark:text-green-400/80 font-medium">Ingresso validado e check-in concluído com sucesso.</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-6 grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground block text-xs font-semibold uppercase tracking-wider">Visitante</span>
                  <strong className="text-base text-foreground font-bold">{checkedTicket.userName}</strong>
                </div>
                <div>
                  <span className="text-muted-foreground block text-xs font-semibold uppercase tracking-wider">CPF</span>
                  <strong className="text-base text-foreground font-mono font-bold">{checkedTicket.userCpf}</strong>
                </div>
                <div>
                  <span className="text-muted-foreground block text-xs font-semibold uppercase tracking-wider">Atração/Ingresso</span>
                  <strong className="text-base text-primary font-bold">{checkedTicket.itemName}</strong>
                </div>
                <div>
                  <span className="text-muted-foreground block text-xs font-semibold uppercase tracking-wider">Quantidade de Pessoas</span>
                  <strong className="text-base text-foreground font-bold">{checkedTicket.quantidade} {checkedTicket.quantidade > 1 ? "pessoas" : "pessoa"}</strong>
                </div>
                <div className="md:col-span-2 border-t pt-4 mt-2">
                  <span className="text-muted-foreground block text-xs font-semibold uppercase tracking-wider">Código do Ingresso</span>
                  <strong className="text-sm font-mono text-muted-foreground">{checkedTicket.qrCodeUrl}</strong>
                </div>
              </CardContent>
              <CardFooter className="bg-green-500/10 border-t border-green-500/10 py-3 flex justify-between items-center px-6">
                <span className="text-xs text-green-700 dark:text-green-400 font-semibold uppercase">Status do Ticket</span>
                <Badge className="bg-green-600 text-white font-bold uppercase">Utilizado</Badge>
              </CardFooter>
            </Card>
          )}

          {/* Resultado: Erro */}
          {errorMsg && (
            <Card className="border-red-500/30 bg-red-500/5 shadow-lg overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-300">
              <CardHeader className="flex flex-row items-center gap-3 border-b border-red-500/10 pb-4">
                <XCircle className="h-10 w-10 text-red-600 dark:text-red-400 shrink-0" />
                <div>
                  <CardTitle className="text-red-800 dark:text-red-400 font-extrabold text-xl">Acesso Negado!</CardTitle>
                  <CardDescription className="text-red-700/80 dark:text-red-400/80 font-medium">Não foi possível validar este ingresso.</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="p-4 rounded-lg bg-red-500/10 text-red-900 dark:text-red-400 font-medium text-center">
                  {errorMsg}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
