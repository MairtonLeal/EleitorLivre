import { Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

/** Caixa "Entenda": explicação curta em linguagem simples. */
export function Explica({ titulo = "Entenda", children, className }: { titulo?: string; children: React.ReactNode; className?: string }) {
  return (
    <aside className={cn("flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-[15px] text-amber-950", className)}>
      <Lightbulb className="mt-0.5 size-5 shrink-0 text-amber-600" aria-hidden />
      <div>
        <p className="font-bold">{titulo}</p>
        <div className="mt-0.5 space-y-1">{children}</div>
      </div>
    </aside>
  );
}
