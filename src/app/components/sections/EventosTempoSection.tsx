import { Calendar, MapPin, CloudRain, Sun, Wind, Cloud } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { AnimatedText, SlideIn } from "../AnimatedText";

export function EventosTempoSection() {
  const eventos = [
    {
      id: 1,
      titulo: "Festival de Inverno 2026",
      data: "15-17 Jun",
      local: "Centro Cultural",
      tipo: "Cultural"
    },
    {
      id: 2,
      titulo: "Corrida de Montanha",
      data: "22 Jun",
      local: "Parque Nacional",
      tipo: "Esporte"
    },
    {
      id: 3,
      titulo: "Feira Gastronômica",
      data: "30 Jun - 02 Jul",
      local: "Praça Balthasar",
      tipo: "Gastronomia"
    },
    {
      id: 4,
      titulo: "Trilha Guiada Noturna",
      data: "08 Jul",
      local: "Parque dos Três Picos",
      tipo: "Aventura"
    }
  ];

  const previsaoSemanal = [
    { dia: "Seg", data: "05/05", icone: Sun, temp: "22°", condicao: "Ensolarado" },
    { dia: "Ter", data: "06/05", icone: Cloud, temp: "20°", condicao: "Nublado" },
    { dia: "Qua", data: "07/05", icone: CloudRain, temp: "18°", condicao: "Chuva" },
    { dia: "Qui", data: "08/05", icone: Sun, temp: "23°", condicao: "Ensolarado" },
    { dia: "Sex", data: "09/05", icone: Sun, temp: "24°", condicao: "Ensolarado" },
    { dia: "Sáb", data: "10/05", icone: Cloud, temp: "21°", condicao: "Nublado" },
    { dia: "Dom", data: "11/05", icone: CloudRain, temp: "19°", condicao: "Chuva" }
  ];

  return (
    <section id="eventos" className="py-12 md:py-20 bg-[#E8F2EF] dark:bg-[#1C2E29]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Calendário de Eventos */}
          <SlideIn direction="left">
            <div>
              <div className="mb-6">
                <h2 className="text-2xl md:text-3xl font-bold mb-2 flex items-center gap-2">
                  <Calendar className="h-6 w-6 text-primary" />
                  Calendário de Eventos
                </h2>
                <p className="text-muted-foreground">
                  Não perca as próximas atrações de Teresópolis
                </p>
              </div>

            <div className="space-y-2">
              {eventos.map((evento) => (
                <Card key={evento.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="p-3 pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-sm font-semibold mb-1 truncate">
                          {evento.titulo}
                        </CardTitle>
                        <CardDescription className="space-y-0.5 text-xs">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 shrink-0" />
                            <span className="truncate">{evento.data}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 shrink-0" />
                            <span className="truncate">{evento.local}</span>
                          </span>
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0.5 shrink-0">
                        {evento.tipo}
                      </Badge>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>

            <Button variant="outline" size="sm" className="w-full mt-3">
              Ver Todos os Eventos
            </Button>
            </div>
          </SlideIn>

          {/* Previsão do Tempo */}
          <SlideIn direction="right" delay={0.2}>
            <div>
              <div className="mb-6">
                <h2 className="text-2xl md:text-3xl font-bold mb-2 flex items-center gap-2">
                  <Sun className="h-6 w-6 text-primary" />
                  Previsão do Tempo
                </h2>
                <p className="text-muted-foreground">
                  Planeje sua trilha com a previsão da semana
                </p>
              </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Teresópolis - RJ</CardTitle>
                <CardDescription>Próximos 7 dias</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2">
                  {previsaoSemanal.map((prev, index) => {
                    const IconeClima = prev.icone;
                    return (
                      <div
                        key={index}
                        className="flex flex-col items-center p-2 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <span className="text-xs font-medium mb-1">{prev.dia}</span>
                        <span className="text-xs text-muted-foreground mb-2">{prev.data}</span>
                        <IconeClima className={`h-6 w-6 mb-2 ${
                          prev.icone === Sun ? "text-yellow-500" :
                          prev.icone === CloudRain ? "text-blue-500" :
                          "text-gray-400"
                        }`} />
                        <span className="font-semibold text-sm">{prev.temp}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
              <CardFooter className="flex-col items-start gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Wind className="h-4 w-4" />
                  <span>Ventos: 15-25 km/h</span>
                </div>
                <p className="text-xs">
                  💡 Dica: Dias ensolarados são ideais para trilhas longas. Em dias de chuva, opte por passeios culturais na cidade.
                </p>
              </CardFooter>
            </Card>
            </div>
          </SlideIn>
        </div>
      </div>
    </section>
  );
}
