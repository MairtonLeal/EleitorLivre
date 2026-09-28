/**
 * Testes das regras de negócio (sem rede). Rode com: npm test
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { montarPerfil } from "../src/lib/montar-perfil";
import { classificarResultado, mesmoCargo } from "../src/lib/reeleicao";
import { validar } from "../src/lib/validar";
import { montarResumo } from "../src/lib/share";
import type { TseCandidatoDetalhe } from "../src/lib/tse/types";

let ok = 0;
function t(nome: string, fn: () => void) {
  fn();
  ok++;
  console.log(`  ✔ ${nome}`);
}

t("classifica resultados do TSE", () => {
  assert.equal(classificarResultado("Eleito por QP"), "eleito");
  assert.equal(classificarResultado("ELEITO POR MÉDIA"), "eleito");
  assert.equal(classificarResultado("Não eleito"), "nao_eleito");
  assert.equal(classificarResultado("NÃO ELEITO"), "nao_eleito");
  assert.equal(classificarResultado("Suplente"), "suplente");
  assert.equal(classificarResultado("2º turno"), "segundo_turno");
  assert.equal(classificarResultado(null), "em_andamento");
  assert.equal(classificarResultado("#NULO"), "em_andamento");
});

t("compara cargos ignorando gênero e acentos", () => {
  assert.ok(mesmoCargo("VEREADOR", "Vereador(a)"));
  assert.ok(mesmoCargo("Deputada Estadual", "DEPUTADO ESTADUAL"));
  assert.ok(mesmoCargo("Prefeita", "prefeito"));
  assert.ok(!mesmoCargo("Deputado Federal", "Deputado Estadual"));
  assert.ok(!mesmoCargo("Vice-prefeito", "Prefeito"));
});

t("valida parâmetros e bloqueia injeção de caminho", () => {
  assert.equal(validar("uf", "pa"), "PA");
  assert.throws(() => validar("id", "12/../../x"));
  assert.throws(() => validar("ue", "SP/../"));
});

const demo = JSON.parse(
  readFileSync(path.join(process.cwd(), "data/demo/candidato-exemplo.json"), "utf8"),
) as TseCandidatoDetalhe;

t("perfil de exemplo: reeleição + linha do tempo Anteriores → Atual", () => {
  const p = montarPerfil(demo, { ano: 2024, ue: "00000", idEleicao: "2045202024", cargo: 13 });
  assert.equal(p.buscaReeleicao, true);
  assert.deepEqual(p.linhaDoTempo.map((e) => e.ano), [2012, 2016, 2018, 2020, 2024]);
  assert.equal(p.linhaDoTempo.at(-1)?.atual, true);
  assert.equal(p.resumo.vezesEleito, 3);
  assert.deepEqual(p.resumo.anosEleito, [2016, 2020, 2024]);
  assert.equal(p.resumo.vezesNaoEleito, 2);
  assert.equal(p.bens.total, 230500);
  assert.equal(p.nomeUrna, "Maria Exemplo");
});

t("detecta reeleição pelo histórico mesmo sem a marca do TSE", () => {
  const sem = { ...demo, stReeleicao: false };
  const p = montarPerfil(sem, { ano: 2024, ue: "00000", idEleicao: "1", cargo: 13 });
  assert.equal(p.buscaReeleicao, true);
  assert.match(p.motivoReeleicao, /2020/);
});

t("candidato sem histórico não é tratado como reeleição", () => {
  const novo = { ...demo, stReeleicao: false, eleicoesAnteriores: [] };
  const p = montarPerfil(novo, { ano: 2024, ue: "00000", idEleicao: "1", cargo: 13 });
  assert.equal(p.buscaReeleicao, false);
  assert.equal(p.linhaDoTempo.length, 1);
});

t("eleito antes para OUTRO cargo não conta como reeleição", () => {
  const outro = {
    ...demo,
    stReeleicao: false,
    eleicoesAnteriores: [{ nrAno: 2020, cargo: "Prefeito", situacaoTotalizacao: "Eleito" }],
  };
  const p = montarPerfil(outro, { ano: 2024, ue: "00000", idEleicao: "1", cargo: 13 });
  assert.equal(p.buscaReeleicao, false);
});

t("resumo para compartilhar contém dados essenciais e o link", () => {
  const p = montarPerfil(demo, { ano: 2024, ue: "00000", idEleicao: "2045202024", cargo: 13 });
  const txt = montarResumo(p, "https://eleitorlivre.app/x");
  assert.match(txt, /Maria Exemplo/);
  assert.match(txt, /99123/);
  assert.match(txt, /2016, 2020/);
  assert.match(txt, /https:\/\/eleitorlivre.app\/x/);
});

console.log(`\n${ok} testes passaram.`);
