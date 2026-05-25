import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Mountain } from "lucide-react";
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

  return (
    <section id="galeria" className="py-12 md:py-20 bg-[#F5F1ED] dark:bg-[#1F2420]">
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
              <div className="relative group overflow-hidden rounded-lg aspect-[4/3] cursor-pointer shadow-md hover:shadow-xl transition-shadow">
              <ImageWithFallback
                src={foto.url}
                alt={foto.titulo}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <p className="text-white font-medium mb-1">{foto.titulo}</p>
                <p className="text-white/80 text-sm">{foto.categoria}</p>
              </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
