/** Textos e links de compartilhamento (funções puras, usadas no cliente e no servidor). */
import { formatarDinheiro } from "./format";
import type { PerfilCandidato } from "./perfil-tipos";
import { ROTULO_RESULTADO } from "./reeleicao";

export type Modelo = "zap" | "social";

export function caminhoPerfil(p: Pick<PerfilCandidato, "ano" | "ue" | "idEleicao" | "cargo" | "id" | "exemplo">, modelo: Modelo) {
  if (p.exemplo) return `/exemplo?modelo=${modelo}`;
  return `/perfil/${p.ano}/${p.ue}/${p.idEleicao}/${p.cargo.codigo}/${p.id}?modelo=${modelo}`;
}

/** Resumo curto, em linguagem simples, para colar no WhatsApp ou em qualquer rede. */
export function montarResumo(p: PerfilCandidato, url: string): string {
  const eleito = p.resumo.anosEleito.filter((a) => a < p.ano);
  const linhas = [
    `🗳️ ${p.nomeUrna} — ${p.numero ?? "s/ número"} (${p.partido.sigla})`,
    `Cargo: ${p.cargo.nome} · ${p.local} · Eleições ${p.ano}`,
    p.buscaReeleicao ? "Está tentando a REELEIÇÃO." : "Não está tentando a reeleição.",
    eleito.length ? `Já foi eleito(a) em: ${eleito.join(", ")}.` : "Não tem vitórias anteriores registradas.",
    `Resultado ${p.ano}: ${p.resultadoAtual.rotulo || ROTULO_RESULTADO[p.resultadoAtual.resultado]}`,
    `Bens declarados: ${formatarDinheiro(p.bens.total)}`,
    "",
    `Veja o perfil completo (dados oficiais do TSE): ${url}`,
  ];
  if (p.exemplo) linhas.unshift("[PERFIL FICTÍCIO DE EXEMPLO]");
  return linhas.join("\n");
}

export function linksRedes(url: string, texto: string) {
  const u = encodeURIComponent(url);
  return {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(texto)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
    x: `https://twitter.com/intent/tweet?url=${u}&text=${encodeURIComponent(texto.split("\n")[0] ?? "")}`,
  };
}

export function urlBase(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
}
