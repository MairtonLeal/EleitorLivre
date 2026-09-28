import Link from "next/link";

export function Rodape() {
  return (
    <footer className="border-t bg-card">
      <div className="mx-auto max-w-5xl space-y-2 px-4 py-6 text-sm text-muted-foreground">
        <p>
          Os dados vêm das fontes públicas do <strong>Tribunal Superior Eleitoral (TSE)</strong>: DivulgaCandContas e
          Portal de Dados Abertos. O Eleitor Livre não tem ligação com partidos, candidatos ou com o TSE.
        </p>
        <p>
          Sempre confira na fonte oficial antes de compartilhar. <Link href="/auditoria" className="underline">Veja aqui de onde veio cada informação.</Link>
        </p>
      </div>
    </footer>
  );
}
