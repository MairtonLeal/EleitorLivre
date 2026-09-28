import { iniciais } from "@/lib/format";
import { cn } from "@/lib/utils";

export function Avatar({ nome, fotoUrl, className }: { nome: string; fotoUrl: string | null; className?: string }) {
  if (fotoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={fotoUrl} alt={`Foto de ${nome}`} referrerPolicy="no-referrer" className={cn("rounded-full bg-muted object-cover", className)} />
    );
  }
  return (
    <span aria-label={`Sem foto de ${nome}`} className={cn("grid place-items-center rounded-full bg-slate-200 font-bold text-slate-600", className)}>
      {iniciais(nome)}
    </span>
  );
}
