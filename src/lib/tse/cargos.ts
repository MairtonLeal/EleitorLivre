/** Códigos de cargo usados pelo TSE e textos explicativos para leigos. */

export interface CargoInfo {
  codigo: number;
  nome: string;
  abrangencia: "municipal" | "estadual" | "federal";
  explicacao: string;
}

export const CARGOS: CargoInfo[] = [
  { codigo: 11, nome: "Prefeito(a)", abrangencia: "municipal", explicacao: "Administra a cidade: saúde básica, escolas municipais, limpeza, transporte local." },
  { codigo: 13, nome: "Vereador(a)", abrangencia: "municipal", explicacao: "Cria leis da cidade e fiscaliza o trabalho do prefeito." },
  { codigo: 3, nome: "Governador(a)", abrangencia: "estadual", explicacao: "Administra o estado: segurança pública, hospitais e escolas estaduais." },
  { codigo: 5, nome: "Senador(a)", abrangencia: "estadual", explicacao: "Representa o estado no Senado, em Brasília. Mandato de 8 anos." },
  { codigo: 6, nome: "Deputado(a) Federal", abrangencia: "estadual", explicacao: "Cria leis para todo o país na Câmara dos Deputados, em Brasília." },
  { codigo: 7, nome: "Deputado(a) Estadual", abrangencia: "estadual", explicacao: "Cria leis do estado e fiscaliza o governador." },
  { codigo: 8, nome: "Deputado(a) Distrital", abrangencia: "estadual", explicacao: "Mesmo papel do deputado estadual, mas no Distrito Federal." },
  { codigo: 1, nome: "Presidente", abrangencia: "federal", explicacao: "Chefe do governo do país inteiro." },
];

export function cargoPorCodigo(codigo: number | string | undefined): CargoInfo | undefined {
  return CARGOS.find((c) => c.codigo === Number(codigo));
}

export function cargosDaEleicao(tipo: "municipal" | "geral"): CargoInfo[] {
  return tipo === "municipal"
    ? CARGOS.filter((c) => c.abrangencia === "municipal")
    : CARGOS.filter((c) => c.abrangencia !== "municipal");
}

export const UFS = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB",
  "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
] as const;
