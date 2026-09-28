/**
 * Catálogo ÚNICO de URLs externas. Toda chamada ao TSE passa por aqui,
 * o que facilita auditar exatamente o que o sistema consulta.
 */

export const DIVULGA_BASE =
  process.env.TSE_DIVULGA_BASE ?? "https://divulgacandcontas.tse.jus.br/divulga/rest/v1";
export const DADOS_ABERTOS_BASE =
  process.env.TSE_DADOS_ABERTOS_BASE ?? "https://dadosabertos.tse.jus.br/api/3/action";

type Id = string | number;

export const endpoints = {
  eleicoesOrdinarias: () => `${DIVULGA_BASE}/eleicao/ordinarias`,
  municipios: (idEleicao: Id, uf: string) => `${DIVULGA_BASE}/eleicao/buscar/${uf}/${idEleicao}/municipios`,
  candidatos: (ano: Id, ue: string, idEleicao: Id, cargo: Id) =>
    `${DIVULGA_BASE}/candidatura/listar/${ano}/${ue}/${idEleicao}/${cargo}/candidatos`,
  candidato: (ano: Id, ue: string, idEleicao: Id, id: Id) =>
    `${DIVULGA_BASE}/candidatura/buscar/${ano}/${ue}/${idEleicao}/candidato/${id}`,
  prestacaoContas: (idEleicao: Id, ano: Id, ue: string, cargo: Id, nrPartido: Id, nrCandidato: Id, id: Id) =>
    `${DIVULGA_BASE}/prestador/consulta/${idEleicao}/${ano}/${ue}/${cargo}/${nrPartido}/${nrCandidato}/${id}`,
  pacoteDadosAbertos: (slug: string) => `${DADOS_ABERTOS_BASE}/package_show?id=${encodeURIComponent(slug)}`,
  /** Página humana (não-API) para o eleitor conferir o candidato no site oficial. */
  paginaOficialCandidato: (ano: Id, ue: string, idEleicao: Id, id: Id) =>
    `https://divulgacandcontas.tse.jus.br/divulga/#/candidato/${ano}/${idEleicao}/${ue}/${id}`,
  paginaDadosAbertos: (slug: string) => `https://dadosabertos.tse.jus.br/dataset/${slug}`,
};

/** Tempo de vida do cache local por tipo de dado (em milissegundos). */
const HORA = 60 * 60 * 1000;
export const TTL = {
  eleicoes: 7 * 24 * HORA,
  municipios: 30 * 24 * HORA,
  candidatos: 12 * HORA,
  candidato: 12 * HORA,
  prestacaoContas: 6 * HORA,
  dadosAbertos: 7 * 24 * HORA,
};
