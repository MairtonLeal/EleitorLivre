import Link from "next/link";
import { Vote } from "lucide-react";

export function Cabecalho() {
  return (
    <header className="sticky top-0 z-30 border-b bg-card/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-3 px-4">
        <Link href="/" className="flex items-center gap-2 font-extrabold text-lg">
          <span className="grid size-9 place-items-center rounded-lg bg-primary text-white">
            <Vote className="size-5" aria-hidden />
          </span>
          Eleitor Livre
        </Link>
        <nav className="flex items-center gap-1 text-sm font-semibold sm:gap-3">
          <Link href="/" className="rounded-md px-2 py-2 hover:bg-muted">Buscar</Link>
          <Link href="/como-funciona" className="rounded-md px-2 py-2 hover:bg-muted">Como funciona</Link>
          <Link href="/auditoria" className="hidden rounded-md px-2 py-2 hover:bg-muted sm:inline">Auditoria</Link>
        </nav>
      </div>
    </header>
  );
}
