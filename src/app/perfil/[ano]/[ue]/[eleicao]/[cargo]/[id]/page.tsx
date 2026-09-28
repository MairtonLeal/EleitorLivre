import type { Metadata } from "next";
import Link from "next/link";
import { cache } from "react";
import { WifiOff } from "lucide-react";
import { gerarPerfil, lerPerfilSalvo } from "@/lib/tse/servico";
import { ParametroInvalido } from "@/lib/validar";
import type { PerfilCandidato } from "@/lib/perfil-tipos";
import { buttonVariants } from "@/components/ui/button";
import { lerModelo, VisualizacaoPerfil } from "@/components/perfil/VisualizacaoPerfil";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = { ano: string; ue: string; eleicao: string; cargo: string; id: string };
type Props = { params: Promise<Params>; searchParams: Promise<Record<string, string | string[] | undefined>> };

/** Uma única busca por requisição (compartilhada entre metadata e página). */
const obterPerfil = cache(async (p: Params): Promise<{ perfil: PerfilCandidato | null; erro?: string; offline?: boolean }> => {
  try {
    return { perfil: await gerarPerfil({ ano: p.ano, ue: p.ue, idEleicao: p.eleicao, cargo: p.cargo, id: p.id }) };
  } catch (e) {
    if (e instanceof ParametroInvalido) return { perfil: null, erro: "O endereço deste perfil está incorreto." };
    const salvo = await lerPerfilSalvo(p.eleicao, p.id).catch(() => null);
    if (salvo) return { perfil: salvo, offline: true };
    return { perfil: null, erro: e instanceof Error ? e.message : "Não foi possível carregar o perfil." };
  }
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { perfil } = await obterPerfil(await params);
  if (!perfil) return { title: "Perfil não encontrado" };
  const titulo = `${perfil.nomeUrna} (${perfil.numero} · ${perfil.partido.sigla}) — ${perfil.cargo.nome}`;
  const descricao = perfil.buscaReeleicao
    ? `Busca reeleição em ${perfil.local}. Eleito(a) ${perfil.resumo.vezesEleito}x. Veja trajetória, bens e campanha com dados do TSE.`
    : `Veja os dados oficiais do TSE sobre ${perfil.nomeUrna}.`;
  return {
    title: titulo,
    description: descricao,
    openGraph: { title: titulo, description: descricao, images: perfil.fotoUrl ? [{ url: perfil.fotoUrl }] : undefined },
    twitter: { card: "summary", title: titulo, description: descricao },
  };
}

export default async function PaginaPerfil({ params, searchParams }: Props) {
  const [p, sp] = await Promise.all([params, searchParams]);
  const { perfil, erro, offline } = await obterPerfil(p);

  if (!perfil) {
    return (
      <div className="mx-auto max-w-xl space-y-4 rounded-xl border bg-card p-6 text-center">
        <WifiOff className="mx-auto size-10 text-muted-foreground" />
        <h1 className="text-2xl font-bold">Não conseguimos abrir este perfil</h1>
        <p className="text-muted-foreground">{erro}</p>
        <p className="text-sm text-muted-foreground">Às vezes o site do TSE fica lento ou fora do ar. Espere um pouco e tente de novo.</p>
        <Link href="/" className={buttonVariants()}>Voltar para a busca</Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {offline && (
        <p role="status" className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-950">
          O TSE não respondeu agora. Mostrando a última cópia salva deste perfil ({new Date(perfil.geradoEm).toLocaleString("pt-BR")}).
        </p>
      )}
      <VisualizacaoPerfil perfil={perfil} modelo={lerModelo(sp.modelo)} />
    </div>
  );
}
