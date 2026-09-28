import type { FonteConsultada } from "./tse/client";

export type Resultado = "eleito" | "nao_eleito" | "suplente" | "segundo_turno" | "em_andamento" | "outro";

export interface EventoLinhaDoTempo {
  ano: number;
  cargo: string;
  local: string;
  partido: string;
  resultado: Resultado;
  rotulo: string; // texto original do TSE, ex.: "Eleito por QP"
  atual: boolean;
  link?: string;
}

export interface PerfilCandidato {
  id: number;
  idEleicao: string;
  ano: number;
  ue: string;
  cargo: { codigo: number; nome: string; explicacao?: string };
  nomeUrna: string;
  nomeCompleto: string;
  numero: number | null;
  partido: { sigla: string; nome: string; numero: number | null };
  fotoUrl: string | null;
  local: string;
  situacaoCandidatura: string;
  resultadoAtual: { resultado: Resultado; rotulo: string };
  buscaReeleicao: boolean;
  motivoReeleicao: string;
  idade: number | null;
  genero: string;
  escolaridade: string;
  ocupacao: string;
  naturalidade: string;
  coligacao: string;
  sites: string[];
  bens: { total: number; itens: { tipo: string; descricao: string; valor: number }[] };
  financas: { recebido: number | null; gasto: number | null } | null;
  linhaDoTempo: EventoLinhaDoTempo[];
  resumo: { disputas: number; vezesEleito: number; vezesNaoEleito: number; anosEleito: number[] };
  linkOficial: string;
  dadosAbertos: { titulo: string; url: string; recursos: { nome: string; url: string; formato: string }[] } | null;
  fontes: FonteConsultada[];
  geradoEm: string;
  exemplo?: boolean;
}
