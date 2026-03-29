import Link from "next/link";

function TrafficLightDemo() {
  const examples = [
    {
      level: "rojo" as const,
      title: "Penalizacion por desistimiento",
      text: "El arrendatario debera abonar 3 mensualidades por cada ano restante de contrato en caso de desistimiento anticipado.",
      explanation:
        "La LAU limita la penalizacion a 1 mes por ano pendiente. Esta clausula triplica el maximo legal.",
    },
    {
      level: "amarillo" as const,
      title: "Prohibicion de mascotas",
      text: "Queda terminantemente prohibida la tenencia de cualquier tipo de animal en la vivienda.",
      explanation:
        "Legal actualmente, pero cada vez mas cuestionada. Clausula inusualmente restrictiva frente al estandar de mercado.",
    },
    {
      level: "verde" as const,
      title: "Duracion del contrato",
      text: "El presente contrato tendra una duracion de cinco anos, prorrogable por periodos anuales hasta un maximo de tres anos adicionales.",
      explanation:
        "Cumple con la duracion minima de 5 anos establecida por la LAU reformada (RD-ley 7/2019).",
    },
  ];

  const colors = {
    rojo: {
      bg: "bg-red-50",
      border: "border-red-200",
      dot: "bg-red-500",
      label: "Riesgo Alto",
      labelBg: "bg-red-100 text-red-700",
    },
    amarillo: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      dot: "bg-amber-500",
      label: "Riesgo Medio",
      labelBg: "bg-amber-100 text-amber-700",
    },
    verde: {
      bg: "bg-green-50",
      border: "border-green-200",
      dot: "bg-green-500",
      label: "Riesgo Bajo",
      labelBg: "bg-green-100 text-green-700",
    },
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {examples.map((ex) => {
        const c = colors[ex.level];
        return (
          <div
            key={ex.level}
            className={`rounded-xl border ${c.border} ${c.bg} p-5`}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-3 h-3 rounded-full ${c.dot}`} />
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${c.labelBg}`}
              >
                {c.label}
              </span>
            </div>
            <h3 className="font-semibold text-sm mb-2">{ex.title}</h3>
            <p className="text-xs text-muted-foreground italic mb-3 leading-relaxed">
              &ldquo;{ex.text}&rdquo;
            </p>
            <p className="text-xs leading-relaxed">{ex.explanation}</p>
          </div>
        );
      })}
    </div>
  );
}

export default function LandingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="py-20 md:py-32 px-4">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
            Entiende tu contrato
            <br />
            <span className="text-blue-600">antes de firmar</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Nuestra IA analiza cada clausula de tu contrato de alquiler y te
            indica los riesgos con un sistema de semaforo. Basado en la
            legislacion espanola vigente.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/analizar"
              className="inline-flex items-center justify-center h-11 px-8 rounded-lg bg-primary text-primary-foreground text-base font-medium hover:bg-primary/90 transition-colors"
            >
              Analizar mi contrato gratis
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Como funciona
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Sube tu contrato",
                desc: "Arrastra tu PDF o pega el texto del contrato directamente.",
              },
              {
                step: "2",
                title: "La IA lo analiza",
                desc: "Cada clausula se examina segun la LAU y la legislacion espanola vigente.",
              },
              {
                step: "3",
                title: "Recibe tu informe",
                desc: "Semaforo rojo/amarillo/verde por clausula, clausulas ausentes y recomendaciones.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 font-bold text-lg flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo */}
      <section className="py-16 px-4">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
            Ejemplo de analisis
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Asi es como ClarityDoc evalua las clausulas de tu contrato.
          </p>
          <TrafficLightDemo />
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Protege tus derechos como inquilino
          </h2>
          <p className="text-muted-foreground mb-8">
            No firmes un contrato sin entenderlo. Analiza el tuyo en menos de un
            minuto.
          </p>
          <Link
            href="/analizar"
            className="inline-flex items-center justify-center h-11 px-8 rounded-lg bg-primary text-primary-foreground text-base font-medium hover:bg-primary/90 transition-colors"
          >
            Analizar mi contrato ahora
          </Link>
        </div>
      </section>
    </div>
  );
}
