# Validación de Semana al Plato 1.0.1

## Discrepancia entre la release y el registro manual

- **Release v1.0.1 publicada el 5 de noviembre de 2026:** su cuerpo afirma que la exportación y la restauración de copias se comprobaron en la aplicación instalada.
- **Este registro, sección «Comprobación manual pendiente»:** mantiene pendientes la exportación desde la app instalada y la restauración de la copia, junto con las comprobaciones indicadas allí.
- **Estado:** las fuentes discrepan y el material disponible en esta revisión documental no permite reconciliarlas. Se conservan ambas afirmaciones con su procedencia; esta sección no marca la comprobación como superada. La discrepancia requiere reconciliar el registro con evidencia concreta antes de cambiar su estado.

Esta revisión documental no ejecutó pruebas ni compilaciones de la aplicación y no aporta evidencia para resolver la discrepancia.

## Comprobado en esta revisión

- `npm test`: 17 pruebas correctas. La nueva prueba simula la exportación nativa, su cancelación y un error de escritura. Las pruebas se ejecutan en un DOM simulado.
- `npm run tauri -- build`: compilación correcta de la aplicación nativa y del instalador NSIS x64 en Windows 11. Copia local: `Instalador/Semana_al_Plato_1.0.1_x64-setup.exe` (SHA-256 `E12A9BEF6E6A0F3F1BC67AE5228D685D907FB4FD9B1E9BF948CFB9E5178FAEE2`). No se incluye en Git.
- Se sustituyó la descarga mediante un enlace `blob:` por un diálogo nativo de guardado en la aplicación Tauri. El HTML autónomo conserva la descarga de navegador. El usuario recibe un mensaje de éxito o error; cancelar el diálogo no informa falsamente de una copia guardada.

## Comprobación manual pendiente

- Instalar 1.0.1 y exportar una copia desde «Mis datos»: elegir ubicación, confirmar que el JSON existe y contiene los datos actuales.
- Restaurar ese JSON y comprobar el calendario tras cerrar y reabrir; probar también cancelar el diálogo de guardado.
- Revisar el nombre e icono en la ventana, barra de tareas, menú Inicio, instalador y desinstalador.
- Probar el calendario con contenido abundante y comprobar el desplazamiento hasta el final.
- Revisar los temas claro y oscuro, el contraste de las categorías y los paneles de recetas no modales.

La compilación del instalador no demuestra el funcionamiento visual o del diálogo nativo. No se ha probado en otro PC.
