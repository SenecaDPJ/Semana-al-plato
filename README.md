# Semana al Plato

**Tu semana, plato a plato.** Un calendario de comidas para Windows 11 con el que organizar desayunos, comidas y cenas, guardar tus recetas y construir un menú a tu gusto.

**Español** · [English](README.en.md)

[Descargar para Windows 11 · x64 · v1.0.3](https://github.com/SenecaDPJ/semana-al-plato/releases/download/v1.0.3/Semana.al.Plato_1.0.3_x64-setup.exe) · [Versiones](https://github.com/SenecaDPJ/semana-al-plato/releases) · [Comunicar un problema](https://github.com/SenecaDPJ/semana-al-plato/issues)

<img width="1397" height="1013" alt="Captura de pantalla 2026-11-07 174358" src="https://github.com/user-attachments/assets/0979efb0-9209-41ca-82d7-4d47ece8d2a4" />

<img width="1394" height="1010" alt="Captura de pantalla 2026-11-07 174421" src="https://github.com/user-attachments/assets/fe564464-a3e8-4745-8dbf-34e497739123" />

## Qué puedes hacer

Semana al Plato reúne el calendario y los catálogos en una misma aplicación. Puedes planificar con platos completos, añadir alimentos sueltos o colocar recetas con ingredientes y pasos de preparación. Cada casilla admite varios elementos: por ejemplo, café, una tostada y fruta en el desayuno del lunes.

Trabaja localmente, sin crear una cuenta ni conectarse a un servicio de planificación. El menú se guarda en tu dispositivo y puedes trasladarlo mediante una copia JSON. La planificación cotidiana no requiere conexión; descargar la aplicación y preparar el entorno de desarrollo sí pueden necesitarla.

| Funcionalidad | Para qué sirve |
| --- | --- |
| Calendario de lunes a domingo | Ver la semana completa, con desayuno, comida y cena cada día. |
| Semana actual al abrir | Empezar en la fecha que corresponde y reconocer el día actual resaltado. |
| Selector de semana, flechas y «Hoy» | Preparar semanas futuras, consultar anteriores y volver a la actual. |
| Varios elementos por casilla | Combinar platos, bebidas, alimentos y recetas sin sustituir lo que ya has añadido. |
| Catálogos editables | Crear, buscar, filtrar por categoría, editar y eliminar comidas y alimentos. |
| Categorías con colores | Identificar los elementos con 14 colores de texto y 14 rellenos: 196 combinaciones predefinidas de alto contraste. |
| Recetario integrado | Guardar ingredientes, preparación, minutos y raciones, y añadir recetas al calendario. |
| Paneles de recetas no modales | Consultar una receta mientras sigues utilizando el calendario; mover los paneles desde su cabecera. |
| Tema claro y oscuro | Cambiar el aspecto con el botón de luna/sol y conservar la elección al volver a abrir. |
| Guardado local y copias JSON | Mantener tu planificación y exportarla o restaurarla cuando lo necesites. |
| Confirmación de cambios | Revisar dónde añades un elemento y confirmar las eliminaciones. |

## Descargar e instalar

1. Descarga **Semana.al.Plato_1.0.3_x64-setup.exe** desde el enlace superior o desde [la release v1.0.3](https://github.com/SenecaDPJ/semana-al-plato/releases/tag/v1.0.3).
2. Ejecuta el instalador y sigue sus indicaciones.
3. Abre **Semana al Plato** para empezar a planificar.

El instalador disponible está dirigido a **Windows 11 de 64 bits**. Para utilizarlo no necesitas instalar Node.js, Rust ni las herramientas de programación. La aplicación utiliza Microsoft Edge WebView2 como motor de interfaz en Windows.

**Estado del proyecto:** el autor es, por ahora, la única persona que ha instalado la aplicación. No se presenta como una versión validada por una comunidad de usuarios ni probada en otros equipos. La compilación y las comprobaciones registradas se detallan en [VALIDACION.md](VALIDACION.md).

## Primeros pasos

### 1. Elige la semana

Al abrir se muestra la semana actual. En **SEMANA**, selecciona cualquier fecha: el calendario mostrará la semana que la contiene. Usa **← / →** para desplazarte por semanas y **Hoy** para regresar a la actual.

Las tres filas son **Desayuno**, **Comida** y **Cena**. El contador «X de 21 momentos» indica cuántas casillas tienen contenido; no cuenta platos ni raciones.

### 2. Añade lo que vas a comer

Puedes empezar de dos formas:

- **Desde los botones superiores:** pulsa **Añadir comida** o **Añadir alimento**, busca o filtra el catálogo y selecciona un elemento. Aparecerá un banner que te pide elegir una casilla. Pulsa el día y momento deseados y confirma.
- **Desde una casilla:** pulsa **+**, elige comida, alimento o receta, selecciona el elemento y confirma su incorporación a esa casilla.

Repite el proceso para añadir varios elementos. Lo que ya esté en la casilla se conserva. **Cancelar** permite salir sin añadir el elemento.

**Ejemplo:** añade «Café», «Tostada con tomate» y «Fruta» al desayuno del lunes. Puedes mezclar alimentos y platos en una misma casilla.

### 3. Personaliza los catálogos

En el catálogo correspondiente, pulsa **Añadir nueva comida** o **Añadir nuevo alimento**, escribe un nombre y asigna una categoría. También puedes **Editar** o **Eliminar** los elementos precargados.

La aplicación evita nombres duplicados dentro de cada catálogo, ignorando diferencias de mayúsculas, tildes y espacios repetidos. Editar un elemento actualiza sus apariciones en el calendario.

### 4. Organiza con categorías

Pulsa **Añadir Categoría**, escribe el nombre y elige un color de texto y otro de relleno. La vista previa muestra el resultado antes de guardarlo.

Las categorías iniciales **Desayuno**, **Comida** y **Cena** están protegidas. Las que crees se pueden editar y eliminar, siempre que no estén siendo utilizadas por alimentos, comidas o recetas.

Las categorías son etiquetas: no añaden filas al calendario ni restringen dónde puedes colocar un elemento. Un plato categorizado como Cena también se puede añadir a la comida del mediodía.

### 5. Utiliza tus recetas

Pulsa **Añadir receta** para abrir el recetario. Haz doble clic en una receta o pulsa **Abrir** para consultar sus ingredientes y preparación en otro panel. Ambos paneles permiten seguir usando el calendario.

Con **Crear nueva receta** puedes guardar nombre, categoría, minutos, raciones, ingredientes y pasos. Puedes editar o eliminar recetas y enviarlas al plan mediante **Al calendario** o **Añadir al calendario**.

### 6. Cambia el tema

Pulsa el botón **☾ / ☀** de la cabecera para alternar entre claro y oscuro. La preferencia se guarda localmente. Es una elección manual; no hay selector de seguimiento automático del tema del sistema.

### 7. Quita un elemento sin borrarlo del catálogo

Pulsa el elemento colocado en el calendario y elige **Eliminar de esta casilla**. Seguirá disponible para otros días.

Si lo eliminas desde el catálogo o el recetario, también se quitarán sus apariciones del calendario. La confirmación avisa de las apariciones afectadas.

### 8. Clona, mueve y selecciona varios elementos

- Pulsa un elemento y elige **Clonar** para copiarlo a otro día de la misma semana o a una fecha de otra semana. Se conserva su desayuno, comida o cena.
- Mantén pulsado un elemento y arrástralo para cambiar su orden dentro de la misma fila o moverlo a otro día de esa fila.
- Para operar con varios elementos, arrastra desde un espacio vacío del calendario. En la selección puedes elegir **Clonar TODOS** o **Eliminar TODOS**. El clonado pide el día de destino y el borrado requiere dos confirmaciones.
- El enlace a **github.com/SenecaDPJ** pide confirmación antes de abrir el perfil en el navegador predeterminado.

## Contenido inicial

La primera ejecución incluye **30 alimentos y 30 comidas**: diez de cada tipo para cada categoría inicial. Son ejemplos editables, no un menú obligatorio.

| Categoría | Ejemplos de alimentos | Ejemplos de comidas |
| --- | --- | --- |
| Desayuno | Café, leche, fruta, avena | Tortilla francesa, tostada con tomate, yogur con fruta |
| Comida | Lechuga, pescado azul, garbanzos | Espagueti boloñesa, cocido, paella |
| Cena | Arroz, huevos, calabacín | Merluza cocida en filete, huevo cocido, crema de calabacín |

El recetario comienza con **tostada con tomate y aceite**, **ensalada sencilla de garbanzos** y **crema suave de calabacín**, con ingredientes, pasos, tiempo y raciones.

## Tus datos y copias de seguridad

Los cambios confirmados se guardan automáticamente en el almacenamiento local de la aplicación. No hay cuenta, servidor de menús ni sincronización automática entre dispositivos.

- **Exportar:** entra en **Mis datos → Exportar copia**. En la aplicación Windows se abre un diálogo para elegir dónde guardar `Semana_al_Plato_copia.json`. En la versión HTML se inicia una descarga del navegador.
- **Restaurar:** entra en **Mis datos → Restaurar copia**, selecciona un JSON compatible y confirma. El archivo se valida antes de aplicar el cambio.
- **Contenido de la copia:** calendario, alimentos, comidas, recetas y categorías. La preferencia de tema se guarda por separado y **no está incluida**.
- **Sustitución, no mezcla:** restaurar reemplaza los datos actuales. Exporta primero si quieres conservarlos. Se admiten archivos de hasta 5 MB.
- **Cambio de dispositivo o navegador:** utiliza exportar/restaurar. La versión HTML y la aplicación instalada no comparten automáticamente sus datos.

Guarda copias antes de limpiar datos de la aplicación, cambiar de equipo o realizar cambios importantes. Un archivo JSON contiene los nombres y textos que hayas introducido: compártelo solo si quieres compartir también esos datos.

## Tecnologías y desarrollo

| Tecnología | Papel en el proyecto |
| --- | --- |
| HTML, CSS y JavaScript modular | Calendario, formularios, paneles, temas e interacciones, sin un framework frontend. |
| Tauri 2 y Rust | Contenedor de escritorio y funciones nativas, como guardar una copia con un diálogo de Windows. |
| Microsoft Edge WebView2 | Motor que presenta la interfaz en Windows. |
| localStorage y JSON | Persistencia local y copias de datos con validación de estructura. |
| Node.js | Servidor local de desarrollo y generación del HTML autónomo. |
| Node Test Runner y jsdom | Pruebas de lógica e interacciones en un DOM simulado. |
| NSIS | Generación del instalador para Windows. |

La separación entre lógica, interfaz y contenedor facilita trabajar en futuros ports. **Linux/Ubuntu y Android son objetivos futuros; esta entrega no ofrece versiones nativas verificadas para esos sistemas.**

### Ejecutar desde el código

Esta sección es para desarrollar o compilar; no es necesaria para instalar el EXE. Para la interfaz necesitas Node.js compatible con las dependencias del proyecto. Para Tauri en Windows necesitas también Rust/MSVC, Microsoft C++ Build Tools, el SDK de Windows y WebView2. Consulta los [requisitos de Tauri](https://v2.tauri.app/start/prerequisites/).

Ejecuta los siguientes comandos desde la raíz del repositorio.

🔴 EJECUCIÓN⚙️🚨 — Instala las dependencias fijadas en el archivo de bloqueo dentro de `node_modules`.

```powershell
npm ci
```

🔴 EJECUCIÓN⚙️🚨 — Regenera `dist/` y ejecuta las pruebas. No modifica los menús guardados por el usuario.

```powershell
npm test
```

🔴 EJECUCIÓN⚙️🚨 — Inicia el servidor local de la interfaz; abre `http://127.0.0.1:1420`. Detén el proceso con Ctrl+C.

```powershell
npm run dev
```

🔴 EJECUCIÓN⚙️🚨 — Compila y abre la aplicación de escritorio en modo desarrollo; puede descargar dependencias y crear archivos de compilación.

```powershell
npm run tauri -- dev
```

🔴 EJECUCIÓN⚙️🚨 — Genera la interfaz y el instalador Windows. No instala el resultado automáticamente.

```powershell
npm run tauri -- build
```

El instalador se genera en `src-tauri/target/release/bundle/nsis/`. `npm run build` genera `dist/index.html`, que también puede abrirse en Edge como HTML autónomo. Edita `src/` e `index.html`; `dist/` se regenera.

| Ruta | Contenido |
| --- | --- |
| `src/domain.js` | Fechas locales, datos iniciales, reglas y validación |
| `src/storage.js` | Persistencia y exportación de copias |
| `src/app.js` | Calendario, catálogos, recetas y tema |
| `src/style.css` | Diseño, adaptación del tamaño y temas |
| `scripts/` | Construcción y servidor de desarrollo |
| `tests/` | Pruebas de lógica e interacción simulada |
| `src-tauri/` | Código Rust, configuración nativa e iconos |
| `docs/` | Recursos de documentación |

## Alcance actual

La interfaz de la aplicación está en **español**. Esta documentación está disponible completa en español e inglés; eso no implica que la aplicación tenga un selector de idioma.

No incluye generación automática de menús, cálculo nutricional, lista de la compra automática ni sincronización en la nube. Las pruebas simuladas tampoco sustituyen a las comprobaciones reales de instalación, ventanas y guardado en Windows.

## Autor y licencia

Creado por [David De Prado · SenecaDPJ](https://github.com/SenecaDPJ).

© 2026 David De Prado. Distribuido bajo licencia [MIT](LICENSE).
