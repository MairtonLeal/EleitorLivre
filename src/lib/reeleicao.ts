/**
 * Regras de negócio (funções puras, testáveis): classificação de resultados,
 * detecção de reeleição e montagem da linha do tempo "Anteriores → Atual".
 */
import type { EventoLinhaDoTempo, Resultado } from "./perfil-tipos";
import type { TseCandidatoDetalhe } from "./tse/types";
import { normalizarBusca } from "./format";

export function classificarResultado(texto: string | null | undefined): Resultado {
  const t = normalizarBusca(texto ?? "");
  if (!t || t === "#nulo" || t === "#ne") return "em_andamento";
  if (t.includes("nao eleito")) return "nao_eleito";
  if (t.startsWith("eleito") || t === "eleita") return "eleito";
  if (t.includes("suplente")) return "suplente";
  if (t.includes("2") && t.includes("turno")) return "segundo_turno";
  return "outro";
}

export const ROTULO_RESULTADO: Record<Resultado, string> = {
  eleito: "Eleito(a)",
  nao_eleito: "Não eleito(a)",
  suplente: "Suplente",
  segundo_turno: "Foi ao 2º turno",
  em_andamento: "Aguardando resultado",
  outro: "Outro resultado",
};

/** Mesmo cargo? Compara ignorando acentos, gênero ("vereador(a)", "deputada") e maiúsculas. */
export function mesmoCargo(a: string | undefined, b: string | undefined): boolean {
  const limpa = (s?: string) =>
    normalizarBusca(s ?? "")
      .replace(/\(a\)/g, "")
      .replace(/[^a-z ]/g, " ")
      .split(/\s+/)
      .filter(Boolean)
      .map((p) => p.replace(/[ao]$/, ""))
      .join(" ");
  const x = limpa(a);
  return !!x && x === limpa(b);
}

export function montarLinhaDoTempo(
  det: TseCandidatoDetalhe,
  atual: { ano: number; cargo: string; local: string; link?: string },
): EventoLinhaDoTempo[] {
  const anteriores: EventoLinhaDoTempo[] = (det.eleicoesAnteriores ?? [])
    .filter((e) => e.nrAno && e.nrAno < atual.ano)
    .map((e) => ({
      ano: Number(e.nrAno),
      cargo: e.cargo ?? "Cargo não informado",
      local: e.local ?? e.sgUe ?? "",
      partido: e.partido ?? "",
      resultado: classificarResultado(e.situacaoTotalizacao),
      rotulo: e.situacaoTotalizacao ?? "Sem informação",
      atual: false,
      link: e.txLink,
    }));

  // Remove duplicados (mesmo ano + cargo), mantendo o primeiro.
  const vistos = new Set<string>();
  const unicos = anteriores.filter((e) => {
    const k = `${e.ano}|${normalizarBusca(e.cargo)}`;
    if (vistos.has(k)) return false;
    vistos.add(k);
    return true;
  });
  unicos.sort((a, b) => a.ano - b.ano);

  const rotuloAtual = det.descricaoTotalizacao ?? "";
  unicos.push({
    ano: atual.ano,
    cargo: atual.cargo,
    local: atual.local,
    partido: det.partido?.sigla ?? "",
    resultado: classificarResultado(rotuloAtual),
    rotulo: rotuloAtual || ROTULO_RESULTADO.em_andamento,
    atual: true,
    link: atual.link,
  });
  return unicos;
}

/**
 * Busca reeleição quando:
 *  1) o próprio TSE marca a candidatura como reeleição (stReeleicao), OU
 *  2) foi eleito(a) para o MESMO cargo na eleição imediatamente anterior
 *     (ano atual - 4; ou - 8 para senador).
 */
export function analisarReeleicao(
  det: TseCandidatoDetalhe,
  linha: EventoLinhaDoTempo[],
): { buscaReeleicao: boolean; motivo: string } {
  if (det.stReeleicao === true || det.st_REELEICAO === true) {
    return { buscaReeleicao: true, motivo: "O TSE marca esta candidatura como tentativa de reeleição." };
  }
  const atual = linha.find((e) => e.atual);
  if (!atual) return { buscaReeleicao: false, motivo: "Não encontramos a candidatura atual." };
  const ciclos = mesmoCargo(atual.cargo, "senador") ? [8, 4] : [4];
  const anterior = linha.find(
    (e) => !e.atual && e.resultado === "eleito" && mesmoCargo(e.cargo, atual.cargo) && ciclos.includes(atual.ano - e.ano),
  );
  if (anterior) {
    return {
      buscaReeleicao: true,
      motivo: `Foi eleito(a) para ${anterior.cargo} em ${anterior.ano} e agora disputa o mesmo cargo.`,
    };
  }
  return { buscaReeleicao: false, motivo: "Não ocupa hoje o mesmo cargo que está disputando." };
}

export function resumir(linha: EventoLinhaDoTempo[]) {
  const concluidas = linha.filter((e) => e.resultado !== "em_andamento");
  const eleitos = concluidas.filter((e) => e.resultado === "eleito");
  return {
    disputas: linha.length,
    vezesEleito: eleitos.length,
    vezesNaoEleito: concluidas.filter((e) => e.resultado === "nao_eleito" || e.resultado === "suplente").length,
    anosEleito: eleitos.map((e) => e.ano),
  };
}
