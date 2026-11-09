# Ficha de Microsoft Store — Español (España)

Borrador de texto para Partner Center. Está basado en la aplicación 2.2.0 actual; no afirma funciones futuras ni validaciones que no se hayan ejecutado.

## Nombre

**Semana al Plato**

## Resumen breve

Planifica comidas de lunes a domingo, organiza recetas y guarda el menú en este dispositivo con copias de seguridad JSON.

## Descripción

Organiza tu semana de comidas con Semana al Plato. Planifica desayuno, comida y cena para cada día, mezcla varios elementos en una casilla y cambia de semana cuando lo necesites.

Añade platos, alimentos y recetas a catálogos editables. Crea categorías con colores, encuentra elementos con la búsqueda y consulta tus recetas sin cerrar el calendario. Cada receta puede incluir ingredientes, preparación, tiempo y raciones.

Mueve elementos entre días del mismo momento, cambia su orden, clónalos individualmente o selecciona varios para clonar o eliminar. Las acciones de borrado piden confirmación.

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
- Selecciona varios elementos para clonarlos o eliminarlos con confirmación.
- Interfaz en español e inglés, con tema claro y oscuro.
- Guardado local y exportación/restauración de copias JSON.
- No necesita cuenta ni sincronización con un servicio de menús.
- Abre el perfil de GitHub solo con permiso explícito.

## Palabras de búsqueda sugeridas

`planificador de comidas`, `menú semanal`, `calendario de comidas`, `recetas`, `planificación de comidas`, `meal planner`

## Capturas requeridas

Pendientes de incorporar como PNG reales de la versión MSIX final. Para escritorio se exige al menos una captura y se recomiendan cuatro o más (máximo 10). Deben ser PNG en horizontal o vertical, de al menos 1366 × 768 píxeles y menos de 50 MB. Si se publican fichas en español e inglés, las imágenes y sus pies se cargan por separado en cada idioma, aunque se reutilice la misma captura. No usar mockups ni pantallas de una versión no comprobada.

Pies propuestos (máximo oficial: 200 caracteres por pie):

- Planifica la semana con varias comidas organizadas por día y momento.
- Gestiona platos, alimentos y recetas desde catálogos editables.
- Selecciona varias comidas del calendario para clonarlas o eliminarlas.
- Elige tema claro u oscuro y cambia entre español e inglés.

## Comprobación de límites de ficha

El resumen breve actual tiene 121 caracteres (límite del campo: 1.000; Microsoft recomienda menos de 270). Las 11 características tienen como máximo 74 caracteres cada una (hasta 20, con 200 como máximo por característica). La descripción admite hasta 10.000 caracteres. Los textos están preparados para las fichas `es-ES` y `en-GB`; cada idioma se completa por separado en Partner Center. El manifiesto del paquete declara `es-ES` y `en-US`, así que antes del envío hay que decidir si inglés británico será un idioma de ficha adicional o si se cambia la ficha a inglés estadounidense.

## Ajustes pendientes en Partner Center

En Partner Center, comprobar el nombre reservado y la identidad del producto; elegir la categoría (obligatoria), mercados y precio/disponibilidad; completar el cuestionario de clasificación por edades; revisar las condiciones de licencia; y verificar la URL de privacidad publicada: `https://senecadpj.github.io/Semana-al-plato/`. La ficha debe completarse en español e inglés; decide si inglés británico (`en-GB`) será una ficha adicional frente al recurso inglés estadounidense (`en-US`) que declara el paquete. Para un primer envío, el campo de novedades se deja vacío. Revisar los datos de contacto que solicite el tipo de cuenta. Soporte propuesto: formulario público de incidencias `https://github.com/SenecaDPJ/Semana-al-plato/issues/new` (los informes son públicos; pedir que no incluyan datos personales). No se ha creado un borrador ni se ha enviado nada a certificación.
