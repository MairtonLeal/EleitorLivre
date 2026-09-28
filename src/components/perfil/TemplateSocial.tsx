import { Briefcase, Cake, GraduationCap, Landmark, MapPin, ThumbsUp, Trophy, Wallet } from "lucide-react";
import type { PerfilCandidato } from "@/lib/perfil-tipos";
import { formatarData, formatarDinheiro } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Explica } from "@/components/Explica";
import { Avatar } from "./Avatar";
import { LinhaDoTempo } from "./LinhaDoTempo";

/** Modelo "Social": perfil no estilo Facebook/LinkedIn (capa, sobre, experiência e publicações). */
export function TemplateSocial({ perfil: p }: { perfil: PerfilCandidato }) {
  const eleitoAntes = p.resumo.anosEleito.filter((a) => a < p.ano);
  return (
    <div className="space-y-4">
      {/* Capa + cabeçalho */}
      <Card className="overflow-hidden">
        <div className="h-28 bg-gradient-to-r from-social via-sky-400 to-pro sm:h-40" aria-hidden />
        <div className="px-4 pb-5 sm:px-6">
          <div className="-mt-14 flex flex-col items-center gap-3 sm:-mt-16 sm:flex-row sm:items-end">
            <Avatar nome={p.nomeUrna} fotoUrl={p.fotoUrl} className="size-28 border-4 border-white text-3xl shadow sm:size-32" />
            <div className="min-w-0 flex-1 text-center sm:pb-1 sm:text-left">
              <h2 className="text-2xl font-extrabold leading-tight sm:text-3xl">{p.nomeUrna}</h2>
              <p className="text-muted-foreground">
                Candidato(a) à reeleição · {p.cargo.nome} · {p.local}
              </p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
            <Badge className="text-sm">Nº {p.numero ?? "—"}</Badge>
            <Badge className="text-sm">{p.partido.sigla}</Badge>
            <Badge variant="success" className="text-sm">Busca reeleição</Badge>
            <Badge variant="muted" className="text-sm">Candidatura: {p.situacaoCandidatura}</Badge>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Coluna lateral */}
        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Sobre</CardTitle></CardHeader>
            <CardContent className="space-y-2.5 text-[15px]">
              {p.nomeCompleto && <Item icone={<Landmark />}>Nome completo: <strong>{p.nomeCompleto}</strong></Item>}
              {p.idade != null && <Item icone={<Cake />}>{p.idade} anos</Item>}
              {p.ocupacao && <Item icone={<Briefcase />}>{p.ocupacao}</Item>}
              {p.escolaridade && <Item icone={<GraduationCap />}>{p.escolaridade}</Item>}
              {p.naturalidade && <Item icone={<MapPin />}>Nasceu em {p.naturalidade}</Item>}
              {p.sites.length > 0 && (
                <div className="pt-1">
                  {p.sites.map((s) => (
                    <a key={s} href={s} target="_blank" rel="noopener noreferrer nofollow" className="block truncate text-primary underline">{s}</a>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Em números</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-3 gap-2 text-center">
              <Numero valor={p.resumo.disputas} rotulo="eleições disputadas" />
              <Numero valor={p.resumo.vezesEleito} rotulo="vitórias" cor="text-green-700" />
              <Numero valor={p.resumo.vezesNaoEleito} rotulo="derrotas / suplência" />
            </CardContent>
          </Card>
          {p.cargo.explicacao && (
            <Explica titulo={`O que faz um(a) ${p.cargo.nome.toLowerCase()}?`}>
              <p>{p.cargo.explicacao}</p>
            </Explica>
          )}
        </div>

        {/* Coluna principal */}
        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Trophy className="size-5 text-amber-500" /> Experiência política</CardTitle>
              <p className="text-sm text-muted-foreground">
                {eleitoAntes.length ? `Eleito(a) antes em ${eleitoAntes.join(", ")}. ` : ""}
                {p.motivoReeleicao}
              </p>
            </CardHeader>
            <CardContent>
              <LinhaDoTempo perfil={p} />
            </CardContent>
          </Card>

          <Publicacao perfil={p} titulo="Bens declarados ao TSE">
            <p className="text-2xl font-extrabold">{formatarDinheiro(p.bens.total)}</p>
            {p.bens.itens.length > 0 ? (
              <ul className="mt-2 divide-y rounded-lg border text-[15px]">
                {[...p.bens.itens].sort((a, b) => b.valor - a.valor).slice(0, 6).map((b, i) => (
                  <li key={i} className="flex justify-between gap-3 p-2.5">
                    <span className="min-w-0"><span className="block font-semibold">{b.tipo}</span><span className="block truncate text-sm text-muted-foreground">{b.descricao}</span></span>
                    <span className="shrink-0 font-semibold">{formatarDinheiro(b.valor)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">Nenhum bem declarado.</p>
            )}
            <p className="mt-2 text-sm text-muted-foreground">Valor informado pelo(a) próprio(a) candidato(a), sem conferência de preço de mercado.</p>
          </Publicacao>

          <Publicacao perfil={p} titulo="Dinheiro da campanha">
            {p.financas ? (
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-green-50 p-3"><p className="text-sm text-green-800">Recebeu</p><p className="text-xl font-bold">{formatarDinheiro(p.financas.recebido)}</p></div>
                <div className="rounded-lg bg-red-50 p-3"><p className="text-sm text-red-800">Gastou (contratado)</p><p className="text-xl font-bold">{formatarDinheiro(p.financas.gasto)}</p></div>
              </div>
            ) : (
              <p className="text-muted-foreground">Ainda não há prestação de contas publicada.</p>
            )}
            <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground"><Wallet className="size-4" /> É o &quot;extrato&quot; da campanha, enviado ao TSE.</p>
          </Publicacao>
        </div>
      </div>
    </div>
  );
}

function Item({ icone, children }: { icone: React.ReactNode; children: React.ReactNode }) {
  return (
    <p className="flex items-start gap-2.5">
      <span className="mt-0.5 text-muted-foreground [&_svg]:size-5">{icone}</span>
      <span>{children}</span>
    </p>
  );
}

function Numero({ valor, rotulo, cor }: { valor: number; rotulo: string; cor?: string }) {
  return (
    <div className="rounded-lg bg-muted p-2">
      <p className={`text-2xl font-extrabold ${cor ?? ""}`}>{valor}</p>
      <p className="text-xs leading-tight text-muted-foreground">{rotulo}</p>
    </div>
  );
}

function Publicacao({ perfil, titulo, children }: { perfil: PerfilCandidato; titulo: string; children: React.ReactNode }) {
  return (
    <Card>
      <div className="flex items-center gap-3 p-4 pb-2">
        <Avatar nome={perfil.nomeUrna} fotoUrl={perfil.fotoUrl} className="size-10 text-sm" />
        <div className="min-w-0">
          <p className="truncate font-semibold leading-tight">{perfil.nomeUrna}</p>
          <p className="text-xs text-muted-foreground">Dados do TSE · {formatarData(perfil.geradoEm)}</p>
        </div>
      </div>
      <div className="px-4 pb-3">
        <p className="mb-2 font-bold">{titulo}</p>
        {children}
      </div>
      <div className="flex items-center gap-2 border-t px-4 py-2 text-sm text-muted-foreground">
        <ThumbsUp className="size-4" /> Achou útil? Compartilhe com quem vai votar.
      </div>
    </Card>
  );
}
