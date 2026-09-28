import { CheckCircle2, CircleDashed, CircleMinus, XCircle } from "lucide-react";
import type { EventoLinhaDoTempo, PerfilCandidato, Resultado } from "@/lib/perfil-tipos";
import { ROTULO_RESULTADO } from "@/lib/reeleicao";
import { cn } from "@/lib/utils";

const ESTILO: Record<Resultado, { cor: string; icone: React.ReactNode }> = {
  eleito: { cor: "border-green-600 bg-green-50 text-green-800", icone: <CheckCircle2 className="size-5 text-green-600" /> },
  nao_eleito: { cor: "border-slate-400 bg-slate-50 text-slate-700", icone: <XCircle className="size-5 text-slate-500" /> },
  suplente: { cor: "border-amber-500 bg-amber-50 text-amber-800", icone: <CircleMinus className="size-5 text-amber-600" /> },
  segundo_turno: { cor: "border-sky-500 bg-sky-50 text-sky-800", icone: <CircleDashed className="size-5 text-sky-600" /> },
  em_andamento: { cor: "border-sky-500 bg-sky-50 text-sky-800", icone: <CircleDashed className="size-5 text-sky-600" /> },
  outro: { cor: "border-slate-300 bg-slate-50 text-slate-700", icone: <CircleDashed className="size-5 text-slate-500" /> },
};

/**
 * Linha do tempo "Anteriores → Atual". Mostra vitórias e derrotas.
 * Quando não há eleições anteriores, exibe a mensagem de "sem histórico".
 */
export function LinhaDoTempo({ perfil, compacto = false }: { perfil: PerfilCandidato; compacto?: boolean }) {
  const anteriores = perfil.linhaDoTempo.filter((e) => !e.atual);
  const atual = perfil.linhaDoTempo.find((e) => e.atual);

  return (
    <div className="space-y-4">
      {anteriores.length === 0 ? (
        <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
          <strong>Sem histórico:</strong> o TSE não tem registro de eleições anteriores deste candidato.
        </p>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            Disputou <strong>{perfil.resumo.disputas}</strong> eleições · ganhou <strong className="text-green-700">{perfil.resumo.vezesEleito}</strong> ·
            não ganhou <strong>{perfil.resumo.vezesNaoEleito}</strong>
          </p>
          <Grupo titulo="Anteriores" eventos={anteriores} compacto={compacto} />
        </>
      )}
      {atual && <Grupo titulo="Atual" eventos={[atual]} compacto={compacto} />}
      {!compacto && (
        <p className="text-xs text-muted-foreground">
          <strong>Suplente</strong> = teve votos, mas ficou na fila: só assume se alguém eleito sair. <strong>QP</strong> = eleito pelo
          quociente partidário (a soma dos votos do partido ajudou).
        </p>
      )}
    </div>
  );
}

function Grupo({ titulo, eventos, compacto }: { titulo: string; eventos: EventoLinhaDoTempo[]; compacto: boolean }) {
  return (
    <div>
      <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">{titulo}</p>
      <ol className="relative space-y-3 border-l-2 border-border pl-5">
        {eventos.map((e) => {
          const s = ESTILO[e.resultado];
          return (
            <li key={`${e.ano}-${e.cargo}`} className="relative">
              <span className="absolute -left-[31px] top-1 grid size-6 place-items-center rounded-full bg-card">{s.icone}</span>
              <div className={cn("rounded-lg border-l-4 p-3", s.cor, compacto && "p-2")}>
                <p className="font-bold">
                  {e.ano} · {e.cargo}
                  {e.atual && <span className="ml-2 rounded bg-primary px-1.5 py-0.5 text-xs text-white">agora</span>}
                </p>
                <p className="text-sm">
                  {ROTULO_RESULTADO[e.resultado]}
                  {e.rotulo && e.rotulo !== ROTULO_RESULTADO[e.resultado] ? ` (${e.rotulo})` : ""}
                  {e.local ? ` · ${e.local}` : ""}
                  {e.partido ? ` · ${e.partido}` : ""}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
