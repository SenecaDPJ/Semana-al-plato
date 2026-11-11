# Microsoft Store WACK result summary — 2.3.0.0

**Date:** 11 November 2026

**Audience:** public, sanitized test summary

## English

The Windows App Certification Kit (WACK) 10.0.26100.9457 completed a full run against a locally test-signed x64 MSIX candidate, version 2.3.0.0, on Windows 11 Enterprise LTSC Evaluation 24H2 x64, build 26100.1742. The package declared minimum OS version 10.0.26100.1742.

**Result: PASS overall.** 23 of 24 checks passed. The only failure was the optional **Blocked Executables** check; no required checks failed. WACK is a pre-submission tool and this result is not Microsoft Store certification.

The optional report listed CreateProcessW and ShellExecuteW, plus several short binary string fragments. The application source uses ShellExecuteW to open the developer's GitHub profile only after the user confirms. Static inspection found a CreateProcessW call consistent with Rust standard-library process support. The compiler commit embedded in the binary maps to the [Rust Windows process implementation](https://github.com/rust-lang/rust/blob/58cf8f9c35b355199727627d07ae34a4e2846d67/library/std/src/sys/process/windows.rs), where Command::spawn calls CreateProcessW and the command-prompt helper constructs a cmd.exe path. The binary has no debug symbols, so the calling dependency and runtime reachability could not be established. The finding is therefore not classified as a false positive.

This result applies to the locally test-signed candidate, not a Microsoft-signed Store package. It does not predict Partner Center's certification decision.

## Español

Windows App Certification Kit (WACK) 10.0.26100.9457 terminó una ejecución completa sobre una candidata MSIX x64 firmada localmente para pruebas, versión 2.3.0.0, en Windows 11 Enterprise LTSC Evaluation 24H2 x64, compilación 26100.1742. El paquete declaraba como versión mínima del sistema 10.0.26100.1742.

**Resultado: PASS global.** Pasaron 23 de 24 comprobaciones. La única que falló fue la comprobación opcional **Ejecutables bloqueados**; no hubo fallos en las comprobaciones obligatorias. WACK es una herramienta previa al envío y este resultado no equivale a la certificación de Microsoft Store.

El informe opcional enumeró CreateProcessW y ShellExecuteW, además de varios fragmentos binarios cortos. El código de la aplicación usa ShellExecuteW para abrir el perfil de GitHub del desarrollador solo después de que la persona lo confirma. La inspección estática encontró una llamada a CreateProcessW coherente con el soporte de procesos de la biblioteca estándar de Rust. El commit del compilador incluido en el binario corresponde a la [implementación de procesos de Rust para Windows](https://github.com/rust-lang/rust/blob/58cf8f9c35b355199727627d07ae34a4e2846d67/library/std/src/sys/process/windows.rs), donde Command::spawn llama a CreateProcessW y la función auxiliar del símbolo del sistema forma una ruta a cmd.exe. El binario no tiene símbolos de depuración, por lo que no se pudo determinar qué dependencia realiza la llamada ni demostrar que la ruta sea alcanzable en ejecución. Por eso el hallazgo no se clasifica como falso positivo.

Este resultado corresponde a la candidata firmada localmente para pruebas, no a un paquete de Store firmado por Microsoft. No permite anticipar la decisión de certificación de Partner Center.
