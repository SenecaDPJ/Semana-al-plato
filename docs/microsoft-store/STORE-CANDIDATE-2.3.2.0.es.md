# Estado de preparación MSIX 2.3.2.0

**Fecha:** 12 de noviembre de 2026
**Estado:** CANDIDATA LOCAL PREPARADA; pendiente una comprobación visual de esta versión y resolver dos resultados de WACK. No está lista para enviarse a Partner Center.

## Alcance e identidad

La versión 2.3.2 añade al ejecutable un manifiesto de reconocimiento de DPI por monitor para corregir la advertencia detectada en la ronda anterior. No cambia los datos ni las funciones de la aplicación. El mínimo continúa en `10.0.26100.1742`, la versión exacta de Windows probada.

| Campo | Valor |
|---|---|
| Producto / versión MSIX | Semana al Plato / `2.3.2.0` |
| Arquitectura | x64 (`x86_64-pc-windows-msvc`) |
| Identidad | `SenecaDPJ.Semanaalplato` |
| Publisher | `CN=6F3CA482-2B0E-4C58-95F1-BFA42598F4C9` |
| Publisher visible | `SenecaDPJ` |
| MinVersion / MaxVersionTested | `10.0.26100.1742` / `10.0.26300.0` |
| Commit fuente | `59d49fb26902415f0165545691a029c7830e9b9f` |
| Firma del paquete Store | Sin firmar; Microsoft firmaría el paquete tras certificación y publicación |

## Artefactos locales

Directorio: `artifacts/msstore/2.3.2.0-x64-cleanbuild-retry1/` (ignorado por Git; no contiene claves privadas).

| Artefacto | SHA-256 | Uso |
|---|---|---|
| `Semana-al-Plato_2.3.2.0_x64.msix` | `C25162A06916DA8B285E26A47894C5FCB7C3B310A27201CF71F324B34B1D99F9` | Paquete Store sin firma |
| `Semana-al-Plato_2.3.2.0_x64.msixupload` | `85984E1CCCC2941F2E483BEB73978C43387185E27139D59B4EA9F3DB937E4DBC` | Archivo local de subida a Partner Center, sin símbolos |
| `Semana-al-Plato_2.3.2.0_x64-LOCALTEST.msix` | `5EF90E0D851B7835A845717E91E04CDB3BBB0E990C2A1116388A465D515C2BF2` | Paquete firmado solo para pruebas aisladas |

El certificado público de prueba vence el 26-11-2026 y solo se confió en la VM LTSC. No se incluye PFX ni clave privada. El paquete de Store y el `.msixupload` son distintos del paquete firmado de pruebas.

## Comprobaciones

| Comprobación | Estado | Evidencia y alcance |
|---|---|---|
| `npm ci` y auditoría de dependencias npm | **PASADO** | 41 paquetes; 0 vulnerabilidades comunicadas en 42 paquetes auditados. |
| `npm test` | **PASADO** | 32/32 pruebas. |
| Compilación Tauri x64 y empaquetado con MakeAppx | **PASADO** | Node 22.21.0, npm 10.9.4, Rust/Cargo 1.99.1, Tauri CLI 2.12.4 y MakeAppx 10.0.19041.5609; Windows 10.0.26300.0. |
| Identidad y manifiesto | **PASADO** | Identidad, Publisher, versión, arquitectura y mínimo coinciden con los datos facilitados y la VM objetivo. El ejecutable incluye `true/pm` y `PerMonitorV2,PerMonitor`. |
| Actualización 2.3.1.0 → 2.3.2.0 en Windows | **PASADO, alcance de archivos** | Windows 11 Enterprise LTSC Evaluation 24H2 x64, build 26100.1742, perfil administrador. MSIX quedó `Ok`. El directorio de datos tenía 174 archivos antes y después; los seis archivos de LevelDB de `localStorage` conservaron exactamente sus SHA-256 (hash del manifiesto: `14C282387E2D6501185992EAC497934237C68993F4C296E538607BA903E0E0E2`). No equivale a una inspección visual de cada registro. |
| Defender | **PASADO** | Análisis personalizado del directorio de artefactos, incluido el paquete firmado de prueba: código 0 y ninguna detección. Ejecutado en el anfitrión de desarrollo; no sustituye el análisis de Microsoft Store. |
| WACK 10.0.26100.9457 | **ADVERTENCIA** | Ejecución completa, salida 0, `PARTIAL_RUN=FALSE`, 22/24 pruebas PASADAS. La comprobación opcional `Ejecutables bloqueados` falló por referencias a `CreateProcessW` y `ShellExecuteW`. `DPIAwarenessValidation`, obligatoria, devolvió `WARNING` pese al manifiesto DPI presente en el PE. No es un resultado limpio ni una certificación. |
| Registro y persistencia de archivos de 2.3.2.0 | **PASADO, alcance de archivos** | PowerShell Direct confirmó el 12-11-2026 en la cuenta administradora: Windows build 26100, paquete `2.3.2.0` en estado `Ok`, `MinVersion=10.0.26100.1742` y aplicación cerrada (0 procesos). El perfil WebView2 contiene 174 archivos, incluidos 6 archivos LevelDB de `localStorage`. Esto confirma presencia y continuidad a nivel de archivos; no inspecciona el contenido ni sustituye la comprobación visual. |
| Apertura visual y prueba interactiva de 2.3.2.0 | **PENDIENTE** | Falta abrir esta versión en la VM y confirmar visualmente los datos restaurados; después cerrar y volver a abrir una vez. Las pruebas manuales anteriores corresponden a versiones previas y no se atribuyen a 2.3.2.0. |
| Actualización/desinstalación y persistencia en perfil estándar en 2.3.2.0 | **NO EJECUTADO** | La actualización y comparación de archivos se hicieron en el perfil administrador. Pruebas anteriores en 2.3.x no sustituyen este control de esta versión. |
| Certificación Microsoft Store | **NO EJECUTADO** | No se envió el paquete a Partner Center. |

### WACK y DPI

WACK deja una advertencia obligatoria para DPI. Aunque el manifiesto PE contiene `dpiAware=true/pm` y `dpiAwareness=PerMonitorV2,PerMonitor`, WACK informa que no pudo procesar el binario y concluye que no detecta el nivel de conciencia DPI. No se interpreta como falso positivo. SHA-256 del XML: `71C3E29BD6E07F526F16024AFD394859F6577C881C19A5F7A7B1EA598D6A9EDA`; del log: `36E089CB4DE5A7E2A5DB721AB5C8C9A1ACA4B342F0C92D200A1AA5DAF318D791`. Ambos quedan en el directorio local de artefactos; los archivos completos no se publican porque contienen rutas internas de la VM.

La prueba opcional de ejecutables bloqueados menciona `kernel32.dll!CreateProcessW` y `shell32.dll!ShellExecuteW`. Su presencia por sí sola no demuestra que la aplicación invoque esas APIs durante el uso; tampoco se ha demostrado que sea inalcanzable. Debe conservarse como hallazgo sin resolver.

Microsoft describe actualmente WACK como obsoleto y como una comprobación local opcional previa al envío; la certificación oficial de Store se ejecuta al enviar el paquete a Partner Center. Por tanto, este resultado local no es una certificación ni, por sí solo, un bloqueo automático de envío. Se conserva como advertencia técnica sin marcarlo como limpio. Véase [la guía oficial de empaquetado MSIX](https://learn.microsoft.com/en-us/windows/msix/package/packaging-uwp-apps).

## Licencias y avisos

El inventario de la candidata registra 247 crates, 443 archivos de licencia, 7 textos suplementarios para 6 paquetes, 1.630 líneas con menciones de cabecera en 64 paquetes, cero expresiones SPDX ausentes y cero textos de licencia ausentes. El MSIX contiene `THIRD-PARTY-NOTICES.txt`, inventario CSV y resumen JSON; incluye los tres textos anidados que faltaban en la candidata 2.3.0.0 y enlaces versionados de fuentes para los cinco crates MPL.

El propietario confirmó el 12-11-2026 que completó la revisión manual de cabeceras de copyright y archivos `NOTICE`. No se ha incorporado un registro de decisiones o incidencias de esa revisión. `LegalReviewComplete=false` en el resumen automático sigue siendo deliberadamente conservador: el inventario técnico y la revisión de cabeceras no son autorización jurídica para distribuir. La aprobación final de derechos/licencias del editor sigue pendiente. Véase [la actualización bilingüe de la revisión](LICENSE-REVIEW-UPDATE-2.3.2.0.es.md).

## Pendiente antes de Partner Center

- Abrir 2.3.2.0 en la VM administradora, confirmar visualmente los datos conservados y repetir cierre/reapertura. Después, si se requiere evidencia de cuenta estándar, instalar y probar el mismo paquete en `cuenta estándar de prueba`.
- Resolver la advertencia obligatoria DPI y evaluar el hallazgo opcional de ejecutables bloqueados; volver a ejecutar WACK sobre el artefacto final si se modifica el paquete.
- Obtener la autorización legal final para distribuir dependencias y avisos.
- **Política de privacidad publicada: PASADO** — el 12-11-2026 `https://senecadpj.github.io/Semana-al-plato/` respondió HTTP 200 y sirvió las etiquetas de versión/fecha 2.3.2 en español e inglés. El commit de `gh-pages` es `da411cd`.
- Seleccionar capturas actuales y reales en español e inglés y completar las decisiones restantes de Partner Center (clasificación por edades, mercados, disponibilidad/precio, categoría y ficha).

La identidad asignada por Partner Center ya está incorporada y coincide con el paquete. No se cambió la visibilidad del repositorio, no se creó una release pública y no se inició la certificación.
