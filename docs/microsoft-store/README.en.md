# Microsoft Store preparation (MSIX)

**Status:** candidate package 2.2.0.0 prepared and partially tested in a Windows 11 VM. It is being rebuilt with `MaxVersionTested=10.0.26300.0`; the new artifact still needs WACK. The NSIS migration, Rust license review and other publication items remain open. The supplied identity is configured. This work does not publish a release or submit the product for certification.

## Verified starting point

- Repository: public `SenecaDPJ/Semana-al-plato`, changed manually by its owner; work branch `msstore/v2.2.0-msix-prep`.
- Source point: tag `v2.2.0`, commit `39423451edeccc7640ed1826582426333cf17d48`. Windows release run `42425539797` reports the same `head_sha`, completed successfully, and created release v2.2.0. This local review starts at documentation commit `26f2f110a4cae109157918aae7a5a39694f1c008`, descended from that point.
- Technology: modular HTML/CSS/JavaScript frontend; Tauri 2 and Rust 2021 desktop host; WebView2 renders the interface. Node.js serves and tests the frontend; there are no JavaScript runtime dependencies. Windows workflows use Node 22 and stable Rust.
- Local Tauri CLI is pinned by the installed tool at 2.12.4. `Cargo.lock` fixes Tauri 2.12.5, `tauri-plugin-dialog` 2.8.4 and `windows-sys` 0.61.2 (plus a transitive 0.45.0). Configuration and the existing release are x64; no ARM64 or x86 package is distributed.
- The product declares Windows 11. The working manifest targets `Windows.Desktop` from `10.0.22000.0` (Windows 11 21H2). Installation was tested on Windows 11 build 26300; build 22000, the declared minimum, was not tested.
- That minimum is technical and provisional; it does not claim that Windows 11 21H2 is still serviced. As of this review, Microsoft lists Windows 11 26H2 as build 26300 and 25H2 as 26200; 21H2 stopped receiving updates years ago, and 24H2 Home/Pro reached end of servicing in October 2026. Before submission, decide whether to retain technical compatibility with older installs or raise the minimum to a serviced release; the manifest must reflect that choice and be tested on Windows.
- The published `Semana.al.Plato_2.2.0_x64-setup.exe` is an NSIS installer, not a portable app. GitHub's API reports 1,987,741 bytes and SHA-256 `978792095f68dde221bf4a2f1f5dc997abf6249511e3a0c13f6d9253dfe29717`. The tag, workflow SHA and asset version in its name match. The EXE was not downloaded or executed on the work machine.
- The NSIS installer uses Tauri's default configuration: if WebView2 is absent, it downloads and launches Microsoft's bootstrapper. Therefore, the current installer is not fully offline. WebView2 Evergreen is included with Windows 11; the proposed Store package does not contain a fixed runtime.
- GitHub metadata and build configuration do not replace a local PE inspection. The v2.2.0 EXE's PE metadata and Authenticode signature were not verified. The current workflow does not configure an Authenticode signing certificate; an earlier v2.1.0 screenshot showed “Unknown publisher” but does not prove the v2.2.0 signature state. Treat the EXE release as unsigned until directly inspected.

## Compatibility review

| Area | Source review result |
| --- | --- |
| Writes beside the install location | None found. The app and resources can reside in the MSIX read-only install area. |
| Absolute paths/working directory | No install-path or working-directory dependency found. The frontend is embedded in the executable during compilation. |
| Data and persistence | The calendar uses the legacy `localStorage` key `calendario-comidas.v1`; theme and language use separate keys. Tauri keeps the WebView2 profile in the user's local app data. The legacy Tauri identifier `com.senecadpj.calendariocomidas` and current keys are retained. The NSIS-to-MSIX test remains outstanding; export a backup first. In an uninstall test, Windows removed the package's local data directory. |
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

The candidate package was built on the GitHub Actions Windows runner in run [42433732980](https://github.com/SenecaDPJ/Semana-al-plato/actions/runs/42433732980), from commit `257e0411fd09dae1d9cbdc67077a7c496b0fed2e`. Names: `Semana-al-Plato_2.2.0.0_x64.msix` and `Semana-al-Plato_2.2.0.0_x64.msixupload`. MSIX SHA-256: `f360916080a77dda1010d5366fd5bf693033304f558be5c623f666191820996b`; `.msixupload` SHA-256: `605ad2b5c3d690947f64c927545aed647f0afea12227ce5aef8d6b59413671c8`. The Store package version is `2.2.0.0`, architecture x64. The workflow passed all 30 tests and `MakeAppx` reported `Package creation succeeded`.

The private Actions ZIP artifact ([download](https://github.com/SenecaDPJ/Semana-al-plato/actions/runs/42433732980/artifacts/13599156206)) includes the `.msix`, `.msixupload`, icon, logs and `BUILD-METADATA.txt` with exact tool versions. It is 5,576,398 bytes, SHA-256 `c31c66a381c7af5e70b7cf1d7ad34841b1a7820de95b2e02979ca9e2ed7c9651`, and expires on 22 November 2026. The MSIX is not locally signed: Microsoft signs MSIX packages after certification. The script does not install or execute the application; this artifact is a test candidate, not evidence of WACK or installation.

The manifest declares `runFullTrust` because this desktop app needs a medium-integrity desktop process. It declares no `unvirtualizedResources` or other capabilities. The previous artifact keeps `MaxVersionTested=10.0.22000.0`; the current template and script use `10.0.26300.0`, confirmed by `OSVERSION` in the VM's WACK XML. The package still needs to be rebuilt, installed and rerun through WACK. The minimum `10.0.22000.0` has not been tested.

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
| `npm test` | **Passed locally**, 30/30 | The reopen check now explicitly selects the week containing the saved data. Previous Windows run [42433732980](https://github.com/SenecaDPJ/Semana-al-plato/actions/runs/42433732980) also passed 30/30. The revised branch still needs its Windows workflow. |
| Clean Tauri x64 build | **Passed on previous revision** | Windows runner, commit `257e0411fd09dae1d9cbdc67077a7c496b0fed2e`; the current rebuild is pending in Actions. |
| `.msix` / `.msixupload` packaging | **Previous candidate generated** | Run [42433732980](https://github.com/SenecaDPJ/Semana-al-plato/actions/runs/42433732980). A new artifact with `MaxVersionTested=10.0.26300.0` is required; packaging is not an install or certification test. |
| Install and first launch as standard user | **Passed, user-confirmed** | Windows 11 Enterprise Evaluation VM, build 26300; account `test-semana-standard`; local 2.2.0.0 test package. |
| Main functions | **Passed, user-confirmed** | The user opened and closed the app and tested its functionality in the VM. No automated per-feature results were recorded. |
| Save/close/reopen | **Passed, user-confirmed** | The user confirmed persistence after closing and reopening. |
| Upgrade from NSIS v2.2.0 | Not run | Start with a backup; verify coexistence, migration and retention before removing NSIS. |
| MSIX-to-MSIX update | Not run | Next version with the same identity and a higher version. |
| Uninstall and residual data | **Passed, limited scope** | In the `test-semana` account, Windows removed the package and its local data directory: 288 files/67,619,374 bytes before, directory absent afterwards. This does not establish deletion of exported backups or data in other profiles. |
| Microsoft Defender | **Passed on local test package** | Custom scan with real-time protection enabled; no new detections. SHA-256 of the locally test-signed MSIX: `1332C10E50DFF8C017615E00DEB76DBD13901F9A6E88990C337C06589EF73624`. |
| SmartScreen | **Not run for the MSIX package** | The local MSIX uses a development signature and does not represent the reputation of a Store-published package. No protections were disabled or Internet provenance removed. |
| Windows App Certification Kit (WACK) | **Passed on previous candidate; rerun pending** | 24 tests: 23 passed, 1 optional test failed and 0 required tests failed; the XML records `OVERALL_RESULT=PASS`. Rerun against the rebuilt package. WACK is not Store certification. |
| Release installer and Authenticode | Not locally run | Static download, `Get-AuthenticodeSignature`, PE metadata and locally calculated SHA-256. Do not open it. |
| Transitive Rust licenses | **Automated inventory pending; legal review incomplete** | The workflow now runs `export-cargo-license-inventory.ps1` to collect Cargo manifests, license files and notices. The publisher must review expressions, texts and obligations; this inventory is not legal clearance. |

### WACK result from 9 November 2026

WACK 10.0.26100.9457 exited with code 0 on Windows 11 Enterprise Evaluation x64, build 26300.0. The complete test XML (`PARTIAL_RUN=FALSE`) records `OVERALL_RESULT=PASS`: 23 of 24 tests passed, one test marked `OPTIONAL=TRUE` failed, and no required tests failed. It ran against the locally test-signed x64 package version 2.2.0.0, not the unsigned `.msixupload` intended for Partner Center or a Microsoft-signed package.

Microsoft documents Desktop Bridge optional tests as informational and says they are not used to evaluate Store onboarding. It describes **Blocked executables** as a check related to Windows S and recommends reviewing each reference. Current MSIX guidance says local WACK is deprecated and is only an optional pre-submission check; official certification happens when the package is submitted to Partner Center. See [Desktop Bridge tests](https://learn.microsoft.com/en-us/windows/uwp/debug-test-perf/windows-desktop-bridge-app-tests) and [MSIX package validation](https://learn.microsoft.com/en-us/windows/msix/package/packaging-uwp-apps).

The optional **Blocked executables** test detected binary references to `CreateProcessW`, `ShellExecuteW`, and the strings `CDb`, `basH`, `cmd`, `CSi`, `cmd.exe` and `\cmd.exe`. Source review confirms `ShellExecuteW` opens the GitHub profile only after user consent. No calls to `CreateProcessW`, `cmd.exe` or `std::process::Command` were found in `src/` or `src-tauri/`; the origin of the other binary references has not been traced. This remains an open finding for evaluation and is not labelled a false positive.

The complete XML is retained outside Git on this workstation in the adjacent local folder `../Compilacion_W11/LocalTest/wack-report-2.2.0.0-20261109.xml` (SHA-256 `CEA24A9869D3FCC364A05AAB767DF61C1F9D6847A45338A0F4FFC70CD9F1EC9D`). The locally test-signed MSIX has SHA-256 `1332C10E50DFF8C017615E00DEB76DBD13901F9A6E88990C337C06589EF73624`; the unsigned candidate keeps the hashes listed in the package section. WACK does not certify the app or by itself predict Partner Center's decision.

## Dependencies, licenses and secrets

- The project's own code declares the MIT license. The npm lockfile contains development and test tooling only; its metadata lists MIT, Apache-2.0, BSD-2-Clause, BSD-3-Clause, ISC and MIT-0. There are no production JavaScript dependencies.
- The Rust executable contains the dependency tree pinned by `Cargo.lock` (Tauri, dialog plugin, Win32 bindings and transitive crates). The lockfile does not store SPDX licenses. The workflow now generates an inventory and collects license texts; until that step runs and the obligations are reviewed, this is **not legal clearance** for publication.
- A search for common token, private-key, PFX/PEM certificate and secret patterns in product files found no matches. The checkout contains no installer or redistributable PE files. No process memory, files outside the repository or environment credentials were inspected.

## Store listing, privacy and publication

- [Complete Spanish listing](STORE-LISTING.es.md) and [English listing](STORE-LISTING.en.md).
- [Bilingual web policy](privacy/index.html) and the [Spanish](PRIVACIDAD.es.md) / [English](PRIVACY.en.md) source texts. The `gh-pages` branch is published and contains only `index.html`. The repository API now reports `has_pages=true`, but this environment could not verify the live response or read the configured source. Check Settings → Pages for `gh-pages` and `/ (root)`, then verify `https://senecadpj.github.io/Semana-al-plato/` before entering it in Partner Center. The proposed contact is the public GitHub issue form; users should not include personal data.
- A square 300×300 Store tile with branding bar is generated, along with 44×44, 50×50 and 150×150 package logos. These are derived from the product SVG.
- Screenshots shown in the README are authentic references, but have not been supplied here as local PNG files for Store or reviewed in the final package. Store needs at least one desktop screenshot; several real captures of the final MSIX build are recommended. Do not use simulated screenshots.

## Partner Center identity received

The user supplied these values, which are set as the package build defaults:

- `Package/Identity/Name`: `SenecaDPJ.Semanaalplato`
- `Package/Identity/Publisher`: `CN=6F3CA482-2B0E-4C58-95F1-BFA42598F4C9`
- `PublisherDisplayName`: `SenecaDPJ`

Before publication, verify that these still match **Product identity**. In Partner Center you will also need to choose/complete the reserved product name, category, price/markets, age rating, licence/terms, privacy URL once Pages is active, real screenshots and certification notes. The public issue form is the proposed support channel; check which contact fields Partner Center requires for your account. No submission or product draft has been created.

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
