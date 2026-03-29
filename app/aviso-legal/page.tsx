export default function AvisoLegalPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">Aviso Legal</h1>

      <div className="prose prose-sm max-w-none space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-3">
            Naturaleza del servicio
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            ClarityDoc es una herramienta informativa que utiliza inteligencia
            artificial para analizar contratos de arrendamiento. Los resultados
            proporcionados tienen caracter meramente orientativo y{" "}
            <strong>no constituyen asesoramiento juridico profesional</strong>.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Limitaciones</h2>
          <p className="text-muted-foreground leading-relaxed">
            El analisis realizado por ClarityDoc se basa en modelos de
            inteligencia artificial que, si bien estan entrenados con
            conocimiento de la legislacion espanola vigente, pueden contener
            errores, omisiones o interpretaciones incorrectas. Recomendamos
            siempre consultar con un abogado o profesional juridico cualificado
            antes de tomar decisiones basadas en los resultados de esta
            herramienta.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">
            Tratamiento de datos
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            ClarityDoc no almacena los documentos analizados. Los contratos se
            procesan en memoria y se descartan inmediatamente tras completar el
            analisis. No se conserva ninguna copia del texto del contrato ni de
            los datos personales que pueda contener.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">
            Exencion de responsabilidad
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            ClarityDoc no se hace responsable de las decisiones tomadas en base
            a los resultados del analisis. El uso de esta herramienta no crea
            ninguna relacion abogado-cliente. La responsabilidad ultima de
            revisar y comprender un contrato antes de firmarlo recae en las
            partes contratantes.
          </p>
        </section>
      </div>
    </div>
  );
}
