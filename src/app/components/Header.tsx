import { Mountain, LogIn, User, Trees } from "lucide-react";
import { useState, useEffect } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { MobileMenu } from "./MobileMenu";
import { AccessibilityControls } from "./AccessibilityControls";
import { SocialLinks } from "./SocialLinks";
import { MainNavigation } from "./MainNavigation";
import { AuthModal } from "./AuthModal";
import { useAuth } from "../contexts/AuthContext";
import type { PageType } from "../App";
import { ApiService } from "../services/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { TicketPurchaseModal } from "./TicketPurchaseModal";

interface HeaderProps {
  onNavigate: (page: PageType, parkId?: string) => void;
}

export function Header({ onNavigate }: HeaderProps) {
  const { user } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "register">("login");
  const [parks, setParks] = useState<any[]>([]);
  const [selectedCustomPark, setSelectedCustomPark] = useState<any>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [buyModalOpen, setBuyModalOpen] = useState(false);

  useEffect(() => {
    const loadParks = async () => {
      try {
        const data = await ApiService.getParks();
        setParks(data);
      } catch (err) {
        console.error("Erro ao carregar parques na Header:", err);
      }
    };
    loadParks();
  }, []);

  const handleOpenAuth = (tab: "login" | "register" = "login") => {
    setAuthTab(tab);
    setAuthOpen(true);
  };

  const handleSelectPark = (parkId: string) => {
    onNavigate("parque-detalhe", parkId);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 md:px-6 flex h-16 items-center justify-between gap-4">
        <button
          onClick={() => onNavigate("home")}
          className="flex items-center gap-2 shrink-0 hover:opacity-80 transition-opacity"
        >
          <Mountain className="h-6 w-6 text-primary" />
          <h1 className="text-xl md:text-2xl font-semibold text-primary">Terê Verde</h1>
        </button>

        <MainNavigation onNavigate={onNavigate} onOpenAuth={handleOpenAuth} parks={parks} onSelectPark={handleSelectPark} />

        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden xl:flex border-l border-border pl-3">
            <SocialLinks size="md" />
          </div>
          <div className="hidden md:flex">
            <AccessibilityControls />
          </div>
          
          {/* Botão Entrar ou Perfil rápido no topo */}
          {!user ? (
            <button
              onClick={() => handleOpenAuth("login")}
              className="flex items-center gap-1 text-sm font-semibold border px-3 py-1.5 rounded-lg hover:bg-accent transition-colors"
            >
              <LogIn className="h-4 w-4" />
              <span className="hidden sm:inline">Entrar</span>
            </button>
          ) : (
            <button
              onClick={() => onNavigate(user.role === "admin" ? "admin-dashboard" : "user-profile")}
              className="flex items-center gap-1.5 text-sm font-semibold border px-3 py-1.5 rounded-lg hover:bg-accent transition-colors bg-primary/5 border-primary/20 text-primary"
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline truncate max-w-[80px]">{user.name.split(" ")[0]}</span>
            </button>
          )}

          <ThemeToggle />
          <MobileMenu onNavigate={onNavigate} onOpenAuth={handleOpenAuth} parks={parks} onSelectPark={handleSelectPark} />
        </div>
      </div>

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} defaultTab={authTab} />

      {/* --- MODAL DETALHES DE PARQUE CUSTOMIZADO --- */}
      {selectedCustomPark && (
        <Dialog open={detailModalOpen} onOpenChange={setDetailModalOpen}>
          <DialogContent className="sm:max-w-[500px] p-6 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-primary flex items-center gap-2">
                <Trees className="h-6 w-6" />
                {selectedCustomPark.nome}
              </DialogTitle>
              <DialogDescription>
                Informações detalhadas sobre o parque ecológico.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 my-4">
              {selectedCustomPark.imagem && (
                <div className="h-48 rounded-lg overflow-hidden">
                  <img src={selectedCustomPark.imagem} alt={selectedCustomPark.nome} className="w-full h-full object-cover" />
                </div>
              )}

              <p className="text-sm text-muted-foreground leading-relaxed">
                {selectedCustomPark.descricao}
              </p>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border">
                <div>
                  <span className="text-xs text-muted-foreground block">Altitude Máxima</span>
                  <span className="text-sm font-semibold">{selectedCustomPark.altitude || "N/A"}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Área Protegida</span>
                  <span className="text-sm font-semibold">{selectedCustomPark.area || "N/A"}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Funcionamento</span>
                  <span className="text-sm font-semibold">{selectedCustomPark.funcionamento || "N/A"}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Ingresso Base</span>
                  <span className="text-sm font-semibold text-primary">R$ {Number(selectedCustomPark.ingressoBase || 0).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button variant="outline" onClick={() => setDetailModalOpen(false)}>
                Fechar
              </Button>
              <Button onClick={() => {
                setDetailModalOpen(false);
                setBuyModalOpen(true);
              }}>
                Comprar Ingresso
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Modal de compra para o parque selecionado */}
      {selectedCustomPark && (
        <TicketPurchaseModal
          open={buyModalOpen}
          onOpenChange={setBuyModalOpen}
          preselectedType="park"
          preselectedId={selectedCustomPark.id}
          preselectedName={selectedCustomPark.nome}
          preselectedPrice={Number(selectedCustomPark.ingressoBase || 0)}
        />
      )}
    </header>
  );
}
