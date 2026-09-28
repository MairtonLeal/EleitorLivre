/**
 * Trilha de auditoria: toda consulta externa (ou leitura de cache) gera um registro
 * append-only em data/auditoria/AAAA-MM-DD.jsonl. Nada é apagado ou reescrito.
 *
 * Com o hash SHA-256 do corpo recebido, qualquer pessoa pode provar que o perfil
 * exibido veio exatamente daquela resposta do TSE.
 */
import { randomUUID } from "node:crypto";
import { appendFile, mkdir, readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { PASTAS } from "./cache";

export type OrigemDado = "divulgacandcontas" | "dadosabertos" | "local";
export type SituacaoCache = "miss" | "hit" | "stale" | "erro";

export interface RegistroAuditoria {
  id: string;
  em: string;
  origem: OrigemDado;
  operacao: string;
  url: string;
  status: number | null;
  ms: number;
  cache: SituacaoCache;
  bytes?: number;
  sha256?: string;
  erro?: string;
}

// Memória de reserva caso o disco não aceite escrita.
const memoria: RegistroAuditoria[] = [];

export async function registrar(r: Omit<RegistroAuditoria, "id" | "em">): Promise<RegistroAuditoria> {
  const registro: RegistroAuditoria = { id: randomUUID(), em: new Date().toISOString(), ...r };
  memoria.push(registro);
  if (memoria.length > 500) memoria.shift();
  try {
    await mkdir(PASTAS.auditoria, { recursive: true });
    const arquivo = path.join(PASTAS.auditoria, `${registro.em.slice(0, 10)}.jsonl`);
    await appendFile(arquivo, JSON.stringify(registro) + "\n", "utf8");
  } catch {
    /* sem disco: fica só na memória */
  }
  return registro;
}

export async function listarAuditoria(limite = 200): Promise<RegistroAuditoria[]> {
  const lidos: RegistroAuditoria[] = [];
  try {
    const arquivos = (await readdir(PASTAS.auditoria)).filter((a) => a.endsWith(".jsonl")).sort().reverse();
    for (const a of arquivos) {
      const linhas = (await readFile(path.join(PASTAS.auditoria, a), "utf8")).trim().split("\n").reverse();
      for (const l of linhas) {
        if (!l) continue;
        try {
          lidos.push(JSON.parse(l));
        } catch {
          /* linha corrompida é ignorada, não apagada */
        }
        if (lidos.length >= limite) return lidos;
      }
    }
  } catch {
    /* pasta ainda não existe */
  }
  if (lidos.length === 0) return [...memoria].reverse().slice(0, limite);
  return lidos;
}
