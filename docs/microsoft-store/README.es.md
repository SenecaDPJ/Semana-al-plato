# Preparación para Microsoft Store (MSIX)

**Estado:** PREPARADO, PENDIENTE DE PRUEBAS EN WINDOWS. El candidato MSIX `2.2.0.0` se reconstruyó en Windows x64 (Actions run [42590341105](https://github.com/SenecaDPJ/Semana-al-plato/actions/runs/42590341105)), con la identidad de Partner Center y `MaxVersionTested=10.0.26300.0`. La copia local firmada para pruebas se instaló en la VM como usuario estándar; el usuario confirmó la restauración del JSON y que los datos persistieron al cerrar y reabrir. También instaló el EXE NSIS v2.2.0 como usuario estándar y confirmó el primer arranque, cambios de idioma/tema y persistencia tras cerrar y reabrir; PowerShell Direct confirmó la instalación y que la app estaba cerrada al inspeccionar. Defender no detectó amenazas. WACK terminó con `OVERALL_RESULT=PASS`, 23/24 pruebas pasadas y una falla opcional en **Ejecutables bloqueados**; ninguna prueba obligatoria falló. El mínimo `10.0.22000.0` y las rutas de actualización desde NSIS y entre versiones MSIX siguen sin probar. También siguen pendientes la revisión legal de licencias, capturas finales y completar la ficha de Store. La política de privacidad bilingüe está publicada y respondió HTTP 200. No se publica una release ni se envía el producto a certificación.

## Punto de partida comprobado

- Repositorio: `SenecaDPJ/Semana-al-plato`, público por cambio manual del propietario; rama de trabajo `msstore/v2.2.0-msix-prep`.
- Código de partida: tag `v2.2.0`, commit `39423451edeccc7640ed1826582426333cf17d48`. El run de publicación de Windows `42425539797` informa ese mismo `head_sha`, terminó correctamente y produjo la release v2.2.0. La revisión local parte del commit de documentación `26f2f110a4cae109157918aae7a5a39694f1c008`, descendiente de ese punto.
- Tecnología: interfaz HTML/CSS/JavaScript modular; contenedor de escritorio Tauri 2 y Rust 2021; WebView2 para dibujar la interfaz. Node.js sirve y prueba el frontend; no hay dependencias JavaScript de ejecución. Los flujos de Windows usan Node 22 y Rust estable.
- Tauri CLI bloqueado en el entorno local: 2.12.4. `Cargo.lock` fija Tauri 2.12.5, `tauri-plugin-dialog` 2.8.4 y `windows-sys` 0.61.2 (además de una versión transitiva 0.45.0). La configuración y la release disponible son x64; no se distribuyen builds ARM64 ni x86.
- El producto declara Windows 11. El manifiesto de trabajo apunta a `Windows.Desktop` desde `10.0.22000.0` (Windows 11 21H2). La instalación se probó en Windows 11 build 26300; no se probó en la versión mínima 22000.
- Ese mínimo es técnico y provisional: no afirma que Windows 11 21H2 siga recibiendo soporte. A fecha de esta revisión, Microsoft publica Windows 11 26H2 como build 26300 y 25H2 como 26200; 21H2 dejó de recibir actualizaciones hace años y 24H2 Home/Pro llegó al fin de servicio en octubre de 2026. Antes de publicar, decide si quieres conservar compatibilidad técnica con instalaciones antiguas o elevar el mínimo a una versión mantenida; el manifiesto debe reflejar esa decisión y probarse en Windows.
- El archivo publicado `Semana.al.Plato_2.2.0_x64-setup.exe` es un instalador NSIS, no una aplicación portable. La API de GitHub informa 1.987.741 bytes y SHA-256 `978792095f68dde221bf4a2f1f5dc997abf6249511e3a0c13f6d9253dfe29717`; el archivo descargado en la VM coincide exactamente con ese hash. La inspección estática confirma que el setup exterior es PE x86 (`Machine=0x014C`), con versión/producto `2.2.0` y Authenticode `NotSigned`. El asset instala el build de aplicación x64; no se inventariaron los PE internos del instalador. Defender terminó el análisis personalizado sin detecciones y con protección en tiempo real activa. Después, el usuario ejecutó el instalador en la VM para probar la instalación y el uso básico.
- El instalador NSIS usa la configuración predeterminada de Tauri: si falta WebView2, descarga y ejecuta el bootstrapper de Microsoft. Por tanto el instalador actual no es offline completo. WebView2 Evergreen viene incluido en Windows 11; el paquete Store propuesto no contiene un runtime fijo.
- El EXE v2.2.0 no lleva firma Authenticode (`NotSigned`); el flujo de release no configura un certificado de firma. Una captura anterior de v2.1.0 mostró «Editor desconocido», pero la conclusión actual se basa en la inspección directa de v2.2.0. La descarga con PowerShell Direct no creó un flujo `Zone.Identifier`; no se eliminó ni se alteró uno existente. Ni la coincidencia de hash ni el análisis de Defender convierten el EXE en un binario firmado o de confianza. El usuario lo ejecutó dentro de la VM aislada, no en el anfitrión.

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

El artefacto candidato vigente se generó en Actions run [42590341105](https://github.com/SenecaDPJ/Semana-al-plato/actions/runs/42590341105), desde `02adc670d3284fb2d3b307383cf40203feffecec`. Incluye `Semana-al-Plato_2.2.0.0_x64.msix` (SHA-256 `e5da0d373c2106aea894f4ed4b8c01a09bf48858cf3321de7e201e43b8ed074d`) y `Semana-al-Plato_2.2.0.0_x64.msixupload` (SHA-256 `4bd3d087593ecd676b94247c8ac7843b7995b0368f87e2b24cd7fc1d303d0ada`). El ZIP de Actions es el artefacto `13660379174`, pesa 6.576.381 bytes, SHA-256 `11375f21b8e5bcd407e21162cd96e676f6af0d86a63cdc8a432dfb0c530a1428` y caduca el 23 de noviembre de 2026. La compilación limpia, `npm test` (30/30) y `MakeAppx` pasaron. Este MSIX de Store no lleva firma y no se instaló directamente; para las pruebas de Windows se instaló una copia local firmada con el certificado temporal de la VM.

El artefacto de Actions contiene ambos paquetes, iconos, logs, `BUILD-METADATA.txt` y el inventario/licencias de Cargo para `x86_64-pc-windows-msvc`: 247 crates externos, 433 textos de licencia copiados, 0 sin expresión SPDX y 6 sin texto de licencia en el paquete fuente (`alloc-stdlib`, `selectors`, `tauri-plugin`, `webview2-com`, `webview2-com-macros`, `webview2-com-sys`). Los 247 requieren revisión de términos y los 6 textos ausentes requieren resolución. El inventario no es autorización legal. El MSIX de Store permanece sin firma; Microsoft lo firma al completar la certificación.

La plantilla marca `runFullTrust` porque esta aplicación de escritorio necesita proceso de confianza plena. No incluye `unvirtualizedResources` ni otras capacidades. El artefacto vigente y la copia firmada usada en WACK declaran `MaxVersionTested=10.0.26300.0`. El mínimo `10.0.22000.0` no se ha probado.

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
| `npm test` | **Pasado, 30/30** | Run [42590341105](https://github.com/SenecaDPJ/Semana-al-plato/actions/runs/42590341105) para el commit candidato. Incluye la selección explícita de la semana al comprobar la reapertura. |
| Compilación Tauri x64 limpia | **Pasada** | Runner Windows, commit `02adc670d3284fb2d3b307383cf40203feffecec`; versiones de Node, npm, Rust, Cargo, Tauri CLI y MakeAppx en `BUILD-METADATA.txt`. |
| Empaquetado `.msix` / `.msixupload` vigente | **Pasado** | Run [42590341105](https://github.com/SenecaDPJ/Semana-al-plato/actions/runs/42590341105), `MaxVersionTested=10.0.26300.0`; SHA-256 MSIX `e5da0d…ed074d`, `.msixupload` `4bd3d0…d0dada`. El paquete de Store sigue sin firma. |
| Instalación/primer arranque como usuario estándar | **Pasado en el candidato vigente** | La copia local firmada del artefacto actual se instaló para `test-semana-standard` en Windows 11 build 26300; PackageStatus `Ok`, versión `2.2.0.0`, identidad y publisher esperados. SHA-256 de la copia firmada: `18E1F5F32C16DFCC705C3ACBA741955A91AFC682F84381D10C36BD883E56A6DA`. |
| Restaurar copia y persistencia | **Pasado en el candidato vigente, confirmado por el usuario** | Se exportó JSON antes del reemplazo, se restauró después de instalar el candidato y el usuario confirmó que los datos seguían allí al cerrar y reabrir la app. La copia sigue fuera del paquete en la VM. |
| Funciones principales | **Pasado en una prueba anterior; candidato vigente abierto y comprobado** | Las funciones principales se probaron en la versión previa. En el candidato vigente se verificaron instalación, restauración del JSON y persistencia; no se documentó una repetición exhaustiva de cada función. |
| Actualización desde NSIS v2.2.0 | No ejecutado | Probar primero copia de seguridad; confirmar coexistencia, migración y conservación antes de retirar NSIS. |
| Actualización MSIX a MSIX | No ejecutado | Siguiente versión con la misma identidad y versión superior. |
| Desinstalación y datos residuales | **Pasado con alcance limitado** | En `test-semana`, Windows retiró el paquete y su directorio local (288 archivos/67.619.374 bytes). En el reemplazo del candidato, eliminó los datos locales de `test-semana-standard` (195 archivos/4.022.501 bytes); la copia JSON permaneció disponible y se restauró. No prueba el borrado de copias exportadas ni de otros perfiles. |
| Microsoft Defender | **Pasado en el candidato vigente** | Análisis personalizado en la VM del `.msix` unsigned vigente y de su copia firmada localmente; ambos códigos 0, cero detecciones, protección en tiempo real activa. SHA-256 unsigned: `E5DA0D373C2106AEA894F4ED4B8C01A09BF48858CF3321DE7E201E43B8ED074D`; copia de prueba firmada: `18E1F5F32C16DFCC705C3ACBA741955A91AFC682F84381D10C36BD883E56A6DA`. Informe local fuera de Git: `../Compilacion_W11/LocalTest/defender-msix-report-20261109-current-artifact.json`. |
| SmartScreen | **No ejecutado para el paquete MSIX** | El MSIX local usa firma de desarrollo y no representa la reputación de un paquete publicado por Store. No se desactivaron protecciones ni se quitó la marca de Internet. |
| Windows App Certification Kit (WACK) | **Pasado en el candidato vigente, con una falla opcional** | WACK 10.0.26100.9457: 24 pruebas, 23 pasaron, 1 opcional falló y 0 obligatorias fallaron; `OVERALL_RESULT=PASS`. Se probó la copia firmada localmente del candidato actual, SHA-256 `18E1F5F32C16DFCC705C3ACBA741955A91AFC682F84381D10C36BD883E56A6DA`, `MaxVersionTested=10.0.26300.0`. WACK no equivale a certificación de Store. |
| Instalador de release v2.2.0: PE, Authenticode, Defender e instalación | **Inspección estática e instalación básica pasadas en la VM; migración/desinstalación pendientes** | SHA-256 coincide con GitHub: `978792095f68dde221bf4a2f1f5dc997abf6249511e3a0c13f6d9253dfe29717`; tamaño 1.987.741 bytes; setup exterior PE x86 (`Machine=0x014C`), versión/producto `2.2.0`, Authenticode `NotSigned`; el asset corresponde al build de app x64, pero no se inventariaron los PE internos. Defender, protección en tiempo real activa, 0 detecciones. El usuario instaló como estándar, probó idioma/tema y persistencia; PowerShell Direct verificó versión `2.2.0`, ejecutable, desinstalador y accesos directos, y confirmó la app cerrada. La actualización NSIS→MSIX y la desinstalación NSIS siguen pendientes. Informes locales fuera de Git: `../Compilacion_W11/LocalTest/nsis-release-static-review-20261109-134102.json` (SHA-256 `298029BD9DF33754C877BDE4919420A4D1E81FCC0BB3241660F7956FC33FAED3`) y `../Compilacion_W11/LocalTest/vm-nsis-install-verification-20261109-142908.json` (SHA-256 `8A31E4DC8A024E53D26E671B0A1762D439107E4A549F9BC4B94853548E27259A`). |
| Licencias transitivas Rust | **Inventario generado; revisión legal incompleta** | El artefacto incluye 247 crates del objetivo Windows x64, 433 archivos de licencia y 6 crates sin texto incluido. Revisar términos de los 247 y resolver los 6; el inventario no es autorización legal. |

### Resultado WACK vigente del 9 de noviembre de 2026

WACK 10.0.26100.9457 terminó con código de salida 0 en Windows 11 Enterprise Evaluation x64, build 26300.0. El XML de la prueba completa (`PARTIAL_RUN=FALSE`) informa `OVERALL_RESULT=PASS`: 23 de 24 pruebas pasaron, una prueba marcada `OPTIONAL=TRUE` falló y ninguna prueba obligatoria falló. Se ejecutó sobre la copia local firmada de la versión 2.2.0.0 x64 del candidato actual (SHA-256 `18E1F5F32C16DFCC705C3ACBA741955A91AFC682F84381D10C36BD883E56A6DA`), no sobre el `.msixupload` sin firma ni sobre un paquete firmado por Microsoft.

Microsoft documenta que las pruebas opcionales de Desktop Bridge son informativas y no se usan para evaluar la incorporación a Store; también describe **Blocked executables** como una comprobación relacionada con Windows S y recomienda revisar cada referencia. La guía vigente indica que WACK local está obsoleto y es solo una comprobación previa opcional; la certificación oficial ocurre al enviar a Partner Center. Véanse [pruebas Desktop Bridge](https://learn.microsoft.com/en-us/windows/uwp/debug-test-perf/windows-desktop-bridge-app-tests) y [validación de paquetes MSIX](https://learn.microsoft.com/en-us/windows/msix/package/packaging-uwp-apps).

La prueba opcional **Ejecutables bloqueados** detectó referencias binarias a `CreateProcessW`, `ShellExecuteW` y las cadenas `CDb`, `basH`, `cmd`, `CSi`, `cmd.exe` y `\cmd.exe`. La revisión del código fuente confirma que `ShellExecuteW` se usa para abrir el perfil de GitHub solo después del consentimiento. No se encontraron llamadas a `CreateProcessW`, `cmd.exe` ni `std::process::Command` en `src/` o `src-tauri/`; el origen de esas otras referencias binarias no se ha trazado. Se conserva como hallazgo pendiente de evaluación, no se etiqueta como falso positivo.

El XML completo está fuera de Git en `../Compilacion_W11/LocalTest/WACK-current-candidate-20261109-124317.xml` (SHA-256 `03989A2F97D75DA1D6F0B46E3733326CE7CB3BCF8E398D118BB83B5C0024FDF4`). El informe confirma la identidad `SenecaDPJ.Semanaalplato`, versión `2.2.0.0`, x64 y `OSVERSION=10.0.26300.0`. La copia firmada para pruebas corresponde al paquete Store candidato cuyo MSIX sin firmar tiene SHA-256 `e5da0d373c2106aea894f4ed4b8c01a09bf48858cf3321de7e201e43b8ed074d`. WACK no certifica la aplicación ni predice por sí solo la decisión de Partner Center.

El original y el resumen JSON siguen disponibles en la VM: `C:\Users\Public\Documents\SemanaAlPlato-Test\WACK-2.2.0.0-current-candidate-20261109-124144.xml` y `C:\Users\Public\Documents\SemanaAlPlato-Test\WACK-2.2.0.0-current-candidate-20261109-124144-summary.json`. La copia del resumen fuera de Git es `../Compilacion_W11/LocalTest/WACK-current-candidate-summary-20261109-124317.json`.

## Dependencias, licencias y secretos

- El código propio declara licencia MIT. El lockfile npm contiene solo herramientas de desarrollo y prueba; sus metadatos informan licencias MIT, Apache-2.0, BSD-2-Clause, BSD-3-Clause, ISC y MIT-0. No hay dependencias JavaScript de producción.
- El binario Rust incluye el grafo resuelto para `x86_64-pc-windows-msvc`: 247 crates externos. El artefacto incluye 433 textos de licencia, pero 6 paquetes no traen texto (la lista está en `CARGO-LICENSE-INVENTORY.csv`) y los 247 requieren revisión de obligaciones. El inventario declara 5 paquetes con MPL-2.0 y 18 con Unicode-3.0; no se encontraron expresiones SPDX GPL/LGPL/AGPL. Esto solo resume metadatos y no determina obligaciones ni constituye autorización legal. La revisión legal sigue incompleta.
- Una búsqueda de patrones habituales de tokens, claves privadas, certificados PFX/PEM y secretos en los archivos de producto no encontró coincidencias. El checkout no contiene instaladores ni PE redistribuibles. No se inspeccionó memoria, archivos fuera del repositorio ni credenciales del entorno.

## Ficha de Store, privacidad y publicación

- [Textos completos en español](STORE-LISTING.es.md) y [English listing](STORE-LISTING.en.md).
- [Política web bilingüe](privacy/index.html) y fuentes [española](PRIVACIDAD.es.md) / [inglesa](PRIVACY.en.md). La rama `gh-pages` publica solo `index.html`; el repositorio público informa `has_pages=true`. Comprobación HTTP del 9 de noviembre de 2026: `https://senecadpj.github.io/Semana-al-plato/` respondió **200**, con título `Privacidad — Semana al Plato` y contenido español e inglés. El contacto es el formulario público de incidencias de GitHub; no se deben incluir datos personales.
- Se genera el icono cuadrado 300×300 para el listing con franja de marca, además de los logotipos de paquete 44×44, 50×50 y 150×150. El icono y los logotipos salen del SVG del producto.
- Las capturas que aparecen en README son referencias reales, pero aún no se han entregado como archivos PNG locales de Store ni revisado en el paquete final. Store pide al menos una captura de escritorio; se recomienda aportar varias capturas reales de la versión MSIX final y no imágenes simuladas.

## Identidad recibida de Partner Center

El usuario proporcionó estos valores, que se usan como predeterminados para generar el paquete:

- `Package/Identity/Name`: `SenecaDPJ.Semanaalplato`
- `Package/Identity/Publisher`: `CN=6F3CA482-2B0E-4C58-95F1-BFA42598F4C9`
- `PublisherDisplayName`: `SenecaDPJ`

Antes de publicar, verifica que siguen coincidiendo con **Product identity**. En Partner Center tendrás que decidir o completar el nombre reservado, categoría, precio/mercados, clasificación por edades, licencia/condiciones, introducir la URL de privacidad verificada, capturas reales y notas de certificación. El formulario público de issues es el canal de soporte; comprueba qué campos de contacto exige el formulario de Partner Center para tu cuenta. No se ha creado un envío ni un borrador de producto.

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
