import { Menu, Minus, Plus, Type, ChevronRight, Home, Trees, Compass, MapPin, Ticket, ShieldCheck, User, MessageCircle, Mountain, LogIn, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Separator } from "./ui/separator";
import { SocialLinks } from "./SocialLinks";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { useAuth } from "../contexts/AuthContext";
import type { PageType } from "../App";

interface MobileMenuProps {
  onNavigate: (page: PageType) => void;
  onOpenAuth: (tab: "login" | "register") => void;
  parks?: any[];
  onSelectPark?: (parkId: string) => void;
}

export function MobileMenu({ onNavigate, onOpenAuth, parks = [], onSelectPark }: MobileMenuProps) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [fontSize, setFontSize] = useState(100);
  const [parquesOpen, setParquesOpen] = useState(false);
  const [trilhasOpen, setTrilhasOpen] = useState(false);
  const [cidadeOpen, setCidadeOpen] = useState(false);
  
  const customParks = parks.filter(
    (p: any) => p.id !== "parque-nacional" && p.id !== "parque-tres-picos" && p.id !== "parque-municipal"
  );

  useEffect(() => {
    const savedFontSize = localStorage.getItem("fontSize");
    if (savedFontSize) {
      setFontSize(parseInt(savedFontSize));
    }
  }, []);

  const increaseFontSize = () => {
    if (fontSize < 130) {
      const newSize = fontSize + 10;
      setFontSize(newSize);
      document.documentElement.style.fontSize = `${newSize}%`;
      localStorage.setItem("fontSize", newSize.toString());
    }
  };

  const decreaseFontSize = () => {
    if (fontSize > 70) {
      const newSize = fontSize - 10;
      setFontSize(newSize);
      document.documentElement.style.fontSize = `${newSize}%`;
      localStorage.setItem("fontSize", newSize.toString());
    }
  };

  const resetFontSize = () => {
    setFontSize(100);
    document.documentElement.style.fontSize = "100%";
    localStorage.setItem("fontSize", "100");
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[280px] sm:w-[350px]">
        <SheetHeader>
          <SheetTitle>Menu de Navegação</SheetTitle>
          <SheetDescription>
            Explore Teresópolis e suas belezas naturais
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 md:hidden">
          <p className="text-sm font-medium mb-3">Tamanho do Texto</p>
          <div className="flex items-center justify-center gap-1 p-3 bg-primary/10 rounded-lg">
            <Button
              variant="ghost"
              onClick={decreaseFontSize}
              className="h-12 px-4 hover:bg-primary/20 font-bold text-xl"
              disabled={fontSize <= 70}
            >
              -
            </Button>

            <Button
              variant="ghost"
              onClick={resetFontSize}
              className="h-12 px-6 hover:bg-primary/20 font-bold text-2xl"
            >
              A
            </Button>

            <Button
              variant="ghost"
              onClick={increaseFontSize}
              className="h-12 px-4 hover:bg-primary/20 font-bold text-xl"
              disabled={fontSize >= 130}
            >
              +
            </Button>
          </div>
          <p className="text-xs text-center text-muted-foreground mt-2">
            Tamanho atual: {fontSize}%
          </p>
          <Separator className="my-4" />
        </div>

        <nav className="flex flex-col gap-2 mt-6">
          <a
            href="#"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 text-base py-3 px-4 rounded-md hover:bg-accent transition-colors"
          >
            <Home className="h-4 w-4" />
            Home
          </a>

          <Collapsible open={parquesOpen} onOpenChange={setParquesOpen}>
            <CollapsibleTrigger className="flex items-center justify-between w-full text-base py-3 px-4 rounded-md hover:bg-accent transition-colors">
              <span className="flex items-center gap-2">
                <Trees className="h-4 w-4" />
                Parques
              </span>
              <ChevronRight className={`h-5 w-5 transition-transform ${parquesOpen ? "rotate-90" : ""}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-4 space-y-1 mt-1">
              <button
                onClick={() => {
                  if (onSelectPark) onSelectPark("parque-nacional");
                  else onNavigate("parque-nacional");
                  setOpen(false);
                }}
                className="flex items-center gap-2 py-2 px-4 text-sm rounded-md hover:bg-accent transition-colors w-full text-left"
              >
                <Mountain className="h-3 w-3" />
                Parque Nacional da Serra dos Órgãos
              </button>
              <button
                onClick={() => {
                  if (onSelectPark) onSelectPark("parque-tres-picos");
                  else onNavigate("parque-tres-picos");
                  setOpen(false);
                }}
                className="flex items-center gap-2 py-2 px-4 text-sm rounded-md hover:bg-accent transition-colors w-full text-left"
              >
                <Mountain className="h-3 w-3" />
                Parque Estadual dos Três Picos
              </button>
              <button
                onClick={() => {
                  if (onSelectPark) onSelectPark("parque-municipal");
                  else onNavigate("parque-municipal");
                  setOpen(false);
                }}
                className="flex items-center gap-2 py-2 px-4 text-sm rounded-md hover:bg-accent transition-colors w-full text-left"
              >
                <Mountain className="h-3 w-3" />
                Parque Natural Municipal Montanhas
              </button>

              {customParks.length > 0 && (
                <>
                  <div className="border-t my-2 border-border/60 mx-4" />
                  <div className="px-4 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Outros Parques
                  </div>
                  {customParks.map((p: any) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        if (onSelectPark) onSelectPark(p.id);
                        else onNavigate(p.id);
                        setOpen(false);
                      }}
                      className="flex items-center gap-2 py-2 px-4 text-sm rounded-md hover:bg-accent transition-colors w-full text-left"
                    >
                      <Mountain className="h-3 w-3 text-primary shrink-0" />
                      <span className="truncate">{p.nome}</span>
                    </button>
                  ))}
                </>
              )}
            </CollapsibleContent>
          </Collapsible>

          <Collapsible open={trilhasOpen} onOpenChange={setTrilhasOpen}>
            <CollapsibleTrigger className="flex items-center justify-between w-full text-base py-3 px-4 rounded-md hover:bg-accent transition-colors">
              <span className="flex items-center gap-2">
                <Compass className="h-4 w-4" />
                Trilhas
              </span>
              <ChevronRight className={`h-5 w-5 transition-transform ${trilhasOpen ? "rotate-90" : ""}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-4 space-y-1 mt-1">
              <button
                onClick={() => {
                  onNavigate("trilhas");
                  setOpen(false);
                }}
                className="flex items-center gap-2 py-2 px-4 text-sm rounded-md hover:bg-accent transition-colors w-full text-left cursor-pointer"
              >
                <Mountain className="h-3 w-3" />
                Trilhas para Iniciantes
              </button>
              <button
                onClick={() => {
                  onNavigate("trilhas");
                  setOpen(false);
                }}
                className="flex items-center gap-2 py-2 px-4 text-sm rounded-md hover:bg-accent transition-colors w-full text-left cursor-pointer"
              >
                <Mountain className="h-3 w-3" />
                Travessias Longas
              </button>
              <button
                onClick={() => {
                  onNavigate("trilhas");
                  setOpen(false);
                }}
                className="flex items-center gap-2 py-2 px-4 text-sm rounded-md hover:bg-accent transition-colors w-full text-left cursor-pointer"
              >
                <Mountain className="h-3 w-3" />
                Trilhas com Cachoeiras
              </button>
            </CollapsibleContent>
          </Collapsible>

          <Collapsible open={cidadeOpen} onOpenChange={setCidadeOpen}>
            <CollapsibleTrigger className="flex items-center justify-between w-full text-base py-3 px-4 rounded-md hover:bg-accent transition-colors">
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                A Cidade
              </span>
              <ChevronRight className={`h-5 w-5 transition-transform ${cidadeOpen ? "rotate-90" : ""}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-4 space-y-1 mt-1">
              <button
                onClick={() => {
                  onNavigate("restaurantes");
                  setOpen(false);
                }}
                className="block py-2 px-4 text-sm rounded-md hover:bg-accent transition-colors w-full text-left cursor-pointer"
              >
                Restaurantes
              </button>
              <button
                onClick={() => {
                  onNavigate("hospedagens");
                  setOpen(false);
                }}
                className="block py-2 px-4 text-sm rounded-md hover:bg-accent transition-colors w-full text-left cursor-pointer"
              >
                Hospedagem
              </button>
              <button
                onClick={() => {
                  onNavigate("eventos");
                  setOpen(false);
                }}
                className="block py-2 px-4 text-sm rounded-md hover:bg-accent transition-colors w-full text-left cursor-pointer"
              >
                Eventos
              </button>
              <button
                onClick={() => {
                  onNavigate("sobre");
                  setOpen(false);
                }}
                className="block py-2 px-4 text-sm rounded-md hover:bg-accent transition-colors w-full text-left cursor-pointer"
              >
                História da Cidade
              </button>
            </CollapsibleContent>
          </Collapsible>

          <button
            onClick={() => {
              onNavigate("fale-conosco");
              setOpen(false);
            }}
            className="flex items-center gap-2 text-base py-3 px-4 rounded-md hover:bg-accent transition-colors w-full text-left cursor-pointer"
          >
            <MessageCircle className="h-4 w-4" />
            Fale Conosco (Contato)
          </button>

          <button
            onClick={() => {
              onNavigate("home");
              setOpen(false);
            }}
            className="flex items-center gap-2 text-base py-3 px-4 rounded-md hover:bg-accent transition-colors w-full text-left"
          >
            <Ticket className="h-4 w-4" />
            Ingressos
          </button>

          {/* Admin Dashboard e Modo Recepção */}
          {user?.role === "admin" && (
            <>
              <button
                onClick={() => {
                  onNavigate("admin-dashboard");
                  setOpen(false);
                }}
                className="flex items-center gap-2 text-base py-3 px-4 rounded-md hover:bg-accent transition-colors w-full text-left text-primary font-semibold"
              >
                <ShieldCheck className="h-4 w-4" />
                Painel do Administrador
              </button>
              <button
                onClick={() => {
                  onNavigate("reception");
                  setOpen(false);
                }}
                className="flex items-center gap-2 text-base py-3 px-4 rounded-md hover:bg-accent transition-colors w-full text-left text-primary font-semibold"
              >
                <ShieldCheck className="h-4 w-4" />
                Modo Recepção (Tablet)
              </button>
            </>
          )}

          {/* Perfil do Visitante ou Login */}
          {user ? (
            <>
              <button
                onClick={() => {
                  onNavigate("user-profile");
                  setOpen(false);
                }}
                className="flex items-center gap-2 text-base py-3 px-4 rounded-md hover:bg-accent transition-colors w-full text-left font-semibold text-primary"
              >
                <User className="h-4 w-4" />
                Meu Perfil ({user.name.split(" ")[0]})
              </button>
              <button
                onClick={() => {
                  logout();
                  setOpen(false);
                  onNavigate("home");
                }}
                className="flex items-center gap-2 text-base py-3 px-4 rounded-md hover:bg-red-50/50 hover:text-red-600 transition-colors w-full text-left text-red-500 font-medium"
              >
                <LogOut className="h-4 w-4" />
                Sair da Conta
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                onOpenAuth("login");
                setOpen(false);
              }}
              className="flex items-center gap-2 text-base py-3 px-4 rounded-md hover:bg-accent transition-colors w-full text-left font-semibold"
            >
              <LogIn className="h-4 w-4" />
              Fazer Login / Cadastrar
            </button>
          )}
        </nav>

        <Separator className="my-6" />

        <div>
          <p className="text-sm font-medium mb-3">Redes Sociais</p>
          <div className="flex items-center gap-2">
            <SocialLinks size="lg" variant="outline" />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
