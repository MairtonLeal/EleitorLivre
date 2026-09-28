/**
 * Tipos (parciais) das respostas do DivulgaCandContas.
 * O TSE não publica um contrato formal; todos os campos são opcionais
 * e o código trata ausências de forma defensiva.
 */

export interface TseEleicao {
  id: number | string;
  ano: number;
  nomeEleicao?: string;
  descricaoEleicao?: string;
  tipoAbrangencia?: string; // "M" municipal | "F" federal/estadual
  turno?: string | number;
  dataEleicao?: string;
  siglaUF?: string | null;
}

export interface TseMunicipio {
  codigo: string | number;
  nome: string;
}

export interface TsePartido {
  numero?: number;
  sigla?: string;
  nome?: string;
}

export interface TseCargo {
  codigo?: number;
  nome?: string;
}

export interface TseCandidatoResumo {
  id: number;
  nomeUrna?: string;
  nomeCompleto?: string;
  numero?: number;
  partido?: TsePartido;
  descricaoSituacao?: string;
  descricaoTotalizacao?: string | null;
  st_REELEICAO?: boolean;
  stReeleicao?: boolean;
}

export interface TseEleicaoAnterior {
  nrAno?: number;
  id?: string | number;
  idEleicao?: string | number;
  nomeUrna?: string;
  nomeCandidato?: string;
  sgUe?: string;
  local?: string;
  cargo?: string;
  partido?: string;
  situacaoTotalizacao?: string;
  txLink?: string;
}

export interface TseBem {
  ordem?: number;
  descricao?: string;
  descricaoDeTipoDeBem?: string;
  valor?: number;
}

export interface TseCandidatoDetalhe {
  id: number;
  nomeUrna?: string;
  nomeCompleto?: string;
  numero?: number;
  dataDeNascimento?: string;
  descricaoSexo?: string;
  descricaoEstadoCivil?: string;
  descricaoCorRaca?: string;
  grauInstrucao?: string;
  ocupacao?: string;
  descricaoNaturalidade?: string;
  sgUfNascimento?: string;
  nomeMunicipioNascimento?: string;
  localCandidatura?: string;
  ufSuperiorCandidatura?: string;
  partido?: TsePartido;
  cargo?: TseCargo;
  nomeColigacao?: string;
  composicaoColigacao?: string;
  descricaoSituacao?: string;
  descricaoTotalizacao?: string | null;
  stReeleicao?: boolean;
  st_REELEICAO?: boolean;
  fotoUrl?: string;
  sites?: string[] | null;
  emails?: string[] | null;
  bens?: TseBem[] | null;
  totalDeBens?: number;
  eleicoesAnteriores?: TseEleicaoAnterior[] | null;
  eleicao?: { id?: number | string; ano?: number; nomeEleicao?: string; descricaoEleicao?: string };
  arquivos?: { nome?: string; url?: string; codTipo?: string }[] | null;
}

export interface TsePrestacaoContas {
  dadosConsolidados?: {
    totalRecebido?: number;
    totalLimiteGastos?: number;
    qtdDoadores?: number;
  } | null;
  despesas?: {
    totalDespesasContratadas?: number;
    totalDespesasPagas?: number;
  } | null;
}

export interface CkanRecurso {
  name?: string;
  url?: string;
  format?: string;
  description?: string;
  last_modified?: string | null;
}

export interface CkanPacote {
  success?: boolean;
  result?: { name?: string; title?: string; notes?: string; resources?: CkanRecurso[]; metadata_modified?: string };
}
