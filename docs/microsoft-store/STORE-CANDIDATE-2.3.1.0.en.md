# MSIX 2.3.1.0 preparation status

> **Historical record, superseded on 12 November 2026 by candidate 2.3.2.0.** The pending statuses below describe 2.3.1.0 planning before the new version was built; they are not current. See the [2.3.2.0 report](STORE-CANDIDATE-2.3.2.0.en.md).

**Date:** 12 November 2026<br>
**Status:** IN LOCAL PREPARATION. This is not a certified or submission-ready package.

## Reason and scope

The product version is incremented from 2.3.0 to 2.3.1 to create a new immutable payload. The previous candidate omitted three nested legal texts from the Cargo source tree; the exporter was fixed to collect them recursively and preserve their paths. The 247-package matrix and header scan are in the 2.3.0.0 reports and describe the same dependency graph (the version change adds or updates no dependencies).

These texts must appear in this candidate's inventory and `THIRD-PARTY-NOTICES.txt`:

- `regex-syntax 0.8.11`: `src/unicode_tables/LICENSE-UNICODE`.
- `tracing-core 0.1.36`: `src/spin/LICENSE`.
- `rfd 0.17.2`: `src/backend/xdg_desktop_portal/window_identifier/LICENSE` (Linux backend; included conservatively).

License notices provide attribution; they do not establish legal authorization to distribute the product. The screening report, per-crate matrix and source-header scan still need a final human review and authorization from the rights holders or qualified counsel.

## Candidate identity

| Field | Value |
|---|---|
| Product / MSIX version | Semana al Plato / `2.3.1.0` |
| Architecture | x64 (`x86_64-pc-windows-msvc`) |
| Package identity | `SenecaDPJ.Semanaalplato` |
| Publisher | `CN=6F3CA482-2B0E-4C58-95F1-BFA42598F4C9` |
| Publisher display name | `SenecaDPJ` |
| MinVersion | `10.0.26100.1742` |
| Store package signature | Unsigned; Microsoft signs after certification/publication |
| Source revision | `feature/v2.3.0-move-selected-entries`; commit to be recorded after source preparation |

## Checks for this version

| Check | Status | Evidence |
|---|---|---|
| Clean build and automated tests | NOT RUN | Pending build of this revision |
| Cargo license inventory / all 247 crates | NOT RUN | Must include the three nested texts and source-header scan |
| MSIX and `.msixupload` creation | NOT RUN | Previous package is not reused |
| Artifact SHA-256 | NOT RUN | Record after artifact generation |
| LTSC 24H2 install/update and data check | NOT RUN | Previous checks apply to 2.3.0.0; run 2.3.1.0 in the VM |
| Microsoft Defender | NOT RUN | Scan Store MSIX, `.msixupload` and locally signed test package |
| WACK | NOT RUN | The 2.3.0.0 result does not transfer to this version |
| Microsoft Store certification | NOT RUN | No submission in this engagement |

## Remaining before Partner Center upload

- Have a person review third-party attributions/rights and the 1,630 candidate source-header mentions; obtain the legal authorization needed for distribution.
- Repeat clean build, automated tests, installation/update, persistence, Defender and WACK on the exact 2.3.1.0 artifacts. Review the optional Blocked Executables WACK finding against its report; do not call it a false positive solely because it is optional.
- Prepare current real screenshots in Spanish and English and confirm they represent the package being submitted.
- Verify the existing GitHub Pages privacy URL over HTTP; confirm contact, category, age rating, markets, availability/pricing and remaining Partner Center fields.
- Confirm the manifest, Partner Center identity and version still match at upload time.

No release was created, repository visibility changed, or application submitted for certification.
