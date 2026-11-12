# Licence-review update — MSIX candidate 2.3.2.0

**Date:** 12 November 2026
**Scope:** licence materials in the local x64 MSIX 2.3.2.0. This report records technical evidence and the owner's reported manual review; it is not a legal opinion or authorization.

## Current status

- The package inventory contains **247 crates**, **443 licence files**, including **7 supplemental texts for 6 packages**, and **1,630 source-header mention lines** across 64 packages. The generated inventory has no missing SPDX expressions or licence texts.
- MSIX 2.3.2.0 includes the three nested texts omitted from candidate 2.3.0.0 and versioned crate/source links for the five MPL packages. The aggregate `THIRD-PARTY-NOTICES.txt`, CSV inventory and JSON summary are inside the package.
- The owner confirmed that they completed the manual review of copyright headers and `NOTICE` files. This note does not record the outcome of each observation or a findings list; it does not treat “done” as legal approval.
- The automated `LegalReviewComplete=false` field remains. Technical screening, text checks and header review do not by themselves establish the publisher's right to distribute every component as part of the product.

## Evidence and limits

The exact version and artifact SHA-256 values are listed in the [2.3.2.0 candidate status](STORE-CANDIDATE-2.3.2.0.en.md). The per-crate matrix, reproducible header scan and supplemental-provenance checks remain in the 2.3.0.0 reports: [CSV matrix](LICENSE-REVIEW-2.3.0.0-CRATES.csv), [English report](LICENSE-REVIEW-2.3.0.0.en.md), [Spanish report](LICENSE-REVIEW-2.3.0.0.es.md) and [supplement sources](license-supplements/SOURCES.md). The dependency graph did not change between those reviews and 2.3.2.0.

Filename search found zero `NOTICE*` files among the located licence files in the crate trees. This does not rule out equivalent attributions under other names, material outside the Cargo cache, or requirements for linked components. The automated mention scan covers the first 40 lines of the file types listed in its CSV; it is not a line-by-line legal review of all source code.

## Publisher action remaining

The publisher must record the final legal decision to distribute the application with these dependencies and notices, and retain that record with the submitted version. Obtain appropriate advice where licence obligations or compatibility are unclear. Including licence texts and links does not by itself guarantee compliance or Microsoft Store approval.
