import { Loader2 } from "lucide-react";

export default function Carregando() {
  return (
    <div className="flex flex-col items-center gap-3 py-20 text-center text-muted-foreground" role="status">
      <Loader2 className="size-10 animate-spin text-primary" />
      <p className="text-lg font-semibold text-foreground">Buscando os dados no TSE…</p>
      <p>Isso pode levar alguns segundos na primeira vez. Depois fica guardado e abre rapidinho.</p>
    </div>
  );
}
