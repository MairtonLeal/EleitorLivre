import type { NextRequest } from "next/server";
import { responder } from "@/lib/api-resposta";
import { listarCandidatos } from "@/lib/tse/servico";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/tse/candidatos?ano=2024&ue=04278&eleicao=2045202024&cargo=13
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams;
  return responder(() =>
    listarCandidatos(q.get("ano") ?? "", q.get("ue") ?? "", q.get("eleicao") ?? "", q.get("cargo") ?? ""),
  );
}
