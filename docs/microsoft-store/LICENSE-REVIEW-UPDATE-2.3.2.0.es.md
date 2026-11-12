# Actualización de revisión de licencias — candidata 2.3.2.0

**Fecha:** 12 de noviembre de 2026
**Alcance:** estado del material de licencias del MSIX local x64 2.3.2.0. Este informe registra evidencia técnica y la revisión manual comunicada por el propietario; no constituye dictamen ni autorización jurídica.

## Estado actual

- El inventario del paquete contiene **247 crates**, **443 archivos de licencia**, incluidos **7 textos suplementarios para 6 paquetes**, y **1.630 líneas con menciones de cabecera** en 64 paquetes. No faltan expresiones SPDX ni textos de licencia en el inventario generado.
- El MSIX 2.3.2.0 incorpora los tres textos anidados que faltaban en la candidata 2.3.0.0 y enlaces versionados de crate/fuente para los cinco paquetes MPL. El archivo agregado `THIRD-PARTY-NOTICES.txt`, el CSV de inventario y el resumen JSON están dentro del paquete.
- El propietario confirmó que completó la revisión manual de las cabeceras de copyright y archivos `NOTICE`. Esta nota no registra el resultado de cada observación ni una lista de incidencias; no interpreta el “hecho” como aprobación legal.
- El campo automático `LegalReviewComplete=false` permanece. El cribado técnico, la comprobación de textos y la revisión de cabeceras no determinan por sí solos que el titular pueda distribuir cada componente dentro del producto.

## Evidencia y límites

La versión concreta y los SHA-256 de sus artefactos figuran en [el estado de candidata 2.3.2.0](STORE-CANDIDATE-2.3.2.0.es.md). La matriz por crate, el escaneo reproducible de cabeceras y los cotejos de procedencia de suplementos se conservan en los informes 2.3.0.0: [matriz CSV](LICENSE-REVIEW-2.3.0.0-CRATES.csv), [informe español](LICENSE-REVIEW-2.3.0.0.es.md), [informe inglés](LICENSE-REVIEW-2.3.0.0.en.md) y [fuentes de suplementos](license-supplements/SOURCES.md). El grafo de dependencias no cambió entre esas revisiones y 2.3.2.0.

La búsqueda de nombres de archivo encontró cero `NOTICE*` entre los archivos de licencia localizados en el árbol de crates. Esto no descarta atribuciones equivalentes con otro nombre, material fuera del caché Cargo o condiciones propias de componentes enlazados. El escaneo automatizado de menciones cubre las primeras 40 líneas de los tipos de archivo enumerados en el CSV; no es una lectura jurídica línea por línea de todo el código.

## Pendiente del editor

El editor debe registrar su decisión jurídica final para distribuir la aplicación con estas dependencias y avisos, y conservar ese registro junto a la versión que envíe. Cuando haya dudas sobre obligaciones o compatibilidad de licencias, debe obtener asesoramiento adecuado. La inclusión de textos y enlaces no garantiza por sí sola cumplimiento ni aprobación de Microsoft Store.
