/**
 * Serviço de dados do lado do servidor. As telas e as rotas /api usam SOMENTE estas funções.
 */
import path from "node:path";
import { readFile } from "node:fs/promises";
import { gravarJson, lerJson, PASTAS } from "../cache";
import { montarPerfil } from "../montar-perfil";
import type { PerfilCandidato } from "../perfil-tipos";
import { registrar } from "../audit";
import { validar } from "../validar";
import { buscarJson, type FonteConsultada } from "./client";
import { endpoints, TTL } from "./endpoints";
import type {
  CkanPacote,
  TseCandidatoDetalhe,
  TseCandidatoResumo,
  TseEleicao,
  TseMunicipio,
  TsePrestacaoContas,
} from "./types";

export interface EleicaoOpcao {
  id: string;
  ano: number;
  nome: string;
  tipo: "municipal" | "geral";
}

export async function listarEleicoes(): Promise<EleicaoOpcao[]> {
  const { dados } = await buscarJson<TseEleicao[]>(endpoints.eleicoesOrdinarias(), {
    origem: "divulgacandcontas",
    operacao: "Lista de eleições",
    ttlMs: TTL.eleicoes,
  });
  const porAno = new Map<number, EleicaoOpcao>();
  for (const e of Array.isArray(dados) ? dados : []) {
    if (!e?.ano || e.ano < 2014) continue;
    const turno = String(e.turno ?? "1");
    if (turno !== "1" || porAno.has(e.ano)) continue;
    porAno.set(e.ano, {
      id: String(e.id),
      ano: e.ano,
      nome: e.nomeEleicao ?? e.descricaoEleicao ?? `Eleições ${e.ano}`,
      tipo: e.tipoAbrangencia === "M" || e.ano % 4 === 0 ? "municipal" : "geral",
    });
  }
  return [...porAno.values()].sort((a, b) => b.ano - a.ano);
}

export async function listarMunicipios(idEleicao: string, uf: string) {
  const id = validar("id", idEleicao, "idEleicao");
  const sigla = validar("uf", uf);
  const { dados } = await buscarJson<{ municipios?: TseMunicipio[] } | TseMunicipio[]>(endpoints.municipios(id, sigla), {
    origem: "divulgacandcontas",
    operacao: `Municípios de ${sigla}`,
    ttlMs: TTL.municipios,
  });
  const lista = Array.isArray(dados) ? dados : dados.municipios ?? [];
  return lista
    .map((m) => ({ codigo: String(m.codigo), nome: m.nome }))
    .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
}

export async function listarCandidatos(ano: string, ue: string, idEleicao: string, cargo: string) {
  const a = validar("ano", ano);
  const u = validar("ue", ue);
  const id = validar("id", idEleicao, "idEleicao");
  const c = validar("cargo", cargo);
  const { dados } = await buscarJson<{ candidatos?: TseCandidatoResumo[] }>(endpoints.candidatos(a, u, id, c), {
    origem: "divulgacandcontas",
    operacao: `Candidatos (cargo ${c}, ${u})`,
    ttlMs: TTL.candidatos,
  });
  return (dados.candidatos ?? []).map((x) => ({
    id: x.id,
    nomeUrna: x.nomeUrna ?? x.nomeCompleto ?? "",
    nomeCompleto: x.nomeCompleto ?? "",
    numero: x.numero ?? null,
    partido: x.partido?.sigla ?? "",
    situacao: x.descricaoSituacao ?? "",
    reeleicao: x.stReeleicao ?? x.st_REELEICAO ?? null,
  }));
}

/** Busca tudo o que o perfil precisa, monta, salva o snapshot JSON e devolve. */
export async function gerarPerfil(params: { ano: string; ue: string; idEleicao: string; cargo: string; id: string }): Promise<PerfilCandidato> {
  const ano = validar("ano", params.ano);
  const ue = validar("ue", params.ue);
  const idEleicao = validar("id", params.idEleicao, "idEleicao");
  const cargo = validar("cargo", params.cargo);
  const id = validar("id", params.id);
  const fontes: FonteConsultada[] = [];

  const det = await buscarJson<TseCandidatoDetalhe>(endpoints.candidato(ano, ue, idEleicao, id), {
    origem: "divulgacandcontas",
    operacao: "Ficha do candidato",
    ttlMs: TTL.candidato,
  });
  fontes.push(det.fonte);

  // Dados complementares: se falharem, o perfil continua sendo gerado.
  let contas: TsePrestacaoContas | null = null;
  if (det.dados.partido?.numero && det.dados.numero) {
    try {
      const r = await buscarJson<TsePrestacaoContas>(
        endpoints.prestacaoContas(idEleicao, ano, ue, cargo, det.dados.partido.numero, det.dados.numero, id),
        { origem: "divulgacandcontas", operacao: "Prestação de contas", ttlMs: TTL.prestacaoContas, timeoutMs: 10000 },
      );
      contas = r.dados;
      fontes.push(r.fonte);
    } catch {
      /* opcional */
    }
  }

  const slug = `candidatos-${ano}`;
  let pacote: CkanPacote | null = null;
  try {
    const r = await buscarJson<CkanPacote>(endpoints.pacoteDadosAbertos(slug), {
      origem: "dadosabertos",
      operacao: `Conjunto de dados ${slug}`,
      ttlMs: TTL.dadosAbertos,
      timeoutMs: 10000,
    });
    pacote = r.dados;
    fontes.push(r.fonte);
  } catch {
    /* opcional */
  }

  const perfil = montarPerfil(det.dados, { ano: Number(ano), ue, idEleicao, cargo: Number(cargo) }, { contas, pacote, fontes, slugDadosAbertos: slug });
  await gravarJson(path.join(PASTAS.perfis, `${idEleicao}-${id}.json`), perfil);
  return perfil;
}

/** Perfil salvo anteriormente (acesso rápido / modo offline). */
export async function lerPerfilSalvo(idEleicao: string, id: string): Promise<PerfilCandidato | null> {
  return lerJson<PerfilCandidato>(path.join(PASTAS.perfis, `${validar("id", idEleicao)}-${validar("id", id)}.json`));
}

/** Perfil fictício de demonstração (data/demo/candidato-exemplo.json). */
export async function perfilExemplo(): Promise<PerfilCandidato> {
  const arquivo = path.join(process.cwd(), "data", "demo", "candidato-exemplo.json");
  const bruto = await readFile(arquivo, "utf8");
  const det = JSON.parse(bruto) as TseCandidatoDetalhe;
  await registrar({ origem: "local", operacao: "Perfil de exemplo (fictício)", url: "data/demo/candidato-exemplo.json", status: 200, ms: 0, cache: "hit" });
  const perfil = montarPerfil(det, { ano: 2024, ue: "00000", idEleicao: "2045202024", cargo: 13 }, {
    fontes: [
      { nome: "Arquivo local — exemplo fictício", origem: "local", url: "data/demo/candidato-exemplo.json", consultadoEm: new Date().toISOString(), sha256: "", cache: "hit" },
    ],
  });
  return { ...perfil, exemplo: true, linkOficial: "https://divulgacandcontas.tse.jus.br/divulga/" };
}
