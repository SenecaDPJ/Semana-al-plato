# Microsoft Store preparation (MSIX)

**Status:** PREPARED, PENDING WINDOWS TESTING. MSIX candidate `2.2.0.0` was rebuilt for Windows x64 (Actions run [42590341105](https://github.com/SenecaDPJ/Semana-al-plato/actions/runs/42590341105)), with the Partner Center identity and `MaxVersionTested=10.0.26300.0`. Its local test-signed copy was installed in the VM for a standard user; the user confirmed backup restoration and data persistence after closing and reopening the app. The user also installed the v2.2.0 NSIS EXE as a standard user and confirmed first launch, language/theme changes, and persistence of those preferences after closing and reopening. PowerShell Direct verified the installation and that the app was closed; MSIX `2.2.0.0` remains registered for the same user, so this was a side-by-side install, not an NSIS-to-MSIX upgrade. Defender detected no threats. WACK reported `OVERALL_RESULT=PASS`: 23/24 tests passed and one optional **Blocked executables** test failed; no required tests failed. The `10.0.22000.0` minimum and NSIS-to-MSIX/MSIX-to-MSIX update paths remain untested. License review, final screenshots and completing the Store listing also remain pending. The bilingual privacy page is published and returned HTTP 200. No release or certification submission has been made.

## Verified starting point

- Repository: public `SenecaDPJ/Semana-al-plato`, changed manually by its owner; work branch `msstore/v2.2.0-msix-prep`.
- Source point: tag `v2.2.0`, commit `39423451edeccc7640ed1826582426333cf17d48`. Windows release run `42425539797` reports the same `head_sha`, completed successfully, and created release v2.2.0. This local review starts at documentation commit `26f2f110a4cae109157918aae7a5a39694f1c008`, descended from that point.
- Technology: modular HTML/CSS/JavaScript frontend; Tauri 2 and Rust 2021 desktop host; WebView2 renders the interface. Node.js serves and tests the frontend; there are no JavaScript runtime dependencies. Windows workflows use Node 22 and stable Rust.
- Local Tauri CLI is pinned by the installed tool at 2.12.4. `Cargo.lock` fixes Tauri 2.12.5, `tauri-plugin-dialog` 2.8.4 and `windows-sys` 0.61.2 (plus a transitive 0.45.0). Configuration and the existing release are x64; no ARM64 or x86 package is distributed.
- The product declares Windows 11. The working manifest targets `Windows.Desktop` from `10.0.22000.0` (Windows 11 21H2). Installation was tested on Windows 11 build 26300; build 22000, the declared minimum, was not tested.
- That minimum is technical and provisional; it does not claim that Windows 11 21H2 is still serviced. As of this review, Microsoft lists Windows 11 26H2 as build 26300 and 25H2 as 26200; 21H2 stopped receiving updates years ago, and 24H2 Home/Pro reached end of servicing in October 2026. Before submission, decide whether to retain technical compatibility with older installs or raise the minimum to a serviced release; the manifest must reflect that choice and be tested on Windows.
- The published `Semana.al.Plato_2.2.0_x64-setup.exe` is an NSIS installer, not a portable app. GitHub's API reports 1,987,741 bytes and SHA-256 `978792095f68dde221bf4a2f1f5dc997abf6249511e3a0c13f6d9253dfe29717`; the copy downloaded in the VM matches that hash. Static inspection confirms the outer setup is x86 PE (`Machine=0x014C`), file/product version `2.2.0` and Authenticode `NotSigned`. The asset installs the x64 application build; its embedded PEs were not inventoried. Defender's custom scan completed with no detections and real-time protection enabled. The user then ran the installer in the VM to check installation and basic use.
- The NSIS installer uses Tauri's default configuration: if WebView2 is absent, it downloads and launches Microsoft's bootstrapper. Therefore, the current installer is not fully offline. WebView2 Evergreen is included with Windows 11; the proposed Store package does not contain a fixed runtime.
- The v2.2.0 EXE has no Authenticode signature (`NotSigned`); the release workflow does not configure a signing certificate. The earlier v2.1.0 “Unknown publisher” screenshot is not the basis for this conclusion. PowerShell Direct's download did not create a `Zone.Identifier` stream; none was removed or altered. A matching hash and a clean Defender scan do not make the EXE signed or trusted. The user ran it inside the isolated VM, not on the host.

## Compatibility review

| Area | Source review result |
| --- | --- |
| Writes beside the install location | None found. The app and resources can reside in the MSIX read-only install area. |
| Absolute paths/working directory | No install-path or working-directory dependency found. The frontend is embedded in the executable during compilation. |
| Data and persistence | The calendar uses the legacy `localStorage` key `calendario-comidas.v1`; theme and language use separate keys. Tauri keeps the WebView2 profile in the user's local app data. The legacy Tauri identifier `com.senecadpj.calendariocomidas` and current keys are retained. NSIS and MSIX v2.2.0 are installed side by side for the standard account; this does not demonstrate migration or profile reuse. The NSIS-to-MSIX test remains outstanding; export a backup first. In an MSIX uninstall test, Windows removed the package's local data directory. |
| Files | Export opens the native save dialog and writes JSON only to the path chosen by the user. Restore validates the data before saving it. The frontend has no general filesystem access. |
| Admin, services, drivers, tasks or registry | No elevation, service, driver, scheduled task, or app-owned registry requirement was found. The NSIS installer is left at its per-user default. |
| Network, accounts and telemetry | No `fetch`, analytics, ads, account system or synchronization. The GitHub profile opens in the default browser only after confirmation. |
| Updates | No app auto-updater. Future MSIX versions will use Store updates with the same identity. The package version must increase for every Store update. |
| External dependency | WebView2 Evergreen; included and serviced by Windows 11. Confirm first launch on a clean Windows machine with no network. |
| Capabilities | Only `runFullTrust`, a restricted capability required for the Tauri desktop process and its native operations (Save dialog and consented external link). No network, documents, camera, microphone or shell/file capabilities are requested. |
| MSIX impediments found | None that require removing features or changing the product's purpose. Identity, final packaging and real tests remain outstanding. |

Keeping the inherited Tauri identifier and browser-storage keys reduces migration risk, but it does **not prove** Windows will reuse the same WebView2 profile when the app is installed with MSIX identity. Test an NSIS-to-MSIX upgrade using real data and a backup before uninstalling the older version.

## Prepared package

A parameterized manifest and `build-msix.ps1` are included. The script:

1. requires the three exact Partner Center fields and rejects example values;
2. checks that `package.json`, `tauri.conf.json` and `Cargo.toml` use the same version;
3. saves logs from `npm ci`, `npm test`, the Tauri build and `MakeAppx`, plus Node.js, npm, Rust, Cargo, Tauri CLI and MakeAppx versions;
4. directly builds the host executable on Windows x64 without creating another NSIS/MSI installer, generates MSIX/Store icons from the original SVG and packages `SemanaAlPlato.exe` plus adjacent build DLLs;
5. creates an unsigned `.msix` and a `.msixupload` ZIP containing that MSIX, without an `.appxsym` file;
6. calculates SHA-256 for both artifacts and records them in `BUILD-METADATA.txt`.

The current candidate was generated by Actions run [42590341105](https://github.com/SenecaDPJ/Semana-al-plato/actions/runs/42590341105), from `02adc670d3284fb2d3b307383cf40203feffecec`. It contains `Semana-al-Plato_2.2.0.0_x64.msix` (SHA-256 `e5da0d373c2106aea894f4ed4b8c01a09bf48858cf3321de7e201e43b8ed074d`) and `Semana-al-Plato_2.2.0.0_x64.msixupload` (SHA-256 `4bd3d087593ecd676b94247c8ac7843b7995b0368f87e2b24cd7fc1d303d0ada`). The Actions ZIP is artifact `13660379174`, 6,576,381 bytes, SHA-256 `11375f21b8e5bcd407e21162cd96e676f6af0d86a63cdc8a432dfb0c530a1428`, expiring 23 November 2026. The clean build, `npm test` (30/30) and MakeAppx passed. The Store MSIX is unsigned and was not installed directly; a locally test-signed copy was installed for Windows testing.

The Actions artifact contains both packages, icons, logs, `BUILD-METADATA.txt`, and a Cargo inventory/license bundle filtered for `x86_64-pc-windows-msvc`: 247 external crates, 433 copied license texts, 0 missing SPDX expressions, and 6 packages without license text in their source (`alloc-stdlib`, `selectors`, `tauri-plugin`, `webview2-com`, `webview2-com-macros`, `webview2-com-sys`). All 247 require terms review and the six missing texts need resolution. This inventory is not legal clearance. The Store MSIX remains unsigned; Microsoft signs it after certification.

The manifest declares `runFullTrust` because this desktop app needs a full-trust process. It declares no `unvirtualizedResources` or other capabilities. The current artifact and the local test-signed copy used by WACK declare `MaxVersionTested=10.0.26300.0`. The `10.0.22000.0` minimum has not been tested.

The optional `-MaxVersionTested` parameter lets you set the Windows build that was actually tested. Its default (`10.0.26300.0`) matches the OS recorded in this VM's WACK XML; use the actual version if building on a different Windows system. This alone does not establish compatibility with earlier releases.

### Build on Windows x64

Requirements: Node.js 22, stable Rust with MSVC, Visual Studio C++ Build Tools, Windows SDK with `MakeAppx.exe` and downloadable development dependencies. The build can be repeated from the branch and does not execute the EXE. The workflow uses `windows-latest` and Rust `stable`; it records the actual versions in each artifact but does not promise bit-for-bit identical builds across runs.

🔴 EJECUCIÓN⚙️🚨 — Builds the app, runs automated tests and creates packages under `artifacts/msstore/`. It may download development dependencies and saves local logs. The values you supplied are already set in the workflow; for a local build, use these values or copy any later changes from Partner Center.

```powershell
.\docs\microsoft-store\build-msix.ps1 `
  -PackageIdentityName "SenecaDPJ.Semanaalplato" `
  -PackageIdentityPublisher "CN=6F3CA482-2B0E-4C58-95F1-BFA42598F4C9" `
  -PublisherDisplayName "SenecaDPJ"
```

The script stops if Node/Rust/SDK is missing, versions disagree, or the output folder already exists; it does not overwrite prior packages. It does not create or request certificates or private keys. The `.msixupload` contains the MSIX package and no debug symbols; Partner Center can accept `.msix` directly, though Microsoft recommends the Store upload format.

The `Build Microsoft Store MSIX (manual)` workflow creates an artifact when changes affecting app code, packaging scripts or manifest are pushed to this branch; retention is 14 days. It also collects the Cargo license inventory and third-party text for review. Its identity defaults are the values supplied by the user. Manual dispatch from GitHub requires the workflow to be on the default branch; after that, this branch can be selected as the ref. The workflow does not publish a release or submit the product for certification, and it does not replace functional testing or WACK.

## Windows results and remaining tests

Tests so far used a Windows 11 x64 Enterprise Evaluation VM and test accounts; the results distinguish user-confirmed checks from machine reports. Do not install or open the GitHub EXE on the main machine. The Store `.msix` remains unsigned and keeps the exact Partner Center identity; Microsoft signs it after certification. Local tests used a copy signed with a development certificate trusted only inside the VM. Do not add that certificate or its private key to the repository or Store artifact; remove the temporary certificate from the VM after all tests are complete. An unsigned test package using the special OID has a different identity and cannot verify installation with the final Store identity.

| Check | Current status | Evidence/scope |
| --- | --- | --- |
| `npm test` | **Passed, 30/30** | Run [42590341105](https://github.com/SenecaDPJ/Semana-al-plato/actions/runs/42590341105) for the candidate commit. The reopen test explicitly selects the week containing the saved data. |
| Clean Tauri x64 build | **Passed** | Windows runner, commit `02adc670d3284fb2d3b307383cf40203feffecec`; Node, npm, Rust, Cargo, Tauri CLI and MakeAppx versions are in `BUILD-METADATA.txt`. |
| Current `.msix` / `.msixupload` packaging | **Passed** | Run [42590341105](https://github.com/SenecaDPJ/Semana-al-plato/actions/runs/42590341105), `MaxVersionTested=10.0.26300.0`; MSIX SHA-256 `e5da0d…ed074d`, `.msixupload` `4bd3d0…d0dada`. The Store package remains unsigned. |
| Install and first launch as standard user | **Passed on current candidate** | The current artifact's locally signed copy was installed for `test-semana-standard` on Windows 11 build 26300; status `Ok`, version `2.2.0.0`, expected identity and publisher. Signed-copy SHA-256: `18E1F5F32C16DFCC705C3ACBA741955A91AFC682F84381D10C36BD883E56A6DA`. |
| Restore backup and persistence | **Passed on current candidate, user-confirmed** | A JSON backup was exported before replacement, restored after installing the candidate, and the user confirmed the data remained after closing and reopening the app. The backup remains outside the package in the VM. |
| Main functions | **Passed on earlier test; current candidate opened and checked** | The main functions were tested on the previous version. On the current candidate, installation, JSON restoration and persistence were verified; an exhaustive repeat of every function was not recorded. |
| Upgrade from NSIS v2.2.0 | Not run | Start with a backup; verify coexistence, migration and retention before removing NSIS. |
| MSIX-to-MSIX update | Not run | Next version with the same identity and a higher version. |
| Uninstall and residual data | **Passed, limited scope** | In `test-semana`, Windows removed the package and local directory (288 files/67,619,374 bytes). During candidate replacement, it also removed `test-semana-standard`'s local data (195 files/4,022,501 bytes); the JSON backup remained available and was restored. This does not establish deletion of exported backups or data in other profiles. |
| Microsoft Defender | **Passed on current candidate** | Custom VM scans of the current unsigned `.msix` and its locally test-signed copy both exited 0 with no new detections; real-time protection was enabled. Unsigned SHA-256: `E5DA0D373C2106AEA894F4ED4B8C01A09BF48858CF3321DE7E201E43B8ED074D`; signed test copy: `18E1F5F32C16DFCC705C3ACBA741955A91AFC682F84381D10C36BD883E56A6DA`. Report outside Git: `../Compilacion_W11/LocalTest/defender-msix-report-20261109-current-artifact.json`. |
| SmartScreen | **Not run for the MSIX package** | The local MSIX uses a development signature and does not represent the reputation of a Store-published package. No protections were disabled or Internet provenance removed. |
| Windows App Certification Kit (WACK) | **Passed on current candidate with one optional failure** | WACK 10.0.26100.9457: 24 tests, 23 passed, 1 optional failed and 0 required tests failed; `OVERALL_RESULT=PASS`. Tested local signed copy SHA-256 `18E1F5F32C16DFCC705C3ACBA741955A91AFC682F84381D10C36BD883E56A6DA`, `MaxVersionTested=10.0.26300.0`. WACK is not Store certification. |
| v2.2.0 release installer: PE, Authenticode, Defender and installation | **Static review and basic installation passed in the VM; migration/uninstall pending** | SHA-256 matches GitHub: `978792095f68dde221bf4a2f1f5dc997abf6249511e3a0c13f6d9253dfe29717`; 1,987,741 bytes; outer setup is x86 PE (`Machine=0x014C`), file/product version `2.2.0`, Authenticode `NotSigned`; the asset installs the x64 app build, but embedded PEs were not inventoried. Defender real-time protection enabled, 0 detections. The user installed as standard, tested language/theme and persistence of those preferences; PowerShell Direct verified version `2.2.0`, executable, uninstaller and shortcuts, and confirmed the app was closed. MSIX `2.2.0.0` also remains installed for that account, so migration has not been tested. NSIS uninstall remains pending. Local reports outside Git: `../Compilacion_W11/LocalTest/nsis-release-static-review-20261109-134102.json` (SHA-256 `298029BD9DF33754C877BDE4919420A4D1E81FCC0BB3241660F7956FC33FAED3`) and `../Compilacion_W11/LocalTest/vm-nsis-install-verification-20261109-143348.json` (SHA-256 `BA5B5254727BB137AD4E6C099F0272EE0B1983ACFE7FAA1D38D45C46ACD25431`). |
| Transitive Rust licenses | **Inventory generated; legal review incomplete** | The artifact includes 247 Windows x64 crates, 433 license files and 6 crates without an included license text. Review the terms for all 247 and resolve the six; the inventory is not legal clearance. |

### Current WACK result from 9 November 2026

WACK 10.0.26100.9457 exited with code 0 on Windows 11 Enterprise Evaluation x64, build 26300.0. The complete test XML (`PARTIAL_RUN=FALSE`) records `OVERALL_RESULT=PASS`: 23 of 24 tests passed, one test marked `OPTIONAL=TRUE` failed, and no required tests failed. It ran against a locally test-signed copy of the current x64 candidate version 2.2.0.0 (SHA-256 `18E1F5F32C16DFCC705C3ACBA741955A91AFC682F84381D10C36BD883E56A6DA`), not the unsigned `.msixupload` or a Microsoft-signed package.

Microsoft documents Desktop Bridge optional tests as informational and says they are not used to evaluate Store onboarding. It describes **Blocked executables** as a check related to Windows S and recommends reviewing each reference. Current MSIX guidance says local WACK is deprecated and is only an optional pre-submission check; official certification happens when the package is submitted to Partner Center. See [Desktop Bridge tests](https://learn.microsoft.com/en-us/windows/uwp/debug-test-perf/windows-desktop-bridge-app-tests) and [MSIX package validation](https://learn.microsoft.com/en-us/windows/msix/package/packaging-uwp-apps).

The optional **Blocked executables** test detected binary references to `CreateProcessW`, `ShellExecuteW`, and the strings `CDb`, `basH`, `cmd`, `CSi`, `cmd.exe` and `\cmd.exe`. Source review confirms `ShellExecuteW` opens the GitHub profile only after user consent. No calls to `CreateProcessW`, `cmd.exe` or `std::process::Command` were found in `src/` or `src-tauri/`; the origin of the other binary references has not been traced. This remains an open finding for evaluation and is not labelled a false positive.

The complete XML is retained outside Git in `../Compilacion_W11/LocalTest/WACK-current-candidate-20261109-124317.xml` (SHA-256 `03989A2F97D75DA1D6F0B46E3733326CE7CB3BCF8E398D118BB83B5C0024FDF4`). The report confirms identity `SenecaDPJ.Semanaalplato`, version `2.2.0.0`, x64 and `OSVERSION=10.0.26300.0`. The test-signed copy is based on the current Store candidate whose unsigned MSIX SHA-256 is `e5da0d373c2106aea894f4ed4b8c01a09bf48858cf3321de7e201e43b8ed074d`. WACK does not certify the app or predict Partner Center's decision.

The original report and JSON summary remain in the VM: `C:\Users\Public\Documents\SemanaAlPlato-Test\WACK-2.2.0.0-current-candidate-20261109-124144.xml` and `C:\Users\Public\Documents\SemanaAlPlato-Test\WACK-2.2.0.0-current-candidate-20261109-124144-summary.json`. The summary copy outside Git is `../Compilacion_W11/LocalTest/WACK-current-candidate-summary-20261109-124317.json`.

## Dependencies, licenses and secrets

- The project's own code declares the MIT license. The npm lockfile contains development and test tooling only; its metadata lists MIT, Apache-2.0, BSD-2-Clause, BSD-3-Clause, ISC and MIT-0. There are no production JavaScript dependencies.
- The Rust executable contains the resolved graph for `x86_64-pc-windows-msvc`: 247 external crates. The artifact contains 433 license texts, but 6 packages have no bundled text (listed in `CARGO-LICENSE-INVENTORY.csv`) and all 247 require obligations review. The inventory declares 5 MPL-2.0 packages and 18 Unicode-3.0 packages; it contains no GPL/LGPL/AGPL SPDX expressions. This is a metadata summary, not a determination of obligations or legal clearance. Legal review remains incomplete.
- A search for common token, private-key, PFX/PEM certificate and secret patterns in product files found no matches. The checkout contains no installer or redistributable PE files. No process memory, files outside the repository or environment credentials were inspected.

## Store listing, privacy and publication

- [Complete Spanish listing](STORE-LISTING.es.md) and [English listing](STORE-LISTING.en.md).
- [Bilingual web policy](privacy/index.html) and the [Spanish](PRIVACIDAD.es.md) / [English](PRIVACY.en.md) source texts. The `gh-pages` branch serves only `index.html`; the public repository reports `has_pages=true`. On 9 November 2026, `https://senecadpj.github.io/Semana-al-plato/` returned HTTP **200**, with title `Privacidad — Semana al Plato` and both Spanish and English content. Contact is through the public GitHub issue form; users should not include personal data.
- A square 300×300 Store tile with branding bar is generated, along with 44×44, 50×50 and 150×150 package logos. These are derived from the product SVG.
- Screenshots shown in the README are authentic references, but have not been supplied here as local PNG files for Store or reviewed in the final package. Store needs at least one desktop screenshot; several real captures of the final MSIX build are recommended. Do not use simulated screenshots.

## Partner Center identity received

The user supplied these values, which are set as the package build defaults:

- `Package/Identity/Name`: `SenecaDPJ.Semanaalplato`
- `Package/Identity/Publisher`: `CN=6F3CA482-2B0E-4C58-95F1-BFA42598F4C9`
- `PublisherDisplayName`: `SenecaDPJ`

Before publication, verify that these still match **Product identity**. In Partner Center you will also need to choose/complete the reserved product name, category, price/markets, age rating, licence/terms, enter the verified privacy URL, real screenshots and certification notes. The public issue form is the support channel; check which contact fields Partner Center requires for your account. No submission or product draft has been created.

## Official references consulted

- [Store MSIX package formats, version and signing](https://learn.microsoft.com/en-us/windows/apps/publish/publish-your-app/msix/app-package-requirements?pivots=store-installer-msix)
- [Create an MSIX with MakeAppx](https://learn.microsoft.com/en-us/windows/msix/package/create-app-package-with-makeappx-tool)
- [MSIX manifest and components for desktop apps](https://learn.microsoft.com/en-us/windows/msix/desktop/desktop-to-uwp-manual-conversion)
- [App capabilities and `runFullTrust`](https://learn.microsoft.com/en-us/windows/apps/package-and-deploy/app-capability-declarations)
- [Certification process and WACK](https://learn.microsoft.com/en-us/windows/uwp/debug-test-perf/windows-app-certification-kit)
- [Tauri Windows packaging](https://v2.tauri.app/distribute/windows-installer/)
- [WebView2 Evergreen distribution](https://learn.microsoft.com/en-us/microsoft-edge/webview2/concepts/evergreen-vs-fixed-version)
- [Store screenshot and icon requirements](https://learn.microsoft.com/en-us/windows/apps/publish/publish-your-app/screenshots-and-images)
- [Windows 11 release and servicing information](https://learn.microsoft.com/en-us/windows/release-health/windows11-release-information)
