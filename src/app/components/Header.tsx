import { Mountain, LogIn, User } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { MobileMenu } from "./MobileMenu";
import { AccessibilityControls } from "./AccessibilityControls";
import { SocialLinks } from "./SocialLinks";
import { MainNavigation } from "./MainNavigation";
import { AuthModal } from "./AuthModal";
import { useAuth } from "../contexts/AuthContext";
import type { PageType } from "../App";

interface HeaderProps {
  onNavigate: (page: PageType) => void;
}

export function Header({ onNavigate }: HeaderProps) {
  const { user } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "register">("login");

  const handleOpenAuth = (tab: "login" | "register" = "login") => {
    setAuthTab(tab);
    setAuthOpen(true);
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

        <MainNavigation onNavigate={onNavigate} onOpenAuth={handleOpenAuth} />

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
          <MobileMenu onNavigate={onNavigate} onOpenAuth={handleOpenAuth} />
        </div>
      </div>

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} defaultTab={authTab} />
    </header>
  );
}
