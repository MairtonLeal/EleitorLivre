import Link from "next/link";
import { Info } from "lucide-react";
import type { PerfilCandidato } from "@/lib/perfil-tipos";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Explica } from "@/components/Explica";
import { Avatar } from "./Avatar";

/** Mensagem exibida quando o candidato NÃO busca reeleição ou não tem histórico. */
export function AvisoNaoReeleicao({ perfil: p }: { perfil: PerfilCandidato }) {
  const semHistorico = p.linhaDoTempo.filter((e) => !e.atual).length === 0;
  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <Card>
        <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
          <Avatar nome={p.nomeUrna} fotoUrl={p.fotoUrl} className="size-24 text-2xl" />
          <div>
            <h1 className="text-2xl font-extrabold">{p.nomeUrna}</h1>
            <p className="text-muted-foreground">
              {p.cargo.nome} · {p.local} · {p.numero} · {p.partido.sigla}
            </p>
          </div>
          <div className="flex items-start gap-3 rounded-lg border border-sky-200 bg-sky-50 p-4 text-left text-sky-950">
            <Info className="mt-0.5 size-6 shrink-0 text-sky-700" />
            <div>
              <p className="text-lg font-bold">
                {semHistorico ? "Este candidato não tem histórico eleitoral." : "Este candidato não está tentando a reeleição."}
              </p>
              <p>
                {semHistorico
                  ? "O TSE não registra nenhuma eleição anterior desta pessoa. Como ela não ocupa o cargo hoje, não há mandato para mostrar."
                  : p.motivoReeleicao}{" "}
                O Eleitor Livre monta perfis apenas de quem busca a reeleição.
              </p>
            </div>
          </div>
          <div className="flex w-full flex-col gap-2 sm:flex-row">
            <Link href="/" className={buttonVariants({ className: "flex-1" })}>Buscar outro candidato</Link>
            <a href={p.linkOficial} target="_blank" rel="noopener noreferrer" className={buttonVariants({ variant: "outline", className: "flex-1" })}>
              Ver ficha no TSE
            </a>
          </div>
        </CardContent>
      </Card>
      <Explica>
        <p>
          Reeleição é quando a pessoa já tem o cargo e quer continuar nele. Para quem está estreando, a melhor fonte são as
          propostas registradas no TSE (link acima).
        </p>
      </Explica>
    </div>
  );
}
