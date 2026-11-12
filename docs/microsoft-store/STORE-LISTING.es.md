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

Las dos imágenes se copiaron sin modificar desde las capturas facilitadas por el usuario; muestran el mismo calendario con tres comidas en la aplicación real y no incluyen marco de VM ni marca de evaluación. Ambas son PNG, superan el mínimo de escritorio de 1366 × 768 y pesan menos de 50 MB. Una captura por familia de dispositivo es el mínimo; Microsoft recomienda al menos cuatro por familia y permite hasta diez. Para completar mejor la ficha se pueden añadir tres capturas por idioma que muestren otras funciones. Partner Center requiere cargar imágenes y pies por separado para cada idioma de ficha.

Pies localizados propuestos (máximo oficial: 200 caracteres por pie):

- Captura 1 (tema claro): `Organiza desayunos, comidas y cenas en tu calendario semanal.`
- Captura 2 (tema oscuro): `Consulta el plan semanal con los días y cada momento de comida.`
- Captura adicional: `Selecciona varias comidas para clonarlas, moverlas juntas o eliminarlas.`
- Captura adicional: `Cambia entre los temas claro y oscuro y los idiomas español e inglés.`

## Comprobación de límites de ficha

El resumen breve actual tiene 121 caracteres (límite del campo: 1.000; Microsoft recomienda menos de 270). Las 11 características tienen como máximo 74 caracteres cada una (hasta 20, con 200 como máximo por característica). La descripción admite hasta 10.000 caracteres. Los textos están preparados para las fichas `es-ES` y `en-GB`; cada idioma se completa por separado en Partner Center. El manifiesto del paquete declara `es-ES` y `en-US`, así que antes del envío hay que decidir si inglés británico será un idioma de ficha adicional o si se cambia la ficha a inglés estadounidense.

## Ajustes pendientes en Partner Center

En Partner Center, comprobar el nombre reservado y la identidad del producto; elegir la categoría (obligatoria), mercados y precio/disponibilidad; completar el cuestionario de clasificación por edades; revisar las condiciones de licencia; y verificar la URL de privacidad publicada: `https://senecadpj.github.io/Semana-al-plato/`. La ficha debe completarse en español e inglés; decide si inglés británico (`en-GB`) será una ficha adicional frente al recurso inglés estadounidense (`en-US`) que declara el paquete. Para un primer envío, el campo de novedades se deja vacío. Revisar los datos de contacto que solicite el tipo de cuenta. Soporte propuesto: formulario público de incidencias `https://github.com/SenecaDPJ/Semana-al-plato/issues/new` (los informes son públicos; pedir que no incluyan datos personales). No se ha creado un borrador ni se ha enviado nada a certificación.
