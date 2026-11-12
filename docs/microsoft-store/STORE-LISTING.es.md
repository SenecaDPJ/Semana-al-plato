# Ficha de Microsoft Store — Español (España)

Borrador para Partner Center revisado contra la candidata local 2.3.3.0. Incluye el movimiento por arrastre de selecciones múltiples; no afirma que esta versión esté publicada o certificada. Las pruebas funcionales informadas por el usuario y el WACK local están documentados en `STORE-CANDIDATE-2.3.3.0.es.md`.

## Nombre

**Semana al Plato**

## Resumen breve

Planifica comidas de lunes a domingo, organiza recetas y guarda el menú en este dispositivo con copias de seguridad JSON.

## Descripción

Organiza tu semana de comidas con Semana al Plato. Planifica desayuno, comida y cena para cada día, mezcla varios elementos en una casilla y cambia de semana cuando lo necesites.

Añade platos, alimentos y recetas a catálogos editables. Crea categorías con colores, encuentra elementos con la búsqueda y consulta tus recetas sin cerrar el calendario. Cada receta puede incluir ingredientes, preparación, tiempo y raciones.

Mueve elementos entre días del mismo momento, cambia su orden y clónalos individualmente. También puedes seleccionar varios elementos, arrastrarlos juntos a otro día de la semana visible, clonarlos o eliminarlos; el borrado múltiple requiere confirmación.

La interfaz está disponible en español e inglés, con tema claro y oscuro. La semana actual aparece al abrir; puedes elegir otra fecha, avanzar o retroceder y volver a hoy.

Tus datos permanecen en este dispositivo. El calendario se guarda automáticamente en el almacenamiento local de la aplicación; no se requiere una cuenta y la aplicación no sincroniza menús con un servidor. Puedes exportar una copia JSON a una ubicación que elijas y restaurar un archivo compatible. Restaurar sustituye los datos actuales, por lo que conviene exportarlos antes.

La aplicación funciona en Windows 11 de 64 bits y utiliza Microsoft Edge WebView2, incluido con Windows 11. El enlace al perfil de GitHub solo se abre en el navegador predeterminado después de que confirmes.

## Características

- Plan semanal de lunes a domingo con desayuno, comida y cena.
- Añade varios platos, alimentos y recetas a una misma casilla.
- Catálogos editables con búsqueda, filtros y categorías con colores.
- Recetas con ingredientes, pasos, tiempo y raciones.
- Clona elementos a otro día de la semana actual o a una fecha posterior.
- Arrastra y reordena elementos dentro del mismo momento del día.
- Selecciona varios elementos para clonarlos, moverlos por arrastre dentro de la semana o eliminarlos con confirmación.
- Interfaz en español e inglés, con tema claro y oscuro.
- Guardado local y exportación/restauración de copias JSON.
- No necesita cuenta ni sincronización con un servicio de menús.
- Abre el perfil de GitHub solo con permiso explícito.

## Palabras de búsqueda sugeridas

`planificador de comidas`, `menú semanal`, `calendario de comidas`, `recetas`, `planificación de comidas`, `meal planner`

## Capturas requeridas

Capturas reales candidatas de la aplicación 2.3.3.0, tomadas durante la prueba del perfil estándar y guardadas fuera de Git en `Compilacion_W11/Entrega-Store-2.3.3.0-x64/`:

- Español, tema claro: `Store-screenshot-es-ES-2.3.3.0.png`, 1395 × 981, 150.966 bytes; SHA-256 `1CB7376B94A39FEE65156C63D62A508055DF0A93AE1936FECEE75400A6E026F4`.
- Inglés, tema oscuro: `Store-screenshot-en-2.3.3.0.png`, 1393 × 977, 120.409 bytes; SHA-256 `506BBFEA81BD202B1E99EA01AA3B1FEC71D0CE4D1A6A5EDF8215BE74B789DB24`.

Las dos imágenes se copiaron sin modificar desde las capturas facilitadas por el usuario; muestran el mismo calendario con tres comidas en la aplicación real y no incluyen marco de VM ni marca de evaluación. Ambas son PNG, superan el mínimo de escritorio de 1366 × 768 y pesan menos de 50 MB. El propietario eligió conservar solo estas dos imágenes, una por idioma; no se añadirán más capturas. Microsoft recomienda al menos cuatro por familia y permite hasta diez. Partner Center requiere cargar cada imagen y su pie por separado para cada idioma de ficha.

Pies de las dos capturas elegidas (máximo oficial: 200 caracteres por pie):

- Captura española (`es-ES`): `Organiza desayunos, comidas y cenas en tu calendario semanal.`
- Captura inglesa (`en-US`): `Plan breakfast, lunch and dinner in your weekly calendar.`

## Comprobación de límites de ficha

El resumen breve actual tiene 121 caracteres (límite del campo: 1.000; Microsoft recomienda menos de 270). Las 11 características tienen como máximo 74 caracteres cada una (hasta 20, con 200 como máximo por característica). La descripción admite hasta 10.000 caracteres. Los textos están preparados para las fichas `es-ES` y `en-US`; cada idioma se completa por separado en Partner Center. El manifiesto del paquete declara ambos recursos.

## Preparación pendiente en Partner Center

El propietario ha elegido **Food + dining**, **gratis**, **todos los mercados disponibles en Partner Center** y los idiomas de ficha **es-ES** y **en-US**. Son valores previstos; aún no se han introducido en el portal. Para «Website» se eligió la página pública del repositorio `https://github.com/SenecaDPJ/Semana-al-plato`; para «Additional license terms» en ambas fichas se eligió enlazar la licencia MIT del repositorio: `https://github.com/SenecaDPJ/Semana-al-plato/blob/main/LICENSE`. El propietario no tiene IARC ID y responderá el cuestionario en Partner Center. La política bilingüe de privacidad está publicada en `https://senecadpj.github.io/Semana-al-plato/`: se comprobó el contenido servido en `gh-pages/index.html` y el README registra HTTP 200 el 12-11-2026. La página está marcada como versión 2.3.2; no se cambió porque 2.3.3.0 no altera almacenamiento, recopilación ni conexiones. El propietario eligió «Sí» para la pregunta de información personal: el contenido introducido podría incluirla, aunque se guarda localmente y la app no lo envía a un servidor propio. El propietario confirmó el nombre reservado y proporcionó la identidad exacta, que coincide con el paquete candidato. Falta completar la ficha y los campos de contacto aplicables, aplicar la respuesta elegida, el enlace MIT y la URL de privacidad, y cargar las dos capturas actuales con sus pies, una por idioma. No se añadirán más capturas. Para un primer envío, el campo de novedades se deja vacío. El contacto elegido para soporte es el formulario público de incidencias `https://github.com/SenecaDPJ/Semana-al-plato/issues/new` (repositorio público; advertir que no incluyan datos personales). El propietario autorizó condicionalmente la distribución de la versión 2.3.3.0 una vez completada la preparación; no se ha creado un borrador ni enviado nada a certificación.
