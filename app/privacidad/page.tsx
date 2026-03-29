export default function PrivacidadPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">Politica de Privacidad</h1>

      <div className="prose prose-sm max-w-none space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-3">Datos que procesamos</h2>
          <p className="text-muted-foreground leading-relaxed">
            ClarityDoc procesa unicamente el texto del contrato que el usuario
            sube o pega voluntariamente. Este texto se envia a un servicio de
            inteligencia artificial para su analisis y se descarta
            inmediatamente despues.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">
            Datos que NO almacenamos
          </h2>
          <ul className="text-muted-foreground space-y-2">
            <li>No almacenamos el texto de los contratos analizados</li>
            <li>No almacenamos los resultados del analisis</li>
            <li>No almacenamos datos personales contenidos en los contratos</li>
            <li>No utilizamos cookies de seguimiento</li>
            <li>No compartimos datos con terceros (salvo el procesamiento por IA)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">
            Servicio de IA
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            El texto del contrato se envia a la API de Anthropic (Claude) para
            su analisis. Anthropic no utiliza los datos enviados a traves de su
            API para entrenar sus modelos. Puedes consultar su politica de
            privacidad en anthropic.com.
          </p>
        </section>
      </div>
    </div>
  );
}
