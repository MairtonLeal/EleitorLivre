import type { Metadata } from "next";
import { perfilExemplo } from "@/lib/tse/servico";
import { lerModelo, VisualizacaoPerfil } from "@/components/perfil/VisualizacaoPerfil";

export const runtime = "nodejs";
export const metadata: Metadata = { title: "Exemplo de perfil (fictício)" };

export default async function PaginaExemplo({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const [perfil, sp] = await Promise.all([perfilExemplo(), searchParams]);
  return <VisualizacaoPerfil perfil={perfil} modelo={lerModelo(sp.modelo)} />;
}
