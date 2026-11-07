export const TEXT_COLORS = [
  "#59400A",
  "#14532D",
  "#1E3A8A",
  "#4C1D95",
  "#881337",
  "#7C2D12",
  "#0F4C5C",
  "#182c25",
  "#243b53",
  "#49245b",
  "#632737",
  "#663b16",
  "#214648",
  "#383447",
];
export const FILL_COLORS = [
  "#FFE08A",
  "#9AE6B4",
  "#A8D8FF",
  "#CDB4F6",
  "#F9B7C3",
  "#FFC799",
  "#A9E3DB",
  "#edf4df",
  "#e2f2ed",
  "#e4eefc",
  "#f2e7f7",
  "#fbe7eb",
  "#fff0d8",
  "#edf0f4",
];
export const SLOTS = ["Desayuno", "Comida", "Cena"];
export const normalize = (s) =>
  s
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es")
    .replace(/\s+/g, " ");
export const uid = () => globalThis.crypto.randomUUID();
export function dateKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
export function parseDate(s) {
  const d = new Date(s + "T12:00:00");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s) || isNaN(d) || dateKey(d) !== s)
    throw Error("Fecha no válida");
  return d;
}
export function monday(d) {
  d = new Date(d);
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return d;
}
export function daysOfWeek(d) {
  return Array.from({ length: 7 }, (_, i) => {
    const x = monday(d);
    x.setDate(x.getDate() + i);
    return x;
  });
}
export function assertName(list, name, id) {
  if (!name.trim() || name.trim().length > 100)
    throw Error("Escribe un nombre de entre 1 y 100 caracteres.");
  if (list.some((x) => x.id !== id && normalize(x.name) === normalize(name)))
    throw Error("Ese nombre ya existe.");
}
export function seed() {
  const categories = SLOTS.map((name, i) => ({
    id: ["breakfast", "lunch", "dinner"][i],
    name,
    text: TEXT_COLORS[i],
    fill: FILL_COLORS[i],
    locked: true,
  }));
  const food = [
    [
      "Descafeinado",
      "Café",
      "Leche",
      "Tostada",
      "Cereales",
      "Fruta",
      "Yogur natural",
      "Avena",
      "Pan integral",
      "Nueces",
    ],
    [
      "Lechuga",
      "Tomate",
      "Pescado azul",
      "Espagueti",
      "Judía blanca",
      "Patata frita",
      "Lentejas",
      "Pollo",
      "Zanahoria",
      "Garbanzos",
    ],
    [
      "Arroz",
      "Huevos",
      "Pescado blanco",
      "Calabacín",
      "Brócoli",
      "Queso fresco",
      "Pavo",
      "Espinacas",
      "Calabaza",
      "Guisantes",
    ],
  ];
  const meal = [
    [
      "Tortilla francesa",
      "Tostada con tomate",
      "Churros",
      "Avena con leche",
      "Yogur con fruta",
      "Tostada con aguacate",
      "Cereales con leche",
      "Pan con queso fresco",
      "Tortitas de avena",
      "Macedonia de frutas",
    ],
    [
      "Espagueti boloñesa",
      "Cocido",
      "Paella",
      "Lentejas con verduras",
      "Pollo al horno",
      "Ensalada de garbanzos",
      "Salmón a la plancha",
      "Judías blancas guisadas",
      "Arroz con verduras",
      "Patatas con carne",
    ],
    [
      "Merluza cocida en filete",
      "Huevo cocido",
      "Crema de calabacín",
      "Ensalada de tomate",
      "Tortilla de espinacas",
      "Pavo a la plancha",
      "Sopa de verduras",
      "Arroz con huevo",
      "Brócoli con patata",
      "Calabaza asada",
    ],
  ];
  const items = [];
  for (const [kind, lists] of [
    ["food", food],
    ["meal", meal],
  ])
    lists.forEach((names, i) =>
      names.forEach((name, j) =>
        items.push({
          id: `${kind}-${i}-${j}`,
          name,
          kind,
          categoryId: categories[i].id,
        }),
      ),
    );
  const recipes = [
    {
      id: "recipe-1",
      name: "Tostada con tomate y aceite",
      categoryId: "breakfast",
      minutes: 5,
      servings: 1,
      ingredients:
        "1 rebanada de pan\n1 tomate maduro\n1 cucharadita de aceite de oliva",
      steps:
        "Tuesta el pan.\nRalla el tomate.\nReparte el tomate y termina con el aceite.",
    },
    {
      id: "recipe-2",
      name: "Ensalada sencilla de garbanzos",
      categoryId: "lunch",
      minutes: 10,
      servings: 2,
      ingredients:
        "400 g de garbanzos cocidos escurridos\n2 tomates\n½ pepino\n1 cucharada de aceite de oliva\nZumo de limón al gusto",
      steps:
        "Enjuaga y escurre los garbanzos.\nLava y corta el tomate y el pepino.\nMezcla todo y aliña con aceite y limón.",
    },
    {
      id: "recipe-3",
      name: "Crema suave de calabacín",
      categoryId: "dinner",
      minutes: 25,
      servings: 2,
      ingredients:
        "2 calabacines\n1 patata pequeña\n½ cebolla\n500 ml de agua\n1 cucharada de aceite de oliva",
      steps:
        "Lava y corta las verduras; pela la patata y la cebolla.\nRehoga la cebolla con el aceite durante 3 minutos.\nAñade el resto y el agua; cuece unos 20 minutos hasta que esté tierno.\nTritura y ajusta el espesor con un poco de agua.",
    },
  ];
  return { version: 1, categories, items, recipes, plan: {} };
}
const legacyDefaultColors = {
  breakfast: ["#182c25", "#edf4df"],
  lunch: ["#243b53", "#e2f2ed"],
  dinner: ["#49245b", "#e4eefc"],
};
export function applyDefaultCategoryColors(s) {
  const defaults = new Map(seed().categories.map((c) => [c.id, c]));
  return {
    ...s,
    categories: s.categories.map((c) => {
      const base = defaults.get(c.id);
      return c.locked && base
        ? { ...c, text: base.text, fill: base.fill }
        : c;
    }),
  };
}
export function validate(s) {
  const fail = () => {
    throw Error("La copia no tiene un formato compatible.");
  };
  if (
    !s ||
    s.version !== 1 ||
    !Array.isArray(s.categories) ||
    !Array.isArray(s.items) ||
    !Array.isArray(s.recipes) ||
    !s.plan ||
    Array.isArray(s.plan) ||
    typeof s.plan !== "object"
  )
    fail();
  for (const list of [s.categories, s.items, s.recipes]) {
    if (list.length > 10000) fail();
    const ids = new Set(),
      names = new Set();
    for (const x of list) {
      if (
        !x ||
        typeof x.id !== "string" ||
        !/^[a-zA-Z0-9_-]{1,100}$/.test(x.id) ||
        typeof x.name !== "string" ||
        !x.name.trim() ||
        x.name.length > 100 ||
        ids.has(x.id)
      )
        fail();
      ids.add(x.id);
      const key = (x.kind || "") + normalize(x.name);
      if (names.has(key)) fail();
      names.add(key);
    }
  }
  const base = seed().categories;
  for (const c of s.categories)
    if (
      !TEXT_COLORS.includes(c.text) ||
      !FILL_COLORS.includes(c.fill) ||
      typeof c.locked !== "boolean" ||
      (c.locked && !base.some((b) => b.id === c.id))
    )
      fail();
  for (const b of base) {
    const c = s.categories.find((c) => c.id === b.id);
    const legacy = legacyDefaultColors[b.id];
    const currentColors = c?.text === b.text && c?.fill === b.fill;
    const legacyColors = c?.text === legacy[0] && c?.fill === legacy[1];
    if (
      !c ||
      c.name !== b.name ||
      c.locked !== b.locked ||
      (!currentColors && !legacyColors)
    )
      fail();
  }
  const cat = (id) => s.categories.some((c) => c.id === id);
  for (const x of s.items)
    if (!["food", "meal"].includes(x.kind) || !cat(x.categoryId)) fail();
  for (const x of s.recipes)
    if (
      !cat(x.categoryId) ||
      !Number.isInteger(x.minutes) ||
      x.minutes < 1 ||
      x.minutes > 1440 ||
      !Number.isInteger(x.servings) ||
      x.servings < 1 ||
      x.servings > 100 ||
      typeof x.ingredients !== "string" ||
      typeof x.steps !== "string" ||
      !x.ingredients.trim() ||
      !x.steps.trim() ||
      x.ingredients.length > 10000 ||
      x.steps.length > 10000
    )
      fail();
  if (Object.keys(s.plan).length > 50000) fail();
  for (const [key, entries] of Object.entries(s.plan)) {
    const [date, slot] = key.split("|");
    try {
      parseDate(date);
    } catch {
      fail();
    }
    if (
      !SLOTS.includes(slot) ||
      key !== `${date}|${slot}` ||
      !Array.isArray(entries) ||
      entries.length > 100
    )
      fail();
    const ids = new Set();
    for (const e of entries) {
      if (
        !e ||
        typeof e.id !== "string" ||
        !/^[a-zA-Z0-9_-]{1,100}$/.test(e.id) ||
        ids.has(e.id) ||
        !["food", "meal", "recipe"].includes(e.kind)
      )
        fail();
      ids.add(e.id);
      const list = e.kind === "recipe" ? s.recipes : s.items;
      if (
        !list.some(
          (x) => x.id === e.refId && (e.kind === "recipe" || x.kind === e.kind),
        )
      )
        fail();
    }
  }
  return s;
}
export function removeReferences(state, id, kind) {
  for (const key of Object.keys(state.plan)) {
    state.plan[key] = state.plan[key].filter(
      (e) => !(e.refId === id && e.kind === kind),
    );
    if (!state.plan[key].length) delete state.plan[key];
  }
}
export function clonePlanEntries(state, selected, targetDate, makeId = uid) {
  parseDate(targetDate);
  if (!Array.isArray(selected) || !selected.length)
    throw Error("Selecciona al menos un elemento para clonar.");
  const seen = new Set();
  const copies = selected.map(({ key, id }) => {
    const token = `${key}|${id}`;
    if (seen.has(token)) throw Error("La selección contiene elementos repetidos.");
    seen.add(token);
    const [, slot] = key.split("|");
    if (!SLOTS.includes(slot)) throw Error("El momento del día no es válido.");
    const original = state.plan[key]?.find((entry) => entry.id === id);
    if (!original) throw Error("Un elemento seleccionado ya no está en el calendario.");
    return { key: `${targetDate}|${slot}`, entry: original };
  });
  const additions = new Map();
  for (const { key } of copies)
    additions.set(key, (additions.get(key) || 0) + 1);
  for (const [key, count] of additions)
    if ((state.plan[key]?.length || 0) + count > 100)
      throw Error("Una casilla ha alcanzado el límite de 100 elementos.");
  for (const { key, entry } of copies)
    (state.plan[key] ||= []).push({ ...entry, id: makeId() });
  return copies.length;
}
export function movePlanEntry(state, sourceKey, id, targetKey, targetIndex) {
  const source = state.plan[sourceKey];
  const sourceIndex = source?.findIndex((entry) => entry.id === id) ?? -1;
  if (sourceIndex < 0) throw Error("El elemento ya no está en el calendario.");
  if (sourceKey.split("|")[1] !== targetKey.split("|")[1])
    throw Error("Los elementos solo se pueden mover dentro de la misma fila.");
  const target = state.plan[targetKey] || [];
  if (sourceKey !== targetKey && target.length >= 100)
    throw Error("Esta casilla ha alcanzado el límite de 100 elementos.");
  if (!Number.isInteger(targetIndex))
    throw Error("La posición de destino no es válida.");
  const [entry] = source.splice(sourceIndex, 1);
  const destination = sourceKey === targetKey ? source : target;
  const index = Math.max(0, Math.min(targetIndex, destination.length));
  destination.splice(index, 0, entry);
  if (sourceKey !== targetKey) {
    state.plan[targetKey] = destination;
    if (!source.length) delete state.plan[sourceKey];
  }
  return sourceKey !== targetKey || sourceIndex !== index;
}
export function removePlanEntries(state, selected) {
  const grouped = new Map();
  for (const { key, id } of selected) {
    if (!grouped.has(key)) grouped.set(key, new Set());
    grouped.get(key).add(id);
  }
  let removed = 0;
  for (const [key, ids] of grouped) {
    const entries = state.plan[key];
    if (!entries) continue;
    state.plan[key] = entries.filter((entry) => {
      if (!ids.has(entry.id)) return true;
      removed++;
      return false;
    });
    if (!state.plan[key].length) delete state.plan[key];
  }
  return removed;
}
export function contrast(a, b) {
  const lum = (h) => {
    const v = h
      .match(/[0-9a-f]{2}/gi)
      .map((x) => parseInt(x, 16) / 255)
      .map((x) => (x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4));
    return v[0] * 0.2126 + v[1] * 0.7152 + v[2] * 0.0722;
  };
  const x = lum(a),
    y = lum(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}
