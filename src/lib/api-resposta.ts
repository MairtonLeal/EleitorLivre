import { NextResponse } from "next/server";
import { ParametroInvalido } from "./validar";
import { ErroTse } from "./tse/client";

/** Resposta padronizada das rotas /api: sucesso { dados } ou erro { erro } em português. */
export async function responder<T>(fn: () => Promise<T>, maxAgeSeg = 300) {
  try {
    const dados = await fn();
    return NextResponse.json(
      { dados },
      { headers: { "Cache-Control": `public, s-maxage=${maxAgeSeg}, stale-while-revalidate=86400` } },
    );
  } catch (e) {
    if (e instanceof ParametroInvalido) return NextResponse.json({ erro: e.message }, { status: 400 });
    if (e instanceof ErroTse) return NextResponse.json({ erro: e.message }, { status: 502 });
    console.error("[eleitor-livre] erro inesperado", e);
    return NextResponse.json({ erro: "Algo deu errado. Tente novamente." }, { status: 500 });
  }
}
