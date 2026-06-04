import { useState, useEffect } from "react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Mountain, X, ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatedText, FadeIn } from "../AnimatedText";

export function GaleriaFotosSection() {
  const fotos = [
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1597094113089-6975be94df01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
      titulo: "Vista da Serra dos Órgãos",
      categoria: "Paisagem"
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1604990830224-5aeb2863fbbe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
      titulo: "Montanhas Verdes",
      categoria: "Natureza"
    },
    {
      id: 3,
      url: "https://images.unsplash.com/photo-1682347813709-e0e59e834b04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
      titulo: "Floresta Atlântica",
      categoria: "Trilha"
    },
    {
      id: 4,
      url: "https://images.unsplash.com/photo-1682347814173-633e2a9084ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
      titulo: "Picos e Vales",
      categoria: "Paisagem"
    },
    {
      id: 5,
      url: "https://images.unsplash.com/photo-1682347810540-b8d2365bef62?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
      titulo: "Horizonte da Serra",
      categoria: "Panorama"
    },
    {
      id: 6,
      url: "https://images.unsplash.com/photo-1600036420970-021b762c8f26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
      titulo: "Trilha na Mata",
      categoria: "Aventura"
    },
    {
      id: 7,
      url: "https://images.unsplash.com/photo-1682347812583-7855d5debecd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
      titulo: "Caminho Verde",
      categoria: "Trilha"
    },
    {
      id: 8,
      url: "https://images.unsplash.com/photo-1682347812423-45911f8e6ef1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
      titulo: "Vale dos Sonhos",
      categoria: "Paisagem"
    }
  ];

  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  const handlePrev = () => {
    setActivePhotoIndex(prev => (prev === null || prev === 0 ? fotos.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActivePhotoIndex(prev => (prev === null || prev === fotos.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activePhotoIndex === null) return;
      if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "Escape") {
        setActivePhotoIndex(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activePhotoIndex]);

  return (
    <section id="galeria" className="py-12 md:py-20 bg-[#F5F1ED]/60 dark:bg-[#1F2420]/60 backdrop-blur-md">
      <div className="container mx-auto px-4 md:px-6">
        <AnimatedText>
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-bold mb-4 flex items-center justify-center gap-2">
              <Mountain className="h-6 w-6 md:h-8 md:w-8 text-primary" />
              Galeria de Fotos
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A beleza natural de Teresópolis capturada em imagens. Inspire-se para sua próxima aventura
            </p>
          </div>
        </AnimatedText>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {fotos.map((foto, index) => (
            <FadeIn key={foto.id} delay={index * 0.05}>
              <div 
                onClick={() => setActivePhotoIndex(index)}
                className="relative group overflow-hidden rounded-lg aspect-[4/3] cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <ImageWithFallback
                  src={foto.url}
                  alt={foto.titulo}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <span className="text-[10px] text-primary bg-primary/10 backdrop-blur-sm self-start px-2 py-0.5 rounded-full font-semibold mb-1 uppercase tracking-wider">
                    {foto.categoria}
                  </span>
                  <p className="text-white font-bold leading-tight">{foto.titulo}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>

      {/* Modal / Lightbox com Carrossel */}
      {activePhotoIndex !== null && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-[9999] flex flex-col justify-between items-center p-4 md:p-8 animate-fade-in select-none">
          {/* Barra Superior */}
          <div className="w-full flex items-center justify-between text-white max-w-6xl z-10">
            <div className="text-left">
              <span className="text-[10px] uppercase tracking-wider font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">
                {fotos[activePhotoIndex].categoria}
              </span>
              <h3 className="text-lg md:text-xl font-bold mt-1.5 text-white/90">
                {fotos[activePhotoIndex].titulo}
              </h3>
            </div>
            <button
              onClick={() => setActivePhotoIndex(null)}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all hover:scale-105 active:scale-95 border border-white/5"
              title="Fechar (Esc)"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Foto Principal Ampliada e Setas */}
          <div className="relative flex items-center justify-center w-full max-w-5xl flex-1 my-4">
            {/* Seta Esquerda */}
            <button
              onClick={handlePrev}
              className="absolute left-2 md:left-4 z-10 p-3 rounded-full bg-black/40 hover:bg-black/60 text-white/70 hover:text-white border border-white/10 hover:scale-110 active:scale-95 transition-all"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            {/* Imagem */}
            <div className="relative max-h-[60vh] max-w-[85vw] md:max-h-[68vh] flex items-center justify-center">
              <img
                src={fotos[activePhotoIndex].url}
                alt={fotos[activePhotoIndex].titulo}
                className="max-h-[60vh] max-w-full md:max-h-[68vh] object-contain rounded-lg shadow-2xl transition-all duration-300 border border-white/5"
              />
            </div>

            {/* Seta Direita */}
            <button
              onClick={handleNext}
              className="absolute right-2 md:right-4 z-10 p-3 rounded-full bg-black/40 hover:bg-black/60 text-white/70 hover:text-white border border-white/10 hover:scale-110 active:scale-95 transition-all"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>

          {/* Carrossel de Miniaturas na Base */}
          <div className="w-full max-w-4xl flex flex-col items-center gap-3">
            <span className="text-xs text-white/50 font-medium">
              Foto {activePhotoIndex + 1} de {fotos.length}
            </span>
            <div className="flex gap-2.5 overflow-x-auto py-2 px-4 max-w-full scrollbar-none snap-x snap-mandatory">
              {fotos.map((foto, idx) => (
                <button
                  key={foto.id}
                  onClick={() => setActivePhotoIndex(idx)}
                  className={`relative w-16 h-12 md:w-20 md:h-14 rounded overflow-hidden shrink-0 border-2 transition-all snap-start ${
                    idx === activePhotoIndex
                      ? "border-primary scale-105 shadow-[0_0_12px_rgba(47,92,74,0.6)]"
                      : "border-transparent opacity-40 hover:opacity-100"
                  }`}
                >
                  <img
                    src={foto.url}
                    alt={foto.titulo}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
