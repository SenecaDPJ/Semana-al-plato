# Borrador de política de privacidad — Semana al Plato

**Estado:** borrador para revisar antes de publicación. Describe el código v2.2.0 inspeccionado; la retención durante y después de desinstalar el paquete MSIX aún requiere una prueba de Windows. No publicar este borrador como URL final sin añadir el contacto público del editor y verificar esa prueba.

## Datos y almacenamiento

Semana al Plato guarda en el dispositivo la planificación del calendario, nombres de comidas y alimentos, categorías, y los nombres, ingredientes, preparación, tiempos y raciones de las recetas. Los datos del calendario se guardan automáticamente en `localStorage` dentro del perfil WebView2 de la aplicación. Las preferencias de tema e idioma se guardan por separado en el mismo dispositivo. La aplicación no pide crear una cuenta.

No hay sincronización en la nube, analítica, anuncios ni telemetría de la aplicación. El código inspeccionado no envía el menú, las recetas ni las preferencias a un servidor de Semana al Plato.

## Conexiones externas

La única acción de red iniciada por la interfaz es abrir `https://github.com/SenecaDPJ` en el navegador predeterminado después de mostrar una confirmación. Si aceptas, la navegación y cualquier dato que el navegador comparta se rigen por la política de privacidad de GitHub y del navegador elegido.

La aplicación utiliza Microsoft Edge WebView2. El runtime Evergreen de Windows se mantiene mediante Windows/Microsoft. La instalación actual NSIS puede descargar el bootstrapper de WebView2 si el runtime no está presente. El paquete de Microsoft Store se dirigirá a Windows 11, que incluye WebView2 Evergreen.

## Copias y control del usuario

La opción **Mis datos → Exportar copia** crea un JSON en la ruta seleccionada por el usuario. Ese archivo puede contener los datos enumerados arriba; guárdalo y compártelo con cuidado. **Restaurar copia** lee un JSON que selecciones, lo valida y sustituye los datos actuales tras confirmación. La copia JSON no incluye las preferencias de tema e idioma.

El programa no envía las copias fuera del dispositivo. Quien use la aplicación controla la exportación, la ubicación del archivo y si lo comparte con terceros.

## Conservación y eliminación

Los datos de trabajo permanecen en el perfil local de la aplicación hasta que el sistema los elimine o la persona los borre mediante las herramientas disponibles en Windows. La aplicación no tiene una función independiente de “borrar todos mis datos”.

**Pendiente de verificación:** comprobar en una VM Windows 11 si al desinstalar la versión MSIX Windows elimina el perfil WebView2 usado por Tauri o conserva datos fuera del paquete. Hasta realizar esa comprobación, no se promete que la desinstalación elimine todos los datos. Antes de migrar desde NSIS, exporta una copia JSON.

## Menores y datos sensibles

La aplicación no solicita ni necesita datos personales especiales. Los nombres, textos de recetas y fechas que introduzcas pueden ser información personal si decides escribirla. No incluyas información que no quieras almacenar localmente o incluir en una copia compartida.

## Cambios y contacto

Esta política se actualizará si cambia el comportamiento de recopilación, almacenamiento o conexión del programa.

**Contacto público del editor:** pendiente de añadir antes de publicar la ficha o enlazar la política.
