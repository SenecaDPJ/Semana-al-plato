import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { JSDOM } from "jsdom";
import { seed } from "../src/domain.js";
const html = await readFile(
  new URL("../dist/index.html", import.meta.url),
  "utf8",
);
function boot(raw, theme, nativeInvoke) {
  const dom = new JSDOM(
    html.replace(/<script type="module">[\s\S]*?<\/script>/, ""),
    {
      url: "http://localhost:1420",
      runScripts: "outside-only",
      pretendToBeVisual: true,
    },
  );
  const w = dom.window;
  w.structuredClone = structuredClone;
  w.HTMLElement.prototype.scrollIntoView = function () {};
  w.HTMLDialogElement.prototype.showModal = w.HTMLDialogElement.prototype.show =
    function () {
      this.open = true;
    };
  w.HTMLDialogElement.prototype.close = function () {
    this.open = false;
    this.dispatchEvent(new w.Event("close"));
  };
  if (raw) w.localStorage.setItem("calendario-comidas.v1", raw);
  if (theme) w.localStorage.setItem("calendario-comidas.theme", theme);
  if (nativeInvoke) w.__TAURI__ = { core: { invoke: nativeInvoke } };
  w.eval(html.match(/<script type="module">([\s\S]*?)<\/script>/)[1]);
  const $ = (s) => w.document.querySelector(s);
  const click = (s) => {
    const b = $(s);
    assert.ok(b, `Falta ${s}`);
    b.click();
  };
  const input = (s, value) => {
    $(s).value = value;
    $(s).dispatchEvent(new w.Event("input", { bubbles: true }));
  };
  const submit = (s) =>
    $(s).dispatchEvent(
      new w.Event("submit", { bubbles: true, cancelable: true }),
    );
  return {
    dom,
    w,
    $,
    click,
    input,
    submit,
    data: () => JSON.parse(w.localStorage.getItem("calendario-comidas.v1")),
  };
}
test("exportación nativa: envía la copia, informa del resultado y respeta la cancelación", async () => {
  const calls = [];
  const b = boot(undefined, undefined, async (command, args) => {
    calls.push({ command, args });
    return true;
  });
  await b.$("#export").onclick();
  assert.equal(calls[0].command, "export_backup");
  const copy = JSON.parse(calls[0].args.json);
  assert.equal(copy.version, 1);
  assert.equal(copy.items.length, 60);
  assert.deepEqual(copy.plan, {});
  assert.match(b.$("#toast").textContent, /Copia exportada/);
  b.dom.window.close();

  const cancelled = boot(undefined, undefined, async () => false);
  await cancelled.$("#export").onclick();
  assert.equal(cancelled.$("#toast").hidden, true);
  cancelled.dom.window.close();

  const failed = boot(undefined, undefined, async () => { throw Error("Acceso denegado"); });
  await failed.$("#export").onclick();
  assert.match(failed.$("#toast").textContent, /Acceso denegado/);
  failed.dom.window.close();
});
test("tema claro y oscuro: alternancia, accesibilidad y preferencia persistente", () => {
  const b = boot();
  assert.equal(b.w.document.documentElement.dataset.theme, "light");
  assert.equal(b.$("#theme-toggle").getAttribute("aria-label"), "Activar tema oscuro");
  b.click("#theme-toggle");
  assert.equal(b.w.document.documentElement.dataset.theme, "dark");
  assert.equal(b.$("#theme-toggle").getAttribute("aria-label"), "Activar tema claro");
  assert.equal(b.w.localStorage.getItem("calendario-comidas.theme"), "dark");
  assert.equal(b.w.localStorage.getItem("calendario-comidas.v1"), null);
  const reopened = boot(undefined, "dark");
  assert.equal(reopened.w.document.documentElement.dataset.theme, "dark");
  reopened.click("#theme-toggle");
  assert.equal(reopened.w.localStorage.getItem("calendario-comidas.theme"), "light");
  reopened.dom.window.close();
  b.dom.window.close();
});
test("calendario, cancelar/confirmar, múltiples entradas, navegación y persistencia", () => {
  const { dom, w, $, click, data } = boot();
  assert.equal(w.document.querySelectorAll(".cell").length, 21);
  click('[data-catalog="meal"]');
  assert.equal(w.document.querySelectorAll(".catalog-row").length, 30);
  click('[data-select="meal-0-0"]');
  click(".cell");
  click("#cancel-confirm");
  assert.equal(w.document.querySelectorAll(".entry").length, 0);
  click(".cell");
  click("#accept-confirm");
  assert.equal(w.document.querySelectorAll(".entry").length, 1);
  click('[data-catalog="food"]');
  click('[data-select="food-0-0"]');
  click(".cell");
  click("#accept-confirm");
  assert.equal(w.document.querySelectorAll(".entry").length, 2);
  click("#next");
  assert.equal(w.document.querySelectorAll(".entry").length, 0);
  click("#prev");
  assert.equal(w.document.querySelectorAll(".entry").length, 2);
  const restored = boot(JSON.stringify(data()));
  assert.equal(restored.w.document.querySelectorAll(".entry").length, 2);
  restored.dom.window.close();
  click(".entry");
  click("#remove-entry");
  click("#accept-confirm");
  assert.equal(w.document.querySelectorAll(".entry").length, 1);
  assert.equal(data().items.length, 60);
  dom.window.close();
});
test("el + de cada momento confirma directamente su casilla para comida, alimento y receta", () => {
  const { dom, $, click, data } = boot();
  for (const [slot, choice, selection, kind] of [
    ["Desayuno", "meal", '[data-select="meal-0-0"]', "meal"],
    ["Comida", "food", '[data-select="food-0-0"]', "food"],
    ["Cena", "recipe", '[data-plan="recipe-1"]', "recipe"],
  ]) {
    const cell = `[data-cell$="|${slot}"]`;
    click(`${cell} [data-add]`);
    assert.equal($(".add-choices").querySelectorAll("button").length, 3);
    click(`[data-add-kind="${choice}"]`);
    if (choice === "recipe") assert.equal($("#recipe-list").open, true);
    click(selection);
    assert.equal($("#confirm").open, true);
    assert.match($("#confirm").textContent, new RegExp(slot.toLowerCase()));
    assert.equal($(cell).querySelectorAll(".entry").length, 0);
    click("#accept-confirm");
    assert.equal(data().plan[$(cell).dataset.cell][0].kind, kind);
  }
  dom.window.close();
});
test("cancelar la confirmación de una casilla no deja selección pendiente", () => {
  const { dom, $, click, data } = boot();
  click('[data-cell$="|Desayuno"] [data-add]');
  click('[data-add-kind="food"]');
  click('[data-select="food-0-0"]');
  click("#cancel-confirm");
  assert.equal($("#placement").hidden, true);
  assert.equal(data(), null);
  click('[data-catalog="meal"]');
  click('[data-select="meal-0-0"]');
  assert.equal($("#confirm").open, false);
  assert.equal($("#placement").hidden, false);
  dom.window.close();
});
test("clonar un elemento desde su menú a otra fecha de la semana", () => {
  const state = seed();
  state.plan["2026-11-02|Desayuno"] = [
    { id: "planned-meal", refId: "meal-0-0", kind: "meal" },
  ];
  const { dom, w, $, click, data } = boot(JSON.stringify(state));
  $("#week").value = "2026-11-02";
  $("#week").dispatchEvent(new w.Event("change", { bubbles: true }));
  click('[data-entry="planned-meal"]');
  assert.ok($("#clone-entry"));
  click("#clone-entry");
  assert.match($("#confirm").textContent, /Otro día de esta semana/);
  $("#clone-week-date").value = "2026-11-04";
  click("#accept-clone");
  assert.equal(data().plan["2026-11-02|Desayuno"][0].id, "planned-meal");
  const [copy] = data().plan["2026-11-04|Desayuno"];
  assert.equal(copy.refId, "meal-0-0");
  assert.equal(copy.kind, "meal");
  assert.notEqual(copy.id, "planned-meal");
  click('[data-entry="planned-meal"]');
  click("#clone-entry");
  click("#clone-other-week");
  $("#clone-other-date").value = "2026-11-12";
  click("#accept-clone");
  assert.equal($("#week").value, "2026-11-09");
  assert.equal(data().plan["2026-11-12|Desayuno"].length, 1);
  dom.window.close();
});
test("arrastrar reordena una fila y mueve elementos a otro día de la misma fila", () => {
  const state = seed();
  state.plan["2026-11-02|Comida"] = [
    { id: "first", refId: "meal-0-0", kind: "meal" },
    { id: "second", refId: "food-0-0", kind: "food" },
  ];
  const { dom, w, $, data } = boot(JSON.stringify(state));
  $("#week").value = "2026-11-02";
  $("#week").dispatchEvent(new w.Event("change", { bubbles: true }));
  const pointer = (target, type, x, y) =>
    target.dispatchEvent(new w.MouseEvent(type, {
      bubbles: true,
      cancelable: true,
      button: 0,
      clientX: x,
      clientY: y,
    }));
  const first = $('[data-entry="first"]');
  const second = $('[data-entry="second"]');
  first.getBoundingClientRect = () => ({ left: 10, right: 110, top: 20, bottom: 60, height: 40 });
  second.getBoundingClientRect = () => ({ left: 10, right: 110, top: 70, bottom: 110, height: 40 });
  const row = $('[data-cell="2026-11-02|Comida"]');
  w.document.elementFromPoint = () => row;
  pointer(second, "pointerdown", 40, 90);
  pointer(w.document, "pointermove", 40, 10);
  pointer(w.document, "pointerup", 40, 10);
  assert.deepEqual(data().plan["2026-11-02|Comida"].map((entry) => entry.id), ["second", "first"]);

  const moved = $('[data-entry="second"]');
  const target = $('[data-cell="2026-11-03|Comida"]');
  w.document.elementFromPoint = () => target;
  pointer(moved, "pointerdown", 40, 30);
  pointer(w.document, "pointermove", 180, 100);
  pointer(w.document, "pointerup", 180, 100);
  assert.deepEqual(data().plan["2026-11-02|Comida"].map((entry) => entry.id), ["first"]);
  assert.deepEqual(data().plan["2026-11-03|Comida"].map((entry) => entry.id), ["second"]);
  dom.window.close();
});
test("selección múltiple permite clonar y exige dos confirmaciones para borrar", () => {
  const state = seed();
  state.plan["2026-11-02|Desayuno"] = [
    { id: "selected-a", refId: "meal-0-0", kind: "meal" },
  ];
  state.plan["2026-11-03|Comida"] = [
    { id: "selected-b", refId: "food-0-0", kind: "food" },
  ];
  const { dom, w, $, click, data } = boot(JSON.stringify(state));
  $("#week").value = "2026-11-02";
  $("#week").dispatchEvent(new w.Event("change", { bubbles: true }));
  const setBounds = () => {
    $('[data-entry="selected-a"]').getBoundingClientRect = () => ({ left: 30, right: 100, top: 30, bottom: 70, height: 40 });
    $('[data-entry="selected-b"]').getBoundingClientRect = () => ({ left: 150, right: 220, top: 90, bottom: 130, height: 40 });
  };
  const lasso = () => {
    setBounds();
    const blankCell = $('[data-cell="2026-11-02|Desayuno"]');
    const pointer = (target, type, x, y) =>
      target.dispatchEvent(new w.MouseEvent(type, {
        bubbles: true,
        cancelable: true,
        button: 0,
        clientX: x,
        clientY: y,
      }));
    pointer(blankCell, "pointerdown", 10, 10);
    pointer(w.document, "pointermove", 240, 150);
    pointer(w.document, "pointerup", 240, 150);
  };

  lasso();
  assert.equal($("#confirm").open, true);
  assert.match($("#confirm").textContent, /2 elementos seleccionados/);
  click("#clone-selected");
  $("#clone-week-date").value = "2026-11-05";
  click("#accept-clone");
  assert.equal(data().plan["2026-11-05|Desayuno"].length, 1);
  assert.equal(data().plan["2026-11-05|Comida"].length, 1);
  assert.notEqual(data().plan["2026-11-05|Desayuno"][0].id, "selected-a");
  assert.equal($("#confirm").open, false);

  lasso();
  click("#delete-selected");
  click("#accept-confirm");
  assert.match($("#confirm h2").textContent, /Confirmación final/);
  assert.equal(data().plan["2026-11-02|Desayuno"].length, 1);
  click("#accept-confirm");
  assert.equal(data().plan["2026-11-02|Desayuno"], undefined);
  assert.equal(data().plan["2026-11-03|Comida"], undefined);
  assert.equal(data().plan["2026-11-05|Desayuno"].length, 1);
  dom.window.close();
});
test("CRUD alimentos y rechazo de duplicados", () => {
  const { dom, $, click, input, submit, data } = boot();
  click('[data-catalog="food"]');
  click("#new-item");
  input("#item-form input", " CAFE ");
  submit("#item-form");
  assert.match($("#item-form .error").textContent, /ya existe/);
  input("#item-form input", "Alimento prueba");
  submit("#item-form");
  assert.equal(data().items.length, 61);
  input("#search", "Alimento prueba");
  click("[data-edit]");
  input("#item-form input", "Alimento editado");
  submit("#item-form");
  input("#search", "Alimento editado");
  click("[data-select]");
  click(".cell");
  click("#accept-confirm");
  click('[data-catalog="food"]');
  input("#search", "Alimento editado");
  click("[data-delete]");
  assert.match($("#confirm p").textContent, /1 apariciones/);
  click("#accept-confirm");
  assert.equal(data().items.length, 60);
  assert.deepEqual(data().plan, {});
  dom.window.close();
});
test("categorías fijas protegidas, CRUD categorías y bloqueo al estar en uso", () => {
  const { dom, w, $, click, input, submit, data } = boot();
  click("#categories");
  assert.equal(
    w.document.querySelectorAll("#category-items [data-delete]").length,
    0,
  );
  click("#new-category");
  input("#category-form input", "Tentempié");
  click('[aria-label="Texto 4"]');
  submit("#category-form");
  assert.equal(data().categories.length, 4);
  click("#category-items [data-edit]");
  input("#category-form input", "Merienda");
  submit("#category-form");
  assert.equal(data().categories[3].name, "Merienda");
  click('[data-catalog="food"]');
  click("#new-item");
  input("#item-form input", "Prueba categoría");
  $("#item-form select").value = data().categories[3].id;
  submit("#item-form");
  click("#categories");
  click("#category-items [data-delete]");
  assert.match($("#toast").textContent, /utilizada/);
  assert.equal(data().categories.length, 4);
  dom.window.close();
});
test("recetas: crear, abrir no modal, editar, planificar y eliminar", () => {
  const { dom, w, $, click, input, submit, data } = boot();
  click("#recipes");
  assert.equal(w.document.querySelectorAll(".recipe-row").length, 3);
  click("#new-recipe");
  input("#recipe-form [name=name]", "Receta prueba");
  input("#recipe-form [name=ingredients]", "Un ingrediente");
  input("#recipe-form [name=steps]", "Un paso");
  submit("#recipe-form");
  assert.equal(data().recipes.length, 4);
  const id = data().recipes[3].id;
  click(`[data-open="${id}"]`);
  assert.equal($("#recipe-detail").open, true);
  assert.equal($("#recipe-list").open, true);
  click("#edit-recipe");
  input("#recipe-form [name=name]", "Receta editada");
  submit("#recipe-form");
  assert.match($("#recipe-detail h2").textContent, /editada/);
  click("#plan-recipe");
  click(".cell");
  click("#accept-confirm");
  assert.equal(w.document.querySelectorAll(".entry").length, 1);
  click("#recipes");
  click(`[data-delete="${id}"]`);
  click("#accept-confirm");
  assert.equal(data().recipes.length, 3);
  assert.deepEqual(data().plan, {});
  dom.window.close();
});
test("contenido HTML se muestra como texto y datos corruptos no se sobrescriben", () => {
  let b = boot();
  b.click('[data-catalog="food"]');
  b.click("#new-item");
  b.input("#item-form input", "<img src=x onerror=alert(1)>");
  b.submit("#item-form");
  assert.equal(b.w.document.querySelectorAll("img").length, 0);
  b.dom.window.close();
  b = boot("corrupto");
  b.click('[data-catalog="meal"]');
  b.click('[data-select="meal-0-0"]');
  b.click(".cell");
  b.click("#accept-confirm");
  assert.equal(b.w.localStorage.getItem("calendario-comidas.v1"), "corrupto");
  b.dom.window.close();
});
test('restaurar copia valida sin perder datos al cancelar o importar un archivo inválido',async()=>{const b=boot();b.click('[data-catalog="meal"]');b.click('[data-select="meal-0-0"]');b.click('.cell');b.click('#accept-confirm');const original=b.w.localStorage.getItem('calendario-comidas.v1');const input=b.$('#file');Object.defineProperty(input,'files',{configurable:true,value:[{size:20,text:async()=>'{"version":90}'}]});await input.onchange({target:input});assert.equal(b.w.localStorage.getItem('calendario-comidas.v1'),original);const next=JSON.parse(original);next.plan={};Object.defineProperty(input,'files',{configurable:true,value:[{size:2000,text:async()=>JSON.stringify(next)}]});await input.onchange({target:input});b.click('#cancel-confirm');assert.equal(b.w.localStorage.getItem('calendario-comidas.v1'),original);await input.onchange({target:input});b.click('#accept-confirm');assert.deepEqual(b.data().plan,{});assert.equal(b.w.document.querySelectorAll('.entry').length,0);b.dom.window.close();});
