import type { Metadata } from "next";
import { listarAuditoria, type RegistroAuditoria } from "@/lib/audit";
import { formatarData } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Explica } from "@/components/Explica";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Auditoria — de onde vêm os dados" };

const SITUACAO: Record<RegistroAuditoria["cache"], { texto: string; variante: "success" | "default" | "warning" | "danger" }> = {
  miss: { texto: "Buscado no TSE", variante: "success" },
  hit: { texto: "Cópia local", variante: "default" },
  stale: { texto: "Cópia antiga (TSE fora)", variante: "warning" },
  erro: { texto: "Falhou", variante: "danger" },
};

export default async function PaginaAuditoria() {
  const registros = await listarAuditoria(150);
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-extrabold">Auditoria</h1>
        <p className="text-lg text-muted-foreground">
          Aqui fica o &quot;caderninho&quot; do sistema: cada vez que buscamos um dado no TSE, anotamos quando, onde e o que veio.
        </p>
      </header>

      <Explica titulo="Como ler esta página">
        <p><strong>Buscado no TSE</strong>: o dado foi pedido agora ao site oficial.</p>
        <p><strong>Cópia local</strong>: usamos uma cópia recente guardada aqui para abrir mais rápido.</p>
        <p><strong>Impressão digital (SHA-256)</strong>: código único da resposta. Se um dado mudar, o código muda.</p>
        <p>Também dá para baixar tudo em formato técnico (JSON) em <a className="underline" href="/api/auditoria?limite=1000">/api/auditoria</a>.</p>
      </Explica>

      <Card>
        <CardHeader><CardTitle>Últimas {registros.length} consultas</CardTitle></CardHeader>
        <CardContent>
          {registros.length === 0 ? (
            <p className="text-muted-foreground">Nenhuma consulta registrada ainda. Faça uma busca para começar.</p>
          ) : (
            <ul className="divide-y">
              {registros.map((r) => (
                <li key={r.id} className="space-y-1 py-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={SITUACAO[r.cache].variante}>{SITUACAO[r.cache].texto}</Badge>
                    <span className="font-semibold">{r.operacao}</span>
                    <span className="text-sm text-muted-foreground">{formatarData(r.em)} · {r.ms} ms · HTTP {r.status ?? "—"}</span>
                  </div>
                  <p className="break-all font-mono text-xs text-muted-foreground">{r.url}</p>
                  {r.sha256 && <p className="break-all font-mono text-[11px] text-muted-foreground">SHA-256 {r.sha256}</p>}
                  {r.erro && <p className="text-sm text-red-700">Erro: {r.erro}</p>}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
