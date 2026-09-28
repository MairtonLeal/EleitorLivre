import { NextResponse, type NextRequest } from "next/server";
import { listarAuditoria } from "@/lib/audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/auditoria?limite=100 → últimos registros da trilha de auditoria
export async function GET(req: NextRequest) {
  const limite = Math.min(Math.max(Number(req.nextUrl.searchParams.get("limite")) || 100, 1), 1000);
  return NextResponse.json({ dados: await listarAuditoria(limite) }, { headers: { "Cache-Control": "no-store" } });
}
