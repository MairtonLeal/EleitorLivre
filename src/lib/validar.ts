/**
 * Validação de parâmetros vindos da URL. Impede que valores arbitrários
 * sejam concatenados nos caminhos das APIs do TSE (injeção de caminho).
 */

const REGRAS = {
  ano: /^(19|20)\d{2}$/,
  ue: /^[A-Z0-9]{2,6}$/,
  uf: /^[A-Z]{2}$/,
  id: /^\d{1,15}$/,
  cargo: /^\d{1,2}$/,
} as const;

export type TipoParametro = keyof typeof REGRAS;

export class ParametroInvalido extends Error {
  constructor(public campo: string) {
    super(`Parâmetro inválido: ${campo}`);
  }
}

/** Valida um valor; `nome` aparece na mensagem de erro. */
export function validar(tipo: TipoParametro, valor: unknown, nome: string = tipo): string {
  const v = String(valor ?? "").trim().toUpperCase();
  if (!REGRAS[tipo].test(v)) throw new ParametroInvalido(nome);
  return v;
}
