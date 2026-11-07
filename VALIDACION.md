# Validación de Semana al Plato 2.0.0

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
