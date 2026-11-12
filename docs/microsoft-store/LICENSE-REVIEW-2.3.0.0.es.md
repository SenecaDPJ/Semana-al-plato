# Revisión manual de licencias Rust — candidata MSIX 2.3.0.0 x64

> **Informe histórico de la candidata 2.3.0.0.** Para el estado de los avisos en el paquete 2.3.2.0, la confirmación del propietario sobre la revisión manual de cabeceras y las decisiones aún pendientes, consulta [la actualización 2.3.2.0](LICENSE-REVIEW-UPDATE-2.3.2.0.es.md). Las conclusiones de este informe describen la candidata 2.3.0.0, no el paquete actual.

**Estado: cribado técnico de expresiones y textos completado para los 247 registros; autorización legal de distribución NO completada.** Este documento no es un dictamen jurídico, no confirma compatibilidad de todas las licencias entre sí y no declara que el paquete esté autorizado para publicarse.

## Alcance y material revisado

- Candidata: versión de producto `2.3.0`, paquete `2.3.0.0`, x64, objetivo `x86_64-pc-windows-msvc`.
- Origen: [Actions run 42812887051](https://github.com/SenecaDPJ/semana-al-plato/actions/runs/42812887051), commit `888f95cf7440911c84c1e42ff7a8e3323eb3b6cb`.
- MSIX Store sin firmar: `Semana-al-Plato_2.3.0.0_x64.msix`, SHA-256 `E695F60F086E95A2D6FCAF1AD48B0D1FAD27824132E7AD5AEB1DEC7B2F97E2C6`.
- Se contrastaron las 247 filas de `CARGO-LICENSE-INVENTORY.csv`, sus expresiones literales y los nombres de archivo incluidos; se comprobó la presencia de cada ruta con el separador `;` normalizado. Los 440 archivos del inventario de la candidata (incluidos los 7 suplementos) se agruparon por SHA-256: 168 contenidos distintos. Se comprobó que los 168 textos completos aparecen en `THIRD-PARTY-NOTICES.txt` tras normalizar finales de línea. La auditoría posterior de los fuentes detectó tres textos legales anidados que ese inventario no incluía; véase la sección de fuentes. Las filas individuales están en [LICENSE-REVIEW-2.3.0.0-CRATES.csv](LICENSE-REVIEW-2.3.0.0-CRATES.csv).
- Hashes de los materiales del artefacto: inventario `1CC3DA8B2974F8523345E6DE01B1D1B0A2FB32BDE0C2C9B279F947A678E38BE4`; resumen JSON `081359A26C0F651D1591596D47D3EE294C8C24A19996BDF330BCC5C3B78756A1`; avisos agregados `0797705C250E2FB800D1685733CA14B81169B538C32BE8C88D745ED7BC7BA261`.

## Resultado del cribado

| Control | Resultado | Evidencia |
|---|---|---|
| Filas de paquetes/versión del grafo x64 | **247 revisadas** | CSV del artefacto; 239 nombres de crate distintos |
| Expresión de licencia declarada | **247/247 presente** | Resumen JSON: cero expresiones ausentes |
| Archivos declarados en el inventario de la candidata | **247/247** | 440 rutas declaradas; sus 168 textos distintos aparecen completos en los avisos agregados. La auditoría recursiva encontró tres textos legales fuente adicionales que faltan en la candidata. |
| Textos suplementarios | **7 de los 440 textos, para 6 paquetes** | `license-supplements/SOURCES.md`; se verificaron las revisiones VCS publicadas y el cotejo de textos de los seis paquetes |
| GPL/LGPL/AGPL declaradas en los metadatos | **Ninguna** | Solo describe expresiones Cargo declaradas; no es análisis del código distribuido |
| Autorización jurídica para distribuir | **NO COMPLETADA** | Requiere resolver los puntos de la sección siguiente |

El JSON incorporado se generó antes de esta revisión: aún contiene `PackagesRequiringManualLicenseReview=247`. Ese contador refleja el estado de compilación y no se actualizó; el cribado técnico actual queda trazado en este informe y la matriz. `LegalReviewComplete=false` sigue siendo correcto mientras queden pendientes los requisitos de distribución y la autorización jurídica. No se cambió ni se regeneró el MSIX.

Las expresiones más frecuentes son `MIT OR Apache-2.0` (120), `MIT` (44), `Apache-2.0 OR MIT` (28), `Unicode-3.0` (18), `Unlicense OR MIT` (8) y `MPL-2.0` (5). El número 18 corresponde a la expresión literal exacta; `unicode-ident` añade un caso compuesto `(MIT OR Apache-2.0) AND Unicode-3.0`, por lo que 19 filas contienen obligaciones Unicode. Cargo define `OR` como elección de una alternativa y `AND` como cumplimiento simultáneo; el campo debe ser una expresión SPDX. Cargo marca el separador `/` como obsoleto, mientras que la guía de estilo de Rust documenta que se usa por convención en lugar de `OR` ([Cargo](https://doc.rust-lang.org/cargo/reference/manifest.html#the-license-and-license-file-fields), [Rust Style Guide](https://doc.rust-lang.org/style-guide/cargo.html)). Por ello, las nueve declaraciones heredadas con barras se conservaron literalmente y se revisaron como tales, sin reescribir el inventario.

Dos expresiones compuestas se comprobaron paquete por paquete: `brotli 9.1.1` declara `BSD-3-Clause AND MIT`, con ambos textos presentes y obligaciones acumulativas; `unicode-ident 1.0.27` declara `(MIT OR Apache-2.0) AND Unicode-3.0`, con los tres textos presentes. Para `unicode-ident` se elige una de las ramas MIT/Apache y además se conserva el aviso y las restricciones de Unicode. La matriz detalla cada registro.

## Auditoría de fuentes descargadas

- La consulta de solo lectura `cargo metadata --offline --locked --filter-platform x86_64-pc-windows-msvc` resolvió 247 paquetes externos; las 247 parejas crate/versión coinciden con la matriz y sus directorios fuente están presentes en el caché. No se compiló ni ejecutó la aplicación.
- La búsqueda recursiva de nombres `LICENSE`, `LICENCE`, `COPYING`, `NOTICE` y `COPYRIGHT` encontró 436 archivos en esos árboles. No encontró archivos cuyo nombre empiece por `NOTICE`. El exportador anterior solo recogía archivos de licencia de la raíz y la carpeta `LICENSES/`; por eso dejó fuera tres archivos anidados de la candidata 2.3.0.0:

| Crate | Archivo fuente omitido y SHA-256 | Relevancia para Windows x64 |
|---|---|---|
| `regex-syntax 0.8.11` | `src/unicode_tables/LICENSE-UNICODE` — `74DB5BAF44A41B1000312C673544B3374E4198AF5605C7F9080A402CEC42CFA3` | `cargo tree -e features` confirma activas las funciones Unicode de `regex-syntax`; el aviso Unicode debe acompañar a esos datos. |
| `tracing-core 0.1.36` | `src/spin/LICENSE` — `58545FED1565E42D687AECEC6897D35C6D37CCB71479A137C0DEB2203E125C79` | El grafo resuelve `tracing-core` sin `std`; el código de respaldo `spin` y su texto MIT se conservan de forma conservadora. |
| `rfd 0.17.2` | `src/backend/xdg_desktop_portal/window_identifier/LICENSE` — `AE26BC7B1BC91FB8648F6A298DECBB1A77090A56C9D04E2C23B8365E5F54ACB5` | Pertenece al backend XDG de Linux, no al backend Windows; se incluirá igualmente para no perder esa atribución al distribuir el crate. |

- Se buscaron líneas comentadas con `Copyright`, `©` o `SPDX-License-Identifier` en las primeras 40 líneas de 24 extensiones de código/documentación fuente. El barrido produjo 1.630 coincidencias en 62 nombres de crate (85 líneas normalizadas distintas). El detalle reproducible por crate, ruta y línea está en [SOURCE-HEADER-SCAN-2.3.0.0.csv](SOURCE-HEADER-SCAN-2.3.0.0.csv), SHA-256 `5DF0881A9FE87B5B9DB9822E03F9F342F21FBB7F1688A6469F58FD015269C90E`. Incluye identificadores SPDX y menciones repetidas; no equivale a una decisión jurídica individual sobre cada archivo ni cubre comentarios posteriores a la línea 40.
- El exportador de la rama ahora busca esos archivos legales recursivamente, conserva sus rutas relativas y agrega las menciones de cabecera localizadas al aviso generado. La candidata 2.3.0.0 es inmutable y **no** se regeneró: todavía carece de los tres textos anidados y de ese apéndice de cabeceras. La siguiente entrega debe usar un payload/versión nuevo y único.

## Obligaciones observadas por familia

- **MIT:** conservar íntegros copyright, permiso y descargo de garantía/responsabilidad ([texto SPDX](https://spdx.org/licenses/MIT.html)).
- **Apache-2.0:** conservar copyright, texto de licencia y avisos aplicables; marcar cambios en archivos cubiertos si se modificaron ([texto SPDX](https://spdx.org/licenses/Apache-2.0.html)). El barrido recursivo no encontró archivos con nombre `NOTICE` en los 247 árboles fuente; esto no descarta avisos con otros nombres ni código enlazado externo.
- **BSD-3-Clause:** conservar copyright, condiciones, descargo y prohibición de usar el nombre de titulares o contribuidores para respaldar el producto ([texto SPDX](https://spdx.org/licenses/BSD-3-Clause.html)).
- **Unicode-3.0:** preservar el aviso/copyright Unicode y no usar el nombre del titular para promoción sin permiso ([texto SPDX](https://spdx.org/licenses/Unicode-3.0.html)).
- **MPL-2.0:** licencia copyleft a nivel de archivo. Para distribuir ejecutables hay que informar cómo obtener el código fuente MPL; si se distribuyen modificaciones cubiertas, también hay que ofrecerlas conforme a MPL. La FAQ de Mozilla describe estas obligaciones y aconseja consultar el texto de la licencia para el caso concreto ([FAQ oficial](https://www.mozilla.org/en-US/MPL/2.0/FAQ/), [texto MPL 2.0](https://www.mozilla.org/en-US/MPL/2.0/)).
- **Unlicense, CC0-1.0, MIT-0, 0BSD y Zlib:** se conservaron los textos/avisos empacados; se aplican los términos y descargos de la alternativa elegida. La lista SPDX enlaza los textos de referencia ([SPDX License List](https://spdx.org/licenses/)).

## Casos que necesitan seguimiento antes del envío

| Paquete(s) | Resultado del cotejo | Pendiente |
|---|---|---|
| `cssparser 0.37.0`, `cssparser-macros 0.7.1`, `dtoa-short 0.3.5`, `option-ext 0.2.0`, `selectors 0.38.0` | Cinco expresiones `MPL-2.0`; el texto MPL completo está en los avisos. | El candidato inmutable actual solo muestra el índice genérico de crates.io. El exportador de la rama se ha actualizado para incluir, en la próxima generación, una página de crate versionada y el archivo fuente versionado para cada paquete. Antes de distribuir, hay que regenerar el aviso/MSIX y comprobar que esas diez líneas estén presentes; revisar también si se modificó algún archivo MPL. Mozilla exige informar cómo obtener el código fuente. |
| `dpi 0.1.2` | Declara `Apache-2.0 AND MIT`; ambos textos están incluidos. La documentación de `dpi` dice que su función `std` predeterminada cambia la licencia efectiva a Apache-2.0, mientras que sin `std` usa código `libm` bajo MIT ([documentación de la versión](https://docs.rs/crate/dpi/0.1.2), [README upstream](https://github.com/rust-windowing/winit/blob/master/dpi/README.md)). | `cargo tree --offline --locked --target x86_64-pc-windows-msvc -e features -i dpi@0.1.2` confirma `dpi [default,serde,std]`; `dpi/std` está activa en el grafo resuelto. Ambos textos se conservaron. ([Cargo](https://doc.rust-lang.org/cargo/reference/features.html), [Tauri 2.12.2](https://docs.rs/crate/tauri/2.12.2/features), [Wry 0.57.1 manifest](https://docs.rs/crate/wry/0.57.1/source/Cargo.toml), [dpi 0.1.2](https://docs.rs/crate/dpi/0.1.2)) |
| `brotli-decompressor 6.2.0` | Declara literalmente `BSD-3-Clause/MIT`; solo hay texto BSD-3 completo. | La convención Cargo/Rust permite leer `/` como `OR`; la rama BSD está disponible. Mantener su texto y todas sus condiciones en el paquete final. |
| `ident_case 1.0.1` | Declara `MIT/Apache-2.0`; el archivo del crate incluido es MIT. | La rama MIT está disponible bajo la convención `/` como `OR`; conservar el aviso MIT íntegro. |
| `dunce 1.0.5` | Declara `CC0-1.0 OR MIT-0 OR Apache-2.0`; se incluye el texto CC0-1.0 completo. | La rama CC0 está disponible; conservar el texto incorporado. |
| `crossbeam-channel 0.5.17` | Incluye MIT y Apache y un `LICENSE-THIRD-PARTY` adicional de unos 33 KB. | Conservar también el archivo de terceros completo; no reducirlo al aviso MIT/Apache principal. |

### Suplementos de texto

Los suplementos son: `alloc-stdlib 0.3.0` (BSD-3), `selectors 0.38.0` (MPL-2.0), `tauri-plugin 2.7.2` (Apache-2.0 OR MIT), `webview2-com 0.39.1`, `webview2-com-macros 0.8.1` y `webview2-com-sys 0.39.1` (MIT). Para los seis paquetes se cotejaron versiones y revisiones VCS publicadas y se comparó el texto suplementario con el archivo de la revisión exacta o, en el caso de `selectors` cuyo crate no trae archivo de licencia, con el texto MPL canónico de una dependencia bloqueada y con Mozilla. Las referencias y hashes están en [license-supplements/SOURCES.md](license-supplements/SOURCES.md).

## Límites y decisiones pendientes

1. La auditoría de fuentes es un barrido reproducible de nombres de archivos y de posibles menciones en cabeceras, no una lectura jurídica línea por línea de todo el código, excepciones específicas, subcomponentes enlazados o archivos con nombres atípicos. El detalle automático de cabeceras cubre las primeras 40 líneas de los tipos enumerados en el CSV.
2. El candidato actual no incluye enlaces fuente MPL versionados por crate ni los tres textos anidados descubiertos. El exportador ya los preparará en una nueva generación, pero hay que reconstruir y revisar un payload con versión única antes de distribuir.
3. La activación de `dpi/std` queda confirmada por la salida del resolver Cargo. Los dos textos declarados están presentes; la auditoría de fuentes añade los avisos anidados documentados arriba.
4. La búsqueda no encontró archivos `NOTICE*` con ese nombre; esto no es una conclusión de que no existan avisos equivalentes en otros archivos, ni sustituye la revisión de los 1.630 candidatos de cabecera.
5. La persona responsable de publicación debe validar que se conservan los avisos en el MSIX final y decidir si necesita revisión jurídica profesional. La presencia de una licencia abierta o un WACK correcto no equivale a permiso automático de redistribución.

**Conclusión:** el cribado de los 247 registros, los textos y las seis procedencias suplementarias, además del barrido de fuentes y cabeceras, está documentado. Se localizaron tres textos anidados que faltan en el candidato 2.3.0.0; el exportador corregido los añadirá junto con las menciones de cabecera en la próxima generación. La autorización legal de distribución y la revisión humana final de los candidatos de cabecera siguen pendientes. No se ejecutaron pruebas ni compilaciones, no se reconstruyó ni modificó el MSIX y no se publicó nada.
