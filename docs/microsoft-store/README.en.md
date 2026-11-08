# Microsoft Store preparation (MSIX)

**Status:** prepared, pending Windows tests; the identity values supplied by the user are configured in the workflow. This work does not publish a release, change GitHub visibility, or submit the product for certification.

## Verified starting point

- Repository: private `SenecaDPJ/Semana-al-plato`; work branch `msstore/v2.2.0-msix-prep`.
- Source point: tag `v2.2.0`, commit `39423451edeccc7640ed1826582426333cf17d48`. Windows release run `42425539797` reports the same `head_sha`, completed successfully, and created release v2.2.0. This local review starts at documentation commit `26f2f110a4cae109157918aae7a5a39694f1c008`, descended from that point.
- Technology: modular HTML/CSS/JavaScript frontend; Tauri 2 and Rust 2021 desktop host; WebView2 renders the interface. Node.js serves and tests the frontend; there are no JavaScript runtime dependencies. Windows workflows use Node 22 and stable Rust.
- Local Tauri CLI is pinned by the installed tool at 2.12.4. `Cargo.lock` fixes Tauri 2.12.5, `tauri-plugin-dialog` 2.8.4 and `windows-sys` 0.61.2 (plus a transitive 0.45.0). Configuration and the existing release are x64; no ARM64 or x86 package is distributed.
- The product declares Windows 11. The working manifest targets `Windows.Desktop` from `10.0.22000.0` (Windows 11 21H2); this still needs a clean-install test.
- That minimum is technical and provisional; it does not claim that Windows 11 21H2 is still serviced. As of this review, Microsoft lists Windows 11 26H2 as build 26300 and 25H2 as 26200; 21H2 stopped receiving updates years ago, and 24H2 Home/Pro reached end of servicing in October 2026. Before submission, decide whether to retain technical compatibility with older installs or raise the minimum to a serviced release; the manifest must reflect that choice and be tested on Windows.
- The published `Semana.al.Plato_2.2.0_x64-setup.exe` is an NSIS installer, not a portable app. GitHub's API reports 1,987,741 bytes and SHA-256 `978792095f68dde221bf4a2f1f5dc997abf6249511e3a0c13f6d9253dfe29717`. The tag, workflow SHA and asset version in its name match. The EXE was not downloaded or executed on the work machine.
- The NSIS installer uses Tauri's default configuration: if WebView2 is absent, it downloads and launches Microsoft's bootstrapper. Therefore, the current installer is not fully offline. WebView2 Evergreen is included with Windows 11; the proposed Store package does not contain a fixed runtime.
- GitHub metadata and build configuration do not replace a local PE inspection. The v2.2.0 EXE's PE metadata and Authenticode signature were not verified. The current workflow does not configure an Authenticode signing certificate; an earlier v2.1.0 screenshot showed “Unknown publisher” but does not prove the v2.2.0 signature state. Treat the EXE release as unsigned until directly inspected.

## Compatibility review

| Area | Source review result |
| --- | --- |
| Writes beside the install location | None found. The app and resources can reside in the MSIX read-only install area. |
| Absolute paths/working directory | No install-path or working-directory dependency found. The frontend is embedded in the executable during compilation. |
| Data and persistence | The calendar uses the legacy `localStorage` key `calendario-comidas.v1`; theme and language use separate keys. Tauri keeps the WebView2 profile in the user's local app data. The legacy Tauri identifier `com.senecadpj.calendariocomidas` and current keys are retained. NSIS-to-MSIX continuity and uninstall cleanup must be tested on Windows; export a backup before testing. |
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

Expected names for this version: `Semana-al-Plato_2.2.0.0_x64.msix` and `Semana-al-Plato_2.2.0.0_x64.msixupload`. The fourth Store version component is zero. The package is not locally signed: Microsoft signs MSIX packages after certification. The script does not install or execute the application.

The manifest declares `runFullTrust` because this desktop app needs a medium-integrity desktop process. It declares no `unvirtualizedResources` or other capabilities. `MaxVersionTested` is initially set to the Windows 11 minimum in the manifest and must be updated after testing the final build on the target Windows machine.

The optional `-MaxVersionTested` parameter lets you set the Windows build that was actually tested. Its default (`10.0.22000.0`) is provisional for preparing the manifest; it does not represent a completed test and must not be used to claim verified compatibility.

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

The `Build Microsoft Store MSIX (manual)` workflow also runs when changes are pushed to this branch and keeps the `.msix`, `.msixupload`, icon and logs as an Actions artifact for 14 days. Its identity defaults are the values supplied by the user. Manual dispatch from GitHub requires the workflow to be on the default branch; after that, this branch can be selected as the ref. The workflow does not publish a release or submit the product for certification, and it does not replace functional testing or WACK.

## Windows tests still required

Run on a disposable clean Windows 11 x64 VM with a standard user. Do not install or open the GitHub EXE on the main machine. The Store `.msix` is unsigned and keeps the exact Partner Center identity; Microsoft signs it after certification. For a local test, create a development certificate whose subject exactly matches the manifest `Publisher`, sign a test copy of the package and trust that certificate **only inside the VM**. Do not add the certificate or private key to the repository or Store artifact; remove them afterwards. An unsigned test package using the special OID has a different identity and cannot verify installation with the final Store identity.

| Check | Current status | Evidence still needed |
| --- | --- | --- |
| `npm test` on this branch | **Passed**, 30/30 | Output and exit code 0 from this review. |
| Clean Tauri x64 build | Not run here | Rust/Cargo are not installed; prior CI build is v2.2.0, not this MSIX branch. |
| `.msix` / `.msixupload` packaging | Not run here | Windows SDK `MakeAppx.exe` and exact identity are missing. |
| Install and first launch as standard user | Not run | Clean Windows 11; app opens without elevation. |
| Main functions | Not run | Calendar, create/edit, recipes, languages/themes, cloning, drag, selection, consented link and backup. |
| Save/close/reopen | Not run | Same data before and after restart. |
| Upgrade from NSIS v2.2.0 | Not run | Start with a backup; verify coexistence, migration and retention before removing NSIS. |
| MSIX-to-MSIX update | Not run | Next version with the same identity and a higher version. |
| Uninstall and residual data | Not run | Verify what Windows removes and what WebView2 profile data remains. Do not promise total deletion before checking. |
| Defender and SmartScreen | Not run | Run only inside the VM; do not disable protections or remove Internet provenance. |
| Windows App Certification Kit | Not run | WACK report for the final build; a successful compile is not certification. |
| Release installer and Authenticode | Not locally run | Static download, `Get-AuthenticodeSignature`, PE metadata and locally calculated SHA-256. Do not open it. |
| Transitive Rust licenses | Incomplete review | Cargo is absent; validate every crate's manifest/license and keep the generated inventory before release. |

## Dependencies, licenses and secrets

- The project's own code declares the MIT license. The npm lockfile contains development and test tooling only; its metadata lists MIT, Apache-2.0, BSD-2-Clause, BSD-3-Clause, ISC and MIT-0. There are no production JavaScript dependencies.
- The Rust executable contains the dependency tree pinned by `Cargo.lock` (Tauri, dialog plugin, Win32 bindings and transitive crates). The lockfile does not store SPDX licenses; a complete Cargo license audit could not run because Cargo is unavailable. This partial review is **not legal clearance** for publication until the third-party inventory is completed.
- A search for common token, private-key, PFX/PEM certificate and secret patterns in product files found no matches. The checkout contains no installer or redistributable PE files. No process memory, files outside the repository or environment credentials were inspected.

## Store listing, privacy and publication

- [Complete Spanish listing](STORE-LISTING.es.md) and [English listing](STORE-LISTING.en.md).
- [Spanish privacy draft](PRIVACIDAD.es.md) and [English privacy draft](PRIVACY.en.md). It needs a public URL and final review of retention/uninstall behavior; the repository is private and these files cannot serve as a public policy URL while it remains private.
- A square 300×300 Store tile with branding bar is generated, along with 44×44, 50×50 and 150×150 package logos. These are derived from the product SVG.
- Screenshots shown in the README are authentic references, but have not been supplied here as local PNG files for Store or reviewed in the final package. Store needs at least one desktop screenshot; several real captures of the final MSIX build are recommended. Do not use simulated screenshots.

## Partner Center identity received

The user supplied these values, which are set as the package build defaults:

- `Package/Identity/Name`: `SenecaDPJ.Semanaalplato`
- `Package/Identity/Publisher`: `CN=6F3CA482-2B0E-4C58-95F1-BFA42598F4C9`
- `PublisherDisplayName`: `SenecaDPJ`

Before publication, verify that these still match **Product identity**. In Partner Center you will also need to choose/complete the reserved product name, category, price/markets, age rating, licence/terms, contact required by the account type, public privacy-policy URL, screenshots and certification notes. No submission or product draft has been created.

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
