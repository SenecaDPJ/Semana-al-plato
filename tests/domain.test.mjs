import test from "node:test";
import assert from "node:assert/strict";
import {
  seed,
  validate,
  applyDefaultCategoryColors,
  monday,
  dateKey,
  daysOfWeek,
  assertName,
  TEXT_COLORS,
  FILL_COLORS,
  contrast,
  removeReferences,
} from "../src/domain.js";
test("30 alimentos, 30 comidas, 10 por cada categoría, 3 recetas", () => {
  const s = validate(seed());
  for (const kind of ["food", "meal"])
    for (const c of s.categories)
      assert.equal(
        s.items.filter((x) => x.kind === kind && x.categoryId === c.id).length,
        10,
      );
  assert.equal(s.recipes.length, 3);
});
test("lunes y domingo, cambio de año y horario de verano", () => {
  for (const [d, expected] of [
    ["2026-11-04", "2026-11-02"],
    ["2027-01-03", "2026-12-28"],
    ["2026-03-29", "2026-03-23"],
    ["2026-10-25", "2026-10-19"],
  ]) {
    assert.equal(dateKey(monday(new Date(d + "T12:00:00"))), expected);
    const week = daysOfWeek(new Date(d + "T12:00:00"));
    assert.equal(week.length, 7);
    assert.equal(week[6].getDay(), 0);
  }
});
test("duplicados sin tildes, espacios ni mayúsculas", () => {
  assert.throws(() =>
    assertName([{ id: "1", name: "Café con leche" }], "  CAFE   con leche "),
  );
  assert.doesNotThrow(() =>
    assertName([{ id: "1", name: "Café" }], "cafe", "1"),
  );
});
test("196 combinaciones cumplen contraste WCAG AA para texto normal", () => {
  for (const a of TEXT_COLORS)
    for (const b of FILL_COLORS)
      assert.ok(contrast(a, b) >= 4.5, `${a} ${b}: ${contrast(a, b)}`);
});
test("una copia anterior conserva sus datos y adopta los colores default nuevos", () => {
  const previous = seed();
  previous.categories[0].text = "#182c25";
  previous.categories[0].fill = "#edf4df";
  previous.categories[1].text = "#243b53";
  previous.categories[1].fill = "#e2f2ed";
  previous.categories[2].text = "#49245b";
  previous.categories[2].fill = "#e4eefc";
  const validated = validate(previous);
  const updated = applyDefaultCategoryColors(validated);
  assert.deepEqual(
    updated.categories.map(({ text, fill }) => [text, fill]),
    [["#59400A", "#FFE08A"], ["#14532D", "#9AE6B4"], ["#1E3A8A", "#A8D8FF"]],
  );
  assert.deepEqual(updated.items, previous.items);
  assert.deepEqual(updated.recipes, previous.recipes);
  assert.deepEqual(updated.plan, previous.plan);
  const invalid = seed();
  invalid.categories[0].fill = "#e2f2ed";
  assert.throws(() => validate(invalid));
});
test("importación protege categorías fijas, fechas y referencias", () => {
  let s = seed();
  s.categories[0].name = "Hack";
  assert.throws(() => validate(s));
  s = seed();
  s.plan["2026-02-30|Cena"] = [];
  assert.throws(() => validate(s));
  s = seed();
  s.plan["2026-11-04|Cena"] = [{ id: "x", refId: "missing", kind: "meal" }];
  assert.throws(() => validate(s));
});
test("borrado elimina referencias, conserva otros elementos", () => {
  const s = seed();
  s.plan["2026-11-04|Cena"] = [
    { id: "a", refId: "meal-0-0", kind: "meal" },
    { id: "b", refId: "food-0-0", kind: "food" },
  ];
  removeReferences(s, "meal-0-0", "meal");
  assert.equal(s.plan["2026-11-04|Cena"].length, 1);
  validate(s);
});
test('importación rechaza identificadores con marcado HTML',()=>{const s=seed();s.items[0].id='x" onfocus="alert(1)';assert.throws(()=>validate(s));});
