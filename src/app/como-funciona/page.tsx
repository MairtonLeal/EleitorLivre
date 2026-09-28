import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Explica } from "@/components/Explica";

export const metadata: Metadata = { title: "Como funciona" };

const PASSOS = [
  { t: "Você escolhe", d: "A eleição, o cargo, o lugar e o nome do candidato." },
  { t: "Nós perguntamos ao TSE", d: "O site do Tribunal Superior Eleitoral devolve a ficha oficial: número, partido, bens, eleições anteriores e contas." },
  { t: "Conferimos se é reeleição", d: "Só seguimos se a pessoa já ocupa o mesmo cargo e quer continuar nele. Se não for, mostramos um aviso." },
  { t: "Montamos o perfil", d: "No modelo Zap (conversa) ou Social (rede social), com textos simples e uma linha do tempo de vitórias e derrotas." },
  { t: "Guardamos uma cópia", d: "O resultado fica salvo em um arquivo, para abrir rápido na próxima vez e funcionar mesmo se o TSE cair." },
  { t: "Você compartilha", d: "Mande o link do perfil ou um resumo pronto pelo WhatsApp, Facebook ou LinkedIn." },
];

const GLOSSARIO = [
  ["Reeleição", "Quando quem já tem o cargo se candidata de novo ao mesmo cargo."],
  ["Eleito por QP", "Eleito pelo quociente partidário: os votos do partido todo ajudaram a conquistar a vaga."],
  ["Eleito por média", "Ganhou uma das vagas que sobram na conta das 'sobras' de votos."],
  ["Suplente", "Ficou na fila. Só assume se alguém eleito do partido sair."],
  ["Deferido", "A Justiça Eleitoral aprovou o registro da candidatura."],
  ["Indeferido", "A candidatura foi negada (pode haver recurso)."],
  ["Bens declarados", "Lista do que o candidato diz possuir, com os valores que ele mesmo informou."],
  ["Prestação de contas", "O 'extrato' da campanha: quanto recebeu, de quem e como gastou."],
];

export default function ComoFunciona() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-extrabold">Como funciona</h1>
        <p className="text-lg text-muted-foreground">Sem mistério: veja o caminho que a informação faz até chegar na sua tela.</p>
      </header>

      <ol className="grid gap-3 sm:grid-cols-2">
        {PASSOS.map((p, i) => (
          <li key={p.t}>
            <Card className="h-full">
              <CardContent className="flex gap-3 p-4">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary font-bold text-white">{i + 1}</span>
                <div>
                  <p className="font-bold">{p.t}</p>
                  <p className="text-muted-foreground">{p.d}</p>
                </div>
              </CardContent>
            </Card>
          </li>
        ))}
      </ol>

      <section className="space-y-3">
        <h2 className="text-2xl font-bold">Palavras que aparecem nos perfis</h2>
        <dl className="divide-y rounded-lg border bg-card">
          {GLOSSARIO.map(([termo, def]) => (
            <div key={termo} className="grid gap-1 p-4 sm:grid-cols-[180px_1fr]">
              <dt className="font-bold">{termo}</dt>
              <dd className="text-muted-foreground">{def}</dd>
            </div>
          ))}
        </dl>
      </section>

      <Explica titulo="Dica de ouro">
        <p>
          Antes de repassar qualquer informação sobre candidato, confira na fonte oficial. Todo perfil do Eleitor Livre tem o
          botão <strong>&quot;Conferir no site oficial do TSE&quot;</strong> e a data da consulta. Veja também a página de{" "}
          <Link href="/auditoria" className="underline">auditoria</Link>.
        </p>
      </Explica>
    </div>
  );
}
