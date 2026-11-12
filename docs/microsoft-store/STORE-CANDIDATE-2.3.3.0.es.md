# Estado de preparación MSIX 2.3.3.0

**Fecha:** 12 de noviembre de 2026

**Estado:** paquete creado y actualizado en la VM LTSC; WACK terminó con `OVERALL_RESULT=PASS` y un único fallo opcional. Falta abrir 2.3.3.0 en la VM y confirmar visualmente la versión y los datos tras la actualización. No se ha publicado una release ni enviado el paquete a Partner Center.

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

## Artefactos locales

Directorio ignorado por Git: `artifacts/msstore/2.3.3.0-x64-cleanbuild/`.

| Artefacto | SHA-256 | Uso |
|---|---|---|
| `Semana-al-Plato_2.3.3.0_x64.msix` | `C49FBE4F37E29A13115B5EB8253608AFC44D7444D64A530838301625E5D433EE` | Paquete Store, sin firma |
| `Semana-al-Plato_2.3.3.0_x64.msixupload` | `46BAD30118C6AA190CDA0123F11D9EB37D0922F5150B947AD9D3B81868A47835` | Archivo de envío local |
| `Semana-al-Plato_2.3.3.0_x64-LOCALTEST.msix` | `AF8FDF33F0F864B9FE145C41D5AA4E63E3444DCC8F2FF00C8102BD557A93AB34` | Firma de prueba; solo para la VM aislada |

El certificado público temporal (`7CCE1273649D6287C12B98B963CD73FE769CB64B`, vence el 26-11-2026) está en `LocalMachine\TrustedPeople` de la VM. No hay PFX ni clave privada. Se retirará al terminar las pruebas. El MSIX Store y el `.msixupload` permanecen sin firmar.

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
| WACK 10.0.26100.9457 | **PASADO CON FALLO OPCIONAL** | Informe completo, salida 0, `OVERALL_RESULT=PASS`, 23/24 pruebas PASADAS. `DPIAwarenessValidation` pasó. La única prueba fallida es `Ejecutables bloqueados`, marcada `OPTIONAL=TRUE`; no se presenta como una certificación. SHA-256 del XML: `EDAAD3F33894A15D9A9ADCFE2E1B5E202E1D1DD5A368839C13E3CF41087E706D`. |
| Microsoft Defender | **PASADO** | Análisis personalizado del directorio de artefactos, evento de finalización 1001; protección antivirus y en tiempo real activas, cero detecciones. Ejecutado en el anfitrión de desarrollo. |
| Primera apertura visual y persistencia en 2.3.3.0 | **PASADO** | El usuario abrió la candidata, confirmó la etiqueta y los tres registros, cerró y volvió a abrir; confirmó la persistencia y cerró la app. |
| Registro de 2.3.3.0 en perfil estándar | **PASADO, SOLO REGISTRO** | PowerShell Direct tras reiniciar la VM confirmó que es una cuenta estándar y que 2.3.3.0 figura `Ok`, con 185 archivos/5.188.463 bytes en su directorio de datos del paquete; no había un proceso de la app. Falta apertura interactiva, confirmación visual del contenido y persistencia tras cerrar/abrir. |
| Desinstalación y reinstalación de 2.3.3.0 | **PASADO, ALCANCE DE DATOS** | En la cuenta de prueba con permisos de administrador, `Remove-AppxPackage` quitó el MSIX. Desapareció el directorio de datos de la familia del paquete (10 archivos, 98.304 bytes); el perfil Tauri/WebView2 externo permaneció: 175 archivos y 5.079.996 bytes. Se reinstaló 2.3.3.0 (`Ok`); los 175 archivos conservaron los hashes anteriores a la desinstalación. La copia de seguridad y los manifiestos quedan en la VM, no en Git. Falta confirmar visualmente los registros tras esta reinstalación. |
| Comprobación tras reinstalar y reiniciar la VM | **PASADO, SOLO ESTADO DEL PAQUETE** | PowerShell Direct confirmó en el perfil administrador el paquete `2.3.3.0`, estado `Ok` y la app cerrada; el directorio de datos del paquete tiene 2 archivos/8.192 bytes y el perfil externo Tauri/WebView2, 175 archivos/5.079.996 bytes. Coinciden los hashes de los 175 archivos externos previos a la desinstalación. Esto no confirma que los registros se muestren tras reinstalar; queda pendiente la comprobación visual. El perfil estándar también mantiene 2.3.3.0, estado `Ok`, 185 archivos/5.188.463 bytes, y la app no estaba abierta. |
| Punto de control previo a desinstalar | **PASADO** | El usuario creó un punto de control de Hyper-V antes de la prueba. |
| Revisión de licencias y avisos | **REVISIÓN MANUAL CONFIRMADA POR EL PROPIETARIO** | Inventario técnico: 247 crates, 443 archivos de licencia y 7 textos suplementarios de 6 crates. El propietario indicó haber completado la revisión manual de licencias, cabeceras de copyright y `NOTICE`. La autorización legal final para distribuir sigue siendo una decisión del propietario. |
| Certificación de Microsoft Store | **NO EJECUTADA** | No se envió el paquete a Partner Center. |

Los informes completos de WACK y las salidas de instalación están en la carpeta local de artefactos, fuera del repositorio; contienen nombres y rutas internas de la VM. El resumen conservado en este documento no incluye esos datos. La consulta del estado tras reinstalar se guarda fuera del repositorio en `vm-2.3.3.0-post-reinstall-readonly-20261112.json` y solo contiene recuentos y estados. La política de privacidad existente no se cambió porque esta revisión solo alinea la etiqueta y versión del paquete y no cambia el comportamiento de datos.

## Pendiente para completar la preparación

1. Abrir la reinstalación 2.3.3.0 en la cuenta administradora y confirmar que los tres registros siguen visibles.
2. Iniciar sesión en la cuenta de prueba estándar, abrir la app registrada para ese perfil y confirmar versión, contenido y persistencia tras cerrar/abrir.
3. Retirar el certificado público de prueba de `TrustedPeople` en la VM una vez terminadas las pruebas.
4. Completar las capturas reales en español e inglés, decidir los campos de ficha restantes en Partner Center y confirmar la autorización legal de distribución.

No se presenta la candidata como validada en otras ediciones de Windows ni como lista para envío mientras queden esas tareas. WACK es una comprobación local; la certificación oficial solo ocurre tras enviar el paquete desde Partner Center.
