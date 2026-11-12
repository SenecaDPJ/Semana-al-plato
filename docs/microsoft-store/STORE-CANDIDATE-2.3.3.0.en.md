# MSIX 2.3.3.0 preparation status

**Date:** 12 November 2026

**Status:** package built and updated in the LTSC VM; WACK completed with `OVERALL_RESULT=PASS` and one optional failure. A visual launch of 2.3.3.0 and confirmation of the data after update remain. No release was published and the package was not submitted to Partner Center.

## Scope and identity

Version 2.3.3 fixes the version label in the interface, which still showed 2.3.0 even though the package was newer. It includes group movement within the displayed week, already tested by the user in an earlier candidate. It does not change the data format or location.

| Field | Value |
|---|---|
| Product / MSIX version | Semana al Plato / `2.3.3.0` |
| Architecture | x64 (`x86_64-pc-windows-msvc`) |
| Package identity | `SenecaDPJ.Semanaalplato` |
| Publisher | `CN=6F3CA482-2B0E-4C58-95F1-BFA42598F4C9` |
| Publisher display name | `SenecaDPJ` |
| MinVersion / MaxVersionTested | `10.0.26100.1742` / `10.0.26300.0` |
| Source commit | `0459c963c772635ec63a48aea13984dae393604e` |
| Store signature | Unsigned; Microsoft signs the package after certification and publication |

## Local artifacts

Git-ignored directory: `artifacts/msstore/2.3.3.0-x64-cleanbuild/`.

| Artifact | SHA-256 | Purpose |
|---|---|---|
| `Semana-al-Plato_2.3.3.0_x64.msix` | `C49FBE4F37E29A13115B5EB8253608AFC44D7444D64A530838301625E5D433EE` | Unsigned Store package |
| `Semana-al-Plato_2.3.3.0_x64.msixupload` | `46BAD30118C6AA190CDA0123F11D9EB37D0922F5150B947AD9D3B81868A47835` | Local Partner Center upload file |
| `Semana-al-Plato_2.3.3.0_x64-LOCALTEST.msix` | `AF8FDF33F0F864B9FE145C41D5AA4E63E3444DCC8F2FF00C8102BD557A93AB34` | Test-signed package; isolated VM only |

The temporary public certificate (`7CCE1273649D6287C12B98B963CD73FE769CB64B`, expires 26 Nov 2026) is in the VM's `LocalMachine\TrustedPeople` store. No PFX or private key exists. It will be removed after testing. The Store MSIX and `.msixupload` remain unsigned.

## Checks

| Check | Status | Evidence and scope |
|---|---|---|
| `npm ci` and npm audit | **PASS** | 41 packages installed; 0 vulnerabilities reported across 42 audited packages. |
| `npm test` | **PASS** | 32/32 tests. |
| x64 build and MSIX packaging | **PASS** | Node 22.21.0, npm 10.9.4, Rust/Cargo 1.99.1, Tauri CLI 2.12.4 and MakeAppx 10.0.19041.5609; Windows 10.0.26300.0. The additional NSIS installer build did not complete because its NSIS download failed with DNS; this did not prevent MSIX generation. |
| Manifest and identity | **PASS** | Identity, Publisher, version `2.3.3.0`, x64 and minimum match Partner Center and the candidate configuration. |
| `2.3.2.0 → 2.3.3.0` update | **PASS, file-level scope** | Windows 11 Enterprise LTSC Evaluation 24H2, administrator account `test-semana24H2`, build 26100. The package ended `Ok`; all 10 files under the package-family local data directory (98,304 bytes) retained identical SHA-256 hashes. This does not replace checking the app interface. |
| Migrated data before update | **PASS** | The user's screenshot shows the expected records: `Café de migración` (Breakfast), `Tortilla de migración` (Lunch) and `Crema de prueba` (Dinner). It was captured with 2.3.2.0 installed; confirming the same data under 2.3.3.0 remains pending. |
| WACK 10.0.26100.9457 | **PASS WITH OPTIONAL FAILURE** | Complete report, exit code 0, `OVERALL_RESULT=PASS`, 23/24 tests PASS. `DPIAwarenessValidation` passed. The only failing test is `Blocked Executables`, marked `OPTIONAL=TRUE`; this is not certification. XML SHA-256: `EDAAD3F33894A15D9A9ADCFE2E1B5E202E1D1DD5A368839C13E3CF41087E706D`. |
| Microsoft Defender | **PASS** | Custom scan of the artifact directory, completion event 1001; antivirus and real-time protection enabled, zero detections. Run on the development host. |
| First visual launch of 2.3.3.0 and close/reopen persistence | **PENDING** | The package is installed and closed. The user should open it, verify the `2.3.3` label and the three records listed above, then close and reopen. |
| 2.3.3.0 standard-profile test | **NOT RUN** | Update and WACK used the administrator profile. Checks from another version or profile are not attributed to this candidate. |
| Uninstall of 2.3.3.0 | **NOT RUN** | The updated package has not been removed; this candidate's data-retention-on-uninstall check remains pending. |
| Pre-update checkpoint | **NOT CREATED** | Hyper-V refused a new checkpoint in the VM's current state. The VM was not paused or shut down; older checkpoints remain available. |
| Licence and notice review | **MANUAL REVIEW CONFIRMED BY OWNER** | Technical inventory: 247 crates, 443 licence files and 7 supplemental texts for 6 crates. The owner said they completed the manual review of licences, copyright headers and `NOTICE` files. Final legal distribution authorization remains the owner's decision. |
| Microsoft Store certification | **NOT RUN** | The package was not submitted to Partner Center. |

Full WACK reports and installation output are in the local Git-ignored artifact folder; they contain internal VM names and paths. This document's summary does not include those details. The existing privacy policy was not changed because this candidate only aligns the UI label and package version and does not change data behaviour.

## Remaining preparation

1. Open 2.3.3.0 in the VM, confirm the `2.3.3` label and three records, then close/reopen to check persistence.
2. Test with the standard profile if the package can be registered for that account; record any PowerShell Direct limitation without silently elevating or changing permissions.
3. Complete the uninstall test and document which data remains.
4. Remove the test public certificate from the VM's `TrustedPeople` store after testing.
5. Complete real English and Spanish screenshots, decide the remaining Partner Center listing fields, and confirm legal distribution authorization.

This candidate is not claimed to work on other Windows editions and is not ready for submission while these actions remain. WACK is a local check; official certification occurs only after submitting the package through Partner Center.
