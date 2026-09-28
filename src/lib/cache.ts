/**
 * Cache local em arquivos JSON (acesso rápido + funcionamento quando o TSE cai).
 *
 * Estrutura em disco (pasta ELEITOR_DATA_DIR, padrão ./data):
 *   data/cache/<sha1-da-url>.json   → resposta bruta + metadados
 *   data/auditoria/AAAA-MM-DD.jsonl → uma linha por consulta (ver audit.ts)
 *   data/perfis/<idEleicao>-<id>.json → perfil já montado (snapshot)
 */
import { createHash } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

export const DATA_DIR =
  process.env.ELEITOR_DATA_DIR ??
  (process.env.VERCEL ? "/tmp/eleitorlivre" : path.join(process.cwd(), "data"));

export const PASTAS = {
  cache: path.join(DATA_DIR, "cache"),
  auditoria: path.join(DATA_DIR, "auditoria"),
  perfis: path.join(DATA_DIR, "perfis"),
};

export interface EntradaCache<T> {
  url: string;
  salvoEm: string;
  expiraEm: string;
  sha256: string;
  bytes: number;
  dados: T;
}

export function sha256(texto: string): string {
  return createHash("sha256").update(texto).digest("hex");
}

function chave(url: string): string {
  return createHash("sha1").update(url).digest("hex");
}

/** Grava de forma atômica (arquivo temporário + rename) para nunca deixar JSON pela metade. */
export async function gravarJson(arquivo: string, conteudo: unknown): Promise<boolean> {
  try {
    await mkdir(path.dirname(arquivo), { recursive: true });
    const tmp = `${arquivo}.${process.pid}.${Date.now()}.tmp`;
    await writeFile(tmp, JSON.stringify(conteudo, null, 2), "utf8");
    await rename(tmp, arquivo);
    return true;
  } catch {
    // Disco somente leitura (ex.: alguns ambientes serverless): segue sem cache.
    return false;
  }
}

export async function lerJson<T>(arquivo: string): Promise<T | null> {
  try {
    return JSON.parse(await readFile(arquivo, "utf8")) as T;
  } catch {
    return null;
  }
}

export async function lerCache<T>(url: string): Promise<EntradaCache<T> | null> {
  return lerJson<EntradaCache<T>>(path.join(PASTAS.cache, `${chave(url)}.json`));
}

export async function gravarCache<T>(url: string, corpoBruto: string, dados: T, ttlMs: number) {
  const agora = Date.now();
  const entrada: EntradaCache<T> = {
    url,
    salvoEm: new Date(agora).toISOString(),
    expiraEm: new Date(agora + ttlMs).toISOString(),
    sha256: sha256(corpoBruto),
    bytes: Buffer.byteLength(corpoBruto),
    dados,
  };
  await gravarJson(path.join(PASTAS.cache, `${chave(url)}.json`), entrada);
  return entrada;
}

export function expirado(entrada: EntradaCache<unknown>): boolean {
  return new Date(entrada.expiraEm).getTime() < Date.now();
}
