# Registro de validación de Semana al Plato

## Registro heredado de v1.0.1

- La release v1.0.1, publicada el 5 de noviembre de 2026, afirmó que la exportación y restauración se comprobaron en la aplicación instalada. El registro manual de esa versión dejó ambas comprobaciones pendientes.
- La discrepancia histórica se conserva sin resolver: la evidencia disponible no permite confirmar cuál de las dos afirmaciones es correcta.
- En v1.0.1 constan 17 pruebas correctas y una compilación NSIS x64 en Windows 11. Su instalador, excluido de Git, tuvo SHA-256 `E12A9BEF6E6A0F3F1BC67AE5228D685D907FB4FD9B1E9BF948CFB9E5178FAEE2`.

## Comprobaciones de v1.0.2

- `npm ci`: dependencias del lockfile instaladas; auditoría con cero vulnerabilidades notificadas.
- `npm test`: 18 pruebas correctas, incluidas las 196 combinaciones de contraste y la actualización de los colores por defecto al cargar copias antiguas sin alterar el resto de los datos.
- `npm run build`: correcto; generó `dist/index.html`, excluido de Git.
- El cálculo de contraste de la paleta da un mínimo de 4,97:1. La prueba automatizada comprueba el umbral AA de 4,5:1 para las 196 combinaciones.
- El flujo [Publicar instalador de Windows](https://github.com/SenecaDPJ/semana-al-plato/actions/runs/42386548479) terminó correctamente en Windows: pruebas y compilación NSIS x64.
- La release privada [v1.0.2](https://github.com/SenecaDPJ/semana-al-plato/releases/tag/v1.0.2) está publicada. Contiene `Semana.al.Plato_1.0.2_x64-setup.exe` (1.970.092 bytes; SHA-256 `36f4afecac82dd0ab65bf0c7027330e129fdfdc6767f3a8fdb6e1484cbcb5426`).
- Se comprobó que el repositorio continúa siendo privado.

## Comprobaciones manuales pendientes de v1.0.2

- Instalar el paquete y revisar visualmente el icono del instalador y desinstalador, además de las etiquetas en los temas claro y oscuro.
- Probar exportar y restaurar una copia, conservando los datos, y revisar el calendario con contenido abundante.
- La compilación automatizada no demuestra por sí sola la comprobación visual del instalador ni el funcionamiento manual en otro PC.

## Comprobaciones de v1.0.3

- `npm test`: 26 pruebas correctas. Las pruebas incluyen ambos destinos de clonado, el reordenado y movimiento entre días de la misma fila, el clonado múltiple, las dos confirmaciones de borrado y el permiso para abrir el perfil de GitHub.
- `git diff --check`: correcto.
- `npm run build`: correcto; generó `dist/index.html`, excluido de Git.
- El flujo de [Publicación de Windows](https://github.com/SenecaDPJ/semana-al-plato/actions/runs/42403188032) terminó correctamente: pruebas y compilación NSIS x64.
- La release privada [v1.0.3](https://github.com/SenecaDPJ/semana-al-plato/releases/tag/v1.0.3) está publicada. Contiene `Semana.al.Plato_1.0.3_x64-setup.exe` (1.981.890 bytes; SHA-256 `183334182d63a0ceb74cb184c6f627efb1ea4fd6bc131b54c830c2227a1cbb5b`).
- Las pruebas automatizadas verifican que cancelar no abre el enlace y que aceptar invoca la apertura nativa. No se ha comprobado manualmente el navegador desde la aplicación instalada.
- La información de GitHub confirma que el repositorio continúa siendo privado.

## Comprobaciones de v2.0.0

- `npm test`: 30 pruebas correctas. Se comprueban el selector de idioma y su persistencia, las traducciones de calendario, categorías, ejemplos, recetas y diálogos, y que la preferencia no modifica los datos guardados.
- `npm run build`: correcto; genera `dist/index.html`, excluido de Git.
- `git diff --check`: correcto.
- La compilación local de Tauri no pudo ejecutarse porque `cargo` no está instalado en este entorno. El flujo de Windows [terminó correctamente](https://github.com/SenecaDPJ/Semana-al-plato/actions/runs/42411277902): ejecutó las pruebas y compiló un instalador NSIS x64, publicado como artefacto descargable.
- La release privada [v2.0.0](https://github.com/SenecaDPJ/Semana-al-plato/releases/tag/v2.0.0) contiene `Semana.al.Plato_2.0.0_x64-setup.exe` (1.988.945 bytes; SHA-256 `34cf2cb9ab2fe783536f662f589a86a576fc2d7130a3047578f43e4fc82d1928`).
- Se confirmó que el repositorio continúa siendo privado.
- No se ha hecho una comprobación visual del instalador ni una prueba manual en Windows.

## Preparación de v2.1.0

- La rama de prueba añade las banderas del idioma activo (España/Reino Unido), reordena las acciones de selección múltiple y refuerza los avisos de movimiento no válido. La corrección final fuerza explícitamente la visibilidad de la bandera correspondiente.
- `npm run build`: correcto localmente. La compilación local de Tauri no pudo ejecutarse porque Cargo no está instalado.
- El flujo de Windows de la [PR #6](https://github.com/SenecaDPJ/semana-al-plato/pull/6) terminó correctamente en el [run 42422715713](https://github.com/SenecaDPJ/semana-al-plato/actions/runs/42422715713): 30 pruebas correctas, 0 fallidas y compilación NSIS x64.
- La compilación se entregó solo como artefacto de prueba (ID `13594795072`; ZIP de 1.972.572 bytes; SHA-256 `f9c481cb7cff5294069e59acf0d20a6b6de89b2718e15ddc39fc9437a0472160`). La rama v2.1.0 no se publicó como release.
- La compilación automatizada no demuestra por sí sola la comprobación visual de cada pantalla del instalador ni sustituye a una prueba manual de esta revisión concreta en Windows.

## Validación de v2.2.0

- v2.2.0 conserva las funciones de v2.1.0 y deja registradas en ambos README las banderas de España y Reino Unido, el icono de la aplicación/instalador/desinstalador, la paleta de categorías, los controles de tema, clonación, movimiento, selección múltiple y los avisos de SmartScreen para el instalador sin firma reconocida.
- `npm test`: 30 pruebas correctas y 0 fallidas; incluye la paleta de contraste, idioma y banderas, temas, clonación, movimiento, selección múltiple, copias y permiso del enlace externo.
- `npm run build`: correcto; generó `dist/index.html`, excluido de Git. `git diff --check`: correcto.
- El flujo final de Windows de la [PR #6](https://github.com/SenecaDPJ/semana-al-plato/pull/6) terminó correctamente en el [run 42424907500](https://github.com/SenecaDPJ/semana-al-plato/actions/runs/42424907500): 30 pruebas correctas, 0 fallidas y compilación NSIS x64.
- El instalador de prueba quedó como artefacto (ID `13594654641`; ZIP de 1.973.055 bytes; SHA-256 `7dec3dc6797d3ab6e02b6cef40b9dee7b2f3f25933a17d6913ea270279b65854`). Se conserva 14 días.
- Tras fusionar la PR #6, el flujo de publicación [42425539797](https://github.com/SenecaDPJ/semana-al-plato/actions/runs/42425539797) volvió a pasar 30 pruebas y publicó el instalador NSIS x64 de producción.
- La release privada [v2.2.0](https://github.com/SenecaDPJ/semana-al-plato/releases/tag/v2.2.0) contiene `Semana.al.Plato_2.2.0_x64-setup.exe` (1.987.741 bytes; SHA-256 `978792095f68dde221bf4a2f1f5dc997abf6249511e3a0c13f6d9253dfe29717`). El repositorio continúa privado.
- La revisión visual del instalador en Windows queda pendiente; un resultado automatizado correcto no equivale a una comprobación visual ni a una prueba en otro equipo.

## Preparación de Microsoft Store (rama `msstore/v2.2.0-msix-prep`)

**Estado:** preparado, pendiente de pruebas en Windows. No está listo para subir a Partner Center: falta generar el `.msixupload`, faltan los tres valores exactos de identidad de Partner Center y no se ha ejecutado WACK ni la instalación de prueba.

- Punto de partida: tag `v2.2.0` en `39423451edeccc7640ed1826582426333cf17d48`; ejecución de Windows `42425539797` coincide con ese SHA y terminó `success`. La release privada publica `Semana.al.Plato_2.2.0_x64-setup.exe`, 1.987.741 bytes. SHA-256 informado por la API de GitHub: `978792095f68dde221bf4a2f1f5dc997abf6249511e3a0c13f6d9253dfe29717` (no recalculado localmente; el binario no se descargó ni ejecutó).
- Revisión del binario: versión inferida de tag/nombre 2.2.0; metadatos PE y Authenticode **NO EJECUTADOS** porque no hay archivo local. El flujo de release no configura certificado Authenticode. La captura de SmartScreen de v2.1.0 no se usa como prueba de firma de v2.2.0.
- Revisión de código: Tauri 2/Rust, interfaz HTML/CSS/JS; salida actual NSIS x64, no portable. Configuración predeterminada de Tauri descarga el bootstrapper de WebView2 si falta el runtime. No se encontraron escritura junto al ejecutable, autoactualizador, servicios, drivers, elevación ni telemetría. Los datos quedan en el almacenamiento local de WebView2/localStorage; la migración NSIS→MSIX y limpieza al desinstalar requieren prueba.
- `npm test`: **PASADO**, 30/30 pruebas, 0 fallidas, en esta rama tras añadir los archivos de preparación.
- `git diff --check`: **PASADO**.
- Parser PowerShell del script MSIX: **PASADO**; parseo XML del manifiesto: **PASADO**.
- Generación con Tauri CLI de iconos de paquete 44×44, 50×50 y 150×150, y mosaico Store 300×300 desde SVG: **PASADO**. Se inspeccionó visualmente el mosaico y la franja de marca; no es una captura de la aplicación.
- Compilación Tauri y empaquetado MSIX: **NO EJECUTADOS**. Entorno observado: Windows `10.0.26300.0`, AMD64, Node `v22.21.0`, npm `10.9.4`, Tauri CLI `2.12.4`; Rust/Cargo y MakeAppx/Windows SDK no están disponibles. La identidad de Partner Center tampoco se ha proporcionado.
- Instalación en usuario estándar, primer arranque, guardado/reapertura, actualización NSIS/MSIX, desinstalación/datos residuales, Defender/SmartScreen y Windows App Certification Kit: **NO EJECUTADOS**.
- Textos de ficha y borrador de privacidad en español e inglés preparados en `docs/microsoft-store/`. Las capturas auténticas enlazadas en README no están como PNG de Store; las capturas finales deben tomarse de una compilación MSIX verificada.
- Workflow manual de Actions para empaquetar MSIX añadido a la rama, no ejecutado; GitHub solo permite despacharlo tras incluir el workflow en la rama predeterminada y luego elegir esta rama como referencia. Conserva artefactos temporales en Actions, no crea release ni envío de Partner Center.
- Licencias Cargo transitivas: revisión **INCOMPLETA** por falta de Cargo; no se declara autorización de terceros hasta completar ese inventario. Búsqueda de patrones de secretos en el código del producto: sin coincidencias.
- Visibilidad de GitHub: **PASADO**, la API sigue informando el repositorio privado. No se publicó release, no se creó envío de Partner Center ni se cambió la visibilidad.

Detalle y repetición: [preparación MSIX](docs/microsoft-store/README.es.md). El script genera los paquetes cuando se ejecute en Windows con las herramientas e identidad requeridas.
