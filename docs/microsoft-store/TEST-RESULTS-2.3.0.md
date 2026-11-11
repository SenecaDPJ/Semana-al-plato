# Resumen de pruebas — candidata 2.3.0.0

Actualizado el 11 de noviembre de 2026.

La versión de prueba 2.3.0 incorpora el movimiento por arrastre de selecciones múltiples dentro de la semana visible.

## Compilación y paquete

- **Origen:** [GitHub Actions, ejecución 9](https://github.com/SenecaDPJ/semana-al-plato/actions/runs/42812887051), commit `888f95cf7440911c84c1e42ff7a8e3323eb3b6cb`.
- **Paquete:** 2.3.0.0, x64. La versión mínima declarada es Windows 11, compilación 26100.1742.
- **MSIX sin firmar para Store — SHA-256:** `E695F60F086E95A2D6FCAF1AD48B0D1FAD27824132E7AD5AEB1DEC7B2F97E2C6`.
- **Archivo .msixupload — SHA-256:** `27B2D0C57D76C632581C84E93E72977B5923BABF47678CDFD4FC0AE6CEB20B8B`.
- El MSIX de Store permanece sin firmar, como corresponde antes de la certificación/publicación; Microsoft firma el paquete al distribuirlo desde Store. No se ha subido el paquete a Partner Center ni se ha publicado una release.
- El paquete incluye `THIRD-PARTY-NOTICES.txt`, el inventario CSV y el resumen JSON de licencias.

## Comprobaciones

- **Instalación y actualización aisladas:** la versión 2.2.0.0 se instaló en el perfil estándar de la VM Windows 11 Enterprise LTSC Evaluation 24H2 (compilación 26100.1742). El registro de AppX confirma una actualización correcta de 2.2.0.0 a 2.3.0.0 (eventos 855 y 400). El usuario comprobó después el calendario, el cambio de idioma y tema, y la persistencia al cerrar y volver a abrir. La VM conserva la instalación 2.3.0.0 de prueba; no se restauró a un checkpoint tras las comprobaciones más recientes.
- **Reintento de la misma versión:** una operación posterior intentó instalar otro MSIX con la misma identidad y versión 2.3.0.0 pero contenido distinto; Windows lo rechazó con `0x80073CFB`. El payload rechazado tenía SHA-256 `654FC69721F9E8250A72A2ED58F8343DB724DFC06DB0CC1687FB49B4A27E2BCC`. Este error separado no invalida la actualización 2.2.0.0 → 2.3.0.0 que sí terminó correctamente; los artefactos de una versión deben mantenerse inmutables y un cambio de contenido debe usar una versión superior.
- **Pruebas manuales:** el usuario confirmó el movimiento de elementos seleccionados, el cambio entre español e inglés y la persistencia tras cerrar y volver a abrir la aplicación.
- **Microsoft Defender:** análisis del paquete MSIX de Store, del archivo .msixupload y del MSIX de prueba completados sin detecciones.
- **WACK 10.0.26100.9457:** informe completo (`PARTIAL_RUN=FALSE`) con resultado global **PASS**; pasaron 23 de 24 pruebas. La única fallida fue «Ejecutables bloqueados», marcada como opcional (`OPTIONAL=TRUE`); no hubo fallos obligatorios. El MSIX local firmado para pruebas que se examinó tenía SHA-256 `80FA9361CEC46617546784A69194869AF389FAF15CE73BD5172C0A7B50DC8222`, versión `2.3.0.0` y mínimo `10.0.26100.1742`. Informe `WACK-2.3.0.0-LTSC26100-20261110-035131.xml`, SHA-256 `8A81968F71741F84A5C6C7511A090F86F3F4FCBDE6061F195C4CD9B49469888E`; `reset=0` y `test=0`. WACK se ejecutó sobre este MSIX de pruebas, no sobre el MSIX Store sin firma.
- **Revisión del hallazgo WACK:** la inspección del PE `SemanaAlPlato.exe` confirma que su tabla de importación incluye `kernel32.dll!CreateProcessW` y `shell32.dll!ShellExecuteW`. En el código propio solo se encontró una llamada directa a `ShellExecuteW`, para abrir el perfil de GitHub después del consentimiento del usuario; no se encontraron llamadas directas a `CreateProcessW`, `cmd.exe` ni `std::process::Command`. El ejecutable contiene la cadena de compatibilidad de Rust para comandos por lotes que incluye `cmd.exe`, y `reG` aparece dentro de metadatos de rutas `registry` incrustadas. Esas observaciones explican coincidencias del análisis estático, pero no demuestran que se ejecuten. La importación de `CreateProcessW` y los fragmentos cortos restantes no tienen una atribución completa; no se etiquetan como falsos positivos.
- **Licencias:** el inventario abarca 247 dependencias Rust y registra 440 copias de archivos de licencia en los materiales de revisión; se añadieron 7 textos complementarios para 6 paquetes. No se detectaron paquetes sin expresión o texto de licencia, pero los 247 paquetes aún requieren revisión legal manual. La revisión legal está incompleta; esto no constituye una conclusión de que todas las licencias permitan la distribución.
- Microsoft describe las pruebas opcionales de Desktop Bridge como informativas y dice que no se usan para evaluar la incorporación a Store. «Ejecutables bloqueados» busca riesgos de compatibilidad con Windows 10 S; su resultado por sí solo no determina la certificación. [Documentación de Microsoft sobre las pruebas Desktop Bridge](https://learn.microsoft.com/en-us/windows/uwp/debug-test-perf/windows-desktop-bridge-app-tests).
- Estas comprobaciones locales no equivalen a la certificación de Microsoft Store. No se ha publicado una release ni se ha enviado la aplicación a certificación.

# Test summary — 2.3.0.0 candidate

Updated 11 November 2026.

Test version 2.3.0 adds drag-to-move for multi-selections within the displayed week.

## Build and package

- **Source:** [GitHub Actions run 9](https://github.com/SenecaDPJ/semana-al-plato/actions/runs/42812887051), commit `888f95cf7440911c84c1e42ff7a8e3323eb3b6cb`.
- **Package:** 2.3.0.0, x64. The declared minimum is Windows 11 build 26100.1742.
- **Unsigned Store MSIX — SHA-256:** `E695F60F086E95A2D6FCAF1AD48B0D1FAD27824132E7AD5AEB1DEC7B2F97E2C6`.
- **.msixupload file — SHA-256:** `27B2D0C57D76C632581C84E93E72977B5923BABF47678CDFD4FC0AE6CEB20B8B`.
- The Store MSIX is unsigned, as expected before certification/publication; Microsoft signs the package when distributing it through the Store. The package has not been uploaded to Partner Center and no release has been published.
- The package includes `THIRD-PARTY-NOTICES.txt`, the CSV inventory, and the JSON license summary.

## Checks

- **Isolated installation and update:** version 2.2.0.0 was installed for the VM's standard test profile on Windows 11 Enterprise LTSC Evaluation 24H2 (build 26100.1742). The AppX deployment log confirms a successful update from 2.2.0.0 to 2.3.0.0 (events 855 and 400). The user then checked the calendar, language and theme switching, and persistence after closing and reopening the app. The VM still has the 2.3.0.0 test installation; it was not restored to a checkpoint after the latest checks.
- **Same-version retry:** a later operation tried to install a different MSIX with the same 2.3.0.0 identity/version; Windows rejected it with `0x80073CFB`. The rejected payload had SHA-256 `654FC69721F9E8250A72A2ED58F8343DB724DFC06DB0CC1687FB49B4A27E2BCC`. This separate error does not invalidate the successful 2.2.0.0 → 2.3.0.0 update; artifacts for a version must remain immutable, and changed content needs a higher version.
- **Manual checks:** the user confirmed moving selected entries, switching between Spanish and English, and persistence after closing and reopening the app.
- **Microsoft Defender:** scans of the Store MSIX, the .msixupload file, and the test MSIX completed with no detections.
- **WACK 10.0.26100.9457:** the complete report (`PARTIAL_RUN=FALSE`) has overall result **PASS**; 23 of 24 tests passed. The only failure was **Blocked Executables**, marked optional (`OPTIONAL=TRUE`); no required tests failed. The locally test-signed MSIX examined had SHA-256 `80FA9361CEC46617546784A69194869AF389FAF15CE73BD5172C0A7B50DC8222`, version `2.3.0.0`, and minimum `10.0.26100.1742`. Report `WACK-2.3.0.0-LTSC26100-20261110-035131.xml`, SHA-256 `8A81968F71741F84A5C6C7511A090F86F3F4FCBDE6061F195C4CD9B49469888E`; `reset=0` and `test=0`. WACK ran against this test MSIX, not the unsigned Store MSIX.
- **Review of the WACK finding:** inspection of the `SemanaAlPlato.exe` PE confirms its import table includes `kernel32.dll!CreateProcessW` and `shell32.dll!ShellExecuteW`. The application source contains one direct call to `ShellExecuteW`, to open the GitHub profile after user consent; no direct calls to `CreateProcessW`, `cmd.exe`, or `std::process::Command` were found in the application's own source. The executable contains Rust batch-command compatibility text that includes `cmd.exe`, and `reG` occurs within embedded `registry` path metadata. These observations explain static matches but do not prove runtime execution. The `CreateProcessW` import and the remaining short matches are not fully attributed; they are not labelled false positives.
- **Licenses:** the inventory covers 247 Rust dependencies and lists 440 license-file copies in the review materials; 7 supplemental license texts were added for 6 packages. No package was found without a license expression or license text, but all 247 packages still require manual legal review. Legal review is incomplete; this is not a conclusion that every license permits distribution.
- Microsoft describes the optional Desktop Bridge tests as informational and says they are not used to evaluate Store onboarding. **Blocked Executables** checks for Windows 10 S compatibility risks; this result alone does not determine certification. See [Microsoft's Desktop Bridge app tests](https://learn.microsoft.com/en-us/windows/uwp/debug-test-perf/windows-desktop-bridge-app-tests).
- These local checks are not Microsoft Store certification. No release has been published and the app has not been submitted for certification.
