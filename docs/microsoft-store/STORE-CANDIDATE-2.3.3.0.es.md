# Estado de preparación MSIX 2.3.3.0

**Fecha:** 13 de noviembre de 2026

**Estado:** paquete creado, actualizado, desinstalado/reinstalado y probado en perfiles administrador y estándar de Windows 11 Enterprise LTSC Evaluation 24H2 build 26100.1742. El usuario confirmó apertura, contenido y persistencia tras reabrir en ambos perfiles. WACK terminó con `OVERALL_RESULT=PASS` y un único fallo opcional. El envío 1 del MSIX se presentó a Partner Center y está **en proceso de certificación**; la última captura muestra preprocesamiento y aún no hay decisión de Microsoft. No se ha publicado en Microsoft Store. La publicación se retuvo hasta que el propietario pulse «Publicar ahora» tras una eventual aprobación. El instalador tradicional v2.3.3 sí se publicó por separado en GitHub.

## Alcance e identidad

La versión 2.3.3 corrige la etiqueta de versión de la interfaz, que aún mostraba 2.3.0 aunque el paquete fuera más reciente. Incluye la función de movimiento en grupo dentro de la semana, ya probada por el usuario en una candidata anterior. No cambia el formato ni la ubicación de los datos.

| Campo | Valor |
|---|---|
| Producto / versión MSIX | Semana al Plato / `2.3.3.0` |
| Arquitectura | x64 (`x86_64-pc-windows-msvc`) |
| Identidad | `SenecaDPJ.Semanaalplato` |
| Publisher | `CN=6F3CA482-2B0E-4C58-95F1-BFA42598F4C9` |
| Publisher visible | `SenecaDPJ` |
| MinVersion / MaxVersionTested | `10.0.26100.1742` / `10.0.26300.0` |
| Commit fuente | `0459c963c772635ec63a48aea13984dae393604e` |
| Firma Store | Sin firmar; Microsoft firma el paquete tras la certificación y publicación |

## Decisiones seleccionadas para Partner Center

Valores seleccionados por el propietario y estado del portal (13-11-2026). Partner Center marcó como completadas las secciones de precio y disponibilidad, propiedades, clasificación por edades, paquetes, descripciones y opciones de envío. El envío está en proceso de certificación.

| Campo | Selección |
|---|---|
| Categoría principal | Food + dining |
| Idiomas de ficha | `es-ES` y `en-US`; el paquete declara ambos recursos |
| Precio | Gratis |
| Mercados | Todos los mercados que Partner Center permita seleccionar para esta aplicación |
| Website | Página pública del repositorio: `https://github.com/SenecaDPJ/Semana-al-plato` |
| Clasificación IARC | Cuestionario completado; clasificación IARC generada: 3+ |
| Capturas | Una captura con pie se cargó para cada ficha: `es-ES` y `en-US` |
| Términos adicionales de licencia | Enlace a la licencia MIT del repositorio aplicado: `https://github.com/SenecaDPJ/Semana-al-plato/blob/main/LICENSE` |
| Información personal | «Sí»: los datos que introduzca el usuario podrían incluirla; se guardan localmente y no se envían al servidor de la app |

En «Propiedades» se guardaron «Bares y restaurantes» (Food + dining), «Sí» con la URL de privacidad publicada `https://senecadpj.github.io/Semana-al-plato/`, Website `https://github.com/SenecaDPJ/Semana-al-plato` y soporte `https://github.com/SenecaDPJ/Semana-al-plato/issues/new`. Se permitió la instalación en unidades alternativas y se desactivaron las copias automáticas de OneDrive y la grabación de clips; las demás declaraciones y requisitos de hardware no se seleccionaron. Las fichas de ambos idiomas, el enlace MIT y las capturas con sus pies se completaron en el envío.

El propietario confirmó que el nombre «Semana al Plato» está reservado en Partner Center y proporcionó la identidad exacta de la tabla anterior, que coincide con el paquete. Autorizó distribuir `2.3.3.0` en Store una vez preparada; esa autorización se materializó en el envío 1. Partner Center mantiene ahora el paquete en proceso de certificación. La publicación se retuvo para que el propietario la inicie manualmente después de la aprobación.

La versión tradicional para descarga, [GitHub v2.3.3](https://github.com/SenecaDPJ/Semana-al-plato/releases/tag/v2.3.3), es un instalador NSIS independiente; no es el MSIX entregado a Store.

## Artefactos locales

Directorio ignorado por Git: `artifacts/msstore/2.3.3.0-x64-cleanbuild/`.

| Artefacto | SHA-256 | Uso |
|---|---|---|
| `Semana-al-Plato_2.3.3.0_x64.msix` | `C49FBE4F37E29A13115B5EB8253608AFC44D7444D64A530838301625E5D433EE` | Paquete Store, sin firma |
| `Semana-al-Plato_2.3.3.0_x64.msixupload` | `46BAD30118C6AA190CDA0123F11D9EB37D0922F5150B947AD9D3B81868A47835` | Archivo de envío local |
| `Semana-al-Plato_2.3.3.0_x64-LOCALTEST.msix` | `AF8FDF33F0F864B9FE145C41D5AA4E63E3444DCC8F2FF00C8102BD557A93AB34` | Firma de prueba; solo para la VM aislada |

El certificado público temporal usado para pruebas se retiró de `LocalMachine\TrustedPeople` de la VM al terminar: se eliminaron 6 certificados propios del editor de prueba y no queda ninguno de ellos en ese almacén. No había PFX ni clave privada. El MSIX Store y el `.msixupload` permanecen sin firmar.

## Repetir la compilación

En Windows x64 con Node 22, Rust estable y Windows SDK instalados, parte de un árbol Git limpio y ejecuta el [script de empaquetado](build-msix.ps1):

```powershell
.\docs\microsoft-store\build-msix.ps1 `
  -PackageIdentityName 'SenecaDPJ.Semanaalplato' `
  -PackageIdentityPublisher 'CN=6F3CA482-2B0E-4C58-95F1-BFA42598F4C9' `
  -PublisherDisplayName 'SenecaDPJ' `
  -OutputDirectory 'artifacts/msstore/2.3.3.0-x64-rebuild'
```

El directorio de salida debe ser nuevo. El script vuelve a generar el inventario y los artefactos sin firma; para instalar una prueba local se usa por separado `sign-msix-for-local-testing.ps1` y se confía su certificado público únicamente en la VM aislada.

## Comprobaciones

| Comprobación | Estado | Evidencia y alcance |
|---|---|---|
| `npm ci` y auditoría npm | **PASADO** | 41 paquetes instalados; 0 vulnerabilidades notificadas entre 42 paquetes auditados. |
| `npm test` | **PASADO** | 32/32 pruebas. |
| Compilación x64 y empaquetado MSIX | **PASADO** | Node 22.21.0, npm 10.9.4, Rust/Cargo 1.99.1, Tauri CLI 2.12.4 y MakeAppx 10.0.19041.5609; Windows 10.0.26300.0. La compilación adicional del instalador NSIS no completó porque su descarga de NSIS falló por DNS; no impidió generar MSIX. |
| Manifiesto e identidad | **PASADO** | Identidad, Publisher, versión `2.3.3.0`, x64 y mínimo coinciden con Partner Center y la configuración de la candidata. |
| Actualización `2.3.2.0 → 2.3.3.0` | **PASADO, alcance de archivos** | Windows 11 Enterprise LTSC Evaluation 24H2, cuenta de prueba con permisos de administrador, build 26100. El paquete terminó `Ok`; los 10 archivos bajo el directorio local de datos de la familia del paquete (98.304 bytes) conservaron sus SHA-256. Esto no sustituye la comprobación dentro de la interfaz. |
| Contenido de migración y persistencia en 2.3.3.0 | **PASADO** | El usuario confirmó que la etiqueta `2.3.3` y los registros `Café de migración` (Desayuno, lunes 9), `Tortilla de migración` (Comida, martes 10) y `Crema de prueba` (Cena, miércoles 11) aparecen tras la actualización; cerró y reabrió la aplicación y confirmó que persistían. |
| WACK 10.0.26100.9457 | **PASS GLOBAL; FALLO OPCIONAL EVALUADO** | Informe completo de la MSIX local firmada para prueba, versión `2.3.3.0`, SHA-256 `AF8FDF33F0F864B9FE145C41D5AA4E63E3444DCC8F2FF00C8102BD557A93AB34`; salida 0, `OVERALL_RESULT=PASS`, 23/24 pruebas PASADAS y ninguna obligatoria fallida. `DPIAwarenessValidation` pasó. `Ejecutables bloqueados` (`OPTIONAL=TRUE`) es la única prueba fallida. XML SHA-256: `EDAAD3F33894A15D9A9ADCFE2E1B5E202E1D1DD5A368839C13E3CF41087E706D`. |
| Microsoft Defender | **PASADO** | Análisis personalizado del directorio de artefactos, evento de finalización 1001; protección antivirus y en tiempo real activas, cero detecciones. Ejecutado en el anfitrión de desarrollo. |
| Primera apertura visual y persistencia en 2.3.3.0 | **PASADO** | El usuario abrió la candidata, confirmó la etiqueta y los tres registros, cerró y volvió a abrir; confirmó la persistencia y cerró la app. |
| Apertura, contenido y persistencia en perfil estándar | **PASADO, ALCANCE MANUAL INFORMADO** | El usuario abrió la versión 2.3.3.0 en una cuenta estándar, confirmó tres elementos, alternó tema oscuro/inglés y tema claro/español, cerró y volvió a abrir y confirmó persistencia. Las capturas limpias muestran el mismo calendario en ambos idiomas y temas. PowerShell Direct confirmó paquete `Ok`, 185 archivos/5.188.463 bytes en los datos del paquete y cero procesos de la app después de la prueba. No es una auditoría exhaustiva de todas las funciones. |
| Desinstalación y reinstalación de 2.3.3.0 | **PASADO, ALCANCE DE DATOS** | En la cuenta de prueba con permisos de administrador, `Remove-AppxPackage` quitó el MSIX. Desapareció el directorio de datos de la familia del paquete (10 archivos, 98.304 bytes); el perfil Tauri/WebView2 externo permaneció: 175 archivos y 5.079.996 bytes. Se reinstaló 2.3.3.0 (`Ok`); los 175 archivos conservaron los hashes anteriores a la desinstalación. La copia de seguridad y los manifiestos quedan en la VM, no en Git. |
| Comprobación tras reinstalar en perfil administrador | **PASADO** | Tras reiniciar la VM, PowerShell Direct confirmó el paquete `2.3.3.0`, estado `Ok` y la app cerrada; el directorio de datos del paquete tenía 2 archivos/8.192 bytes y el perfil externo Tauri/WebView2, 175 archivos/5.079.996 bytes. Coincidieron los hashes de los 175 archivos externos previos a la desinstalación. Después, el usuario abrió la app y confirmó la versión y los tres registros, cambió tema e idioma, cerró y volvió a abrir; confirmó persistencia y cerró de nuevo. |
| Certificado temporal de pruebas | **PASADO, RETIRADO** | Tras finalizar las pruebas, se eliminaron de `LocalMachine\TrustedPeople` de la VM seis certificados autofirmados del editor de pruebas; la comprobación final no encontró ninguno restante. No se usó ni quedó clave privada en ese almacén. |
| Punto de control previo a desinstalar | **PASADO** | El usuario creó un punto de control de Hyper-V antes de la prueba. |
| Revisión de licencias y autorización | **REVISIÓN MANUAL CONFIRMADA; AUTORIZACIÓN CONDICIONAL OTORGADA** | Inventario técnico: 247 crates, 443 archivos de licencia y 7 textos suplementarios de 6 crates. El propietario confirmó haber completado la revisión manual de licencias, cabeceras de copyright y `NOTICE`, y autorizó distribuir la versión `2.3.3.0` en Store cuando termine la preparación. |
| Capturas de ficha | **CARGADAS, UNA POR IDIOMA** | Se cargó una captura PNG con pie en cada ficha, tomada de la aplicación 2.3.3.0 en el perfil estándar y copiada sin modificar; no contiene marco de VM ni marca de evaluación. Inglés/oscuro: `Store-screenshot-en-2.3.3.0.png`, 1393 × 977, 120.409 bytes, SHA-256 `506BBFEA81BD202B1E99EA01AA3B1FEC71D0CE4D1A6A5EDF8215BE74B789DB24`. Español/claro: `Store-screenshot-es-ES-2.3.3.0.png`, 1395 × 981, 150.966 bytes, SHA-256 `1CB7376B94A39FEE65156C63D62A508055DF0A93AE1936FECEE75400A6E026F4`. Los archivos de origen están en la carpeta local de entrega, fuera de Git. |
| Envío y certificación de Microsoft Store | **EN PROCESO; DECISIÓN PENDIENTE** | El envío 1 aparece en Partner Center como «En proceso de certificación» y la última evidencia muestra preprocesamiento. Aún no hay aprobación ni publicación. Tras aprobarse, el propietario debe seleccionar «Publicar ahora». |

Los informes completos de WACK y las salidas de instalación están en la carpeta local de artefactos, fuera del repositorio; contienen nombres y rutas internas de la VM. El informe local final `vm-2.3.3.0-post-reinstall-readonly-20261112.json` tiene SHA-256 `0D8699B89B4F38DD5375EF9DC54CABA131FEA37CEE1E631D1016533177BDB7F4`; no contiene credenciales ni información privada de cuentas. El manifiesto de capturas local registra dimensiones, tamaños y hashes. La política de privacidad existente no se cambió porque esta revisión solo alinea la etiqueta y versión del paquete y no cambia el comportamiento de datos.

### Evaluación del hallazgo opcional de WACK

El XML de 2.3.3.0 enumera referencias a `kernel32.dll!CreateProcessW`, `shell32.dll!ShellExecuteW` y las cadenas `basH`, `cmd`, `cmd.exe`, `\cmd.exe` y `reG`. La inspección de las fuentes de la aplicación encontró una llamada directa a `ShellExecuteW` que abre la URL del perfil de GitHub después de pedir confirmación; no encontró llamadas directas a `CreateProcessW`, `cmd.exe` ni `std::process::Command`. El resto de las referencias del binario no se ha atribuido a un sitio de llamada y no se clasifica como falso positivo.

Microsoft describe las pruebas opcionales de Desktop Bridge como informativas y señala que no se usan para evaluar la incorporación a Store. La prueba `Blocked executables` está orientada a riesgos de compatibilidad con Windows 10 S; su documentación recomienda identificar y retirar llamadas que lancen ejecutables ajenos a la aplicación. Por ello, el resultado opcional se evaluó y no bloquea esta preparación, pero la atribución incompleta queda registrada. [Documentación oficial de Microsoft sobre pruebas Desktop Bridge](https://learn.microsoft.com/en-us/windows/uwp/debug-test-perf/windows-desktop-bridge-app-tests). WACK no equivale a certificación de Store.

## Estado de envío y siguiente hito

La preparación del envío está completa y el paquete se entregó a Microsoft. **Pendiente externo:** esperar la decisión de certificación de Microsoft en Partner Center. No publicar automáticamente: si se aprueba, el propietario debe seleccionar «Publicar ahora». Hasta entonces, la aplicación no está disponible en Microsoft Store.

La prueba funcional respalda Windows 11 Enterprise LTSC Evaluation 24H2 x64 build 26100.1742; no demuestra compatibilidad con otras ediciones ni builds. WACK es una comprobación local; la certificación oficial solo ocurre tras enviar el paquete desde Partner Center.
