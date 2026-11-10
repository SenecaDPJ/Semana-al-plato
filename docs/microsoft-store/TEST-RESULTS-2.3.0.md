# Resumen de pruebas — candidata 2.3.0.0

Actualizado el 10 de noviembre de 2026.

La versión de prueba 2.3.0 incorpora el movimiento por arrastre de selecciones múltiples dentro de la semana visible.

- **Pruebas manuales:** el usuario confirmó el movimiento de elementos seleccionados, el cambio entre español e inglés y la persistencia tras cerrar y volver a abrir la aplicación.
- **Microsoft Defender:** el análisis del paquete de prueba terminó sin detecciones.
- **WACK:** informe completo con resultado global **PASS**; pasaron 23 de 24 pruebas. La única fallida fue «Ejecutables bloqueados», marcada como opcional. No hubo fallos obligatorios.
- **Revisión del hallazgo WACK:** el análisis de los bytes del paquete probado confirma referencias a `ShellExecuteW` y `CreateProcessW`. El código de la aplicación solo llama directamente a `ShellExecuteW`, para abrir el perfil de GitHub después del consentimiento del usuario; no se encontraron llamadas a `CreateProcessW`, `cmd.exe` ni `std::process::Command` en el código propio. El ejecutable contiene la cadena de compatibilidad de Rust para comandos por lotes que incluye `cmd.exe`, y `reG` aparece dentro de metadatos de rutas `registry` incrustadas. Esas observaciones explican coincidencias del análisis estático, pero no demuestran que se ejecuten. La importación de `CreateProcessW` y los fragmentos cortos restantes no tienen una atribución completa; no se etiquetan como falsos positivos.
- Microsoft describe las pruebas opcionales de Desktop Bridge como informativas y dice que no se usan para evaluar la incorporación a Store. «Ejecutables bloqueados» busca riesgos de compatibilidad con Windows 10 S; su resultado por sí solo no determina la certificación. [Documentación de Microsoft sobre las pruebas Desktop Bridge](https://learn.microsoft.com/en-us/windows/uwp/debug-test-perf/windows-desktop-bridge-app-tests).
- Estas comprobaciones locales no equivalen a la certificación de Microsoft Store. No se ha publicado una release ni se ha enviado la aplicación a certificación.

# Test summary — 2.3.0.0 candidate

Updated 10 November 2026.

Test version 2.3.0 adds drag-to-move for multi-selections within the displayed week.

- **Manual checks:** the user confirmed moving selected entries, switching between Spanish and English, and persistence after closing and reopening the app.
- **Microsoft Defender:** the test package scan completed with no detections.
- **WACK:** complete report with overall result **PASS**; 23 of 24 tests passed. The only failure was **Blocked Executables**, marked optional. No required tests failed.
- **Review of the WACK finding:** inspection of the tested package bytes confirms references to `ShellExecuteW` and `CreateProcessW`. The application source directly calls only `ShellExecuteW`, to open the GitHub profile after user consent; no calls to `CreateProcessW`, `cmd.exe`, or `std::process::Command` were found in the application’s own source. The executable contains Rust batch-command compatibility text that includes `cmd.exe`, and `reG` occurs within embedded `registry` path metadata. These observations explain static matches but do not prove runtime execution. The `CreateProcessW` import and the remaining short matches are not fully attributed; they are not labelled false positives.
- Microsoft describes the optional Desktop Bridge tests as informational and says they are not used to evaluate Store onboarding. **Blocked Executables** checks for Windows 10 S compatibility risks; this result alone does not determine certification. See [Microsoft’s Desktop Bridge app tests](https://learn.microsoft.com/en-us/windows/uwp/debug-test-perf/windows-desktop-bridge-app-tests).
- These local checks are not Microsoft Store certification. No release has been published and the app has not been submitted for certification.
