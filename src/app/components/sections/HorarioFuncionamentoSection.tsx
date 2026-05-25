import { Clock, Info, Phone, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { AnimatedText, FadeIn } from "../AnimatedText";

export function HorarioFuncionamentoSection() {
  const horarios = [
    {
      id: 1,
      local: "Parque Nacional",
      nomeCompleto: "Parque Nacional Serra dos Órgãos",
      horario: "Ter-Dom: 8h-17h",
      telefone: "(21) 2152-1100",
      status: "Aberto",
      cor: "bg-green-500"
    },
    {
      id: 2,
      local: "Parque Montanhas",
      nomeCompleto: "Parque Natural Municipal Montanhas",
      horario: "Todos os dias: 7h-18h",
      telefone: "(21) 2742-3352",
      status: "Aberto",
      cor: "bg-green-500"
    },
    {
      id: 3,
      local: "Parque Três Picos",
      nomeCompleto: "Parque Estadual dos Três Picos",
      horario: "Qua-Dom: 8h-16h",
      telefone: "(21) 2643-1412",
      status: "Aberto",
      cor: "bg-green-500"
    },
    {
      id: 4,
      local: "Centro de Visitantes",
      nomeCompleto: "Centro de Informações Turísticas",
      horario: "Seg-Sex: 9h-17h",
      telefone: "(21) 2742-7000",
      status: "Aberto",
      cor: "bg-blue-500"
    }
  ];

  return (
    <section id="horarios" className="py-10 md:py-14 bg-[#E8F2EF] dark:bg-[#1C2E29]">
      <div className="container mx-auto px-4 md:px-6">
        <AnimatedText>
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 flex items-center justify-center gap-2">
              <Clock className="h-6 w-6 text-primary" />
              Horário de Funcionamento
            </h2>
            <p className="text-muted-foreground text-sm">
              Planeje sua visita consultando os horários dos parques
            </p>
          </div>
        </AnimatedText>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {horarios.map((item, index) => (
            <FadeIn key={item.id} delay={index * 0.1}>
              <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between mb-1">
                  <CardTitle className="text-base">{item.local}</CardTitle>
                  <Badge className={`${item.cor} text-white text-[10px] px-1.5 py-0.5`}>
                    {item.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{item.nomeCompleto}</p>
              </CardHeader>
              <CardContent className="space-y-2 pt-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
                  <p className="text-xs font-medium">{item.horario}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-primary shrink-0" />
                  <p className="text-xs">{item.telefone}</p>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                  <a href="#" className="text-xs text-primary hover:underline">
                    Ver no mapa
                  </a>
                </div>
              </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.4}>
          <Card className="mt-6 max-w-3xl mx-auto bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-xs text-blue-900 dark:text-blue-100 mb-1">
                  Informações Importantes
                </p>
                <p className="text-xs text-blue-800 dark:text-blue-200">
                  Horários podem variar em feriados. Recomenda-se chegar cedo para trilhas longas.
                  Alguns parques exigem agendamento prévio.
                </p>
              </div>
            </div>
          </CardContent>
          </Card>
        </FadeIn>
      </div>
    </section>
  );
}
