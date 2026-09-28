"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Link2, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { linksRedes, montarResumo } from "@/lib/share";
import type { PerfilCandidato } from "@/lib/perfil-tipos";

/**
 * Compartilhamento: link do próprio site (abre o perfil) ou
 * resumo com os dados essenciais (texto para colar em qualquer lugar).
 */
export function Compartilhar({ perfil, caminho }: { perfil: PerfilCandidato; caminho: string }) {
  const [url, setUrl] = useState(caminho);
  const [copiado, setCopiado] = useState<"link" | "resumo" | null>(null);
  const [temShare, setTemShare] = useState(false);

  useEffect(() => {
    setUrl(new URL(caminho, window.location.origin).toString());
    setTemShare(typeof navigator !== "undefined" && typeof navigator.share === "function");
  }, [caminho]);

  const resumo = montarResumo(perfil, url);
  const redes = linksRedes(url, resumo);

  async function copiar(texto: string, tipo: "link" | "resumo") {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(tipo);
      setTimeout(() => setCopiado(null), 2500);
    } catch {
      window.prompt("Copie o texto abaixo:", texto);
    }
  }

  async function compartilharNativo() {
    try {
      await navigator.share({ title: `${perfil.nomeUrna} — Eleitor Livre`, text: resumo, url });
    } catch {
      /* usuário cancelou */
    }
  }

  return (
    <div className="space-y-3">
      {temShare && (
        <Button className="w-full" size="lg" onClick={compartilharNativo}>
          <Share2 /> Compartilhar
        </Button>
      )}
      <div className="grid grid-cols-3 gap-2">
        <a className="flex h-12 items-center justify-center rounded-lg bg-[#25d366] font-semibold text-[#0b3d2b]" href={redes.whatsapp} target="_blank" rel="noopener noreferrer">
          WhatsApp
        </a>
        <a className="flex h-12 items-center justify-center rounded-lg bg-social font-semibold text-white" href={redes.facebook} target="_blank" rel="noopener noreferrer">
          Facebook
        </a>
        <a className="flex h-12 items-center justify-center rounded-lg bg-pro font-semibold text-white" href={redes.linkedin} target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" onClick={() => copiar(url, "link")}>
          {copiado === "link" ? <Check /> : <Link2 />} {copiado === "link" ? "Copiado!" : "Copiar link"}
        </Button>
        <Button variant="outline" onClick={() => copiar(resumo, "resumo")}>
          {copiado === "resumo" ? <Check /> : <Copy />} {copiado === "resumo" ? "Copiado!" : "Copiar resumo"}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        <strong>Link</strong> abre este perfil completo. <strong>Resumo</strong> é um textinho com o essencial para colar em grupos.
      </p>
    </div>
  );
}
