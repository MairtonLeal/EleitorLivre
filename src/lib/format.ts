export function formatarDinheiro(valor: number | null | undefined): string {
  if (valor == null || Number.isNaN(valor)) return "Não informado";
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor);
}

export function formatarData(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short", timeZone: "America/Sao_Paulo" });
}

/** Aceita "AAAA-MM-DD", "DD/MM/AAAA" ou ISO completo. */
export function parseData(texto: string | null | undefined): Date | null {
  if (!texto) return null;
  const br = /^(\d{2})\/(\d{2})\/(\d{4})/.exec(texto);
  const d = br ? new Date(`${br[3]}-${br[2]}-${br[1]}T12:00:00`) : new Date(texto);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function calcularIdade(nascimento: string | null | undefined, referencia = new Date()): number | null {
  const d = parseData(nascimento);
  if (!d) return null;
  let idade = referencia.getFullYear() - d.getFullYear();
  const m = referencia.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && referencia.getDate() < d.getDate())) idade--;
  return idade >= 0 && idade < 130 ? idade : null;
}

/** Primeira letra maiúscula em cada palavra, mantendo preposições minúsculas. */
export function nomeProprio(texto: string | null | undefined): string {
  if (!texto) return "";
  const minusculas = new Set(["da", "de", "do", "das", "dos", "e"]);
  return texto
    .toLowerCase()
    .split(/\s+/)
    .map((p, i) => (i > 0 && minusculas.has(p) ? p : p.charAt(0).toUpperCase() + p.slice(1)))
    .join(" ");
}

export function iniciais(nome: string): string {
  return nome
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

/** Remove acentos para busca tolerante ("joao" encontra "JOÃO"). */
export function normalizarBusca(texto: string): string {
  return texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
}
