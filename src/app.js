import {
  TEXT_COLORS,
  FILL_COLORS,
  SLOTS,
  uid,
  dateKey,
  parseDate,
  monday,
  daysOfWeek,
  normalize,
  assertName,
  applyDefaultCategoryColors,
  validate,
  removeReferences,
  seed,
} from "./domain.js";
import { load, save, download } from "./storage.js";
const $ = (s) => document.querySelector(s),
  esc = (s) =>
    String(s).replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
let state,
  storageError = false;
try {
  state = load();
} catch {
  state = seed();
  storageError = true;
}
let week = monday(new Date()),
  pending = null,
  targetCell = null,
  kind = "meal",
  returnFocus = null;
const THEME_KEY = "calendario-comidas.theme";
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const label = theme === "dark" ? "Activar tema claro" : "Activar tema oscuro";
  const button = $("#theme-toggle");
  button.textContent = theme === "dark" ? "☀" : "☾";
  button.setAttribute("aria-label", label);
  button.title = label;
}
let savedTheme = "light";
try {
  if (localStorage.getItem(THEME_KEY) === "dark") savedTheme = "dark";
} catch { /* El calendario sigue usable sin preferencias locales. */ }
applyTheme(savedTheme);
$("#theme-toggle").onclick = () => {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(next);
  try {
    localStorage.setItem(THEME_KEY, next);
  } catch {
    toast("El tema ha cambiado, pero no se ha podido guardar la preferencia.");
  }
};
const category = (id) => state.categories.find((c) => c.id === id);
const source = (e) =>
  (e.kind === "recipe" ? state.recipes : state.items).find(
    (x) => x.id === e.refId,
  );
const fmt = (d, options) => d.toLocaleDateString("es-ES", options);
const badge = (id) => {
  const c = category(id);
  return `<span class="badge" style="color:${c.text};background:${c.fill}">${esc(c.name)}</span>`;
};
function toast(msg) {
  $("#toast").textContent = msg;
  $("#toast").hidden = false;
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => ($("#toast").hidden = true), 4500);
}
function commit(fn) {
  if (storageError) {
    toast(
      "No se puede guardar: exporta lo visible o restaura una copia válida. Los datos anteriores no se han sobrescrito.",
    );
    return false;
  }
  const next = structuredClone(state);
  try {
    fn(next);
    save(next);
    state = next;
    $("#save-status").textContent = "✓ Guardado en este dispositivo";
    render();
    return true;
  } catch (e) {
    toast("No se ha guardado: " + e.message);
    return false;
  }
}
function render() {
  const days = daysOfWeek(week);
  $("#week").value = dateKey(week);
  $("#range").textContent =
    `${fmt(days[0], { day: "numeric", month: "long" })} — ${fmt(days[6], { day: "numeric", month: "long", year: "numeric" })}`;
  let total = 0,
    html = '<div class="day-head"></div>';
  for (const day of days)
    html += `<div class="day-head ${dateKey(day) === dateKey(new Date()) ? "today" : ""}"><span class="weekday">${fmt(day, { weekday: "short" })}</span><strong>${day.getDate()}</strong></div>`;
  SLOTS.forEach((slot, i) => {
    html += `<div class="slot-label"><span>${["○", "◐", "◒"][i]}</span>${slot}</div>`;
    for (const day of days) {
      const key = dateKey(day) + "|" + slot,
        entries = state.plan[key] || [];
      if (entries.length) total++;
      html += `<div class="cell ${dateKey(day) === dateKey(new Date()) ? "current" : ""} ${pending ? "choosing" : ""}" data-cell="${key}" ${pending ? 'tabindex="0" role="button"' : ""} aria-label="${esc(slot + " del " + fmt(day, { weekday: "long", day: "numeric", month: "long" }))}">`;
      if (!entries.length)
        html += `<div class="empty"><button aria-label="Añadir a ${slot} del ${dateKey(day)}" data-add="${key}">+</button></div>`;
      for (const e of entries) {
        const x = source(e),
          c = category(x.categoryId);
        html += `<button class="entry" data-text="${c.text}" data-fill="${c.fill}" data-entry="${e.id}" data-key="${key}">${esc(x.name)}<small>${e.kind === "recipe" ? "▤ Receta" : e.kind === "food" ? "Alimento" : "Plato"} · ${esc(c.name)}</small></button>`;
      }
      if (entries.length)
        html +=
          '<button class="cell-add" data-add="' +
          key +
          '" aria-label="Añadir otro elemento">+</button>';
      html += "</div>";
    }
  });
  $("#calendar").innerHTML = html;
  $("#calendar").querySelectorAll(".entry").forEach((entry) => {
    entry.style.setProperty("color", entry.dataset.text, "important");
    entry.style.setProperty("background-color", entry.dataset.fill, "important");
  });
  $("#count").textContent = `${total} de 21 momentos`;
  $("#placement").hidden = !pending;
  if (pending) {
    $("#placement").innerHTML =
      `<span><strong>${esc(pending.name)}</strong> · Selecciona la casilla donde quieres añadirlo.</span><button id="cancel-placement" class="small">Cancelar</button>`;
    $("#cancel-placement").onclick = () => {
      pending = null;
      render();
    };
  }
}
function choose(x, k) {
  const target = targetCell;
  targetCell = null;
  pending = { id: x.id, name: x.name, kind: k };
  $("#catalog").hidden = true;
  $("#recipe-list").close();
  $("#recipe-detail").close();
  if (target) {
    place(target, true);
    return;
  }
  render();
  $("#placement").scrollIntoView({ block: "nearest", behavior: "smooth" });
  $("#cancel-placement").focus();
}
function confirmAction(title, message, accept, action, label = "Confirmar") {
  const d = $("#confirm");
  returnFocus = document.activeElement;
  d.innerHTML = `<h2>${esc(title)}</h2><p>${esc(message)}</p><div class="actions"><button id="cancel-confirm">Cancelar</button><button id="accept-confirm" class="${action === "delete" ? "danger" : "primary"}">${esc(label)}</button></div>`;
  d.showModal();
  $("#cancel-confirm").onclick = () => d.close();
  $("#accept-confirm").onclick = () => {
    if (accept() !== false) d.close();
  };
}
$("#confirm").addEventListener("close", () => {
  if (returnFocus?.isConnected) returnFocus.focus();
});
function place(key, fromCell = false) {
  const p = pending;
  if (!p) return;
  const [date, slot] = key.split("|");
  confirmAction(
    "Añadir al calendario",
    `¿Añadir «${p.name}» a ${slot.toLowerCase()} del ${fmt(parseDate(date), { weekday: "long", day: "numeric", month: "long", year: "numeric" })}? Los elementos existentes se conservan.`,
    () => {
      if (
        commit((s) => {
          const list = (s.plan[key] ||= []);
          if (list.length >= 100)
            throw Error(
              "Esta casilla ha alcanzado el límite de 100 elementos.",
            );
          list.push({ id: uid(), refId: p.id, kind: p.kind });
        })
      ) {
        pending = null;
        render();
        toast("Añadido a tu semana.");
        return true;
      }
      return false;
    },
  );
  if (fromCell)
    $("#confirm").addEventListener(
      "close",
      () => {
        if (pending === p) {
          pending = null;
          render();
        }
      },
      { once: true },
    );
}
$("#calendar").onclick = (e) => {
  const cell = e.target.closest("[data-cell]");
  if (!cell) return;
  if (pending) {
    place(cell.dataset.cell);
    return;
  }
  const entry = e.target.closest("[data-entry]");
  if (entry) {
    entryMenu(entry.dataset.key, entry.dataset.entry);
    return;
  }
  if (e.target.closest("[data-add]")) openAddChoices(cell.dataset.cell);
};
$("#calendar").onkeydown = (e) => {
  if (
    pending &&
    e.target.matches("[data-cell]") &&
    ["Enter", " "].includes(e.key)
  ) {
    e.preventDefault();
    place(e.target.dataset.cell);
  }
};
function entryMenu(key, id) {
  const e = state.plan[key].find((x) => x.id === id),
    x = source(e),
    d = $("#editor");
  d.innerHTML = `<div class="panel-head"><h2>${esc(x.name)}</h2><button class="icon" data-close aria-label="Cerrar">×</button></div><p class="help">${esc(key.replace("|", " · "))}</p>${badge(x.categoryId)}<div class="actions">${e.kind === "recipe" ? '<button id="open-entry-recipe">Abrir receta</button>' : ""}<button class="danger" id="remove-entry">Eliminar de esta casilla</button></div>`;
  d.showModal();
  d.querySelector("[data-close]").onclick = () => d.close();
  if (e.kind === "recipe")
    $("#open-entry-recipe").onclick = () => {
      d.close();
      openRecipe(x.id);
    };
  $("#remove-entry").onclick = () =>
    confirmAction(
      "Eliminar de la casilla",
      `Se quitará «${x.name}» de este momento del día. Seguirá disponible en el catálogo.`,
      () => {
        const ok = commit((s) => {
          s.plan[key] = s.plan[key].filter((x) => x.id !== id);
          if (!s.plan[key].length) delete s.plan[key];
        });
        if (ok) d.close();
        return ok;
      },
      "delete",
      "Eliminar",
    );
}
function categoryOptions(id) {
  return state.categories
    .map(
      (c) =>
        `<option value="${c.id}" ${id === c.id ? "selected" : ""}>${esc(c.name)}</option>`,
    )
    .join("");
}
function openAddChoices(key) {
  targetCell = key;
  const [date, slot] = key.split("|");
  const panel = $("#catalog");
  panel.hidden = false;
  panel.innerHTML = `<div class="panel-head"><h2>Añadir a ${esc(slot.toLowerCase())}</h2><button id="close-catalog" class="icon" aria-label="Cerrar opciones">×</button></div><p class="help">${esc(fmt(parseDate(date), { weekday: "long", day: "numeric", month: "long" }))}. Elige qué quieres añadir y después confirma la casilla.</p><div class="add-choices"><button class="primary" data-add-kind="meal">＋ Añadir comida</button><button class="action-food" data-add-kind="food">＋ Añadir alimento</button><button class="action-recipe" data-add-kind="recipe">▤ Añadir receta</button></div>`;
  $("#close-catalog").onclick = () => {
    panel.hidden = true;
    targetCell = null;
  };
  panel.querySelector(".add-choices").onclick = (e) => {
    const choice = e.target.closest("[data-add-kind]");
    if (!choice) return;
    if (choice.dataset.addKind === "recipe") openRecipes();
    else openCatalog(choice.dataset.addKind);
  };
  panel.querySelector("[data-add-kind]").focus();
}
function openCatalog(k) {
  kind = k;
  const panel = $("#catalog");
  panel.hidden = false;
  panel.innerHTML = `<div class="panel-head"><h2>${k === "meal" ? "Comidas" : "Alimentos"}</h2><button id="close-catalog" class="icon" aria-label="Cerrar catálogo">×</button></div><p class="help">${targetCell ? "Elige un elemento para la casilla seleccionada y confirma." : "Elige un elemento y después su lugar en el calendario."}</p><button class="${k === "meal" ? "primary" : "action-food"} full" id="new-item">＋ ${k === "meal" ? "Añadir nueva comida" : "Añadir nuevo alimento"}</button><div class="filters"><input id="search" placeholder="Buscar…" aria-label="Buscar en el catálogo"><select id="filter" aria-label="Filtrar por categoría"><option value="">Todas las categorías</option>${categoryOptions()}</select></div><div id="catalog-items"></div>`;
  $("#close-catalog").onclick = () => {
    panel.hidden = true;
    targetCell = null;
  };
  $("#new-item").onclick = () => editItem();
  $("#search").oninput = renderCatalog;
  $("#filter").onchange = renderCatalog;
  renderCatalog();
  $("#search").focus();
}
function renderCatalog() {
  const q = normalize($("#search").value),
    filter = $("#filter").value;
  const list = state.items.filter(
    (x) =>
      x.kind === kind &&
      normalize(x.name).includes(q) &&
      (!filter || x.categoryId === filter),
  );
  $("#catalog-items").innerHTML = list.length
    ? list
        .map(
          (x) =>
            `<div class="catalog-row"><button class="select-item" data-select="${x.id}">${esc(x.name)}<br>${badge(x.categoryId)}</button><div class="row-tools"><button data-edit="${x.id}" aria-label="Editar ${esc(x.name)}">Editar</button><button class="danger" data-delete="${x.id}" aria-label="Eliminar ${esc(x.name)}">Eliminar</button></div></div>`,
        )
        .join("")
    : '<p class="help">No hay resultados. Prueba otra búsqueda o añade uno nuevo.</p>';
  $("#catalog-items").onclick = (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    const id = b.dataset.select || b.dataset.edit || b.dataset.delete;
    const x = state.items.find((x) => x.id === id);
    if (b.dataset.select) choose(x, kind);
    if (b.dataset.edit) editItem(x);
    if (b.dataset.delete) deleteItem(x, kind);
  };
}
function deleteItem(x, k) {
  const count = Object.values(state.plan)
    .flat()
    .filter((e) => e.refId === x.id && e.kind === k).length;
  confirmAction(
    "Eliminar " + (k === "recipe" ? "receta" : "del catálogo"),
    `¿Eliminar «${x.name}»?${count ? ` También se quitarán sus ${count} apariciones del calendario.` : " No aparece en el calendario."}`,
    () => {
      const ok = commit((s) => {
        const field = k === "recipe" ? "recipes" : "items";
        s[field] = s[field].filter((v) => v.id !== x.id);
        removeReferences(s, x.id, k);
      });
      if (ok) {
        if (k === "recipe") {
          if ($("#recipe-detail").dataset.recipeId === x.id)
            $("#recipe-detail").close();
          renderRecipes();
        } else renderCatalog();
      }
      return ok;
    },
    "delete",
    "Eliminar",
  );
}
function editItem(x) {
  const d = $("#editor");
  d.innerHTML = `<div class="panel-head"><h2>${x ? "Editar" : kind === "meal" ? "Añadir nueva comida" : "Añadir nuevo alimento"}</h2><button class="icon" data-close aria-label="Cerrar">×</button></div><form id="item-form"><label class="field">Nombre ${kind === "meal" ? "de la comida" : "del alimento"}<input name="name" required maxlength="100" value="${esc(x?.name || "")}"></label><label class="field">Categoría<select name="categoryId">${categoryOptions(x?.categoryId)}</select></label><p class="error" role="alert"></p><div class="actions"><button type="button" data-close>Cancelar</button><button class="primary" type="submit">Guardar</button></div></form>`;
  d.showModal();
  d.querySelectorAll("[data-close]").forEach(
    (b) => (b.onclick = () => d.close()),
  );
  $("#item-form").onsubmit = (e) => {
    e.preventDefault();
    const f = new FormData(e.target),
      name = f.get("name").trim();
    try {
      assertName(
        state.items.filter((v) => v.kind === kind),
        name,
        x?.id,
      );
    } catch (err) {
      d.querySelector(".error").textContent = err.message;
      return;
    }
    if (
      commit((s) => {
        const item = {
          id: x?.id || uid(),
          name,
          kind,
          categoryId: f.get("categoryId"),
        };
        if (x) s.items[s.items.findIndex((v) => v.id === x.id)] = item;
        else s.items.push(item);
      })
    ) {
      d.close();
      renderCatalog();
    }
  };
}
function openCategories() {
  const p = $("#catalog");
  p.hidden = false;
  p.innerHTML = `<div class="panel-head"><h2>Categorías</h2><button class="icon" id="close-catalog" aria-label="Cerrar categorías">×</button></div><p class="help">Etiquetas para organizar tus platos. El calendario conserva sus tres momentos del día.</p><button class="action-category full" id="new-category">＋ Añadir Categoría</button><div id="category-items"></div>`;
  $("#close-catalog").onclick = () => (p.hidden = true);
  $("#new-category").onclick = () => editCategory();
  renderCategories();
}
function renderCategories() {
  $("#category-items").innerHTML = state.categories
    .map(
      (c) =>
        `<div class="catalog-row"><div style="flex:1">${badge(c.id)}</div>${c.locked ? '<small class="help">Fija · protegida</small>' : `<button class="small" data-edit="${c.id}">Editar</button><button class="small danger" data-delete="${c.id}">Eliminar</button>`}</div>`,
    )
    .join("");
  $("#category-items").onclick = (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    const c = category(b.dataset.edit || b.dataset.delete);
    if (b.dataset.edit) editCategory(c);
    else {
      const used = [...state.items, ...state.recipes].filter(
        (x) => x.categoryId === c.id,
      ).length;
      if (used) {
        toast(
          `Categoría utilizada por ${used} elementos. Cámbialos de categoría antes de eliminarla.`,
        );
        return;
      }
      confirmAction(
        "Eliminar categoría",
        `¿Eliminar «${c.name}»?`,
        () => {
          const ok = commit((s) => {
            s.categories = s.categories.filter((v) => v.id !== c.id);
          });
          if (ok) renderCategories();
          return ok;
        },
        "delete",
        "Eliminar",
      );
    }
  };
}
function editCategory(c) {
  if (c?.locked) return;
  let textColor = c?.text || TEXT_COLORS[0],
    fillColor = c?.fill || FILL_COLORS[0];
  const d = $("#editor");
  d.innerHTML = `<div class="panel-head"><h2>${c ? "Editar categoría" : "Añadir Categoría"}</h2><button class="icon" data-close aria-label="Cerrar">×</button></div><form id="category-form"><label class="field">Nombre de la categoría<input name="name" required maxlength="100" value="${esc(c?.name || "")}"></label><h3>Color del texto</h3><div class="swatches" id="text-colors"></div><h3>Color de relleno</h3><div class="swatches" id="fill-colors"></div><div class="preview-badge">Así se verá tu categoría</div><p class="help">196 combinaciones de alto contraste.</p><p class="error" role="alert"></p><div class="actions"><button type="button" data-close>Cancelar</button><button type="submit" class="primary">Guardar</button></div></form>`;
  const palettes = () => {
    for (const [selector, colors, value] of [
      ["#text-colors", TEXT_COLORS, textColor],
      ["#fill-colors", FILL_COLORS, fillColor],
    ]) {
      $(selector).innerHTML = colors
        .map(
          (v, i) =>
            `<button type="button" class="swatch ${value === v ? "selected" : ""}" aria-label="${selector === "#text-colors" ? "Texto" : "Relleno"} ${i + 1}" aria-pressed="${value === v}" data-color="${v}"></button>`,
        )
        .join("");
      $(selector).onclick = (e) => {
        const b = e.target.closest("button");
        if (!b) return;
        if (selector === "#text-colors") textColor = b.dataset.color;
        else fillColor = b.dataset.color;
        palettes();
      };
      $(selector).querySelectorAll(".swatch").forEach((swatch) =>
        swatch.style.setProperty("background-color", swatch.dataset.color, "important"),
      );
    }
    d.querySelector(".preview-badge").style.setProperty("color", textColor, "important");
    d.querySelector(".preview-badge").style.setProperty("background-color", fillColor, "important");
  };
  palettes();
  d.showModal();
  d.querySelectorAll("[data-close]").forEach(
    (b) => (b.onclick = () => d.close()),
  );
  d.querySelector("input").oninput = (e) =>
    (d.querySelector(".preview-badge").textContent =
      e.target.value || "Así se verá tu categoría");
  $("#category-form").onsubmit = (e) => {
    e.preventDefault();
    const name = new FormData(e.target).get("name").trim();
    try {
      assertName(state.categories, name, c?.id);
    } catch (err) {
      d.querySelector(".error").textContent = err.message;
      return;
    }
    if (
      commit((s) => {
        const next = {
          id: c?.id || uid(),
          name,
          text: textColor,
          fill: fillColor,
          locked: false,
        };
        if (c)
          s.categories[s.categories.findIndex((v) => v.id === c.id)] = next;
        else s.categories.push(next);
      })
    ) {
      d.close();
      renderCategories();
    }
  };
}
function openRecipes() {
  $("#catalog").hidden = true;
  renderRecipes();
  if (!$("#recipe-list").open) $("#recipe-list").show();
}
function renderRecipes() {
  const d = $("#recipe-list");
  d.innerHTML = `<div class="panel-head"><h2>Tu recetario</h2><button class="icon" id="close-recipes" aria-label="Cerrar recetario">×</button></div><p class="help">${targetCell ? "Pulsa «Al calendario» en una receta para confirmar su casilla." : "Abre una receta con doble clic o pulsa «Abrir». Puedes seguir usando el calendario."}</p><button id="new-recipe" class="action-recipe full">＋ Crear nueva receta</button><div>${state.recipes.length ? state.recipes.map((r) => `<article class="recipe-row" data-recipe="${r.id}" tabindex="0"><strong>${esc(r.name)}</strong><div class="recipe-meta">${r.minutes} min · ${r.servings} raciones ${badge(r.categoryId)}</div><button class="small" data-open="${r.id}">Abrir</button><button class="small" data-plan="${r.id}">Al calendario</button><button class="small" data-edit="${r.id}">Editar</button><button class="small danger" data-delete="${r.id}">Eliminar</button></article>`).join("") : '<p class="help">Tu próxima receta empieza aquí.</p>'}</div>`;
  $("#close-recipes").onclick = () => {
    d.close();
    targetCell = null;
  };
  $("#new-recipe").onclick = () => editRecipe();
  d.onclick = (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    const id =
      b.dataset.open || b.dataset.plan || b.dataset.edit || b.dataset.delete;
    if (!id) return;
    const r = state.recipes.find((x) => x.id === id);
    if (b.dataset.open) openRecipe(id);
    if (b.dataset.plan) choose(r, "recipe");
    if (b.dataset.edit) editRecipe(r);
    if (b.dataset.delete) deleteItem(r, "recipe");
  };
  d.ondblclick = (e) => {
    if (e.target.closest("button")) return;
    const row = e.target.closest("[data-recipe]");
    if (row) openRecipe(row.dataset.recipe);
  };
  d.onkeydown = (e) => {
    if (e.key === "Enter" && e.target.matches("[data-recipe]"))
      openRecipe(e.target.dataset.recipe);
  };
}
function openRecipe(id) {
  const r = state.recipes.find((x) => x.id === id),
    d = $("#recipe-detail");
  d.dataset.recipeId = id;
  d.innerHTML = `<div class="panel-head"><h2>${esc(r.name)}</h2><button class="icon" id="close-recipe" aria-label="Cerrar receta">×</button></div>${badge(r.categoryId)}<div class="recipe-meta">◷ ${r.minutes} minutos · ${r.servings} raciones</div><h3>Ingredientes</h3><div class="recipe-text">${esc(r.ingredients)}</div><h3>Preparación</h3><div class="recipe-text">${esc(r.steps)}</div><div class="actions"><button id="edit-recipe">Editar</button><button class="primary" id="plan-recipe">Añadir al calendario</button></div>`;
  if (!d.open) d.show();
  $("#close-recipe").onclick = () => d.close();
  $("#edit-recipe").onclick = () => editRecipe(r);
  $("#plan-recipe").onclick = () => choose(r, "recipe");
}
function editRecipe(r) {
  const d = $("#editor");
  d.innerHTML = `<div class="panel-head"><h2>${r ? "Editar receta" : "Nueva receta"}</h2><button class="icon" data-close aria-label="Cerrar">×</button></div><form id="recipe-form"><div class="form-grid"><label class="field wide">Nombre de la receta<input name="name" required maxlength="100" value="${esc(r?.name || "")}"></label><label class="field wide">Categoría<select name="categoryId">${categoryOptions(r?.categoryId)}</select></label><label class="field">Minutos<input name="minutes" type="number" min="1" max="1440" required value="${r?.minutes || 15}"></label><label class="field">Raciones<input name="servings" type="number" min="1" max="100" required value="${r?.servings || 2}"></label><label class="field wide">Ingredientes · uno por línea<textarea name="ingredients" required maxlength="10000">${esc(r?.ingredients || "")}</textarea></label><label class="field wide">Preparación · un paso por línea<textarea name="steps" required maxlength="10000">${esc(r?.steps || "")}</textarea></label></div><p class="error" role="alert"></p><div class="actions"><button type="button" data-close>Cancelar</button><button type="submit" class="primary">Guardar receta</button></div></form>`;
  d.showModal();
  d.querySelectorAll("[data-close]").forEach(
    (b) => (b.onclick = () => d.close()),
  );
  $("#recipe-form").onsubmit = (e) => {
    e.preventDefault();
    const f = new FormData(e.target),
      name = f.get("name").trim();
    try {
      assertName(state.recipes, name, r?.id);
    } catch (err) {
      d.querySelector(".error").textContent = err.message;
      return;
    }
    if (
      commit((s) => {
        const next = {
          id: r?.id || uid(),
          name,
          categoryId: f.get("categoryId"),
          minutes: Number(f.get("minutes")),
          servings: Number(f.get("servings")),
          ingredients: f.get("ingredients").trim(),
          steps: f.get("steps").trim(),
        };
        if (r) s.recipes[s.recipes.findIndex((x) => x.id === r.id)] = next;
        else s.recipes.push(next);
      })
    ) {
      d.close();
      renderRecipes();
      if (
        r &&
        $("#recipe-detail").open &&
        $("#recipe-detail").dataset.recipeId === r.id
      )
        openRecipe(r.id);
    }
  };
}
for (const d of document.querySelectorAll(".floating")) {
  d.addEventListener("pointerdown", (e) => {
    if (!e.target.closest(".panel-head") || e.target.closest("button")) return;
    const rect = d.getBoundingClientRect(),
      dx = e.clientX - rect.left,
      dy = e.clientY - rect.top;
    d.setPointerCapture(e.pointerId);
    const move = (ev) => {
      d.style.left =
        Math.max(0, Math.min(innerWidth - rect.width, ev.clientX - dx)) + "px";
      d.style.top =
        Math.max(0, Math.min(innerHeight - 60, ev.clientY - dy)) + "px";
      d.style.right = "auto";
      d.style.bottom = "auto";
    };
    d.addEventListener("pointermove", move);
    d.addEventListener(
      "pointerup",
      () => d.removeEventListener("pointermove", move),
      { once: true },
    );
  });
}
document
  .querySelectorAll("[data-catalog]")
  .forEach((b) => (b.onclick = () => {
    targetCell = null;
    openCatalog(b.dataset.catalog);
  }));
$("#categories").onclick = () => {
  targetCell = null;
  openCategories();
};
$("#recipes").onclick = () => {
  targetCell = null;
  openRecipes();
};
function navigate(offset) {
  targetCell = null;
  week.setDate(week.getDate() + offset);
  render();
}
$("#prev").onclick = () => navigate(-7);
$("#next").onclick = () => navigate(7);
$("#today").onclick = () => {
  targetCell = null;
  week = monday(new Date());
  render();
};
$(".brand").onclick = (e) => {
  e.preventDefault();
  $("#today").click();
};
$("#week").onchange = (e) => {
  if (e.target.value) {
    try {
      week = monday(parseDate(e.target.value));
      render();
    } catch {
      toast("Selecciona una fecha válida.");
    }
  }
};
$("#export").onclick = async () => {
  $("#backup").open = false;
  try {
    const saved = await download(state);
    if (saved) toast("Copia exportada. Comprueba el archivo JSON en la ubicación elegida.");
  } catch (err) {
    toast("No se ha exportado la copia: " + String(err));
  }
};
$("#import").onclick = () => {
  $("#file").click();
  $("#backup").open = false;
};
$("#file").onchange = async (e) => {
  const file = e.target.files[0];
  e.target.value = "";
  if (!file) return;
  try {
    if (file.size > 5_000_000)
      throw Error("La copia supera el límite de 5 MB.");
    const next = applyDefaultCategoryColors(validate(JSON.parse(await file.text())));
    confirmAction(
      "Restaurar copia",
      `Se sustituirán todos los datos locales por esta copia: ${next.items.length} alimentos y comidas, ${next.recipes.length} recetas y ${Object.keys(next.plan).length} casillas. Exporta tus datos actuales antes si quieres conservarlos.`,
      () => {
        try {
          save(next);
          state = next;
          storageError = false;
          pending = null;
          $("#catalog").hidden = true;
          $("#recipe-list").close();
          $("#recipe-detail").close();
          render();
          $("#save-status").textContent = "✓ Copia restaurada";
          return true;
        } catch (err) {
          toast("No se ha restaurado: " + err.message);
          return false;
        }
      },
      "",
      "Restaurar",
    );
  } catch (err) {
    toast("No se puede importar: " + err.message);
  }
};
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !$("#editor").open && !$("#confirm").open) {
    $("#catalog").hidden = true;
    targetCell = null;
    pending = null;
    render();
  }
});
render();
if (storageError) {
  $("#save-status").textContent =
    "⚠ Almacenamiento no disponible o datos no válidos";
  toast(
    "No se han sobrescrito los datos anteriores. Restaura una copia válida para continuar.",
  );
}
