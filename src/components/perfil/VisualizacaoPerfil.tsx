import Link from "next/link";
import { AlertTriangle, MessageCircle, Users } from "lucide-react";
import type { PerfilCandidato } from "@/lib/perfil-tipos";
import { caminhoPerfil, type Modelo } from "@/lib/share";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RegistrarRecente } from "@/components/Recentes";
import { Compartilhar } from "./Compartilhar";
import { Fontes } from "./Fontes";
import { TemplateSocial } from "./TemplateSocial";
import { TemplateZap } from "./TemplateZap";
import { AvisoNaoReeleicao } from "./AvisoNaoReeleicao";

export function lerModelo(valor: string | string[] | undefined): Modelo {
  return valor === "social" ? "social" : "zap";
}

/** Tela completa do perfil: troca de modelo, modelo escolhido, compartilhamento e fontes. */
export function VisualizacaoPerfil({ perfil, modelo }: { perfil: PerfilCandidato; modelo: Modelo }) {
  if (!perfil.buscaReeleicao) return <AvisoNaoReeleicao perfil={perfil} />;
  const caminho = caminhoPerfil(perfil, modelo);

  return (
    <div className="space-y-6">
      <RegistrarRecente
        caminho={caminho}
        nome={perfil.nomeUrna}
        numero={perfil.numero}
        partido={perfil.partido.sigla}
        cargo={perfil.cargo.nome}
        local={perfil.local}
        ano={perfil.ano}
        fotoUrl={perfil.fotoUrl}
      />

      {perfil.exemplo && (
        <div role="note" className="flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 p-3 text-amber-950">
          <AlertTriangle className="mt-0.5 size-5 shrink-0" />
          <p><strong>Exemplo fictício.</strong> Esta pessoa não existe; os dados servem só para mostrar como o perfil fica.</p>
        </div>
      )}

      <nav aria-label="Escolher modelo" className="grid grid-cols-2 gap-2 rounded-xl bg-muted p-1.5">
        <AbaModelo href={caminhoPerfil(perfil, "zap")} ativo={modelo === "zap"} icone={<MessageCircle />} texto="Modelo Zap" />
        <AbaModelo href={caminhoPerfil(perfil, "social")} ativo={modelo === "social"} icone={<Users />} texto="Modelo Social" />
      </nav>

      {modelo === "zap" ? <TemplateZap perfil={perfil} /> : <TemplateSocial perfil={perfil} />}

      <div className="grid gap-4 md:grid-cols-2">
        <Card id="compartilhar">
          <CardHeader><CardTitle>Compartilhe este perfil</CardTitle></CardHeader>
          <CardContent><Compartilhar perfil={perfil} caminho={caminho} /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Transparência</CardTitle></CardHeader>
          <CardContent><Fontes perfil={perfil} /></CardContent>
        </Card>
      </div>
    </div>
  );
}

function AbaModelo({ href, ativo, icone, texto }: { href: string; ativo: boolean; icone: React.ReactNode; texto: string }) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-current={ativo ? "page" : undefined}
      className={cn(
        "flex h-11 items-center justify-center gap-2 rounded-lg font-semibold [&_svg]:size-5",
        ativo ? "bg-card shadow-sm" : "text-muted-foreground hover:text-foreground",
      )}
    >
      {icone} {texto}
    </Link>
  );
}
