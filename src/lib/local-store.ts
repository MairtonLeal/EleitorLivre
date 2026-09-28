/**
 * Dados locais no navegador (acesso rápido): últimos perfis abertos.
 * Tudo protegido por try/catch — modo anônimo ou armazenamento bloqueado não quebra a tela.
 */
export interface PerfilRecente {
  caminho: string;
  nome: string;
  numero: number | null;
  partido: string;
  cargo: string;
  local: string;
  ano: number;
  fotoUrl: string | null;
  vistoEm: string;
}

const CHAVE = "eleitorlivre:recentes:v1";

export function lerRecentes(): PerfilRecente[] {
  try {
    const bruto = localStorage.getItem(CHAVE);
    return bruto ? (JSON.parse(bruto) as PerfilRecente[]) : [];
  } catch {
    return [];
  }
}

export function salvarRecente(p: PerfilRecente) {
  try {
    const lista = [p, ...lerRecentes().filter((r) => r.caminho.split("?")[0] !== p.caminho.split("?")[0])].slice(0, 8);
    localStorage.setItem(CHAVE, JSON.stringify(lista));
  } catch {
    /* ignora */
  }
}

export function limparRecentes() {
  try {
    localStorage.removeItem(CHAVE);
  } catch {
    /* ignora */
  }
}
