# Validación de Semana al Plato 1.0.2

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

## Comprobación manual pendiente

- Instalar el paquete y revisar visualmente el icono del instalador y desinstalador, además de las etiquetas en los temas claro y oscuro.
- Probar exportar y restaurar una copia, conservando los datos, y revisar el calendario con contenido abundante.
- La compilación automatizada no demuestra por sí sola la comprobación visual del instalador ni el funcionamiento manual en otro PC.

## Rama de prueba: clonado, arrastre y selección múltiple

- `npm test`: 24 pruebas correctas. Las pruebas nuevas comprueban el clonado individual dentro y fuera de la semana visible, el reordenado y movimiento entre días de la misma fila, el clonado de varios elementos y las dos confirmaciones de borrado.
- `git diff --check`: correcto.
- No se ha generado ni comprobado visualmente un instalador. Esta rama no cambia la versión ni publica una release.
