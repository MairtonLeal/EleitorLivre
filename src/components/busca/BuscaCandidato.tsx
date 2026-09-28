"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, MessageCircle, Search, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label, Select } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cargoPorCodigo, cargosDaEleicao, UFS } from "@/lib/tse/cargos";
import { normalizarBusca } from "@/lib/format";
import type { Modelo } from "@/lib/share";
import { cn } from "@/lib/utils";

interface Eleicao { id: string; ano: number; nome: string; tipo: "municipal" | "geral" }
interface Municipio { codigo: string; nome: string }
interface CandidatoItem { id: number; nomeUrna: string; nomeCompleto: string; numero: number | null; partido: string; situacao: string; reeleicao: boolean | null }

async function api<T>(url: string): Promise<T> {
  const r = await fetch(url);
  const j = (await r.json().catch(() => ({}))) as { dados?: T; erro?: string };
  if (!r.ok || j.dados === undefined) throw new Error(j.erro ?? "Não foi possível carregar agora.");
  return j.dados;
}

function Passo({ n, titulo, ajuda, children, ativo = true }: { n: number; titulo: string; ajuda?: string; children: React.ReactNode; ativo?: boolean }) {
  return (
    <section className={cn("flex gap-3 sm:gap-4", !ativo && "opacity-50")} aria-disabled={!ativo}>
      <div className="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-base font-bold text-white">{n}</div>
      <div className="min-w-0 flex-1 space-y-2 pb-2">
        <h2 className="text-lg font-bold leading-9">{titulo}</h2>
        {ajuda && <p className="-mt-1 text-sm text-muted-foreground">{ajuda}</p>}
        {children}
      </div>
    </section>
  );
}

export function BuscaCandidato() {
  const router = useRouter();
  const [eleicoes, setEleicoes] = useState<Eleicao[]>([]);
  const [eleicaoId, setEleicaoId] = useState("");
  const [cargo, setCargo] = useState("");
  const [uf, setUf] = useState("");
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [municipio, setMunicipio] = useState("");
  const [candidatos, setCandidatos] = useState<CandidatoItem[]>([]);
  const [filtro, setFiltro] = useState("");
  const [soReeleicao, setSoReeleicao] = useState(false);
  const [escolhido, setEscolhido] = useState<CandidatoItem | null>(null);
  const [modelo, setModelo] = useState<Modelo>("zap");
  const [carregando, setCarregando] = useState<string | null>("eleicoes");
  const [erro, setErro] = useState<string | null>(null);

  const eleicao = eleicoes.find((e) => e.id === eleicaoId);
  const ehPresidente = cargo === "1";
  const municipal = eleicao?.tipo === "municipal";
  const ue = ehPresidente ? "BR" : municipal ? municipio : uf;

  useEffect(() => {
    api<Eleicao[]>("/api/tse/eleicoes")
      .then((l) => {
        setEleicoes(l);
        if (l[0]) setEleicaoId(l[0].id);
      })
      .catch((e: Error) => setErro(e.message))
      .finally(() => setCarregando(null));
  }, []);

  // Municípios (só em eleição municipal)
  useEffect(() => {
    setMunicipios([]);
    setMunicipio("");
    if (!municipal || !uf || !eleicaoId) return;
    setCarregando("municipios");
    api<Municipio[]>(`/api/tse/municipios?eleicao=${eleicaoId}&uf=${uf}`)
      .then(setMunicipios)
      .catch((e: Error) => setErro(e.message))
      .finally(() => setCarregando(null));
  }, [municipal, uf, eleicaoId]);

  // Candidatos
  useEffect(() => {
    setCandidatos([]);
    setEscolhido(null);
    if (!eleicao || !cargo || !ue) return;
    setErro(null);
    setCarregando("candidatos");
    api<CandidatoItem[]>(`/api/tse/candidatos?ano=${eleicao.ano}&ue=${ue}&eleicao=${eleicao.id}&cargo=${cargo}`)
      .then(setCandidatos)
      .catch((e: Error) => setErro(e.message))
      .finally(() => setCarregando(null));
  }, [eleicao, cargo, ue]);

  const temMarcaReeleicao = candidatos.some((c) => c.reeleicao !== null);
  const filtrados = useMemo(() => {
    const f = normalizarBusca(filtro);
    return candidatos
      .filter((c) => !soReeleicao || c.reeleicao === true)
      .filter((c) => !f || normalizarBusca(`${c.nomeUrna} ${c.nomeCompleto} ${c.numero ?? ""} ${c.partido}`).includes(f))
      .sort((a, b) => a.nomeUrna.localeCompare(b.nomeUrna, "pt-BR"))
      .slice(0, 40);
  }, [candidatos, filtro, soReeleicao]);

  function gerar() {
    if (!eleicao || !escolhido || !ue) return;
    router.push(`/perfil/${eleicao.ano}/${ue}/${eleicao.id}/${cargo}/${escolhido.id}?modelo=${modelo}`);
  }

  const cargos = eleicao ? cargosDaEleicao(eleicao.tipo) : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Encontre o candidato</CardTitle>
        <CardDescription>São poucos passos. Você pode voltar e mudar qualquer escolha.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {erro && (
          <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-900">
            {erro}
          </div>
        )}

        <Passo n={1} titulo="Qual eleição?" ajuda="Eleições municipais escolhem prefeito e vereador. As gerais escolhem presidente, governador, senador e deputados.">
          <Select
            aria-label="Eleição"
            value={eleicaoId}
            disabled={!eleicoes.length}
            onChange={(e) => {
              setEleicaoId(e.target.value);
              setCargo("");
            }}
          >
            {carregando === "eleicoes" && <option>Carregando…</option>}
            {eleicoes.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nome} ({e.tipo === "municipal" ? "municipal" : "geral"})
              </option>
            ))}
          </Select>
        </Passo>

        <Passo n={2} titulo="Para qual cargo?" ativo={!!eleicao}>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {cargos.map((c) => (
              <button
                key={c.codigo}
                type="button"
                onClick={() => setCargo(String(c.codigo))}
                className={cn(
                  "rounded-lg border p-3 text-left transition-colors",
                  cargo === String(c.codigo) ? "border-primary bg-accent ring-2 ring-primary" : "bg-card hover:bg-muted",
                )}
              >
                <span className="block font-semibold">{c.nome}</span>
                <span className="block text-sm text-muted-foreground">{c.explicacao}</span>
              </button>
            ))}
          </div>
        </Passo>

        {!ehPresidente && (
          <Passo n={3} titulo={municipal ? "Qual estado e cidade?" : "Qual estado?"} ativo={!!cargo}>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor="uf">Estado</Label>
                <Select id="uf" value={uf} disabled={!cargo} onChange={(e) => setUf(e.target.value)}>
                  <option value="">Escolha o estado</option>
                  {UFS.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </Select>
              </div>
              {municipal && (
                <div>
                  <Label htmlFor="municipio">Cidade</Label>
                  <Select id="municipio" value={municipio} disabled={!municipios.length} onChange={(e) => setMunicipio(e.target.value)}>
                    <option value="">{carregando === "municipios" ? "Carregando cidades…" : "Escolha a cidade"}</option>
                    {municipios.map((m) => (
                      <option key={m.codigo} value={m.codigo}>{m.nome}</option>
                    ))}
                  </Select>
                </div>
              )}
            </div>
          </Passo>
        )}

        <Passo n={ehPresidente ? 3 : 4} titulo="Quem é o candidato?" ajuda="Digite o nome que aparece na urna ou o número." ativo={candidatos.length > 0 || carregando === "candidatos"}>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input
              aria-label="Nome ou número do candidato"
              placeholder={carregando === "candidatos" ? "Carregando lista…" : "Ex.: Maria ou 12345"}
              className="pl-10"
              value={filtro}
              disabled={!candidatos.length}
              onChange={(e) => setFiltro(e.target.value)}
            />
          </div>
          {temMarcaReeleicao && (
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" className="size-5 accent-primary" checked={soReeleicao} onChange={(e) => setSoReeleicao(e.target.checked)} />
              Mostrar só quem está tentando a reeleição
            </label>
          )}
          {carregando === "candidatos" && (
            <p className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin" /> Buscando candidatos no TSE…</p>
          )}
          {candidatos.length > 0 && (
            <ul className="max-h-80 divide-y overflow-y-auto rounded-lg border bg-card" aria-label="Candidatos encontrados">
              {filtrados.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => setEscolhido(c)}
                    className={cn("flex w-full items-center justify-between gap-3 px-3 py-3 text-left hover:bg-muted", escolhido?.id === c.id && "bg-accent")}
                  >
                    <span className="min-w-0">
                      <span className="block truncate font-semibold">{c.nomeUrna}</span>
                      <span className="block truncate text-sm text-muted-foreground">
                        {c.numero} · {c.partido} · {c.situacao}
                      </span>
                    </span>
                    <span className="flex shrink-0 items-center gap-2">
                      {c.reeleicao && <Badge variant="success">Reeleição</Badge>}
                      {escolhido?.id === c.id && <Check className="size-5 text-primary" aria-label="Escolhido" />}
                    </span>
                  </button>
                </li>
              ))}
              {filtrados.length === 0 && <li className="p-3 text-sm text-muted-foreground">Ninguém encontrado com esse nome.</li>}
            </ul>
          )}
        </Passo>

        <Passo n={ehPresidente ? 4 : 5} titulo="Como quer ver o perfil?" ativo={!!escolhido}>
          <div className="grid gap-3 sm:grid-cols-2">
            <EscolhaModelo ativo={modelo === "zap"} onClick={() => setModelo("zap")} icone={<MessageCircle />} cor="bg-[#25d366]" titulo="Zap" texto="Parece uma conversa de WhatsApp: perguntas e respostas em balõezinhos." />
            <EscolhaModelo ativo={modelo === "social"} onClick={() => setModelo("social")} icone={<Users />} cor="bg-social" titulo="Social" texto="Parece um perfil de Facebook/LinkedIn: capa, 'sobre' e experiência." />
          </div>
        </Passo>

        <Button size="lg" className="w-full" disabled={!escolhido} onClick={gerar}>
          Gerar perfil {escolhido ? `de ${escolhido.nomeUrna}` : ""}
        </Button>
        {eleicao && cargo && cargoPorCodigo(cargo) && (
          <p className="text-center text-sm text-muted-foreground">
            O perfil só é montado para quem está <strong>tentando a reeleição</strong>. Se não for o caso, avisaremos.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function EscolhaModelo({ ativo, onClick, icone, cor, titulo, texto }: { ativo: boolean; onClick: () => void; icone: React.ReactNode; cor: string; titulo: string; texto: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={ativo}
      className={cn("flex items-start gap-3 rounded-lg border p-4 text-left", ativo ? "border-primary bg-accent ring-2 ring-primary" : "bg-card hover:bg-muted")}
    >
      <span className={cn("grid size-11 shrink-0 place-items-center rounded-full text-white [&_svg]:size-6", cor)}>{icone}</span>
      <span>
        <span className="block text-base font-bold">{titulo}</span>
        <span className="block text-sm text-muted-foreground">{texto}</span>
      </span>
    </button>
  );
}
