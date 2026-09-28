/** Converte a resposta bruta do TSE no perfil usado pelas telas (função pura). */
import { calcularIdade, nomeProprio } from "./format";
import type { PerfilCandidato } from "./perfil-tipos";
import { analisarReeleicao, classificarResultado, montarLinhaDoTempo, resumir } from "./reeleicao";
import type { FonteConsultada } from "./tse/client";
import { cargoPorCodigo } from "./tse/cargos";
import { endpoints } from "./tse/endpoints";
import type { CkanPacote, TseCandidatoDetalhe, TsePrestacaoContas } from "./tse/types";

export interface ContextoPerfil {
  ano: number;
  ue: string;
  idEleicao: string;
  cargo: number;
}

export function montarPerfil(
  det: TseCandidatoDetalhe,
  ctx: ContextoPerfil,
  extras: { contas?: TsePrestacaoContas | null; pacote?: CkanPacote | null; fontes?: FonteConsultada[]; slugDadosAbertos?: string } = {},
): PerfilCandidato {
  const infoCargo = cargoPorCodigo(det.cargo?.codigo ?? ctx.cargo);
  const cargoNome = det.cargo?.nome ? nomeProprio(det.cargo.nome) : infoCargo?.nome ?? "Cargo";
  const local = nomeProprio(det.localCandidatura ?? "") + (det.ufSuperiorCandidatura && det.ufSuperiorCandidatura !== det.localCandidatura ? ` - ${det.ufSuperiorCandidatura}` : "");
  const linkOficial = endpoints.paginaOficialCandidato(ctx.ano, ctx.ue, ctx.idEleicao, det.id);

  const linha = montarLinhaDoTempo(det, { ano: ctx.ano, cargo: cargoNome, local: local || ctx.ue, link: linkOficial });
  const reeleicao = analisarReeleicao(det, linha);

  const itensBens = (det.bens ?? []).map((b) => ({
    tipo: b.descricaoDeTipoDeBem ?? "Bem",
    descricao: b.descricao ?? "",
    valor: Number(b.valor ?? 0),
  }));
  const totalBens = det.totalDeBens ?? itensBens.reduce((s, b) => s + b.valor, 0);

  const contas = extras.contas;
  const financas =
    contas && (contas.dadosConsolidados || contas.despesas)
      ? {
          recebido: contas.dadosConsolidados?.totalRecebido ?? null,
          gasto: contas.despesas?.totalDespesasContratadas ?? contas.despesas?.totalDespesasPagas ?? null,
        }
      : null;

  const pacote = extras.pacote?.result;
  const dadosAbertos =
    pacote && extras.slugDadosAbertos
      ? {
          titulo: pacote.title ?? extras.slugDadosAbertos,
          url: endpoints.paginaDadosAbertos(extras.slugDadosAbertos),
          recursos: (pacote.resources ?? [])
            .filter((r) => r.url)
            .slice(0, 6)
            .map((r) => ({ nome: r.name ?? "Arquivo", url: r.url as string, formato: (r.format ?? "").toUpperCase() })),
        }
      : null;

  const naturalidade = [nomeProprio(det.nomeMunicipioNascimento ?? det.descricaoNaturalidade ?? ""), det.sgUfNascimento]
    .filter(Boolean)
    .join(" - ");

  return {
    id: det.id,
    idEleicao: String(ctx.idEleicao),
    ano: ctx.ano,
    ue: ctx.ue,
    cargo: { codigo: Number(det.cargo?.codigo ?? ctx.cargo), nome: cargoNome, explicacao: infoCargo?.explicacao },
    nomeUrna: nomeProprio(det.nomeUrna ?? det.nomeCompleto ?? "Candidato(a)"),
    nomeCompleto: nomeProprio(det.nomeCompleto ?? ""),
    numero: det.numero ?? null,
    partido: { sigla: det.partido?.sigla ?? "", nome: nomeProprio(det.partido?.nome ?? ""), numero: det.partido?.numero ?? null },
    fotoUrl: det.fotoUrl ?? null,
    local: local || ctx.ue,
    situacaoCandidatura: det.descricaoSituacao ?? "Não informada",
    resultadoAtual: { resultado: classificarResultado(det.descricaoTotalizacao), rotulo: det.descricaoTotalizacao ?? "" },
    buscaReeleicao: reeleicao.buscaReeleicao,
    motivoReeleicao: reeleicao.motivo,
    idade: calcularIdade(det.dataDeNascimento),
    genero: nomeProprio(det.descricaoSexo ?? ""),
    escolaridade: nomeProprio(det.grauInstrucao ?? ""),
    ocupacao: nomeProprio(det.ocupacao ?? ""),
    naturalidade,
    coligacao: det.nomeColigacao ?? "",
    sites: (det.sites ?? []).filter(Boolean),
    bens: { total: totalBens, itens: itensBens },
    financas,
    linhaDoTempo: linha,
    resumo: resumir(linha),
    linkOficial,
    dadosAbertos,
    fontes: extras.fontes ?? [],
    geradoEm: new Date().toISOString(),
  };
}
