# Estado de preparación MSIX 2.3.1.0

> **Registro histórico, sustituido el 12-11-2026 por la candidata 2.3.2.0.** Los estados pendientes que siguen describen la planificación de 2.3.1.0 antes de generar la nueva versión; no son el estado actual. Consulta [el informe 2.3.2.0](STORE-CANDIDATE-2.3.2.0.es.md).

**Fecha:** 12 de noviembre de 2026  
**Estado:** EN PREPARACIÓN LOCAL. No es una entrega certificada ni lista para enviar.

## Motivo y alcance

Se incrementa la versión de producto de 2.3.0 a 2.3.1 para crear un payload nuevo e inmutable. La candidata anterior omitía tres textos legales anidados del árbol fuente Cargo; el exportador se corrigió para recogerlos recursivamente y conservar sus rutas. La matriz de 247 paquetes y el barrido de cabeceras están en los informes 2.3.0.0, que describen el mismo grafo de dependencias (el cambio de versión no añade ni actualiza dependencias).

Textos que deben aparecer en el inventario y en `THIRD-PARTY-NOTICES.txt` de esta candidata:

- `regex-syntax 0.8.11`: `src/unicode_tables/LICENSE-UNICODE`.
- `tracing-core 0.1.36`: `src/spin/LICENSE`.
- `rfd 0.17.2`: `src/backend/xdg_desktop_portal/window_identifier/LICENSE` (backend de Linux, incluido de forma conservadora).

El contenido de licencias es material de atribución; no implica que se haya concedido autorización legal para distribuir el producto. El informe de cribado, la matriz por crate y el barrido de menciones de cabecera siguen requiriendo revisión humana final y autorización del titular o asesoría competente.

## Identificación de la candidata

| Campo | Valor |
|---|---|
| Producto / versión MSIX | Semana al Plato / `2.3.1.0` |
| Arquitectura | x64 (`x86_64-pc-windows-msvc`) |
| Identidad | `SenecaDPJ.Semanaalplato` |
| Publisher | `CN=6F3CA482-2B0E-4C58-95F1-BFA42598F4C9` |
| Publisher visible | `SenecaDPJ` |
| MinVersion | `10.0.26100.1742` |
| Firma del paquete Store | Sin firmar; Microsoft firma tras la certificación/publicación |
| Versión de origen | `feature/v2.3.0-move-selected-entries`; commit se registrará tras preparar la fuente |

## Verificaciones de esta versión

| Comprobación | Estado | Evidencia |
|---|---|---|
| Compilación limpia y pruebas automatizadas | NO EJECUTADO | Pendiente de compilar esta revisión |
| Generación del inventario de licencias / 247 crates | NO EJECUTADO | Debe incluir los tres textos anidados y el escaneo de cabeceras |
| Creación de MSIX y `.msixupload` | NO EJECUTADO | El paquete anterior no se reutiliza |
| SHA-256 de artefactos | NO EJECUTADO | Se anotará después de generar los archivos |
| Instalación/actualización en LTSC 24H2 y comprobación de datos | NO EJECUTADO | Las pruebas previas corresponden a 2.3.0.0; ejecutar 2.3.1.0 en la VM |
| Microsoft Defender | NO EJECUTADO | Analizar el Store MSIX, el `.msixupload` y el paquete firmado de prueba |
| WACK | NO EJECUTADO | El resultado de 2.3.0.0 no se traslada a esta versión |
| Certificación de Microsoft Store | NO EJECUTADO | No se enviará dentro de este encargo |

## Pendiente antes de subir a Partner Center

- Revisar por una persona las atribuciones/derechos de los avisos de terceros y las 1.630 menciones candidatas de cabeceras; obtener la autorización legal necesaria para la distribución.
- Repetir compilación, pruebas automatizadas, instalación/actualización, persistencia, Defender y WACK sobre los artefactos exactos 2.3.1.0. Revisar el fallo opcional WACK de ejecutables bloqueados con el detalle del informe; no declararlo falso positivo solo por ser opcional.
- Preparar capturas reales actuales en español e inglés y confirmar que representan la versión que se enviará.
- Verificar por HTTP la URL de privacidad ya publicada en GitHub Pages; confirmar contacto, categoría, clasificación por edades, mercados, disponibilidad/precio y restantes campos de Partner Center.
- Confirmar que el manifiesto, la identidad de Partner Center y el número de versión siguen coincidiendo al subir.

No se ha creado una release, cambiado la visibilidad del repositorio ni enviado la aplicación a certificación.
