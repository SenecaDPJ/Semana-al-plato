# Semana al Plato

Proyecto local para Windows 11. Comunicación con David en español de España. Publicar únicamente en el repositorio GitHub privado autorizado; no cambiar su visibilidad sin petición expresa.

Antes de ofrecer comandos al usuario, usa las etiquetas `🔴 EJECUCIÓN⚙️🚨`, `🔶 CONSULTA🔎⚠️` y `🟦 INFO SENSIBLE🧾🔥` según corresponda.

Trabaja sobre `src/` e `index.html`; `dist/` se genera con `npm run build`. Ejecuta `npm test` tras cambiar interacciones y compila con `npm run tauri -- build` antes de entregar un instalador. No des por probado visualmente un instalador solo por compilarlo.

Conserva las tres filas Desayuno, Comida y Cena. Las categorías adicionales son etiquetas. Las categorías iniciales están protegidas. Mantén el flujo de selección y confirmación; las recetas se muestran en paneles no modales. Usa fechas locales para el calendario, escapa los datos del usuario y valida las copias antes de guardar. Versiona cualquier cambio del esquema de datos.

El identificador Tauri `com.senecadpj.calendariocomidas` y las claves de almacenamiento `calendario-comidas.v1` y `calendario-comidas.theme` son heredados y se conservan para facilitar la actualización de instalaciones anteriores. Antes de modificar cualquiera de ellos, diseña y prueba una migración que no pierda datos.

No añadas a Git instaladores, `dist/`, `node_modules/`, `src-tauri/target/`, bundles de recuperación ni archivos locales de prueba. Mantén el README y VALIDACION.md ajustados a la versión actual.
