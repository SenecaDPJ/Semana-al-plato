import { seed, validate } from "./domain.js";
const KEY = "calendario-comidas.v1";
export function load() {
  const raw = localStorage.getItem(KEY);
  return raw ? validate(JSON.parse(raw)) : seed();
}
export function save(state) {
  validate(state);
  localStorage.setItem(KEY, JSON.stringify(state));
}
export function download(state) {
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(state, null, 2)], { type: "application/json" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = "calendario-comidas-copia.json";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
