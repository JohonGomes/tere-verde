import { AnimatedText, FadeIn } from "../AnimatedText";

export function IntroducaoSection() {
  return (
    <section className="py-8 md:py-12 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <AnimatedText>
            <h2 className="text-xl md:text-3xl font-bold mb-4">
              Bem-vindo a Teresópolis
            </h2>
          </AnimatedText>
          <FadeIn delay={0.2}>
            <div className="text-muted-foreground text-sm md:text-base leading-relaxed">
              <p>
                Teresópolis é um destino privilegiado para quem busca a combinação perfeita entre aventura na natureza e conforto serrano.
                Do topo da <strong className="text-foreground">Pedra do Sino</strong> até as refrescantes cachoeiras da Mata Atlântica,
                a cidade respira cultura, gastronomia serrana autêntica e eventos que celebram o melhor da região.
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
