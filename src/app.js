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
  clonePlanEntries,
  movePlanEntry,
  removePlanEntries,
  seed,
} from "./domain.js";
import { load, save, download } from "./storage.js";
import {
  localizeDefault,
  restoreDefault,
  slotName,
  translateText,
} from "./i18n.js";
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
  returnFocus = null,
  selectedEntries = [],
  pointerGesture = null,
  clearSelectionOnConfirmClose = false,
  suppressCalendarClick = false;
const THEME_KEY = "calendario-comidas.theme",
  LANGUAGE_KEY = "calendario-comidas.language",
  PROFILE_URL = "https://github.com/SenecaDPJ";
let language = "es";
try {
  language = localStorage.getItem(LANGUAGE_KEY) === "en" ? "en" : "es";
} catch { /* La preferencia de idioma es opcional. */ }

function localizeTree(root = document) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    const parent = node.parentElement;
    if (
      !parent ||
      parent.closest("[data-user-content]") ||
      ["SCRIPT", "STYLE", "TEXTAREA"].includes(parent.tagName)
    )
      continue;
    const translated = translateText(node.nodeValue, language);
    if (translated !== node.nodeValue) node.nodeValue = translated;
  }
  const elements = root.querySelectorAll?.("[aria-label], [title], [placeholder]") || [];
  for (const element of elements) {
    if (element.closest("[data-user-content]")) continue;
    for (const attribute of ["aria-label", "title", "placeholder"]) {
      if (!element.hasAttribute(attribute)) continue;
      const value = element.getAttribute(attribute),
        translated = translateText(value, language);
      if (translated !== value) element.setAttribute(attribute, translated);
    }
  }
}

function displayName(item, field = "name") {
  return localizeDefault(item.id, field, item[field] || "", language);
}
function displayCategoryName(categoryItem) {
  return ["breakfast", "lunch", "dinner"].includes(categoryItem.id)
    ? slotName(categoryItem.name, language)
    : categoryItem.name;
}
function applyLanguage(next) {
  language = next === "en" ? "en" : "es";
  document.documentElement.lang = language;
  const button = $("#language-toggle");
  $("#language-name").textContent = language === "en" ? "Language" : "Idioma";
  $("#language-flag-es").hidden = language !== "es";
  $("#language-flag-en").hidden = language !== "en";
  button.textContent = language === "en" ? "English" : "Español";
  button.dataset.language = language;
  const switchLabel = language === "en" ? "Change language to Español" : "Cambiar idioma a English";
  button.setAttribute("aria-label", switchLabel);
  button.title = switchLabel;
  localizeTree(document);
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const label = language === "en"
    ? theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
    : theme === "dark" ? "Activar tema claro" : "Activar tema oscuro";
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
applyLanguage(language);
$("#language-toggle").onclick = () => {
  const next = language === "en" ? "es" : "en";
  applyLanguage(next);
  applyTheme(document.documentElement.dataset.theme);
  try {
    localStorage.setItem(LANGUAGE_KEY, next);
  } catch {
    toast(language === "en"
      ? "The language changed, but the preference could not be saved."
      : "El idioma ha cambiado, pero no se ha podido guardar la preferencia.");
  }
  render();
  if (!$("#catalog").hidden) {
    if ($("#category-items")) renderCategories();
    else if ($("#catalog-items")) renderCatalog();
    else if (targetCell) openAddChoices(targetCell);
  }
  if ($("#recipe-list").open) renderRecipes();
  if ($("#recipe-detail").open) openRecipe($("#recipe-detail").dataset.recipeId);
};
$("#theme-toggle").onclick = () => {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(next);
  try {
    localStorage.setItem(THEME_KEY, next);
  } catch {
    toast("El tema ha cambiado, pero no se ha podido guardar la preferencia.");
  }
};
$("#profile-link").onclick = (event) => {
  event.preventDefault();
  confirmAction(
    "Abrir perfil de GitHub",
    `¿Permites abrir ${PROFILE_URL} en el navegador predeterminado?`,
    () => {
      try {
        if (window.__TAURI__?.core?.invoke) {
          Promise.resolve(
            window.__TAURI__.core.invoke("open_github_profile"),
          ).catch((error) => toast("No se pudo abrir el perfil: " + error));
        } else {
          window.open(PROFILE_URL, "_blank", "noopener,noreferrer");
        }
      } catch (error) {
        toast("No se pudo abrir el perfil: " + error);
      }
    },
    "",
    "Abrir enlace",
  );
};
const category = (id) => state.categories.find((c) => c.id === id);
const source = (e) =>
  (e.kind === "recipe" ? state.recipes : state.items).find(
    (x) => x.id === e.refId,
  );
const fmt = (d, options) => d.toLocaleDateString(language === "en" ? "en-GB" : "es-ES", options);
const badge = (id) => {
  const c = category(id);
  const name = displayCategoryName(c);
  return `<span class="badge" style="color:${c.text};background:${c.fill}"${c.locked ? "" : ' data-user-content="true"'}>${esc(name)}</span>`;
};
function toast(msg, variant = "") {
  const node = $("#toast");
  node.textContent = translateText(msg, language);
  node.classList.toggle("toast-invalid-drop", variant === "invalid-drop");
  node.hidden = false;
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => (node.hidden = true), 4500);
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
    $("#save-status").textContent = language === "en" ? "✓ Saved on this device" : "✓ Guardado en este dispositivo";
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
    html += `<div class="slot-label"><span>${["○", "◐", "◒"][i]}</span>${esc(slotName(slot, language))}</div>`;
    for (const day of days) {
      const key = dateKey(day) + "|" + slot,
        entries = state.plan[key] || [];
      if (entries.length) total++;
      const dayLabel = fmt(day, { weekday: "long", day: "numeric", month: "long" });
      html += `<div class="cell ${dateKey(day) === dateKey(new Date()) ? "current" : ""} ${pending ? "choosing" : ""}" data-cell="${key}" ${pending ? 'tabindex="0" role="button"' : ""} aria-label="${esc(language === "en" ? `${slotName(slot, language)} on ${dayLabel}` : `${slot} del ${dayLabel}`)}">`;
      if (!entries.length)
        html += `<div class="empty"><button aria-label="${language === "en" ? "Add to " + slotName(slot, language) + " on " + dateKey(day) : "Añadir a " + slot + " del " + dateKey(day)}" data-add="${key}">+</button></div>`;
      for (const e of entries) {
        const x = source(e),
          c = category(x.categoryId),
          selected = selectedEntries.some(
            (item) => item.key === key && item.id === e.id,
          );
          html += `<button class="entry${selected ? " is-selected" : ""}" aria-pressed="${selected}" draggable="false" data-text="${c.text}" data-fill="${c.fill}" data-entry="${e.id}" data-key="${key}"><span data-user-content="true">${esc(displayName(x))}</span><small>${e.kind === "recipe" ? (language === "en" ? "▤ Recipe" : "▤ Receta") : e.kind === "food" ? (language === "en" ? "Food" : "Alimento") : (language === "en" ? "Dish" : "Plato")} · ${esc(displayCategoryName(c))}</small></button>`;
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
  $("#count").textContent = language === "en" ? `${total} of 21 time slots` : `${total} de 21 momentos`;
  $("#placement").hidden = !pending;
  if (pending) {
    $("#placement").innerHTML =
      `<span><strong data-user-content="true">${esc(pending.name)}</strong>${language === "en" ? " · Choose the slot where you want to add it." : " · Selecciona la casilla donde quieres añadirlo."}</span><button id="cancel-placement" class="small">Cancelar</button>`;
    $("#cancel-placement").onclick = () => {
      pending = null;
      render();
    };
  }
  localizeTree($("#calendar"));
  localizeTree($("#placement"));
}
function choose(x, k) {
  const target = targetCell;
  targetCell = null;
  pending = { id: x.id, name: displayName(x), kind: k };
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
  if (!d.open) returnFocus = document.activeElement;
  d.innerHTML = `<h2>${esc(title)}</h2><p>${esc(message)}</p><div class="actions"><button id="cancel-confirm">Cancelar</button><button id="accept-confirm" class="${action === "delete" ? "danger" : "primary"}">${esc(label)}</button></div>`;
  localizeTree(d);
  if (!d.open) d.showModal();
  $("#cancel-confirm").onclick = () => d.close();
  $("#accept-confirm").onclick = () => {
    if (accept() !== false) d.close();
  };
}
$("#confirm").addEventListener("close", () => {
  if (clearSelectionOnConfirmClose) {
    clearSelectionOnConfirmClose = false;
    selectedEntries = [];
    render();
  }
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
        toast(language === "en" ? "Added to your week." : "Añadido a tu semana.");
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
  if (suppressCalendarClick) {
    suppressCalendarClick = false;
    e.preventDefault();
    return;
  }
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
    d = $("#editor"),
    daySlot = key.split("|"),
    when = language === "en"
      ? `${fmt(parseDate(daySlot[0]), { weekday: "long", day: "numeric", month: "long", year: "numeric" })} · ${slotName(daySlot[1], language)}`
      : key.replace("|", " · ");
  d.innerHTML = `<div class="panel-head"><h2 data-user-content="true">${esc(displayName(x))}</h2><button class="icon" data-close aria-label="Cerrar">×</button></div><p class="help">${esc(when)}</p><div class="entry-menu-meta">${badge(x.categoryId)}<button id="clone-entry" class="small" aria-label="Clonar ${esc(displayName(x))}">Clonar</button></div><div class="actions">${e.kind === "recipe" ? '<button id="open-entry-recipe">Abrir receta</button>' : ""}<button class="danger" id="remove-entry">Eliminar de esta casilla</button></div>`;
  localizeTree(d);
  d.showModal();
  d.querySelector("[data-close]").onclick = () => d.close();
  $("#clone-entry").onclick = () => {
    d.close();
    openCloneDialog([{ key, id }]);
  };
  if (e.kind === "recipe")
    $("#open-entry-recipe").onclick = () => {
      d.close();
      openRecipe(x.id);
    };
  $("#remove-entry").onclick = () =>
    confirmAction(
      "Eliminar de la casilla",
      `Se quitará «${displayName(x)}» de este momento del día. Seguirá disponible en el catálogo.`,
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
function openCloneDialog(entries, bulk = false) {
  if (!entries.length) return;
  const d = $("#confirm"),
    weekDates = daysOfWeek(week).map(dateKey),
    sourceDates = new Set(entries.map(({ key }) => key.split("|")[0])),
    destinations = weekDates.filter((date) => !sourceDates.has(date)),
    nextWeek = new Date(week);
  nextWeek.setDate(nextWeek.getDate() + 7);
  if (!d.open) returnFocus = document.activeElement;
  if (bulk) clearSelectionOnConfirmClose = true;
  const weekOptions = destinations
    .map((date) => {
      const day = parseDate(date);
      return `<option value="${date}">${esc(fmt(day, { weekday: "long", day: "numeric", month: "long" }))}</option>`;
    })
    .join("");
  const countLabel = entries.length === 1 ? "elemento" : "elementos";
  d.innerHTML = `<h2>Clonar ${entries.length} ${countLabel}</h2><p>Elige el día de destino. Se conservará el momento del día de cada elemento.</p><div class="clone-destinations"><label class="clone-destination"><input id="clone-this-week" name="clone-destination" type="radio" value="week" ${destinations.length ? "checked" : "disabled"}><span><strong>Otro día de esta semana</strong><small>Los elementos seleccionados se copiarán al día elegido.</small><select id="clone-week-date" aria-label="Día de esta semana" ${destinations.length ? "" : "disabled"}>${weekOptions || '<option value="">No queda otro día disponible</option>'}</select></span></label><label class="clone-destination"><input id="clone-other-week" name="clone-destination" type="radio" value="other-week" ${destinations.length ? "" : "checked"}><span><strong>Otro día de otra semana</strong><small>Elige una fecha fuera de la semana visible.</small><input id="clone-other-date" type="date" value="${dateKey(nextWeek)}" disabled></span></label></div><p id="clone-error" class="error" role="alert"></p><div class="actions"><button type="button" id="cancel-clone">Cancelar</button><button type="button" id="accept-clone" class="primary">Clonar</button></div>`;
  localizeTree(d);
  if (!d.open) d.showModal();
  const syncMode = () => {
    const useWeek = $("#clone-this-week").checked;
    $("#clone-week-date").disabled = !useWeek || !destinations.length;
    $("#clone-other-date").disabled = useWeek;
  };
  d.querySelectorAll('[name="clone-destination"]').forEach((input) =>
    input.addEventListener("change", syncMode),
  );
  $("#cancel-clone").onclick = () => d.close();
  $("#accept-clone").onclick = () => {
    const error = $("#clone-error");
    let targetDate;
    if ($("#clone-this-week").checked) {
      targetDate = $("#clone-week-date").value;
      if (!targetDate || !destinations.includes(targetDate)) {
        error.textContent = translateText("Selecciona otro día de esta semana.", language);
        return;
      }
    } else {
      targetDate = $("#clone-other-date").value;
      try {
        const chosenWeek = dateKey(monday(parseDate(targetDate)));
        if (chosenWeek === dateKey(week)) {
          error.textContent = translateText("La fecha debe pertenecer a otra semana.", language);
          return;
        }
      } catch {
        error.textContent = translateText("Selecciona una fecha válida.", language);
        return;
      }
    }
    if (!commit((s) => clonePlanEntries(s, entries, targetDate))) return;
    const targetWeek = monday(parseDate(targetDate));
    const movedWeek = dateKey(targetWeek) !== dateKey(week);
    if (movedWeek) {
      week = targetWeek;
      render();
    }
    d.close();
    toast(language === "en"
      ? `${entries.length} ${entries.length === 1 ? "entry cloned" : "entries cloned"}.`
      : `${entries.length} ${countLabel}${entries.length === 1 ? " clonado" : " clonados"}.`);
  };
}
function confirmDeleteSelected() {
  const count = selectedEntries.length;
  confirmAction(
    "Aviso 1 de 2",
    `Vas a quitar ${count} ${count === 1 ? "elemento" : "elementos"} seleccionado${count === 1 ? "" : "s"} del calendario. Seguirán disponibles en sus catálogos. ¿Quieres continuar?`,
    () => {
      confirmAction(
        "Confirmación final",
        count === 1
          ? "Se eliminará el elemento seleccionado del plan. Esta acción no se puede deshacer desde el calendario."
          : `Se eliminarán los ${count} elementos seleccionados del plan. Esta acción no se puede deshacer desde el calendario.`,
        () => {
          const ok = commit((s) => {
            if (!removePlanEntries(s, selectedEntries))
              throw Error("Los elementos seleccionados ya no están en el calendario.");
          });
          if (ok) toast(`${count} ${count === 1 ? "elemento eliminado" : "elementos eliminados"}.`);
          return ok;
        },
        "delete",
        "Eliminar TODOS",
      );
      return false;
    },
    "delete",
    "Continuar",
  );
}
function showBulkActions() {
  const d = $("#confirm"),
    count = selectedEntries.length,
    countLabel = count === 1 ? "elemento seleccionado" : "elementos seleccionados";
  if (!d.open) returnFocus = document.activeElement;
  clearSelectionOnConfirmClose = true;
  d.innerHTML = `<h2>${count} ${countLabel}</h2><p>Puedes clonar la selección en otro día o quitarla del calendario.</p><div class="actions bulk-selection-actions"><button type="button" class="primary" id="clone-selected">Clonar TODOS</button><button type="button" class="danger" id="delete-selected">Eliminar TODOS</button><button type="button" id="cancel-bulk-selection">Cancelar</button></div>`;
  localizeTree(d);
  if (!d.open) d.showModal();
  $("#cancel-bulk-selection").onclick = () => d.close();
  $("#clone-selected").onclick = () => openCloneDialog(selectedEntries, true);
  $("#delete-selected").onclick = confirmDeleteSelected;
}
function updateMarquee(gesture, clientX, clientY) {
  const calendar = $("#calendar"),
    bounds = calendar.getBoundingClientRect(),
    left = Math.min(gesture.startX, clientX),
    right = Math.max(gesture.startX, clientX),
    top = Math.min(gesture.startY, clientY),
    bottom = Math.max(gesture.startY, clientY);
  gesture.box.style.left = `${left - bounds.left}px`;
  gesture.box.style.top = `${top - bounds.top}px`;
  gesture.box.style.width = `${right - left}px`;
  gesture.box.style.height = `${bottom - top}px`;
  gesture.bounds = { left, right, top, bottom };
  gesture.matches = [...calendar.querySelectorAll(".entry")]
    .filter((entry) => {
      const rect = entry.getBoundingClientRect();
      return rect.left < right && rect.right > left && rect.top < bottom && rect.bottom > top;
    })
    .map((entry) => ({ key: entry.dataset.key, id: entry.dataset.entry }));
  calendar.querySelectorAll(".entry").forEach((entry) => {
    const matched = gesture.matches.some(
      (item) => item.key === entry.dataset.key && item.id === entry.dataset.entry,
    );
    entry.classList.toggle("lasso-candidate", matched);
  });
}
function clearGestureVisuals(gesture) {
  gesture?.box?.remove();
  const calendar = $("#calendar");
  calendar.classList.remove("calendar-selecting");
  calendar.querySelectorAll(".entry.lasso-candidate, .entry.is-dragging, .cell.drop-target, .cell.drop-invalid").forEach((node) => {
    node.classList.remove("lasso-candidate", "is-dragging", "drop-target", "drop-invalid");
  });
}
function pointerCellAt(event) {
  const hit = document.elementFromPoint?.(event.clientX, event.clientY);
  return hit?.closest?.(".cell") || event.target?.closest?.(".cell") || null;
}
function insertionIndex(cell, clientY, draggedId) {
  const entries = [...cell.querySelectorAll(".entry")].filter(
    (entry) => entry.dataset.entry !== draggedId,
  );
  const index = entries.findIndex((entry) => {
    const rect = entry.getBoundingClientRect();
    return clientY < rect.top + rect.height / 2;
  });
  return index < 0 ? entries.length : index;
}
document.addEventListener("pointerdown", (event) => {
  if ((event.button ?? 0) !== 0 || pending || $("#confirm").open) return;
  const calendar = $("#calendar"),
    entry = event.target.closest?.(".entry");
  if (entry && calendar.contains(entry)) {
    pointerGesture = {
      type: "entry",
      pointerId: event.pointerId ?? 1,
      startX: event.clientX,
      startY: event.clientY,
      element: entry,
      key: entry.dataset.key,
      id: entry.dataset.entry,
      started: false,
    };
    return;
  }
  const cell = event.target.closest?.(".cell");
  if (
    cell &&
    calendar.contains(cell) &&
    !event.target.closest("button, a, input, select, summary, .entry")
  ) {
    const box = document.createElement("div");
    box.className = "selection-marquee";
    calendar.append(box);
    pointerGesture = {
      type: "selection",
      pointerId: event.pointerId ?? 1,
      startX: event.clientX,
      startY: event.clientY,
      box,
      matches: [],
      bounds: null,
    };
    calendar.classList.add("calendar-selecting");
    event.preventDefault();
  }
});
document.addEventListener("pointermove", (event) => {
  const gesture = pointerGesture;
  if (!gesture || gesture.pointerId !== (event.pointerId ?? 1)) return;
  const deltaX = event.clientX - gesture.startX,
    deltaY = event.clientY - gesture.startY;
  if (gesture.type === "selection") {
    if (Math.hypot(deltaX, deltaY) < 6) return;
    updateMarquee(gesture, event.clientX, event.clientY);
    event.preventDefault();
    return;
  }
  if (!gesture.started && Math.hypot(deltaX, deltaY) < 7) return;
  gesture.started = true;
  gesture.element.classList.add("is-dragging");
  const calendar = $("#calendar"),
    cell = pointerCellAt(event),
    sourceSlot = gesture.key.split("|")[1];
  calendar.querySelectorAll(".cell.drop-target, .cell.drop-invalid").forEach((node) =>
    node.classList.remove("drop-target", "drop-invalid"),
  );
  if (cell) {
    cell.classList.add(cell.dataset.cell.split("|")[1] === sourceSlot ? "drop-target" : "drop-invalid");
  }
  event.preventDefault();
});
document.addEventListener("pointerup", (event) => {
  const gesture = pointerGesture;
  if (!gesture || gesture.pointerId !== (event.pointerId ?? 1)) return;
  pointerGesture = null;
  if (gesture.type === "selection") {
    if (gesture.bounds) updateMarquee(gesture, event.clientX, event.clientY);
    const matches = gesture.matches;
    const largeEnough = gesture.bounds &&
      (gesture.bounds.right - gesture.bounds.left >= 10 || gesture.bounds.bottom - gesture.bounds.top >= 10);
    clearGestureVisuals(gesture);
    if (largeEnough && matches.length) {
      suppressCalendarClick = true;
      setTimeout(() => (suppressCalendarClick = false), 0);
      selectCalendarEntries(matches);
    } else if (largeEnough) {
      toast("La selección no contiene elementos del calendario.");
    }
    return;
  }
  if (!gesture.started) return;
  suppressCalendarClick = true;
  setTimeout(() => (suppressCalendarClick = false), 0);
  const cell = pointerCellAt(event),
    sourceSlot = gesture.key.split("|")[1];
  const targetKey = cell?.dataset.cell;
  const targetIndex = cell ? insertionIndex(cell, event.clientY, gesture.id) : -1;
  const sourceIndex = state.plan[gesture.key]?.findIndex((entry) => entry.id === gesture.id) ?? -1;
  clearGestureVisuals(gesture);
  if (!cell || !targetKey) return;
  if (targetKey.split("|")[1] !== sourceSlot) {
    toast("Muévelo a otro día dentro de la misma categoría.", "invalid-drop");
    return;
  }
  if (targetKey === gesture.key && targetIndex === sourceIndex) return;
  if (commit((s) => movePlanEntry(s, gesture.key, gesture.id, targetKey, targetIndex)))
    toast("Elemento movido en el calendario.");
});
document.addEventListener("pointercancel", () => {
  if (pointerGesture) clearGestureVisuals(pointerGesture);
  pointerGesture = null;
});
function selectCalendarEntries(entries) {
  selectedEntries = entries;
  render();
  showBulkActions();
}
function clearCalendarSelection() {
  selectedEntries = [];
}
function categoryOptions(id) {
  return state.categories
    .map(
      (c) =>
        `<option value="${c.id}" ${c.locked ? "" : 'data-user-content="true"'} ${id === c.id ? "selected" : ""}>${esc(displayCategoryName(c))}</option>`,
    )
    .join("");
}
function openAddChoices(key) {
  targetCell = key;
  const [date, slot] = key.split("|");
  const panel = $("#catalog");
  panel.hidden = false;
  panel.innerHTML = `<div class="panel-head"><h2>${language === "en" ? `Add to ${slotName(slot, language)}` : `Añadir a ${esc(slot.toLowerCase())}`}</h2><button id="close-catalog" class="icon" aria-label="Cerrar opciones">×</button></div><p class="help">${esc(fmt(parseDate(date), { weekday: "long", day: "numeric", month: "long" }))}. Elige qué quieres añadir y después confirma la casilla.</p><div class="add-choices"><button class="primary" data-add-kind="meal">＋ Añadir comida</button><button class="action-food" data-add-kind="food">＋ Añadir alimento</button><button class="action-recipe" data-add-kind="recipe">▤ Añadir receta</button></div>`;
  localizeTree(panel);
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
  localizeTree(panel);
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
      normalize(displayName(x)).includes(q) &&
      (!filter || x.categoryId === filter),
  );
  $("#catalog-items").innerHTML = list.length
    ? list
        .map(
          (x) =>
            `<div class="catalog-row"><button class="select-item" data-select="${x.id}"><span data-user-content="true">${esc(displayName(x))}</span><br>${badge(x.categoryId)}</button><div class="row-tools"><button data-edit="${x.id}" aria-label="Editar ${esc(displayName(x))}">Editar</button><button class="danger" data-delete="${x.id}" aria-label="Eliminar ${esc(displayName(x))}">Eliminar</button></div></div>`,
        )
        .join("")
    : '<p class="help">No hay resultados. Prueba otra búsqueda o añade uno nuevo.</p>';
  localizeTree($("#catalog-items"));
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
    `¿Eliminar «${displayName(x)}»?${count ? ` También se quitarán sus ${count} apariciones del calendario.` : " No aparece en el calendario."}`,
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
  d.innerHTML = `<div class="panel-head"><h2>${x ? "Editar" : kind === "meal" ? "Añadir nueva comida" : "Añadir nuevo alimento"}</h2><button class="icon" data-close aria-label="Cerrar">×</button></div><form id="item-form"><label class="field">Nombre ${kind === "meal" ? "de la comida" : "del alimento"}<input name="name" required maxlength="100" value="${esc(x ? displayName(x) : "")}"></label><label class="field">Categoría<select name="categoryId">${categoryOptions(x?.categoryId)}</select></label><p class="error" role="alert"></p><div class="actions"><button type="button" data-close>Cancelar</button><button class="primary" type="submit">Guardar</button></div></form>`;
  localizeTree(d);
  d.showModal();
  d.querySelectorAll("[data-close]").forEach(
    (b) => (b.onclick = () => d.close()),
  );
  $("#item-form").onsubmit = (e) => {
    e.preventDefault();
    const f = new FormData(e.target),
      name = restoreDefault(x?.id, "name", f.get("name").trim());
    try {
      assertName(
        state.items.filter((v) => v.kind === kind),
        name,
        x?.id,
      );
    } catch (err) {
      d.querySelector(".error").textContent = translateText(err.message, language);
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
  localizeTree(p);
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
  localizeTree($("#category-items"));
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
  localizeTree(d);
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
  localizeTree(d);
  d.showModal();
  d.querySelectorAll("[data-close]").forEach(
    (b) => (b.onclick = () => d.close()),
  );
  d.querySelector("input").oninput = (e) =>
    (d.querySelector(".preview-badge").textContent =
      e.target.value || (language === "en" ? "Category preview" : "Así se verá tu categoría"));
  $("#category-form").onsubmit = (e) => {
    e.preventDefault();
    const name = new FormData(e.target).get("name").trim();
    try {
      assertName(state.categories, name, c?.id);
    } catch (err) {
      d.querySelector(".error").textContent = translateText(err.message, language);
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
  d.innerHTML = `<div class="panel-head"><h2>Tu recetario</h2><button class="icon" id="close-recipes" aria-label="Cerrar recetario">×</button></div><p class="help">${targetCell ? "Pulsa «Al calendario» en una receta para confirmar su casilla." : "Abre una receta con doble clic o pulsa «Abrir». Puedes seguir usando el calendario."}</p><button id="new-recipe" class="action-recipe full">＋ Crear nueva receta</button><div>${state.recipes.length ? state.recipes.map((r) => `<article class="recipe-row" data-recipe="${r.id}" tabindex="0"><strong data-user-content="true">${esc(displayName(r))}</strong><div class="recipe-meta">${r.minutes} ${language === "en" ? "min" : "min"} · ${r.servings} ${language === "en" ? "servings" : "raciones"} ${badge(r.categoryId)}</div><button class="small" data-open="${r.id}">Abrir</button><button class="small" data-plan="${r.id}">Al calendario</button><button class="small" data-edit="${r.id}">Editar</button><button class="small danger" data-delete="${r.id}">Eliminar</button></article>`).join("") : '<p class="help">Tu próxima receta empieza aquí.</p>'}</div>`;
  localizeTree(d);
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
  d.innerHTML = `<div class="panel-head"><h2 data-user-content="true">${esc(displayName(r))}</h2><button class="icon" id="close-recipe" aria-label="Cerrar receta">×</button></div>${badge(r.categoryId)}<div class="recipe-meta">◷ ${r.minutes} ${language === "en" ? "minutes" : "minutos"} · ${r.servings} ${language === "en" ? "servings" : "raciones"}</div><h3>Ingredientes</h3><div class="recipe-text" data-user-content="true">${esc(displayName(r, "ingredients"))}</div><h3>Preparación</h3><div class="recipe-text" data-user-content="true">${esc(displayName(r, "steps"))}</div><div class="actions"><button id="edit-recipe">Editar</button><button class="primary" id="plan-recipe">Añadir al calendario</button></div>`;
  localizeTree(d);
  if (!d.open) d.show();
  $("#close-recipe").onclick = () => d.close();
  $("#edit-recipe").onclick = () => editRecipe(r);
  $("#plan-recipe").onclick = () => choose(r, "recipe");
}
function editRecipe(r) {
  const d = $("#editor");
  d.innerHTML = `<div class="panel-head"><h2>${r ? "Editar receta" : "Nueva receta"}</h2><button class="icon" data-close aria-label="Cerrar">×</button></div><form id="recipe-form"><div class="form-grid"><label class="field wide">Nombre de la receta<input name="name" required maxlength="100" value="${esc(r ? displayName(r) : "")}"></label><label class="field wide">Categoría<select name="categoryId">${categoryOptions(r?.categoryId)}</select></label><label class="field">Minutos<input name="minutes" type="number" min="1" max="1440" required value="${r?.minutes || 15}"></label><label class="field">Raciones<input name="servings" type="number" min="1" max="100" required value="${r?.servings || 2}"></label><label class="field wide">Ingredientes · uno por línea<textarea name="ingredients" required maxlength="10000">${esc(r ? displayName(r, "ingredients") : "")}</textarea></label><label class="field wide">Preparación · un paso por línea<textarea name="steps" required maxlength="10000">${esc(r ? displayName(r, "steps") : "")}</textarea></label></div><p class="error" role="alert"></p><div class="actions"><button type="button" data-close>Cancelar</button><button type="submit" class="primary">Guardar receta</button></div></form>`;
  localizeTree(d);
  d.showModal();
  d.querySelectorAll("[data-close]").forEach(
    (b) => (b.onclick = () => d.close()),
  );
  $("#recipe-form").onsubmit = (e) => {
    e.preventDefault();
    const f = new FormData(e.target),
      name = restoreDefault(r?.id, "name", f.get("name").trim());
    try {
      assertName(state.recipes, name, r?.id);
    } catch (err) {
      d.querySelector(".error").textContent = translateText(err.message, language);
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
          ingredients: restoreDefault(r?.id, "ingredients", f.get("ingredients").trim()),
          steps: restoreDefault(r?.id, "steps", f.get("steps").trim()),
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
  clearCalendarSelection();
  week.setDate(week.getDate() + offset);
  render();
}
$("#prev").onclick = () => navigate(-7);
$("#next").onclick = () => navigate(7);
$("#today").onclick = () => {
  targetCell = null;
  clearCalendarSelection();
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
      clearCalendarSelection();
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
          $("#save-status").textContent = language === "en" ? "✓ Backup restored" : "✓ Copia restaurada";
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
    clearCalendarSelection();
    render();
  }
});
render();
if (storageError) {
  $("#save-status").textContent = language === "en"
    ? "⚠ Storage unavailable or data is invalid"
    : "⚠ Almacenamiento no disponible o datos no válidos";
  toast(
    "No se han sobrescrito los datos anteriores. Restaura una copia válida para continuar.",
  );
}
