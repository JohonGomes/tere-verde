import { useState, useEffect } from "react";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "./components/ui/sonner";
import { LandingPage } from "./components/LandingPage";
import { ParqueNacionalPage } from "./components/pages/ParqueNacionalPage";
import { ParqueTresPicosPage } from "./components/pages/ParqueTresPicosPage";
import { ParqueMunicipalPage } from "./components/pages/ParqueMunicipalPage";
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case "parque-nacional":
        return <ParqueNacionalPage onNavigate={setCurrentPage} />;
      case "parque-tres-picos":
        return <ParqueTresPicosPage onNavigate={setCurrentPage} />;
      case "parque-municipal":
        return <ParqueMunicipalPage onNavigate={setCurrentPage} />;
      case "admin-dashboard":
        return <AdminDashboardPage onNavigate={setCurrentPage} />;
      case "reception":
        return <ReceptionPage onNavigate={setCurrentPage} />;
      case "user-profile":
        return <UserProfilePage onNavigate={setCurrentPage} />;
      case "trilhas":
        return <TrilhasPage onNavigate={setCurrentPage} />;
      case "eventos":
        return <EventosPage onNavigate={setCurrentPage} />;
      case "restaurantes":
        return <RestaurantesPage onNavigate={setCurrentPage} />;
      case "hospedagens":
        return <HospedagensPage onNavigate={setCurrentPage} />;
      case "sobre":
        return <SobreCidadePage onNavigate={setCurrentPage} />;
      case "fale-conosco":
        return <FaleConoscoPage onNavigate={setCurrentPage} />;
      default:
        return <LandingPage onNavigate={setCurrentPage} />;
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