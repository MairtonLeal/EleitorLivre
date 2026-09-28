import type { NextRequest } from "next/server";
import { responder } from "@/lib/api-resposta";
import { listarMunicipios } from "@/lib/tse/servico";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/tse/municipios?eleicao=2045202024&uf=PA
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams;
  return responder(() => listarMunicipios(q.get("eleicao") ?? "", q.get("uf") ?? ""), 86400);
}
