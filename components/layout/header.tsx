import Link from "next/link";

export function Header() {
  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="mx-auto max-w-6xl px-4 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
            <span className="text-white font-bold text-sm">C</span>
          </div>
          <span className="font-semibold text-lg">ClarityDoc</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link
            href="/analizar"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Analizar
          </Link>
          <Link
            href="/aviso-legal"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Aviso legal
          </Link>
        </nav>
      </div>
      <div className="bg-amber-50 border-b border-amber-200 text-amber-800 text-xs text-center py-1 px-4">
        ClarityDoc es una herramienta informativa. No constituye asesoramiento
        juridico profesional.
      </div>
    </header>
  );
}
