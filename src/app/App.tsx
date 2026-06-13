import { useState, useEffect } from "react";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "./components/ui/sonner";
import { LandingPage } from "./components/LandingPage";
import { ParqueDetalhePage } from "./components/pages/ParqueDetalhePage";
import { AdminDashboardPage } from "./components/pages/AdminDashboardPage";
import { ReceptionPage } from "./components/pages/ReceptionPage";
import { UserProfilePage } from "./components/pages/UserProfilePage";
import { TrilhasPage } from "./components/pages/TrilhasPage";
import { EventosPage } from "./components/pages/EventosPage";
import { RestaurantesPage } from "./components/pages/RestaurantesPage";
import { HospedagensPage } from "./components/pages/HospedagensPage";
import { SobreCidadePage } from "./components/pages/SobreCidadePage";
import { FaleConoscoPage } from "./components/pages/FaleConoscoPage";

export type PageType = 
  | "home" 
  | "parque-nacional" 
  | "parque-tres-picos" 
  | "parque-municipal"
  | "parque-detalhe"
  | "admin-dashboard"
  | "reception"
  | "user-profile"
  | "trilhas"
  | "eventos"
  | "restaurantes"
  | "hospedagens"
  | "sobre"
  | "fale-conosco";

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>("home");
  const [selectedParkId, setSelectedParkId] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const handleNavigate = (page: PageType, parkId?: string) => {
    if (parkId) {
      setSelectedParkId(parkId);
    }
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case "parque-nacional":
        return <ParqueDetalhePage parkId="parque-nacional" onNavigate={handleNavigate} />;
      case "parque-tres-picos":
        return <ParqueDetalhePage parkId="parque-tres-picos" onNavigate={handleNavigate} />;
      case "parque-municipal":
        return <ParqueDetalhePage parkId="parque-municipal" onNavigate={handleNavigate} />;
      case "parque-detalhe":
        return <ParqueDetalhePage parkId={selectedParkId || ""} onNavigate={handleNavigate} />;
      case "admin-dashboard":
        return <AdminDashboardPage onNavigate={handleNavigate} />;
      case "reception":
        return <ReceptionPage onNavigate={handleNavigate} />;
      case "user-profile":
        return <UserProfilePage onNavigate={handleNavigate} />;
      case "trilhas":
        return <TrilhasPage onNavigate={handleNavigate} />;
      case "eventos":
        return <EventosPage onNavigate={handleNavigate} />;
      case "restaurantes":
        return <RestaurantesPage onNavigate={handleNavigate} />;
      case "hospedagens":
        return <HospedagensPage onNavigate={handleNavigate} />;
      case "sobre":
        return <SobreCidadePage onNavigate={handleNavigate} />;
      case "fale-conosco":
        return <FaleConoscoPage onNavigate={handleNavigate} />;
      default:
        return <LandingPage onNavigate={handleNavigate} />;
    }
  };

  return (
    <ThemeProvider>
      <AuthProvider>
        {renderPage()}
        <Toaster position="bottom-right" />
      </AuthProvider>
    </ThemeProvider>
  );
}