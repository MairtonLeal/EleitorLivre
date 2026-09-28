import Link from "next/link";
import { ShieldCheck, Share2, Timeline } from "@/components/icones";
import { BuscaCandidato } from "@/components/busca/BuscaCandidato";
import { Recentes } from "@/components/Recentes";
import { Explica } from "@/components/Explica";

export default function Inicio() {
  return (
    <div className="space-y-8">
      <section className="space-y-3 text-center sm:text-left">
        <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl">
          Quem quer ser <span className="text-primary">reeleito</span>? Veja a história antes de votar.
        </h1>
        <p className="text-lg text-muted-foreground">
          Escolha um candidato e o Eleitor Livre monta um perfil fácil de ler — igual a uma conversa de WhatsApp ou a um
          perfil de rede social — com dados oficiais do TSE.
        </p>
        <p>
          <Link href="/exemplo" className="font-semibold text-primary underline">Quer ver como fica? Abra um exemplo fictício.</Link>
        </p>
      </section>

      <div className="grid gap-3 sm:grid-cols-3">
        <Vantagem icone={<Timeline />} titulo="Linha do tempo" texto="Em quais eleições ganhou e em quais perdeu." />
        <Vantagem icone={<ShieldCheck />} titulo="Dados oficiais" texto="Tudo vem do TSE e pode ser conferido." />
        <Vantagem icone={<Share2 />} titulo="Fácil de enviar" texto="Mande o link no WhatsApp ou nas redes." />
      </div>

      <BuscaCandidato />

      <Explica titulo="O que é reeleição?">
        <p>
          É quando alguém que <strong>já ocupa um cargo</strong> (por exemplo, vereador) se candidata de novo ao{" "}
          <strong>mesmo cargo</strong>. Assim dá para olhar o que a pessoa já fez com o voto que recebeu.
        </p>
      </Explica>

      <Recentes />
    </div>
  );
}

function Vantagem({ icone, titulo, texto }: { icone: React.ReactNode; titulo: string; texto: string }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border bg-card p-4">
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-accent text-accent-foreground [&_svg]:size-5">{icone}</span>
      <div>
        <p className="font-bold">{titulo}</p>
        <p className="text-sm text-muted-foreground">{texto}</p>
      </div>
    </div>
  );
}
