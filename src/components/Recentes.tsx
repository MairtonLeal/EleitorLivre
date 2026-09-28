"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { History, Trash2 } from "lucide-react";
import { lerRecentes, limparRecentes, salvarRecente, type PerfilRecente } from "@/lib/local-store";
import { iniciais } from "@/lib/format";

/** Lista os perfis vistos neste aparelho (localStorage). */
export function Recentes() {
  const [lista, setLista] = useState<PerfilRecente[]>([]);
  useEffect(() => setLista(lerRecentes()), []);
  if (!lista.length) return null;
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-bold"><History className="size-5" /> Vistos recentemente</h2>
        <button
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          onClick={() => {
            limparRecentes();
            setLista([]);
          }}
        >
          <Trash2 className="size-4" /> Limpar
        </button>
      </div>
      <p className="text-sm text-muted-foreground">Ficam salvos só neste aparelho, para você abrir de novo rapidinho.</p>
      <ul className="grid gap-2 sm:grid-cols-2">
        {lista.map((r) => (
          <li key={r.caminho}>
            <Link href={r.caminho} className="flex items-center gap-3 rounded-lg border bg-card p-3 hover:bg-muted">
              {r.fotoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={r.fotoUrl} alt="" referrerPolicy="no-referrer" className="size-11 rounded-full object-cover" />
              ) : (
                <span className="grid size-11 place-items-center rounded-full bg-muted font-bold">{iniciais(r.nome)}</span>
              )}
              <span className="min-w-0">
                <span className="block truncate font-semibold">{r.nome}</span>
                <span className="block truncate text-sm text-muted-foreground">{r.cargo} · {r.local} · {r.ano}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Invisível: registra o perfil aberto na lista de recentes. */
export function RegistrarRecente(props: Omit<PerfilRecente, "vistoEm">) {
  useEffect(() => {
    salvarRecente({ ...props, vistoEm: new Date().toISOString() });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.caminho]);
  return null;
}
