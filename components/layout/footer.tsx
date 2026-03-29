import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
              <span className="text-white font-bold text-xs">C</span>
            </div>
            <span className="text-sm font-medium">ClarityDoc</span>
          </div>
          <nav className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/aviso-legal" className="hover:text-foreground transition-colors">
              Aviso legal
            </Link>
            <Link href="/privacidad" className="hover:text-foreground transition-colors">
              Privacidad
            </Link>
          </nav>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-6">
          ClarityDoc no almacena ningun documento ni dato personal. Los
          contratos se analizan en memoria y se descartan inmediatamente.
        </p>
      </div>
    </footer>
  );
}
