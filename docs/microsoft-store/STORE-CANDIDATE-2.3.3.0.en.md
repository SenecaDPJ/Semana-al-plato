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
| 2.3.3.0 standard-profile registration | **PASS, REGISTRATION ONLY** | PowerShell Direct after the VM restart confirmed this is a standard account and 2.3.3.0 is registered with status `Ok`, with 185 files/5,188,463 bytes in its package data directory; no app process was running. Interactive launch, visual content confirmation and close/reopen persistence remain pending. |
| 2.3.3.0 uninstall and reinstall | **PASS, DATA SCOPE** | Under the administrator test account, `Remove-AppxPackage` removed the MSIX. The package-family data directory (10 files, 98,304 bytes) disappeared; the external Tauri/WebView2 profile remained with 175 files and 5,079,996 bytes. Reinstalled 2.3.3.0 (`Ok`); all 175 files retained their pre-uninstall hashes. The backup and manifests remain in the VM, not Git. |
| Post-reinstall verification in administrator profile | **PASS** | After the VM restart, PowerShell Direct confirmed package `2.3.3.0`, status `Ok`, and no running app process; the package data directory had 2 files/8,192 bytes, and the external Tauri/WebView2 profile had 175 files/5,079,996 bytes. All 175 external-profile file hashes matched the pre-uninstall copy. The user then opened the app and confirmed the version and all three records, changed theme and language, closed and reopened it, confirmed persistence, and closed it again. |
| Standard-profile registration | **PASS, REGISTRATION ONLY** | After the VM restart, PowerShell Direct confirmed the standard account has package `2.3.3.0`, status `Ok`, with 185 files/5,188,463 bytes in its package data directory and no running app process. Interactive launch, visual content confirmation and close/reopen persistence remain pending. |
| Checkpoint before uninstall | **PASS** | The user created a Hyper-V checkpoint before the test. |
| Licence and notice review | **MANUAL REVIEW CONFIRMED BY OWNER** | Technical inventory: 247 crates, 443 licence files and 7 supplemental texts for 6 crates. The owner said they completed the manual review of licences, copyright headers and `NOTICE` files. Final legal distribution authorization remains the owner's decision. |
| Microsoft Store certification | **NOT RUN** | The package was not submitted to Partner Center. |

Full WACK reports and installation output are in the local artifact folder outside the repository; they contain internal VM names and paths. This document's summary does not include those details. The post-reinstall state query and user-confirmed functional checks are recorded in `vm-2.3.3.0-post-reinstall-readonly-20261112.json` outside the repository; it contains no credentials or private account information. The existing privacy policy was not changed because this candidate only aligns the UI label and package version and does not change data behaviour.

## Remaining preparation

1. Sign in to the standard test account, open the app registered for that profile, and confirm its version, content and close/reopen persistence.
2. Remove the test public certificate from the VM's `TrustedPeople` store after testing.
3. Complete real English and Spanish screenshots, decide the remaining Partner Center listing fields, and confirm legal distribution authorization.

This candidate is not claimed to work on other Windows editions and is not ready for submission while these actions remain. WACK is a local check; official certification occurs only after submitting the package through Partner Center.
