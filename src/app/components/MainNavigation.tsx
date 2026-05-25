import { Trees, MapPin, Calendar, Mountain, Home, Compass, Ticket, ShieldCheck, User, MessageCircle, LogIn, Award } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./ui/navigation-menu";
import { useAuth } from "../contexts/AuthContext";
import type { PageType } from "../App";

interface MainNavigationProps {
  onNavigate: (page: PageType) => void;
  onOpenAuth: (tab: "login" | "register") => void;
}

export function MainNavigation({ onNavigate, onOpenAuth }: MainNavigationProps) {
  const { user } = useAuth();

  return (
    <NavigationMenu className="hidden lg:flex">
      <NavigationMenuList className="gap-1">
        <NavigationMenuItem>
          <NavigationMenuLink
            asChild
            className="group inline-flex h-10 w-10 items-center justify-center rounded-md bg-background text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer"
          >
            <button onClick={() => onNavigate("home")}>
              <Home className="h-5 w-5" />
              <span className="sr-only">Home</span>
            </button>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-base font-medium gap-1">
            <Trees className="h-4 w-4" />
            Parques
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[420px] gap-2 p-4">
              <li>
                <NavigationMenuLink asChild>
                  <button
                    onClick={() => onNavigate("parque-nacional")}
                    className="group w-full text-left block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-all hover:bg-primary/5 hover:shadow-sm border border-transparent hover:border-primary/20"
                  >
                    <div className="flex items-center gap-2 text-sm font-semibold leading-none group-hover:text-primary transition-colors">
                      <Mountain className="h-4 w-4" />
                      Parque Nacional da Serra dos Órgãos
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1.5">
                      Trilhas icônicas como Pedra do Sino e Travessia
                    </p>
                  </button>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <button
                    onClick={() => onNavigate("parque-tres-picos")}
                    className="group w-full text-left block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-all hover:bg-primary/5 hover:shadow-sm border border-transparent hover:border-primary/20"
                  >
                    <div className="flex items-center gap-2 text-sm font-semibold leading-none group-hover:text-primary transition-colors">
                      <Mountain className="h-4 w-4" />
                      Parque Estadual dos Três Picos
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1.5">
                      Maior unidade de conservação do estado
                    </p>
                  </button>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <button
                    onClick={() => onNavigate("parque-municipal")}
                    className="group w-full text-left block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-all hover:bg-primary/5 hover:shadow-sm border border-transparent hover:border-primary/20"
                  >
                    <div className="flex items-center gap-2 text-sm font-semibold leading-none group-hover:text-primary transition-colors">
                      <Mountain className="h-4 w-4" />
                      Parque Natural Municipal Montanhas
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1.5">
                      Trilhas leves e cachoeiras para toda família
                    </p>
                  </button>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-base font-medium gap-1">
            <Compass className="h-4 w-4" />
            Trilhas
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[420px] gap-2 p-4">
              <li>
                <NavigationMenuLink asChild>
                  <button
                    onClick={() => onNavigate("trilhas")}
                    className="group w-full text-left block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-all hover:bg-accent/5 hover:shadow-sm border border-transparent hover:border-accent/20 cursor-pointer"
                  >
                    <div className="flex items-center gap-2 text-sm font-semibold leading-none group-hover:text-accent transition-colors">
                      <Mountain className="h-4 w-4" />
                      Trilhas para Iniciantes
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1.5">
                      Cachoeira do Imbuí, Pedra da Tartaruga
                    </p>
                  </button>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <button
                    onClick={() => onNavigate("trilhas")}
                    className="group w-full text-left block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-all hover:bg-accent/5 hover:shadow-sm border border-transparent hover:border-accent/20 cursor-pointer"
                  >
                    <div className="flex items-center gap-2 text-sm font-semibold leading-none group-hover:text-accent transition-colors">
                      <Mountain className="h-4 w-4" />
                      Travessias Longas
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1.5">
                      Petrópolis-Teresópolis, Pedra do Sino
                    </p>
                  </button>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <button
                    onClick={() => onNavigate("trilhas")}
                    className="group w-full text-left block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-all hover:bg-accent/5 hover:shadow-sm border border-transparent hover:border-accent/20 cursor-pointer"
                  >
                    <div className="flex items-center gap-2 text-sm font-semibold leading-none group-hover:text-accent transition-colors">
                      <Mountain className="h-4 w-4" />
                      Trilhas com Cachoeiras
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1.5">
                      Cachoeira do Imbuí, Poço do Castelo
                    </p>
                  </button>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-base font-medium gap-1">
            <MapPin className="h-4 w-4" />
            A Cidade
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[420px] gap-2 p-4">
              <li>
                <NavigationMenuLink asChild>
                  <button
                    onClick={() => onNavigate("restaurantes")}
                    className="group w-full text-left block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-all hover:bg-secondary/5 hover:shadow-sm border border-transparent hover:border-secondary/20 cursor-pointer"
                  >
                    <div className="text-sm font-semibold leading-none group-hover:text-secondary transition-colors">
                      Restaurantes
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1.5">
                      Gastronomia serrana autêntica
                    </p>
                  </button>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <button
                    onClick={() => onNavigate("hospedagens")}
                    className="group w-full text-left block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-all hover:bg-secondary/5 hover:shadow-sm border border-transparent hover:border-secondary/20 cursor-pointer"
                  >
                    <div className="text-sm font-semibold leading-none group-hover:text-secondary transition-colors">
                      Hospedagem
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1.5">
                      Pousadas e chalés aconchegantes
                    </p>
                  </button>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <button
                    onClick={() => onNavigate("eventos")}
                    className="group w-full text-left block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-all hover:bg-secondary/5 hover:shadow-sm border border-transparent hover:border-secondary/20 cursor-pointer"
                  >
                    <div className="flex items-center gap-2 text-sm font-semibold leading-none group-hover:text-secondary transition-colors">
                      <Calendar className="h-4 w-4" />
                      Eventos
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1.5">
                      Calendário de atrações culturais
                    </p>
                  </button>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <button
                    onClick={() => onNavigate("sobre")}
                    className="group w-full text-left block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-all hover:bg-secondary/5 hover:shadow-sm border border-transparent hover:border-secondary/20 cursor-pointer"
                  >
                    <div className="text-sm font-semibold leading-none group-hover:text-secondary transition-colors">
                      História da Cidade
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1.5">
                      Conheça Teresópolis
                    </p>
                  </button>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Fale Conosco Link */}
        <NavigationMenuItem>
          <NavigationMenuLink
            asChild
            className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-3 py-2 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground gap-1 cursor-pointer"
          >
            <a onClick={() => onNavigate("fale-conosco")}>
              <MessageCircle className="h-4 w-4" />
              Contato
            </a>
          </NavigationMenuLink>
        </NavigationMenuItem>

        {/* Ingressos Link */}
        <NavigationMenuItem>
          <NavigationMenuLink
            asChild
            className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-3 py-2 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground gap-1 cursor-pointer"
          >
            <a onClick={() => onNavigate("home")}>
              <Ticket className="h-4 w-4" />
              Ingressos
            </a>
          </NavigationMenuLink>
        </NavigationMenuItem>

        {/* Administrador (somente visível para admin ou redireciona para login) */}
        {user?.role === "admin" && (
          <NavigationMenuItem>
            <button
              onClick={() => onNavigate("admin-dashboard")}
              className="group inline-flex h-10 w-10 items-center justify-center rounded-md bg-background text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              title="Painel do Administrador"
            >
              <ShieldCheck className="h-5 w-5 text-primary" />
              <span className="sr-only">Área do Administrador</span>
            </button>
          </NavigationMenuItem>
        )}

        {/* Visitante / Login */}
        <NavigationMenuItem>
          {user ? (
            <button
              onClick={() => onNavigate("user-profile")}
              className="group inline-flex h-10 w-10 items-center justify-center rounded-md bg-background text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              title="Meu Perfil"
            >
              <User className="h-5 w-5 text-primary" />
              <span className="sr-only">Área do Visitante</span>
            </button>
          ) : (
            <button
              onClick={() => onOpenAuth("login")}
              className="group inline-flex h-10 w-10 items-center justify-center rounded-md bg-background text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              title="Fazer Login"
            >
              <LogIn className="h-5 w-5" />
              <span className="sr-only">Fazer Login</span>
            </button>
          )}
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
