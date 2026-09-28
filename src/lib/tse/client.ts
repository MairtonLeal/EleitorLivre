/**
 * Cliente HTTP único para as APIs do TSE.
 * Fluxo: cache válido → rede → (se falhar) cache vencido → erro amigável.
 * Cada passo é registrado na trilha de auditoria.
 */
import { registrar, type OrigemDado, type SituacaoCache } from "../audit";
import { expirado, gravarCache, lerCache } from "../cache";

export interface FonteConsultada {
  nome: string;
  origem: OrigemDado;
  url: string;
  consultadoEm: string;
  sha256: string;
  cache: SituacaoCache;
}

export class ErroTse extends Error {
  constructor(message: string, public status: number | null) {
    super(message);
  }
}

interface Opcoes {
  origem: OrigemDado;
  operacao: string;
  ttlMs: number;
  timeoutMs?: number;
}

export async function buscarJson<T>(url: string, op: Opcoes): Promise<{ dados: T; fonte: FonteConsultada }> {
  const inicio = Date.now();
  const emCache = await lerCache<T>(url);

  if (emCache && !expirado(emCache)) {
    await registrar({ origem: op.origem, operacao: op.operacao, url, status: 200, ms: Date.now() - inicio, cache: "hit", bytes: emCache.bytes, sha256: emCache.sha256 });
    return { dados: emCache.dados, fonte: fonte(op, url, emCache.salvoEm, emCache.sha256, "hit") };
  }

  let status: number | null = null;
  try {
    const resp = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "EleitorLivre/0.1 (+projeto educativo; dados publicos TSE)",
      },
      cache: "no-store",
      signal: AbortSignal.timeout(op.timeoutMs ?? 15000),
    });
    status = resp.status;
    if (!resp.ok) throw new ErroTse(`O TSE respondeu com o código ${resp.status}`, resp.status);
    const corpo = await resp.text();
    const dados = JSON.parse(corpo) as T;
    const salvo = await gravarCache(url, corpo, dados, op.ttlMs);
    await registrar({ origem: op.origem, operacao: op.operacao, url, status, ms: Date.now() - inicio, cache: "miss", bytes: salvo.bytes, sha256: salvo.sha256 });
    return { dados, fonte: fonte(op, url, salvo.salvoEm, salvo.sha256, "miss") };
  } catch (e) {
    const mensagem = e instanceof Error ? e.message : String(e);
    if (emCache) {
      await registrar({ origem: op.origem, operacao: op.operacao, url, status, ms: Date.now() - inicio, cache: "stale", sha256: emCache.sha256, erro: mensagem });
      return { dados: emCache.dados, fonte: fonte(op, url, emCache.salvoEm, emCache.sha256, "stale") };
    }
    await registrar({ origem: op.origem, operacao: op.operacao, url, status, ms: Date.now() - inicio, cache: "erro", erro: mensagem });
    throw e instanceof ErroTse ? e : new ErroTse("Não foi possível falar com o TSE agora. Tente de novo em instantes.", status);
  }
}

function fonte(op: Opcoes, url: string, em: string, hash: string, cache: SituacaoCache): FonteConsultada {
  const nomes: Record<OrigemDado, string> = {
    divulgacandcontas: "TSE · DivulgaCandContas",
    dadosabertos: "TSE · Portal de Dados Abertos",
    local: "Arquivo local",
  };
  return { nome: `${nomes[op.origem]} — ${op.operacao}`, origem: op.origem, url, consultadoEm: em, sha256: hash, cache };
}
