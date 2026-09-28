import { ArrowLeft, CheckCheck, Lock, MoreVertical, Phone, Video } from "lucide-react";
import type { PerfilCandidato } from "@/lib/perfil-tipos";
import { formatarDinheiro } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Avatar } from "./Avatar";
import { LinhaDoTempo } from "./LinhaDoTempo";

/** Modelo "Zap": perfil em formato de conversa de WhatsApp (perguntas do eleitor, respostas com dados do TSE). */
export function TemplateZap({ perfil: p }: { perfil: PerfilCandidato }) {
  const hora = new Date(p.geradoEm).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo" });
  const eleitoAntes = p.resumo.anosEleito.filter((a) => a < p.ano);
  const principaisBens = [...p.bens.itens].sort((a, b) => b.valor - a.valor).slice(0, 3);

  return (
    <div className="mx-auto w-full max-w-2xl overflow-hidden rounded-xl border shadow-md">
      {/* Cabeçalho do chat */}
      <div className="flex items-center gap-3 bg-zap px-3 py-2.5 text-white">
        <ArrowLeft className="size-5 shrink-0 opacity-80" aria-hidden />
        <Avatar nome={p.nomeUrna} fotoUrl={p.fotoUrl} className="size-11 text-sm" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold leading-tight">{p.nomeUrna}</p>
          <p className="truncate text-xs opacity-90">
            {p.cargo.nome} · {p.numero} · {p.partido.sigla}
          </p>
        </div>
        <div className="hidden items-center gap-4 opacity-80 sm:flex" aria-hidden>
          <Video className="size-5" />
          <Phone className="size-5" />
          <MoreVertical className="size-5" />
        </div>
      </div>

      {/* Conversa */}
      <div className="zap-wallpaper space-y-2 px-3 py-4 sm:px-6">
        <p className="mx-auto w-fit rounded-md bg-[#fff5c4] px-3 py-1.5 text-center text-xs text-slate-700 shadow-sm">
          <Lock className="mr-1 inline size-3" aria-hidden />
          Mensagens automáticas montadas com dados oficiais do TSE. <strong>Não é o candidato escrevendo.</strong>
        </p>
        <p className="mx-auto w-fit rounded-md bg-white/90 px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm">Eleições {p.ano}</p>

        <Pergunta hora={hora}>Oi! Quem é você?</Pergunta>
        <Resposta hora={hora}>
          <p>
            <strong>{p.nomeUrna}</strong>
            {p.nomeCompleto && p.nomeCompleto !== p.nomeUrna ? ` (nome completo: ${p.nomeCompleto})` : ""}.
          </p>
          <ul className="mt-1 space-y-0.5 text-[15px]">
            {p.idade != null && <li>🎂 {p.idade} anos</li>}
            {p.ocupacao && <li>💼 Profissão declarada: {p.ocupacao}</li>}
            {p.escolaridade && <li>🎓 Escolaridade: {p.escolaridade}</li>}
            {p.naturalidade && <li>📍 Nasceu em: {p.naturalidade}</li>}
          </ul>
        </Resposta>

        <Pergunta hora={hora}>Qual o número e o partido?</Pergunta>
        <Resposta hora={hora}>
          <p>
            Número na urna: <strong className="text-lg">{p.numero ?? "—"}</strong>
          </p>
          <p>
            Partido: <strong>{p.partido.sigla}</strong> {p.partido.nome && `(${p.partido.nome})`}
          </p>
          {p.coligacao && <p className="text-sm text-slate-600">Coligação/federação: {p.coligacao}</p>}
          <Dica>O número é o que você digita na urna. Os dois primeiros dígitos são sempre do partido.</Dica>
        </Resposta>

        <Pergunta hora={hora}>Tá tentando se reeleger?</Pergunta>
        <Resposta hora={hora}>
          <p>
            ✅ <strong>Sim.</strong> {p.motivoReeleicao}
          </p>
          <p>
            Cargo: <strong>{p.cargo.nome}</strong> em {p.local}.
          </p>
          {p.cargo.explicacao && <Dica>O que faz um(a) {p.cargo.nome.toLowerCase()}? {p.cargo.explicacao}</Dica>}
        </Resposta>

        <Pergunta hora={hora}>Já ganhou eleição antes?</Pergunta>
        <Resposta hora={hora} largo>
          <p className="mb-2">
            {eleitoAntes.length
              ? `Sim, foi eleito(a) em ${eleitoAntes.join(", ")}. Veja a trajetória:`
              : "Não encontramos vitórias anteriores registradas no TSE."}
          </p>
          <LinhaDoTempo perfil={p} compacto />
        </Resposta>

        <Pergunta hora={hora}>Quanto declarou de bens?</Pergunta>
        <Resposta hora={hora}>
          <p>
            Total declarado: <strong>{formatarDinheiro(p.bens.total)}</strong>
          </p>
          {principaisBens.length > 0 && (
            <ul className="mt-1 list-disc pl-5 text-[15px]">
              {principaisBens.map((b, i) => (
                <li key={i}>
                  {b.tipo}: {formatarDinheiro(b.valor)}
                </li>
              ))}
            </ul>
          )}
          <Dica>Todo candidato é obrigado a informar ao TSE o que possui (casa, carro, dinheiro no banco…). O valor é o que a própria pessoa declarou.</Dica>
        </Resposta>

        <Pergunta hora={hora}>E o dinheiro da campanha?</Pergunta>
        <Resposta hora={hora}>
          {p.financas ? (
            <>
              <p>💰 Recebeu: <strong>{formatarDinheiro(p.financas.recebido)}</strong></p>
              <p>🧾 Gastou (contratado): <strong>{formatarDinheiro(p.financas.gasto)}</strong></p>
            </>
          ) : (
            <p>Ainda não há prestação de contas publicada para esta candidatura.</p>
          )}
          <Dica>Prestação de contas é o &quot;extrato&quot; da campanha: quanto entrou, de quem veio e com o que foi gasto.</Dica>
        </Resposta>

        <Pergunta hora={hora}>Como eu confiro isso tudo?</Pergunta>
        <Resposta hora={hora}>
          <p>
            No site oficial do TSE:{" "}
            <a href={p.linkOficial} target="_blank" rel="noopener noreferrer" className="break-all font-semibold text-[#027eb5] underline">
              abrir ficha oficial
            </a>
          </p>
          <p className="text-sm text-slate-600">Mais abaixo você vê a data da consulta e a &quot;impressão digital&quot; dos dados.</p>
        </Resposta>
      </div>
    </div>
  );
}

function Pergunta({ children, hora }: { children: React.ReactNode; hora: string }) {
  return (
    <div className="flex justify-end">
      <div className="relative max-w-[85%] rounded-lg rounded-tr-none bg-zap-out px-3 py-2 text-slate-900 shadow-sm">
        {children}
        <span className="ml-3 inline-flex translate-y-1 items-center gap-0.5 text-[11px] text-slate-500">
          {hora} <CheckCheck className="size-4 text-sky-500" aria-hidden />
        </span>
      </div>
    </div>
  );
}

function Resposta({ children, hora, largo = false }: { children: React.ReactNode; hora: string; largo?: boolean }) {
  return (
    <div className="flex justify-start">
      <div className={cn("relative rounded-lg rounded-tl-none bg-white px-3 py-2 text-slate-900 shadow-sm", largo ? "w-full sm:max-w-[92%]" : "max-w-[88%]")}>
        {children}
        <p className="mt-1 text-right text-[11px] text-slate-500">{hora}</p>
      </div>
    </div>
  );
}

function Dica({ children }: { children: React.ReactNode }) {
  return <p className="mt-2 rounded-md bg-amber-50 px-2 py-1.5 text-sm text-amber-900">💡 {children}</p>;
}
