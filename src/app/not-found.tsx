import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NaoEncontrado() {
  return (
    <div className="mx-auto max-w-md space-y-4 py-16 text-center">
      <h1 className="text-3xl font-extrabold">Página não encontrada</h1>
      <p className="text-muted-foreground">O endereço pode estar incompleto. Que tal começar uma nova busca?</p>
      <Link href="/" className={buttonVariants()}>Ir para a busca</Link>
    </div>
  );
}
