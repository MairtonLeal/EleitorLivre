# Eleitor Livre

Perfis educativos de **candidatos à reeleição** com dados oficiais do TSE, em dois modelos:
**Zap** (conversa estilo WhatsApp) e **Social** (perfil estilo Facebook/LinkedIn).

- Busca passo a passo: eleição → cargo → estado/cidade → candidato → modelo
- Só gera perfil para quem busca reeleição; avisa quando não há histórico
- Linha do tempo **Anteriores → Atual** com vitórias e derrotas
- Compartilhamento por link do site ou por resumo com dados essenciais
- Cache JSON local, snapshot de perfis e **trilha de auditoria** com SHA-256
- Tema claro, responsivo (celular e computador), textos simples

## Rodando

```bash
npm install
cp .env.example .env.local   # ajuste NEXT_PUBLIC_SITE_URL em produção
npm run dev                  # http://localhost:3000
npm test                     # testa as regras de reeleição/linha do tempo
```

Sem acesso ao TSE? Abra **/exemplo** (candidato fictício) para ver os dois modelos.

## Páginas

| Rota | O que é |
|---|---|
| `/` | Busca |
| `/perfil/{ano}/{ue}/{idEleicao}/{cargo}/{id}?modelo=zap\|social` | Perfil (link compartilhável) |
| `/exemplo?modelo=zap\|social` | Perfil fictício de demonstração |
| `/auditoria` | Registro de todas as consultas ao TSE |
| `/como-funciona` | Explicação e glossário |

## API interna

| Rota | Parâmetros |
|---|---|
| `GET /api/tse/eleicoes` | — |
| `GET /api/tse/municipios` | `eleicao`, `uf` |
| `GET /api/tse/candidatos` | `ano`, `ue`, `eleicao`, `cargo` |
| `GET /api/tse/perfil` | `ano`, `ue`, `eleicao`, `cargo`, `id` |
| `GET /api/auditoria` | `limite` (opcional) |

## Arquitetura

Veja [`docs/ARQUITETURA.md`](docs/ARQUITETURA.md): diagramas, endpoints, regras de negócio, trilha de auditoria, armazenamento local e checklist.

## Stack

Next.js (App Router) · React · TypeScript · Tailwind CSS v4 · componentes no padrão shadcn/ui (`components.json` pronto para `npx shadcn add ...`) · lucide-react.

## Observações

- As APIs do DivulgaCandContas não têm documentação oficial; os caminhos ficam centralizados em `src/lib/tse/endpoints.ts`.
- O TSE pode recusar acessos de fora do Brasil; prefira hospedagem em região brasileira (ex.: `gru1` na Vercel).
- Na Vercel, o disco é temporário (`/tmp`). Para cache/auditoria permanentes, use `ELEITOR_DATA_DIR` com volume persistente ou troque `src/lib/cache.ts` por um KV.
