# Tecnologia
- Next.js App Router + React + TypeScript + Tailwind v4 + componentes padrão shadcn/ui + lucide-react.
- Chamadas ao TSE SÓ pelo servidor: `src/lib/tse/servico.ts` → `client.ts` (cache + auditoria). Nunca `fetch` direto do navegador para o TSE.
- Novas URLs externas: adicionar em `src/lib/tse/endpoints.ts` e validar parâmetros com `validar()`.
- Regras de negócio puras em `src/lib/reeleicao.ts`/`montar-perfil.ts`, cobertas por `npm test`.
