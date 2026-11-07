import { applyDefaultCategoryColors, seed, validate } from "./domain.js";
const KEY = "calendario-comidas.v1";
export function load() {
  const raw = localStorage.getItem(KEY);
  return raw ? applyDefaultCategoryColors(validate(JSON.parse(raw))) : seed();
}
export function save(state) {
  validate(state);
  localStorage.setItem(KEY, JSON.stringify(state));
}
export async function download(state) {
  validate(state);
  const json = JSON.stringify(state, null, 2);
  if (window.__TAURI__?.core?.invoke) {
    return window.__TAURI__.core.invoke("export_backup", { json });
  }
  const url = URL.createObjectURL(
    new Blob([json], { type: "application/json" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = "Semana_al_Plato_copia.json";
  document.body.append(a);
  try {
    a.click();
  } finally {
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  }
  return true;
}
