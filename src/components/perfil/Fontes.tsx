import { ExternalLink, ShieldCheck } from "lucide-react";
import type { PerfilCandidato } from "@/lib/perfil-tipos";
import { formatarData } from "@/lib/format";

const CACHE_TXT = { miss: "consultado agora", hit: "cópia local recente", stale: "cópia local (TSE fora do ar)", erro: "falhou" } as const;

/** Bloco de transparência: de onde veio cada dado, quando e com qual "impressão digital" (hash). */
export function Fontes({ perfil }: { perfil: PerfilCandidato }) {
  return (
    <div className="space-y-3 text-sm">
      <p className="flex items-center gap-2 font-semibold"><ShieldCheck className="size-5 text-green-700" /> De onde vieram estes dados</p>
      <ul className="space-y-2">
        {perfil.fontes.map((f) => (
          <li key={f.url} className="rounded-lg border bg-card p-3">
            <p className="font-semibold">{f.nome}</p>
            <p className="text-muted-foreground">
              {formatarData(f.consultadoEm)} · {CACHE_TXT[f.cache]}
            </p>
            {f.sha256 && (
              <p className="break-all font-mono text-[11px] text-muted-foreground" title="Impressão digital (SHA-256) da resposta recebida">
                SHA-256: {f.sha256}
              </p>
            )}
          </li>
        ))}
      </ul>
      <a href={perfil.linkOficial} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-primary underline">
        Conferir no site oficial do TSE <ExternalLink className="size-4" />
      </a>
      {perfil.dadosAbertos && (
        <div className="rounded-lg border bg-card p-3">
          <p className="font-semibold">Portal de Dados Abertos do TSE</p>
          <p className="text-muted-foreground">Planilhas completas com todos os candidatos de {perfil.ano}:</p>
          <a href={perfil.dadosAbertos.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary underline">
            {perfil.dadosAbertos.titulo}
          </a>
          {perfil.dadosAbertos.recursos.length > 0 && (
            <ul className="mt-1 list-disc pl-5 text-muted-foreground">
              {perfil.dadosAbertos.recursos.map((r) => (
                <li key={r.url}>
                  <a href={r.url} className="underline" rel="noopener noreferrer">{r.nome}</a> {r.formato && `(${r.formato})`}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      <p className="text-xs text-muted-foreground">
        A &quot;impressão digital&quot; (SHA-256) é um código único da resposta do TSE. Se alguém mudar um único dado, o código muda —
        assim dá para provar que nada foi alterado.
      </p>
    </div>
  );
}
