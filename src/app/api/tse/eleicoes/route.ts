import { responder } from "@/lib/api-resposta";
import { listarEleicoes } from "@/lib/tse/servico";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return responder(() => listarEleicoes(), 3600);
}
