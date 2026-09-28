import type { NextRequest } from "next/server";
import { responder } from "@/lib/api-resposta";
import { gerarPerfil } from "@/lib/tse/servico";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/tse/perfil?ano=2024&ue=04278&eleicao=2045202024&cargo=13&id=140001234567
// Devolve o perfil normalizado em JSON (útil para integrações e para auditoria).
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams;
  return responder(() =>
    gerarPerfil({
      ano: q.get("ano") ?? "",
      ue: q.get("ue") ?? "",
      idEleicao: q.get("eleicao") ?? "",
      cargo: q.get("cargo") ?? "",
      id: q.get("id") ?? "",
    }),
  );
}
