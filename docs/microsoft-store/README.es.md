# Preparación para Microsoft Store (MSIX)

**Estado:** preparado, pendiente de pruebas en Windows y de los valores exactos de identidad de Partner Center. Este trabajo no publica una release, no modifica la visibilidad de GitHub y no envía el producto a certificación.

## Punto de partida comprobado

- Repositorio: `SenecaDPJ/Semana-al-plato`, privado; rama de trabajo `msstore/v2.2.0-msix-prep`.
- Código de partida: tag `v2.2.0`, commit `39423451edeccc7640ed1826582426333cf17d48`. El run de publicación de Windows `42425539797` informa ese mismo `head_sha`, terminó correctamente y produjo la release v2.2.0. La revisión local parte del commit de documentación `26f2f110a4cae109157918aae7a5a39694f1c008`, descendiente de ese punto.
- Tecnología: interfaz HTML/CSS/JavaScript modular; contenedor de escritorio Tauri 2 y Rust 2021; WebView2 para dibujar la interfaz. Node.js sirve y prueba el frontend; no hay dependencias JavaScript de ejecución. Los flujos de Windows usan Node 22 y Rust estable.
- Tauri CLI bloqueado en el entorno local: 2.12.4. `Cargo.lock` fija Tauri 2.12.5, `tauri-plugin-dialog` 2.8.4 y `windows-sys` 0.61.2 (además de una versión transitiva 0.45.0). La configuración y la release disponible son x64; no se distribuyen builds ARM64 ni x86.
- El producto declara Windows 11. El manifiesto de trabajo apunta a `Windows.Desktop` desde `10.0.22000.0` (Windows 11 21H2); falta comprobarlo en una instalación limpia.
- Ese mínimo es técnico y provisional: no afirma que Windows 11 21H2 siga recibiendo soporte. A fecha de esta revisión, Microsoft publica Windows 11 26H2 como build 26300 y 25H2 como 26200; 21H2 dejó de recibir actualizaciones hace años y 24H2 Home/Pro llegó al fin de servicio en octubre de 2026. Antes de publicar, decide si quieres conservar compatibilidad técnica con instalaciones antiguas o elevar el mínimo a una versión mantenida; el manifiesto debe reflejar esa decisión y probarse en Windows.
- El archivo publicado `Semana.al.Plato_2.2.0_x64-setup.exe` es un instalador NSIS, no una aplicación portable. La API de GitHub informa 1.987.741 bytes y SHA-256 `978792095f68dde221bf4a2f1f5dc997abf6249511e3a0c13f6d9253dfe29717`. El tag, el SHA del flujo y la versión del nombre del archivo coinciden. No se descargó ni ejecutó el EXE en el equipo de trabajo.
- El instalador NSIS usa la configuración predeterminada de Tauri: si falta WebView2, descarga y ejecuta el bootstrapper de Microsoft. Por tanto el instalador actual no es offline completo. WebView2 Evergreen viene incluido en Windows 11; el paquete Store propuesto no contiene un runtime fijo.
- La API de GitHub y la configuración de compilación no sustituyen una inspección PE local. No se verificaron los metadatos PE ni Authenticode del EXE v2.2.0. El flujo actual no configura un certificado de firma Authenticode; una captura anterior de v2.1.0 mostró «Editor desconocido», pero no demuestra la firma de v2.2.0. Trátese la release EXE como no firmada hasta inspeccionarla directamente.

## Revisión de compatibilidad

| Área | Resultado de la revisión del código |
| --- | --- |
| Escrituras en la carpeta de instalación | No se encontraron. El paquete puede mantener el ejecutable y los recursos en el área de solo lectura de MSIX. |
| Rutas absolutas/directorio de trabajo | No hay dependencias de rutas de instalación ni del directorio de trabajo en la app. La compilación integra el frontend en el ejecutable. |
| Datos y persistencia | El calendario se guarda en `localStorage` con clave heredada `calendario-comidas.v1`; tema e idioma usan claves separadas. Tauri mantiene el perfil WebView2 bajo los datos locales del usuario. Se conservan el identificador Tauri `com.senecadpj.calendariocomidas` y las claves actuales. La continuidad NSIS → MSIX y la conservación/desinstalación deben comprobarse en Windows; exporta una copia antes de probar. |
| Archivos | La exportación abre el diálogo nativo y escribe JSON solo en la ruta elegida por la persona. La restauración valida los datos antes de guardarlos. No hay acceso genérico al sistema de archivos concedido a la interfaz. |
| Administrador, servicios, drivers, tareas o registro | No se encontró necesidad de elevación, servicios, controladores, tareas programadas ni registro propio. El instalador NSIS está configurado con el modo de usuario predeterminado. |
| Red, cuentas y telemetría | No hay `fetch`, analítica, publicidad, cuentas ni sincronización. El perfil GitHub se abre en el navegador predeterminado solo tras confirmación. |
| Actualización | No hay autoactualizador de la app. Las versiones MSIX futuras usarán la actualización de Store y conservarán la misma identidad. Debe aumentarse la versión del paquete en cada actualización. |
| Dependencia externa | WebView2 Evergreen; Windows 11 lo incluye y mantiene. Confirmar primer arranque en Windows limpio sin conexión. |
| Capacidades | Solo `runFullTrust`, restringida y necesaria para ejecutar el proceso de escritorio Tauri y sus funciones nativas (diálogo Guardar y apertura externa consentida). No se solicitan capacidades de red, documentos, cámara, micrófono ni shell de archivos. |
| Impedimentos de MSIX encontrados | Ninguno que requiera eliminar funciones o cambiar el propósito. La identidad, el empaquetado final y las pruebas reales siguen pendientes. |

La posibilidad de guardar preferencias y datos bajo el identificador Tauri heredado reduce el riesgo de migración, pero **no demuestra** que Windows vaya a reutilizar el mismo perfil WebView2 al instalar el paquete con identidad MSIX. La actualización desde NSIS debe probarse con una copia real, sin desinstalar antes la versión previa.

## Paquete preparado

Se incluye un manifiesto parametrizable y `build-msix.ps1`. El script:

1. exige los tres campos exactos de Partner Center y no acepta identidades de ejemplo;
2. comprueba que `package.json`, `tauri.conf.json` y `Cargo.toml` tengan la misma versión;
3. guarda registros de `npm ci`, `npm test`, compilación Tauri y `MakeAppx`, además de las versiones de Node.js, npm, Rust, Cargo, Tauri CLI y MakeAppx;
4. compila directamente el ejecutable anfitrión en Windows x64, sin generar otro instalador NSIS/MSI, genera iconos de MSIX/Store a partir del SVG original y empaqueta `SemanaAlPlato.exe` y las DLL de salida;
5. genera un `.msix` sin firma y un `.msixupload` ZIP que contiene ese MSIX, sin `.appxsym`;
6. calcula SHA-256 de ambos artefactos y los registra en `BUILD-METADATA.txt`.

El nombre esperado para esta versión será `Semana-al-Plato_2.2.0.0_x64.msix` y `Semana-al-Plato_2.2.0.0_x64.msixupload`. El cuarto componente de la versión de Store queda en cero. El paquete no se firma localmente: Microsoft firma los paquetes MSIX tras aprobar la certificación. El script no instala ni ejecuta el programa.

La plantilla marca `runFullTrust` porque esta aplicación de escritorio necesita proceso de confianza media. No incluye `unvirtualizedResources` ni otras capacidades. `MaxVersionTested` queda inicialmente igual al mínimo Windows 11 del manifiesto y debe actualizarse tras probar la versión final en la máquina Windows de destino.

El parámetro opcional `-MaxVersionTested` permite fijar el build Windows que se haya probado. Su valor predeterminado (`10.0.22000.0`) es provisional para preparar el manifiesto; no representa una prueba ejecutada y no debe usarse para declarar compatibilidad verificada.

### Ejecutar la generación en Windows x64

Requisitos: Node.js 22, Rust estable con MSVC, Visual Studio C++ Build Tools, Windows SDK con `MakeAppx.exe` y dependencias descargables. La generación se puede repetir desde la rama y no ejecuta el EXE. El flujo usa `windows-latest` y Rust `stable`; registra las versiones concretas en cada artefacto, pero no garantiza builds bit a bit idénticos entre ejecuciones.

🔴 EJECUCIÓN⚙️🚨 — Compila, ejecuta las pruebas automatizadas y crea los paquetes en `artifacts/msstore/`. Puede descargar dependencias de desarrollo y deja registros locales. Sustituye cada texto de ejemplo por el dato copiado literalmente de Partner Center.

```powershell
.\docs\microsoft-store\build-msix.ps1 `
  -PackageIdentityName "REEMPLAZAR_CON_IDENTITY_NAME_DE_PARTNER_CENTER" `
  -PackageIdentityPublisher "REEMPLAZAR_CON_PUBLISHER_DE_PARTNER_CENTER" `
  -PublisherDisplayName "REEMPLAZAR_CON_NOMBRE_VISIBLE_DEL_EDITOR"
```

El script se detiene si falta Node/Rust/SDK, si las versiones discrepan o si ya existe la carpeta de salida; no sobreescribe paquetes anteriores. No crea ni solicita certificados o claves privadas. La `.msixupload` contiene el paquete MSIX y no símbolos de depuración; Partner Center puede aceptar el `.msix` directamente, aunque Microsoft recomienda el formato de subida para Store.

También hay un workflow manual `Build Microsoft Store MSIX (manual)`. GitHub solo permite ejecutarlo cuando el archivo del workflow ya está en la rama predeterminada; entonces se puede elegir esta rama como referencia e introducir la identidad exacta. Conserva el `.msix`, `.msixupload`, icono y registros como artefacto de Actions durante 14 días. No publica una release ni envía el producto a certificación; tampoco sustituye las pruebas funcionales o WACK. Mientras el workflow no esté en la rama predeterminada, usa el script local en Windows.

## Pruebas Windows que faltan

Ejecutar en una VM Windows 11 x64 limpia y desechable, con usuario estándar. No instalar ni abrir el EXE de GitHub en el equipo principal. El `.msix` de envío va sin firma y conserva la identidad exacta de Partner Center; Microsoft lo firma tras la certificación. Para una prueba local, crear un certificado de desarrollo cuyo sujeto coincida exactamente con el `Publisher` del manifiesto, firmar una copia de prueba del paquete y confiar ese certificado **solo dentro de la VM**. No añadir el certificado ni su clave privada al repositorio o al artefacto de Store; eliminarlos al acabar. Un paquete de prueba unsigned con el OID especial tiene otra identidad y no comprueba la instalación con la identidad final de Store.

| Comprobación | Estado actual | Evidencia pendiente |
| --- | --- | --- |
| `npm test` sobre la rama | **Pasado**, 30/30 | Salida y código de salida 0 obtenidos en esta revisión. |
| Compilación Tauri x64 limpia | No ejecutada aquí | Rust/Cargo no están instalados; la compilación CI anterior es de v2.2.0, no de esta rama MSIX. |
| Empaquetado `.msix` / `.msixupload` | No ejecutado aquí | Falta SDK `MakeAppx.exe` y falta identidad exacta. |
| Instalación/primer arranque como usuario estándar | No ejecutado | Windows 11 limpio, app abre y no requiere elevación. |
| Funciones principales | No ejecutado | Calendario, alta/edición, recetas, idioma/temas, clonado, arrastre, selección, enlace con permiso y copia. |
| Guardar/cerrar/reabrir | No ejecutado | Mismos datos antes/después del reinicio. |
| Actualización desde NSIS v2.2.0 | No ejecutado | Probar primero copia de seguridad; confirmar coexistencia, migración y conservación antes de retirar NSIS. |
| Actualización MSIX a MSIX | No ejecutado | Siguiente versión con la misma identidad y versión superior. |
| Desinstalación y datos residuales | No ejecutado | Verificar qué elimina Windows y qué perfil WebView2 conserva. No prometer borrado total antes de comprobarlo. |
| Defender y SmartScreen | No ejecutado | Ejecutar solo dentro de VM; no desactivar protecciones ni quitar marca de Internet. |
| Windows App Certification Kit | No ejecutado | Informe WACK de la versión final; compilación correcta no equivale a certificación. |
| Instalador del release y Authenticode | No ejecutado localmente | Descarga estática del EXE, `Get-AuthenticodeSignature`, metadatos PE y SHA-256 calculado localmente. No abrirlo. |
| Licencias transitivas Rust | Revisión incompleta | Cargo no está instalado; validar manifiestos/licencias de todas las crates y conservar el inventario generado antes de publicar. |

## Dependencias, licencias y secretos

- El código propio declara licencia MIT. El lockfile npm contiene solo herramientas de desarrollo y prueba; sus metadatos informan licencias MIT, Apache-2.0, BSD-2-Clause, BSD-3-Clause, ISC y MIT-0. No hay dependencias JavaScript de producción.
- El binario Rust incluye el árbol fijado por `Cargo.lock` (Tauri, plugin de diálogo, bindings Win32 y transitivas). El lockfile no guarda licencias SPDX; no se pudo ejecutar una auditoría completa de licencias Cargo porque Cargo no está instalado. Esta revisión parcial **no es autorización legal** para publicar hasta completar el inventario de terceros.
- Una búsqueda de patrones habituales de tokens, claves privadas, certificados PFX/PEM y secretos en los archivos de producto no encontró coincidencias. El checkout no contiene instaladores ni PE redistribuibles. No se inspeccionó memoria, archivos fuera del repositorio ni credenciales del entorno.

## Ficha de Store, privacidad y publicación

- [Textos completos en español](STORE-LISTING.es.md) y [English listing](STORE-LISTING.en.md).
- [Borrador de privacidad en español](PRIVACIDAD.es.md) y [English privacy draft](PRIVACY.en.md). Necesita una URL pública y revisión final de retención/desinstalación; el repositorio es privado y esos archivos no sirven como enlace público mientras siga así.
- Se genera el icono cuadrado 300×300 para el listing con franja de marca, además de los logotipos de paquete 44×44, 50×50 y 150×150. El icono y los logotipos salen del SVG del producto.
- Las capturas que aparecen en README son referencias reales, pero aún no se han entregado como archivos PNG locales de Store ni revisado en el paquete final. Store pide al menos una captura de escritorio; se recomienda aportar varias capturas reales de la versión MSIX final y no imágenes simuladas.

## Datos exactos pendientes de Partner Center

No se han inventado ni reservado valores. Antes de generar el paquete final hacen falta, copiados de **Product identity** en Partner Center:

1. `Package/Identity/Name` exacto de la aplicación reservada.
2. `Package/Identity/Publisher` exacto asignado a la cuenta.
3. `PublisherDisplayName` exacto que debe mostrar la ficha/manifiesto.

No envíes contraseñas, PFX, tokens ni documentos personales. Además, en Partner Center tendrás que decidir o completar el nombre reservado, categoría, precio/mercados, clasificación por edades, licencia/condiciones, contacto que exija el tipo de cuenta, URL pública de privacidad, capturas, y notas de certificación. No se ha creado un envío ni un borrador de producto.

## Referencias oficiales consultadas

- [Formatos, versión y firma para paquetes MSIX de Store](https://learn.microsoft.com/en-us/windows/apps/publish/publish-your-app/msix/app-package-requirements?pivots=store-installer-msix)
- [Crear un paquete MSIX con MakeAppx](https://learn.microsoft.com/en-us/windows/msix/package/create-app-package-with-makeappx-tool)
- [Generar componentes de MSIX y manifiesto para una app de escritorio](https://learn.microsoft.com/en-us/windows/msix/desktop/desktop-to-uwp-manual-conversion)
- [Capacidades de aplicaciones y `runFullTrust`](https://learn.microsoft.com/en-us/windows/apps/package-and-deploy/app-capability-declarations)
- [Proceso de certificación y WACK](https://learn.microsoft.com/en-us/windows/uwp/debug-test-perf/windows-app-certification-kit)
- [Empaquetado de Windows de Tauri](https://v2.tauri.app/distribute/windows-installer/)
- [Distribución de WebView2 Evergreen](https://learn.microsoft.com/en-us/microsoft-edge/webview2/concepts/evergreen-vs-fixed-version)
- [Requisitos de iconos y capturas de Store](https://learn.microsoft.com/en-us/windows/apps/publish/publish-your-app/screenshots-and-images)
- [Versiones y estado de mantenimiento de Windows 11](https://learn.microsoft.com/en-us/windows/release-health/windows11-release-information)
