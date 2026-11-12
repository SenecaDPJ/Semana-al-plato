# MSIX 2.3.3.0 preparation status

**Date:** 12 November 2026

**Status:** package built, updated, uninstalled/reinstalled and tested under administrator and standard profiles on Windows 11 Enterprise LTSC Evaluation 24H2 build 26100.1742. The user confirmed launch, content and persistence after reopening in both profiles. WACK completed with `OVERALL_RESULT=PASS` and one optional failure. No release was published and the package was not submitted to Partner Center.

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

## Partner Center choices selected

The owner has selected the intended listing values below. These choices are recorded for entry in Partner Center; they have not been entered there yet.

| Field | Selection |
|---|---|
| Primary category | Food + dining |
| Listing languages | `es-ES` and `en-US`; both resources are declared by the package |
| Price | Free |
| Markets | All markets that Partner Center allows for this app |
| IARC rating | No existing IARC ID; the owner will answer the Partner Center questionnaire |
| Screenshots | Use the two current images: one for `es-ES` and one for `en-US`; no additional screenshots requested |
| Additional license terms | Link the repository's MIT licence: `https://github.com/SenecaDPJ/Semana-al-plato/blob/main/LICENSE` in both listings |

The owner authorizes distribution of version `2.3.3.0` through Microsoft Store once the remaining preparation is complete. This authorization does not create a draft or submit the package for certification.

## Local artifacts

Git-ignored directory: `artifacts/msstore/2.3.3.0-x64-cleanbuild/`.

| Artifact | SHA-256 | Purpose |
|---|---|---|
| `Semana-al-Plato_2.3.3.0_x64.msix` | `C49FBE4F37E29A13115B5EB8253608AFC44D7444D64A530838301625E5D433EE` | Unsigned Store package |
| `Semana-al-Plato_2.3.3.0_x64.msixupload` | `46BAD30118C6AA190CDA0123F11D9EB37D0922F5150B947AD9D3B81868A47835` | Local Partner Center upload file |
| `Semana-al-Plato_2.3.3.0_x64-LOCALTEST.msix` | `AF8FDF33F0F864B9FE145C41D5AA4E63E3444DCC8F2FF00C8102BD557A93AB34` | Test-signed package; isolated VM only |

The temporary public test certificates were removed from the VM's `LocalMachine\TrustedPeople` store after testing: six self-signed test publisher certificates were removed and none remain there. No PFX or private key was used or left in that store. The Store MSIX and `.msixupload` remain unsigned.

## Rebuilding

On x64 Windows with Node 22, stable Rust and the Windows SDK installed, start from a clean Git tree and run the [packaging script](build-msix.ps1):

```powershell
.\docs\microsoft-store\build-msix.ps1 `
  -PackageIdentityName 'SenecaDPJ.Semanaalplato' `
  -PackageIdentityPublisher 'CN=6F3CA482-2B0E-4C58-95F1-BFA42598F4C9' `
  -PublisherDisplayName 'SenecaDPJ' `
  -OutputDirectory 'artifacts/msstore/2.3.3.0-x64-rebuild'
```

The output directory must be new. The script regenerates the inventory and unsigned artifacts; for local installation testing, use `sign-msix-for-local-testing.ps1` separately and trust its public certificate only in the isolated VM.

## Checks

| Check | Status | Evidence and scope |
|---|---|---|
| `npm ci` and npm audit | **PASS** | 41 packages installed; 0 vulnerabilities reported across 42 audited packages. |
| `npm test` | **PASS** | 32/32 tests. |
| x64 build and MSIX packaging | **PASS** | Node 22.21.0, npm 10.9.4, Rust/Cargo 1.99.1, Tauri CLI 2.12.4 and MakeAppx 10.0.19041.5609; Windows 10.0.26300.0. The additional NSIS installer build did not complete because its NSIS download failed with DNS; this did not prevent MSIX generation. |
| Manifest and identity | **PASS** | Identity, Publisher, version `2.3.3.0`, x64 and minimum match Partner Center and the candidate configuration. |
| `2.3.2.0 → 2.3.3.0` update | **PASS, file-level scope** | Windows 11 Enterprise LTSC Evaluation 24H2, administrator test account, build 26100. The package ended `Ok`; all 10 files under the package-family local data directory (98,304 bytes) retained identical SHA-256 hashes. This does not replace checking the app interface. |
| Migrated data and persistence in 2.3.3.0 | **PASS** | The user confirmed the `2.3.3` label and the entries `Café de migración` (Breakfast, Monday 9), `Tortilla de migración` (Lunch, Tuesday 10) and `Crema de prueba` (Dinner, Wednesday 11) after the update; they closed and reopened the app and confirmed persistence. |
| WACK 10.0.26100.9457 | **PASS WITH OPTIONAL FAILURE** | Complete report, exit code 0, `OVERALL_RESULT=PASS`, 23/24 tests PASS. `DPIAwarenessValidation` passed. The only failing test is `Blocked Executables`, marked `OPTIONAL=TRUE`; this is not certification. XML SHA-256: `EDAAD3F33894A15D9A9ADCFE2E1B5E202E1D1DD5A368839C13E3CF41087E706D`. |
| Microsoft Defender | **PASS** | Custom scan of the artifact directory, completion event 1001; antivirus and real-time protection enabled, zero detections. Run on the development host. |
| First visual launch and persistence of 2.3.3.0 | **PASS** | The user opened the candidate, checked the label and three entries, closed and reopened it, confirmed persistence, then closed the app. |
| Standard-profile launch, content and persistence | **PASS, USER-REPORTED MANUAL SCOPE** | The user opened 2.3.3.0 under a standard account, confirmed three entries, switched from dark/English to light/Spanish, closed and reopened the app, and confirmed persistence. Clean screenshots show the same calendar in both languages and themes. PowerShell Direct confirmed package status `Ok`, 185 files/5,188,463 bytes in package data and zero app processes after the test. This is not an exhaustive feature audit. |
| 2.3.3.0 uninstall and reinstall | **PASS, DATA SCOPE** | Under the administrator test account, `Remove-AppxPackage` removed the MSIX. The package-family data directory (10 files, 98,304 bytes) disappeared; the external Tauri/WebView2 profile remained with 175 files and 5,079,996 bytes. Reinstalled 2.3.3.0 (`Ok`); all 175 files retained their pre-uninstall hashes. The backup and manifests remain in the VM, not Git. |
| Post-reinstall verification in administrator profile | **PASS** | After the VM restart, PowerShell Direct confirmed package `2.3.3.0`, status `Ok`, and no running app process; the package data directory had 2 files/8,192 bytes, and the external Tauri/WebView2 profile had 175 files/5,079,996 bytes. All 175 external-profile file hashes matched the pre-uninstall copy. The user then opened the app and confirmed the version and all three records, changed theme and language, closed and reopened it, confirmed persistence, and closed it again. |
| Temporary test certificate | **PASS, REMOVED** | After testing, six self-signed test publisher certificates were removed from the VM's `LocalMachine\TrustedPeople` store; a final check found none remaining. No private key was used or left in that store. |
| Checkpoint before uninstall | **PASS** | The user created a Hyper-V checkpoint before the test. |
| Licence review and authorization | **MANUAL REVIEW CONFIRMED; CONDITIONAL AUTHORIZATION GRANTED** | Technical inventory: 247 crates, 443 licence files and 7 supplemental texts for 6 crates. The owner confirmed completing the manual review of licences, copyright headers and `NOTICE` files, and authorized distribution of version `2.3.3.0` through the Store once preparation is complete. |
| Microsoft Store certification | **NOT RUN** | The package was not submitted to Partner Center. |
| Store listing screenshots | **PASS, MINIMUM PER LANGUAGE** | One PNG screenshot per language was prepared from the 2.3.3.0 app under the standard profile and copied unchanged; neither includes a VM frame or Evaluation watermark. English/dark: `Store-screenshot-en-2.3.3.0.png`, 1393 × 977, 120,409 bytes, SHA-256 `506BBFEA81BD202B1E99EA01AA3B1FEC71D0CE4D1A6A5EDF8215BE74B789DB24`. Spanish/light: `Store-screenshot-es-ES-2.3.3.0.png`, 1395 × 981, 150,966 bytes, SHA-256 `1CB7376B94A39FEE65156C63D62A508055DF0A93AE1936FECEE75400A6E026F4`. They are staged in the local delivery folder outside Git. One desktop screenshot is the minimum; Microsoft recommends at least four per device family and allows up to ten. |

Full WACK reports and installation output are in the local artifact folder outside the repository; they contain internal VM names and paths. This document's summary does not include those details. The final local report `vm-2.3.3.0-post-reinstall-readonly-20261112.json` has SHA-256 `0D8699B89B4F38DD5375EF9DC54CABA131FEA37CEE1E631D1016533177BDB7F4`; it contains no credentials or private account information. The local screenshot manifest records dimensions, sizes and hashes. The existing privacy policy was not changed because this candidate only aligns the UI label and package version and does not change data behaviour.

## Remaining preparation

1. Enter the selected category, price, markets and listing languages in Partner Center; verify the reserved name and product identity; complete the `es-ES` and `en-US` listings; and upload the prepared screenshot and caption for its corresponding language. Additional screenshots are optional: one per language is prepared, the documented minimum.
2. Complete the IARC age-rating questionnaire accurately; the owner confirmed there is no existing IARC ID. Apply the selected MIT link under “Additional license terms”; review contact fields and the published privacy URL. No Partner Center draft has been created.
3. Assess the origin of WACK's optional `Blocked Executables` failure; do not label it a false positive until traced.

The functional test supports Windows 11 Enterprise LTSC Evaluation 24H2 x64 build 26100.1742; it does not establish compatibility with other editions or builds. WACK is a local check; official certification occurs only after submitting the package through Partner Center.
