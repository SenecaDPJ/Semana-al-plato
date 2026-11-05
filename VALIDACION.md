# Validación de Semana al Plato 1.0.0

## Comprobado en esta revisión

- `npm test`: 16 pruebas correctas. Genera el HTML autónomo y comprueba calendario semanal, categorías, comidas, alimentos, recetas, copias, persistencia y cambio de tema mediante un DOM simulado.
- `npm run tauri -- build`: compilación correcta de la aplicación nativa y del instalador NSIS x64 en Windows 11. El instalador local está en `Instalador/Semana_al_Plato_1.0.0_x64-setup.exe` (SHA-256 `F5243067351EF118EE7B500AB548B2F1CF0340D8091DC99915A6A0C8A69D5CF5`). No se incluye en Git.

## Comprobación manual pendiente para 1.0.0

- Instalar sobre una versión anterior después de exportar una copia; cerrar y reabrir para comprobar la conservación del menú y del tema.
- Revisar el nombre e icono nuevos en la ventana, barra de tareas, menú Inicio, instalador y desinstalador.
- Probar el calendario con contenido abundante y comprobar el desplazamiento hasta el final.
- Exportar y restaurar una copia JSON desde la aplicación instalada.
- Revisar los temas claro y oscuro, el contraste de las categorías y los paneles de recetas no modales.

Las pruebas automatizadas usan un DOM simulado; no sustituyen estas comprobaciones visuales ni una instalación real. No se ha probado en otro PC.
