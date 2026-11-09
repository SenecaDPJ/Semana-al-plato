# Preparación para Microsoft Store (MSIX)

**Estado:** paquete candidato 2.2.0.0 preparado y probado parcialmente en una VM Windows 11. Se está reconstruyendo con `MaxVersionTested=10.0.26300.0`; el nuevo artefacto aún requiere WACK. Siguen pendientes la migración desde NSIS, la revisión legal del inventario Rust y otros elementos de publicación. La identidad proporcionada está configurada. Este trabajo no publica una release ni envía el producto a certificación.

## Punto de partida comprobado

- Repositorio: `SenecaDPJ/Semana-al-plato`, público por cambio manual del propietario; rama de trabajo `msstore/v2.2.0-msix-prep`.
- Código de partida: tag `v2.2.0`, commit `39423451edeccc7640ed1826582426333cf17d48`. El run de publicación de Windows `42425539797` informa ese mismo `head_sha`, terminó correctamente y produjo la release v2.2.0. La revisión local parte del commit de documentación `26f2f110a4cae109157918aae7a5a39694f1c008`, descendiente de ese punto.
- Tecnología: interfaz HTML/CSS/JavaScript modular; contenedor de escritorio Tauri 2 y Rust 2021; WebView2 para dibujar la interfaz. Node.js sirve y prueba el frontend; no hay dependencias JavaScript de ejecución. Los flujos de Windows usan Node 22 y Rust estable.
- Tauri CLI bloqueado en el entorno local: 2.12.4. `Cargo.lock` fija Tauri 2.12.5, `tauri-plugin-dialog` 2.8.4 y `windows-sys` 0.61.2 (además de una versión transitiva 0.45.0). La configuración y la release disponible son x64; no se distribuyen builds ARM64 ni x86.
- El producto declara Windows 11. El manifiesto de trabajo apunta a `Windows.Desktop` desde `10.0.22000.0` (Windows 11 21H2). La instalación se probó en Windows 11 build 26300; no se probó en la versión mínima 22000.
- Ese mínimo es técnico y provisional: no afirma que Windows 11 21H2 siga recibiendo soporte. A fecha de esta revisión, Microsoft publica Windows 11 26H2 como build 26300 y 25H2 como 26200; 21H2 dejó de recibir actualizaciones hace años y 24H2 Home/Pro llegó al fin de servicio en octubre de 2026. Antes de publicar, decide si quieres conservar compatibilidad técnica con instalaciones antiguas o elevar el mínimo a una versión mantenida; el manifiesto debe reflejar esa decisión y probarse en Windows.
- El archivo publicado `Semana.al.Plato_2.2.0_x64-setup.exe` es un instalador NSIS, no una aplicación portable. La API de GitHub informa 1.987.741 bytes y SHA-256 `978792095f68dde221bf4a2f1f5dc997abf6249511e3a0c13f6d9253dfe29717`. El tag, el SHA del flujo y la versión del nombre del archivo coinciden. No se descargó ni ejecutó el EXE en el equipo de trabajo.
- El instalador NSIS usa la configuración predeterminada de Tauri: si falta WebView2, descarga y ejecuta el bootstrapper de Microsoft. Por tanto el instalador actual no es offline completo. WebView2 Evergreen viene incluido en Windows 11; el paquete Store propuesto no contiene un runtime fijo.
- La API de GitHub y la configuración de compilación no sustituyen una inspección PE local. No se verificaron los metadatos PE ni Authenticode del EXE v2.2.0. El flujo actual no configura un certificado de firma Authenticode; una captura anterior de v2.1.0 mostró «Editor desconocido», pero no demuestra la firma de v2.2.0. Trátese la release EXE como no firmada hasta inspeccionarla directamente.

## Revisión de compatibilidad

| Área | Resultado de la revisión del código |
| --- | --- |
| Escrituras en la carpeta de instalación | No se encontraron. El paquete puede mantener el ejecutable y los recursos en el área de solo lectura de MSIX. |
| Rutas absolutas/directorio de trabajo | No hay dependencias de rutas de instalación ni del directorio de trabajo en la app. La compilación integra el frontend en el ejecutable. |
| Datos y persistencia | El calendario se guarda en `localStorage` con clave heredada `calendario-comidas.v1`; tema e idioma usan claves separadas. Tauri mantiene el perfil WebView2 bajo los datos locales del usuario. Se conservan el identificador Tauri `com.senecadpj.calendariocomidas` y las claves actuales. La prueba NSIS → MSIX sigue pendiente; exporta una copia antes de probarla. En una prueba de desinstalación, Windows eliminó el directorio de datos local asociado al paquete. |
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

1. exige los tres campos exactos de Partner Center y rechaza valores de ejemplo;
2. comprueba que `package.json`, `tauri.conf.json` y `Cargo.toml` tengan la misma versión;
3. guarda registros de `npm ci`, `npm test`, compilación Tauri y `MakeAppx`, además de las versiones de Node.js, npm, Rust, Cargo, Tauri CLI y MakeAppx;
4. compila directamente el ejecutable anfitrión en Windows x64, sin generar otro instalador NSIS/MSI, genera iconos de MSIX/Store a partir del SVG original y empaqueta `SemanaAlPlato.exe` y las DLL de salida;
5. genera un `.msix` sin firma y un `.msixupload` ZIP que contiene ese MSIX, sin `.appxsym`;
6. calcula SHA-256 de ambos artefactos y los registra en `BUILD-METADATA.txt`.

El paquete candidato se generó en el runner Windows de GitHub Actions, run [42433732980](https://github.com/SenecaDPJ/Semana-al-plato/actions/runs/42433732980), desde el commit `257e0411fd09dae1d9cbdc67077a7c496b0fed2e`. Nombres: `Semana-al-Plato_2.2.0.0_x64.msix` y `Semana-al-Plato_2.2.0.0_x64.msixupload`. SHA-256 MSIX: `f360916080a77dda1010d5366fd5bf693033304f558be5c623f666191820996b`; SHA-256 `.msixupload`: `605ad2b5c3d690947f64c927545aed647f0afea12227ce5aef8d6b59413671c8`. El paquete Store tiene versión `2.2.0.0` y arquitectura x64. El workflow pasó las 30 pruebas y `MakeAppx` informó `Package creation succeeded`.

El artefacto ZIP privado de Actions ([descargar](https://github.com/SenecaDPJ/Semana-al-plato/actions/runs/42433732980/artifacts/13599156206)) incluye el `.msix`, `.msixupload`, icono, registros y `BUILD-METADATA.txt` con versiones exactas de herramientas. Pesa 5.576.398 bytes, SHA-256 `c31c66a381c7af5e70b7cf1d7ad34841b1a7820de95b2e02979ca9e2ed7c9651` y caduca el 22 de noviembre de 2026. El MSIX no se firma localmente: Microsoft firma paquetes MSIX tras aprobar la certificación. El script no instala ni ejecuta el programa; el artefacto es candidato para pruebas, no resultado de WACK o instalación.

La plantilla marca `runFullTrust` porque esta aplicación de escritorio necesita proceso de confianza media. No incluye `unvirtualizedResources` ni otras capacidades. El artefacto anterior conserva `MaxVersionTested=10.0.22000.0`; la plantilla y el script actuales usan `10.0.26300.0`, confirmado por `OSVERSION` en el XML de WACK de la VM. Falta reconstruir e instalar ese nuevo paquete y repetir WACK. El mínimo `10.0.22000.0` no se ha probado.

El parámetro opcional `-MaxVersionTested` permite fijar el build Windows que se haya probado. El valor predeterminado (`10.0.26300.0`) corresponde al sistema registrado en el XML de WACK de esta VM; si se ejecuta en otro Windows, usa su versión real. Esto no acredita por sí solo compatibilidad con versiones anteriores.

### Ejecutar la generación en Windows x64

Requisitos: Node.js 22, Rust estable con MSVC, Visual Studio C++ Build Tools, Windows SDK con `MakeAppx.exe` y dependencias descargables. La generación se puede repetir desde la rama y no ejecuta el EXE. El flujo usa `windows-latest` y Rust `stable`; registra las versiones concretas en cada artefacto, pero no garantiza builds bit a bit idénticos entre ejecuciones.

🔴 EJECUCIÓN⚙️🚨 — Compila, ejecuta las pruebas automatizadas y crea los paquetes en `artifacts/msstore/`. Puede descargar dependencias de desarrollo y deja registros locales. Los valores que facilitaste ya aparecen en el workflow; para una ejecución local puedes usar estos datos o copiar cualquier cambio posterior de Partner Center.

```powershell
.\docs\microsoft-store\build-msix.ps1 `
  -PackageIdentityName "SenecaDPJ.Semanaalplato" `
  -PackageIdentityPublisher "CN=6F3CA482-2B0E-4C58-95F1-BFA42598F4C9" `
  -PublisherDisplayName "SenecaDPJ"
```

El script se detiene si falta Node/Rust/SDK, si las versiones discrepan o si ya existe la carpeta de salida; no sobreescribe paquetes anteriores. No crea ni solicita certificados o claves privadas. La `.msixupload` contiene el paquete MSIX y no símbolos de depuración; Partner Center puede aceptar el `.msix` directamente, aunque Microsoft recomienda el formato de subida para Store.

El workflow `Build Microsoft Store MSIX (manual)` genera un artefacto al subir cambios que afecten al código, scripts o manifiesto de empaquetado de esta rama; la retención es de 14 días. También recopila el inventario Cargo de licencias y textos de terceros para revisión. Los valores de identidad predeterminados son los que facilitó el usuario. La ejecución manual desde GitHub requiere que el workflow esté en la rama predeterminada; después se puede elegir esta rama como referencia. El workflow no publica una release ni envía el producto a certificación y no sustituye pruebas funcionales o WACK.

## Resultados y pruebas Windows pendientes

Las pruebas realizadas usan una VM Windows 11 x64 Enterprise Evaluation y cuentas de prueba; los resultados distinguen las comprobaciones confirmadas por el usuario de los informes de máquina. No instalar ni abrir el EXE de GitHub en el equipo principal. El `.msix` destinado a Store va sin firma y conserva la identidad exacta de Partner Center; Microsoft lo firma tras la certificación. Para pruebas locales se usó una copia firmada con un certificado de desarrollo, confiado solo dentro de la VM. No añadir el certificado ni su clave privada al repositorio o al artefacto de Store; retirar el certificado temporal de la VM al terminar todas las pruebas. Un paquete de prueba unsigned con el OID especial tiene otra identidad y no comprueba la instalación con la identidad final de Store.

| Comprobación | Estado actual | Evidencia/alcance |
| --- | --- | --- |
| `npm test` | **Pasado localmente**, 30/30 | Incluye la selección explícita de la semana al comprobar los datos tras reabrir. El run anterior [42433732980](https://github.com/SenecaDPJ/Semana-al-plato/actions/runs/42433732980) también pasó 30/30. La nueva revisión debe completar su flujo Windows. |
| Compilación Tauri x64 limpia | **Pasada en revisión anterior** | Runner Windows, commit `257e0411fd09dae1d9cbdc67077a7c496b0fed2e`; la reconstrucción actual está pendiente en Actions. |
| Empaquetado `.msix` / `.msixupload` | **Candidato anterior generado** | Run [42433732980](https://github.com/SenecaDPJ/Semana-al-plato/actions/runs/42433732980). Se necesita un nuevo artefacto con `MaxVersionTested=10.0.26300.0`; empaquetar no equivale a instalar ni certificar. |
| Instalación/primer arranque como usuario estándar | **Pasado, confirmado por el usuario** | VM Windows 11 Enterprise Evaluation, build 26300; cuenta `test-semana-standard`; paquete local de prueba 2.2.0.0. |
| Funciones principales | **Pasado, confirmado por el usuario** | El usuario abrió y cerró la aplicación y probó su funcionamiento en la VM. No se registró un resultado automatizado por función. |
| Guardar/cerrar/reabrir | **Pasado, confirmado por el usuario** | El usuario confirmó la persistencia tras cerrar y volver a abrir. |
| Actualización desde NSIS v2.2.0 | No ejecutado | Probar primero copia de seguridad; confirmar coexistencia, migración y conservación antes de retirar NSIS. |
| Actualización MSIX a MSIX | No ejecutado | Siguiente versión con la misma identidad y versión superior. |
| Desinstalación y datos residuales | **Pasado con alcance limitado** | En la cuenta `test-semana`, Windows retiró el paquete y su directorio local: 288 archivos/67.619.374 bytes antes y directorio ausente después. No prueba el borrado de copias exportadas ni de otros perfiles. |
| Microsoft Defender | **Pasado en el paquete local de prueba** | Análisis personalizado con protección en tiempo real activa; cero detecciones nuevas. SHA-256 del MSIX firmado para pruebas: `1332C10E50DFF8C017615E00DEB76DBD13901F9A6E88990C337C06589EF73624`. |
| SmartScreen | **No ejecutado para el paquete MSIX** | El MSIX local usa firma de desarrollo y no representa la reputación de un paquete publicado por Store. No se desactivaron protecciones ni se quitó la marca de Internet. |
| Windows App Certification Kit (WACK) | **Pasado en el candidato anterior; pendiente repetir** | 24 pruebas: 23 pasaron, 1 opcional falló y 0 obligatorias fallaron; el XML registra `OVERALL_RESULT=PASS`. Debe repetirse en el paquete reconstruido. WACK no equivale a certificación de Store. |
| Instalador del release y Authenticode | No ejecutado localmente | Descarga estática del EXE, `Get-AuthenticodeSignature`, metadatos PE y SHA-256 calculado localmente. No abrirlo. |
| Licencias transitivas Rust | **Inventario automatizado pendiente de generar y revisión legal incompleta** | El workflow incorpora `export-cargo-license-inventory.ps1` para adjuntar manifiestos/licencias y avisos de Cargo. La persona responsable debe revisar expresiones, textos y obligaciones; el inventario no es autorización legal. |

### Resultado WACK del 9 de noviembre de 2026

WACK 10.0.26100.9457 terminó con código de salida 0 en Windows 11 Enterprise Evaluation x64, build 26300.0. El XML de la prueba completa (`PARTIAL_RUN=FALSE`) informa `OVERALL_RESULT=PASS`: 23 de 24 pruebas pasaron, una prueba marcada `OPTIONAL=TRUE` falló y ninguna prueba obligatoria falló. Se ejecutó sobre la versión 2.2.0.0 x64 del paquete local firmado para pruebas, no sobre el `.msixupload` sin firma que se entregaría a Partner Center ni sobre un paquete firmado por Microsoft.

Microsoft documenta que las pruebas opcionales de Desktop Bridge son informativas y no se usan para evaluar la incorporación a Store; también describe **Blocked executables** como una comprobación relacionada con Windows S y recomienda revisar cada referencia. La guía vigente indica que WACK local está obsoleto y es solo una comprobación previa opcional; la certificación oficial ocurre al enviar a Partner Center. Véanse [pruebas Desktop Bridge](https://learn.microsoft.com/en-us/windows/uwp/debug-test-perf/windows-desktop-bridge-app-tests) y [validación de paquetes MSIX](https://learn.microsoft.com/en-us/windows/msix/package/packaging-uwp-apps).

La prueba opcional **Ejecutables bloqueados** detectó referencias binarias a `CreateProcessW`, `ShellExecuteW` y las cadenas `CDb`, `basH`, `cmd`, `CSi`, `cmd.exe` y `\cmd.exe`. La revisión del código fuente confirma que `ShellExecuteW` se usa para abrir el perfil de GitHub solo después del consentimiento. No se encontraron llamadas a `CreateProcessW`, `cmd.exe` ni `std::process::Command` en `src/` o `src-tauri/`; el origen de esas otras referencias binarias no se ha trazado. Se conserva como hallazgo pendiente de evaluación, no se etiqueta como falso positivo.

El XML completo se conserva fuera de Git en esta máquina, en la carpeta local vecina `../Compilacion_W11/LocalTest/wack-report-2.2.0.0-20261109.xml` (SHA-256 `CEA24A9869D3FCC364A05AAB767DF61C1F9D6847A45338A0F4FFC70CD9F1EC9D`). El MSIX local firmado para pruebas tiene SHA-256 `1332C10E50DFF8C017615E00DEB76DBD13901F9A6E88990C337C06589EF73624`; el candidato sin firmar conserva los hashes indicados en la sección de paquete. WACK no certifica la aplicación ni predice por sí solo la decisión de Partner Center.

## Dependencias, licencias y secretos

- El código propio declara licencia MIT. El lockfile npm contiene solo herramientas de desarrollo y prueba; sus metadatos informan licencias MIT, Apache-2.0, BSD-2-Clause, BSD-3-Clause, ISC y MIT-0. No hay dependencias JavaScript de producción.
- El binario Rust incluye el árbol fijado por `Cargo.lock` (Tauri, plugin de diálogo, bindings Win32 y transitivas). El lockfile no guarda licencias SPDX. El workflow ahora genera un inventario y recopila textos de licencia; hasta ejecutar ese paso y revisar las obligaciones, el estado **no es autorización legal** para publicar.
- Una búsqueda de patrones habituales de tokens, claves privadas, certificados PFX/PEM y secretos en los archivos de producto no encontró coincidencias. El checkout no contiene instaladores ni PE redistribuibles. No se inspeccionó memoria, archivos fuera del repositorio ni credenciales del entorno.

## Ficha de Store, privacidad y publicación

- [Textos completos en español](STORE-LISTING.es.md) y [English listing](STORE-LISTING.en.md).
- [Política web bilingüe](privacy/index.html) y fuentes [española](PRIVACIDAD.es.md) / [inglesa](PRIVACY.en.md). La rama `gh-pages` ya está publicada y contiene solo `index.html`. El API del repositorio informa `has_pages=true`, pero desde este entorno no se pudo verificar la respuesta web ni leer la configuración de origen. Confirma en Settings → Pages que la fuente sea `gh-pages` y `/ (root)`, y valida `https://senecadpj.github.io/Semana-al-plato/` antes de usarla en Partner Center. El contacto propuesto es el formulario público de incidencias de GitHub; no se deben incluir datos personales.
- Se genera el icono cuadrado 300×300 para el listing con franja de marca, además de los logotipos de paquete 44×44, 50×50 y 150×150. El icono y los logotipos salen del SVG del producto.
- Las capturas que aparecen en README son referencias reales, pero aún no se han entregado como archivos PNG locales de Store ni revisado en el paquete final. Store pide al menos una captura de escritorio; se recomienda aportar varias capturas reales de la versión MSIX final y no imágenes simuladas.

## Identidad recibida de Partner Center

El usuario proporcionó estos valores, que se usan como predeterminados para generar el paquete:

- `Package/Identity/Name`: `SenecaDPJ.Semanaalplato`
- `Package/Identity/Publisher`: `CN=6F3CA482-2B0E-4C58-95F1-BFA42598F4C9`
- `PublisherDisplayName`: `SenecaDPJ`

Antes de publicar, verifica que siguen coincidiendo con **Product identity**. En Partner Center tendrás que decidir o completar el nombre reservado, categoría, precio/mercados, clasificación por edades, licencia/condiciones, URL de privacidad una vez activa Pages, capturas reales y notas de certificación. El formulario público de issues es el canal de soporte propuesto; comprueba qué campos de contacto exige el formulario de Partner Center para tu cuenta. No se ha creado un envío ni un borrador de producto.

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
