# Microsoft Store preparation (MSIX)

**Status:** MSIX 2.2.0.0 with minimum `10.0.26100.1742` has been built and its installation **PASSED** on Windows 11 Enterprise LTSC Evaluation 24H2 x64, build 26100.1742, through PowerShell Direct as `test-semana24H2-std` (standard account; `PackageStatus=Ok`). The app has not yet been opened manually with this exact artifact: an on-screen check of existing data, basic use and persistence remains. The user already tested those functions on the preceding package. The data directory was present before and after installation; a local pre-install copy was saved outside Git. The public test certificate is trusted only in this VM's `LocalMachine\TrustedPeople` store while testing continues. The earlier uninstall removed the package and certificate before this candidate was installed. WACK and Defender have not been rerun on the new artifact. Licence review, final screenshots and Partner Center decisions remain pending. No release has been created and the product has not been submitted for certification; the updated privacy policy in this branch has not yet been deployed to GitHub Pages.

## Verified starting point

- Repository: public `SenecaDPJ/Semana-al-plato`, changed manually by its owner; work branch `msstore/v2.2.0-msix-prep`.
- Source point: tag `v2.2.0`, commit `39423451edeccc7640ed1826582426333cf17d48`. Windows release run `42425539797` reports the same `head_sha`, completed successfully, and created release v2.2.0. This local review starts at documentation commit `26f2f110a4cae109157918aae7a5a39694f1c008`, descended from that point.
- Technology: modular HTML/CSS/JavaScript frontend; Tauri 2 and Rust 2021 desktop host; WebView2 renders the interface. Node.js serves and tests the frontend; there are no JavaScript runtime dependencies. Windows workflows use Node 22 and stable Rust.
- Local Tauri CLI is pinned by the installed tool at 2.12.4. `Cargo.lock` fixes Tauri 2.12.5, `tauri-plugin-dialog` 2.8.4 and `windows-sys` 0.61.2 (plus a transitive 0.45.0). Configuration and the existing release are x64; no ARM64 or x86 package is distributed.
- The minimum candidate for this round was tested on Windows 11 Enterprise LTSC Evaluation 2024, x64, version 24H2, build 26100.1742. Installation and the user's functional checks passed under a standard account. This does not establish compatibility with Home/Pro or earlier builds; Windows 11 21H2/build 22000 and build 26100.0 were not tested.
- The search for 21H2 media is closed under the user's decision to test a recent minimum candidate first. No third-party ISO was used and 21H2 is not claimed as compatible. LTSC was used as an isolated Windows test environment, not as evidence of Store acceptance on Home/Pro editions.
- After the initial test, the source manifest was set to `MinVersion=10.0.26100.1742`, the full version of the tested OS. The package with that minimum has now been built and registered successfully in the same VM. An on-screen and functional check of this exact artifact remains. Microsoft defines `MinVersion` as the minimum OS version to which a package applies; see [TargetDeviceFamily](https://learn.microsoft.com/en-us/uwp/schemas/appxpackage/uapmanifestschema/element-targetdevicefamily).
- The published `Semana.al.Plato_2.2.0_x64-setup.exe` is an NSIS installer, not a portable app. GitHub's API reports 1,987,741 bytes and SHA-256 `978792095f68dde221bf4a2f1f5dc997abf6249511e3a0c13f6d9253dfe29717`; the copy downloaded in the VM matches that hash. Static inspection confirms the outer setup is x86 PE (`Machine=0x014C`), file/product version `2.2.0` and Authenticode `NotSigned`. The asset installs the x64 application build; its embedded PEs were not inventoried. Defender's custom scan completed with no detections and real-time protection enabled. The user then ran the installer in the VM to check installation and basic use.
- The NSIS installer uses Tauri's default configuration: if WebView2 is absent, it downloads and launches Microsoft's bootstrapper. Therefore, the current installer is not fully offline. WebView2 Evergreen is included with Windows 11; the proposed Store package does not contain a fixed runtime.
- The v2.2.0 EXE has no Authenticode signature (`NotSigned`); the release workflow does not configure a signing certificate. The earlier v2.1.0 “Unknown publisher” screenshot is not the basis for this conclusion. PowerShell Direct's download did not create a `Zone.Identifier` stream; none was removed or altered. A matching hash and a clean Defender scan do not make the EXE signed or trusted. The user ran it inside the isolated VM, not on the host.

## Compatibility review

| Area | Source review result |
| --- | --- |
| Writes beside the install location | None found. The app and resources can reside in the MSIX read-only install area. |
| Absolute paths/working directory | No install-path or working-directory dependency found. The frontend is embedded in the executable during compilation. |
| Data and persistence | The calendar uses the legacy `localStorage` key `calendario-comidas.v1`; theme and language use separate keys. Tauri keeps the WebView2 profile in the user's local app data. The legacy Tauri identifier `com.senecadpj.calendariocomidas` and current keys are retained. The manual JSON migration was completed in the VM; the user confirmed three entries, theme and language persisted after closing and reopening. The LevelDB inspection was a text search only. During the LTSC 24H2 uninstall test, Windows retained the standard user's profile; see the test table for the result and its limits. The migration does not prove an in-place update or automatic profile reuse. |
| Files | Export opens the native save dialog and writes JSON only to the path chosen by the user. Restore validates the data before saving it. The frontend has no general filesystem access. |
| Admin, services, drivers, tasks or registry | No elevation, service, driver, scheduled task, or app-owned registry requirement was found. The NSIS installer is left at its per-user default. |
| Network, accounts and telemetry | No `fetch`, analytics, ads, account system or synchronization. The GitHub profile opens in the default browser only after confirmation. |
| Updates | No app auto-updater. Future MSIX versions will use Store updates with the same identity. The package version must increase for every Store update. |
| External dependency | WebView2 Evergreen; included and serviced by Windows 11. Confirm first launch on a clean Windows machine with no network. |
| Capabilities | Only `runFullTrust`, a restricted capability required for the Tauri desktop process and its native operations (Save dialog and consented external link). No network, documents, camera, microphone or shell/file capabilities are requested. |
| MSIX impediments found | None that require removing features or changing the product's purpose. The updated-minimum package has been built and installed on the tested OS; the exact build still needs a manual first launch, WACK/Defender review and the remaining publication decisions. |

Keeping the inherited Tauri identifier and browser-storage keys reduces migration risk, but it does **not prove** Windows will reuse the same WebView2 profile with MSIX identity. The manual JSON migration was completed and both restored entries were visible after the user closed and reopened the app. A separate raw LevelDB text scan found the storage key and both names, but did not parse the active record. This is not an in-place update and does not prove automatic profile reuse.

## Prepared package

A parameterized manifest and `build-msix.ps1` are included. The script:

1. requires the three exact Partner Center fields and rejects example values;
2. checks that `package.json`, `tauri.conf.json` and `Cargo.toml` use the same version;
3. saves logs from `npm ci`, `npm test`, the Tauri build and `MakeAppx`, plus Node.js, npm, Rust, Cargo, Tauri CLI and MakeAppx versions;
4. directly builds the host executable on Windows x64 without creating another NSIS/MSI installer, generates MSIX/Store icons from the original SVG and packages `SemanaAlPlato.exe` plus adjacent build DLLs;
5. creates an unsigned `.msix` and a `.msixupload` ZIP containing that MSIX, without an `.appxsym` file;
6. calculates SHA-256 for both artifacts and records them in `BUILD-METADATA.txt`.

The Actions run [42590341105](https://github.com/SenecaDPJ/Semana-al-plato/actions/runs/42590341105), from `02adc670d3284fb2d3b307383cf40203feffecec`, was built **before** the minimum-version change. It contains `Semana-al-Plato_2.2.0.0_x64.msix` (SHA-256 `e5da0d373c2106aea894f4ed4b8c01a09bf48858cf3321de7e201e43b8ed074d`) and `Semana-al-Plato_2.2.0.0_x64.msixupload` (SHA-256 `4bd3d087593ecd676b94247c8ac7843b7995b0368f87e2b24cd7fc1d303d0ada`). The Actions ZIP is artifact `13660379174`, 6,576,381 bytes, SHA-256 `11375f21b8e5bcd407e21162cd96e676f6af0d86a63cdc8a432dfb0c530a1428`, expiring 23 November 2026. The clean build, `npm test` (30/30) and MakeAppx passed with the earlier manifest, which declared `MinVersion=10.0.22000.0`. This Store MSIX is not the final artifact after the minimum change and is unsigned; it was not installed directly.

The Actions artifact contains both packages, icons, logs, `BUILD-METADATA.txt`, and a Cargo inventory/license bundle filtered for `x86_64-pc-windows-msvc`: 247 external crates, 433 copied license texts, 0 missing SPDX expressions, and 6 packages without license text in their source (`alloc-stdlib`, `selectors`, `tauri-plugin`, `webview2-com`, `webview2-com-macros`, `webview2-com-sys`). All 247 require terms review and the six missing texts need resolution. This inventory is not legal clearance. The Store MSIX remains unsigned; Microsoft signs it after certification.

The manifest declares `runFullTrust` because this desktop app needs a full-trust process. It declares no `unvirtualizedResources` or other capabilities. The source manifest now declares `MinVersion=10.0.26100.1742` and `MaxVersionTested=10.0.26300.0`. The locally test-signed package used for the last WACK run predates this change and declared `MinVersion=10.0.22000.0`.

The optional `-MinVersion` and `-MaxVersionTested` parameters set versions supported by test evidence. The default minimum is `10.0.26100.1742`, exactly the OS version where the LTSC functional test completed. The default `MaxVersionTested` remains `10.0.26300.0`, recorded by the last WACK run. The template and script do not establish package compatibility until the updated MSIX is rebuilt and installed.

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
| `.msix` / `.msixupload` packaging with updated minimum | **Passed** | Actions run [42716945617](https://github.com/SenecaDPJ/Semana-al-plato/actions/runs/42716945617), commit `355ff5cef0f4ebec9c5c82d287c1cf8cd4251806`, completed `success`; `npm test` passed 30/30 and MakeAppx created both packages. Unsigned Store MSIX SHA-256 `26cd12daba235eedc90bee59cb9fa472d8ae5e0f3353ef2b146fa8b1153c8697`; `.msixupload` `94c04dc1f17381725aef1820a1d63ce68c36f4d354217ec7adbb388446e93050`; Actions ZIP artifact ID `13719520553`, SHA-256 `b46f360b068918e794621503b6fd9ff6f2e3da70f883eb8de0aa29fb7305ce41`, expires 23 Nov 2026. The manifest confirms x64, version `2.2.0.0`, exact identity and minimum `10.0.26100.1742`. |
| Install as standard user on the tested minimum OS | **Passed; installation recovered** | Locally test-signed copy SHA-256 `93031f70664f6962656c52849304e77b3ff37daee53ea8d06090d9110f2c0572` registered with `PackageStatus=Ok` for `test-semana24H2-std` on Windows 11 Enterprise LTSC Evaluation x64 24H2 build `26100.1742`; it declares `MinVersion=10.0.26100.1742`. After a screenshot showed it missing, PowerShell Direct confirmed the package registration was absent and installed it again. It now reports status `Ok` and the Start entry `Semana al Plato`. |
| First launch and visual check of rebuilt package | **User check pending** | Codex did not open the desktop. Search Start for **Semana al Plato** (not `SemanaAlPlato-Test`, the public test folder), launch it and confirm the restored data is visible. |
| Restore backup and persistence | **Profile restored technically; visual check pending** | The previous profile copy kept outside Git (179 files, 5,140,248 bytes) was restored to the standard user's package profile after the latter disappeared; the newly created two-file/8,192-byte profile was saved separately. Counts match, but manually open the app to confirm its contents and close/reopen it to check persistence. Report: `../../../Compilacion_W11/LocalTest/vm-minimum-candidate-availability-restore-20261110.json` (SHA-256 `AC50B9002BB5C3175840F3B515BC97034AD273846D469431268AAED24822E957`). The reason for the disappearance is unknown. |
| Main functions | **Passed within the reported manual scope on the preceding package** | The user tested three created entries, language, theme, close/reopen and persistence as `test-semana24H2-std`. This is not an exhaustive check of every feature or the rebuilt package. |
| NSIS-to-MSIX migration via JSON backup | **Import and visual reopen passed for two entries** | NSIS was removed with exit code 0; the prior MSIX and local profile were removed; the test MSIX was installed with status `Ok`. The screenshot after import, close and reopen shows both restored slots. The full set of 60 foods and 3 recipes was not visually audited. Migration report: `../../../Compilacion_W11/LocalTest/vm-nsis-to-msix-migration-20261109-152929.json` (SHA-256 `E12FE7C0E87DD6135DC63701157BD8B7C9742E8A2B6D1355BF765615F3B88474`); reopen evidence: `../../../Compilacion_W11/LocalTest/vm-post-restore-reopen-20261109.png` (SHA-256 `3322AA895D11A39F858BF75E8873C7A69F249C2CD5D24DB21B265AD73B79F5DF`). |
| In-place NSIS v2.2.0 to MSIX update | Not run | The backup/reinstall migration path was exercised. Installing MSIX over NSIS and automatic profile reuse were not tested. |
| MSIX-to-MSIX update | Not run | Next version with the same identity and a higher version. |
| Uninstall and residual data | **Passed; results differed by profile** | After sign-out and VM reboot, `Get-AppxPackage -AllUsers` found no package and the test certificate was no longer trusted. Windows retained the standard user's app profile: 183 files, 5,205,784 bytes; comparison with the pre-uninstall copy found 0 persistent-data differences and 7 differences in volatile WebView2 caches. The administrator profile did not remain. Report: `../../../Compilacion_W11/LocalTest/LTSC26100-after-uninstall-20261109.json` (SHA-256 `67B9D42254BAA50838CF317584ACA41A3C1E9653A75F885CE3826008992B01E5`); verified pre-uninstall copy: `../../../Compilacion_W11/LocalTest/LTSC26100-before-uninstall-20261109.json` (SHA-256 `354DF227C11876D4C7BA54F2C9736455573280E349C28B8524A0651A4665ACE8`). This does not guarantee the same result for other profiles or versions. |
| Microsoft Defender | **Passed only on the earlier artifact; new candidate not scanned** | Earlier custom VM scans: unsigned `.msix` SHA-256 `E5DA0D373C2106AEA894F4ED4B8C01A09BF48858CF3321DE7E201E43B8ED074D` and signed test copy `18E1F5F32C16DFCC705C3ACBA741955A91AFC682F84381D10C36BD883E56A6DA`, both exit 0 with no detections and real-time protection enabled. The candidate with the updated minimum has not been scanned. Report outside Git: `../../../Compilacion_W11/LocalTest/defender-msix-report-20261109-current-artifact.json`. |
| SmartScreen | **Not run for the MSIX package** | The local MSIX uses a development signature and does not represent the reputation of a Store-published package. No protections were disabled or Internet provenance removed. |
| Windows App Certification Kit (WACK) | **Passed on the package before the minimum change; not rerun** | WACK 10.0.26100.9457: 24 tests, 23 passed, 1 optional failed and 0 required tests failed; `OVERALL_RESULT=PASS`. Tested signed copy SHA-256 `18E1F5F32C16DFCC705C3ACBA741955A91AFC682F84381D10C36BD883E56A6DA`, with `MinVersion=10.0.22000.0` and `MaxVersionTested=10.0.26300.0`. WACK is not Store certification; it has not been run on the new manifest. |
| v2.2.0 release installer: PE, Authenticode, Defender and installation | **Install, basic use and uninstall passed in the VM** | SHA-256 matches GitHub: `978792095f68dde221bf4a2f1f5dc997abf6249511e3a0c13f6d9253dfe29717`; 1,987,741 bytes; outer setup is x86 PE (`Machine=0x014C`), file/product version `2.2.0`, Authenticode `NotSigned`; embedded PEs were not inventoried. Defender reported 0 detections. The user tested language/theme and preference persistence. PowerShell Direct ran the NSIS uninstaller silently, exit code 0, and verified its directory and registration were gone. Data transfer to MSIX used a JSON backup, not an in-place update. Local reports: `../../../Compilacion_W11/LocalTest/nsis-release-static-review-20261109-134102.json` (SHA-256 `298029BD9DF33754C877BDE4919420A4D1E81FCC0BB3241660F7956FC33FAED3`) and `../../../Compilacion_W11/LocalTest/vm-nsis-to-msix-migration-20261109-152929.json` (SHA-256 `E12FE7C0E87DD6135DC63701157BD8B7C9742E8A2B6D1355BF765615F3B88474`). |
| Transitive Rust licenses | **Inventory generated; legal review incomplete** | The artifact includes 247 Windows x64 crates, 433 license files and 6 crates without an included license text. Review the terms for all 247 and resolve the six; the inventory is not legal clearance. |

### Last WACK result, before the minimum-version change — 9 November 2026

WACK 10.0.26100.9457 exited with code 0 on Windows 11 Enterprise Evaluation x64, build 26300.0. The complete test XML (`PARTIAL_RUN=FALSE`) records `OVERALL_RESULT=PASS`: 23 of 24 tests passed, one test marked `OPTIONAL=TRUE` failed, and no required tests failed. It ran against the locally test-signed x64 package 2.2.0.0 (SHA-256 `18E1F5F32C16DFCC705C3ACBA741955A91AFC682F84381D10C36BD883E56A6DA`), which declared `MinVersion=10.0.22000.0`, before the change to `10.0.26100.1742`; it was not a Microsoft-signed package or the new manifest.

Microsoft documents Desktop Bridge optional tests as informational and says they are not used to evaluate Store onboarding. It describes **Blocked executables** as a check related to Windows S and recommends reviewing each reference. Current MSIX guidance says local WACK is deprecated and is only an optional pre-submission check; official certification happens when the package is submitted to Partner Center. See [Desktop Bridge tests](https://learn.microsoft.com/en-us/windows/uwp/debug-test-perf/windows-desktop-bridge-app-tests) and [MSIX package validation](https://learn.microsoft.com/en-us/windows/msix/package/packaging-uwp-apps).

The optional **Blocked executables** test detected binary references to `CreateProcessW`, `ShellExecuteW`, and the strings `CDb`, `basH`, `cmd`, `CSi`, `cmd.exe` and `\cmd.exe`. Source review confirms `ShellExecuteW` opens the GitHub profile only after user consent. No calls to `CreateProcessW`, `cmd.exe` or `std::process::Command` were found in `src/` or `src-tauri/`; the origin of the other binary references has not been traced. This remains an open finding for evaluation and is not labelled a false positive.

The complete XML is retained outside Git in `../../../Compilacion_W11/LocalTest/WACK-current-candidate-20261109-124317.xml` (SHA-256 `03989A2F97D75DA1D6F0B46E3733326CE7CB3BCF8E398D118BB83B5C0024FDF4`). The report confirms identity `SenecaDPJ.Semanaalplato`, version `2.2.0.0`, x64 and `OSVERSION=10.0.26300.0`. The test-signed copy is based on the current Store candidate whose unsigned MSIX SHA-256 is `e5da0d373c2106aea894f4ed4b8c01a09bf48858cf3321de7e201e43b8ed074d`. WACK does not certify the app or predict Partner Center's decision.

The original report and JSON summary remain in the VM: `C:\Users\Public\Documents\SemanaAlPlato-Test\WACK-2.2.0.0-current-candidate-20261109-124144.xml` and `C:\Users\Public\Documents\SemanaAlPlato-Test\WACK-2.2.0.0-current-candidate-20261109-124144-summary.json`. The summary copy outside Git is `../../../Compilacion_W11/LocalTest/WACK-current-candidate-summary-20261109-124317.json`.

## Dependencies, licenses and secrets

- The project's own code declares the MIT license. The npm lockfile contains development and test tooling only; its metadata lists MIT, Apache-2.0, BSD-2-Clause, BSD-3-Clause, ISC and MIT-0. There are no production JavaScript dependencies.
- The Rust executable contains the resolved graph for `x86_64-pc-windows-msvc`: 247 external crates. The artifact contains 433 license texts, but 6 packages have no bundled text (listed in `CARGO-LICENSE-INVENTORY.csv`) and all 247 require obligations review. The inventory declares 5 MPL-2.0 packages and 18 Unicode-3.0 packages; it contains no GPL/LGPL/AGPL SPDX expressions. This is a metadata summary, not a determination of obligations or legal clearance. Legal review remains incomplete.
- A search for common token, private-key, PFX/PEM certificate and secret patterns in product files found no matches. The checkout contains no installer or redistributable PE files. No process memory, files outside the repository or environment credentials were inspected.

## Store listing, privacy and publication

- [Complete Spanish listing](STORE-LISTING.es.md) and [English listing](STORE-LISTING.en.md).
- [Bilingual web policy](privacy/index.html) and the [Spanish](PRIVACIDAD.es.md) / [English](PRIVACY.en.md) source texts. The `gh-pages` branch serves only `index.html`; the public repository reports `has_pages=true`. On 9 November 2026, `https://senecadpj.github.io/Semana-al-plato/` returned HTTP **200**, with title `Privacidad — Semana al Plato` and both Spanish and English content. Contact is through the public GitHub issue form; users should not include personal data.
- A square 300×300 Store tile with branding bar is generated, along with 44×44, 50×50 and 150×150 package logos. These are derived from the product SVG.
- One real candidate screenshot from the verified MSIX install is staged outside Git: `../../../Compilacion_W11/Entrega-Store-2.2.0.0-x64/Store-screenshot-es-ES-20261109.png` (1919 × 1024, 571,266 bytes; SHA-256 `A15E1FA8CAF043F9F9CA0E1B119A98E48D66F7095195B5D6007EEDC0E0A42705`). It meets the desktop minimum but includes the Windows Evaluation watermark and VM margins; decide whether to use it or capture a cleaner view. An English screenshot is still needed. Microsoft requires one screenshot per supported device family (desktop here), recommends four or more and allows up to 10. Upload screenshots and captions separately for each listing language.

## Partner Center identity received

The user supplied these values, which are set as the package build defaults:

- `Package/Identity/Name`: `SenecaDPJ.Semanaalplato`
- `Package/Identity/Publisher`: `CN=6F3CA482-2B0E-4C58-95F1-BFA42598F4C9`
- `PublisherDisplayName`: `SenecaDPJ`

Before publication, verify that these still match **Product identity**. In Partner Center, verify the reserved name; choose the required category, markets and price/availability; complete the age-rating questionnaire; review licence terms; complete the `es-ES` and `en-US` listings; add authentic screenshots; enter the verified privacy URL and relevant certification notes. The public issue form is the support channel; check which contact fields apply to the account type. Leave “What's new” blank for a first submission. No submission or product draft has been created.

## Official references consulted

- [Store MSIX package formats, version and signing](https://learn.microsoft.com/en-us/windows/apps/publish/publish-your-app/msix/app-package-requirements?pivots=store-installer-msix)
- [Create an MSIX with MakeAppx](https://learn.microsoft.com/en-us/windows/msix/package/create-app-package-with-makeappx-tool)
- [MSIX manifest and components for desktop apps](https://learn.microsoft.com/en-us/windows/msix/desktop/desktop-to-uwp-manual-conversion)
- [App capabilities and `runFullTrust`](https://learn.microsoft.com/en-us/windows/apps/package-and-deploy/app-capability-declarations)
- [Certification process and WACK](https://learn.microsoft.com/en-us/windows/uwp/debug-test-perf/windows-app-certification-kit)
- [Tauri Windows packaging](https://v2.tauri.app/distribute/windows-installer/)
- [WebView2 Evergreen distribution](https://learn.microsoft.com/en-us/microsoft-edge/webview2/concepts/evergreen-vs-fixed-version)
- [Store screenshot and icon requirements](https://learn.microsoft.com/en-us/windows/apps/publish/publish-your-app/screenshots-and-images)
- [Store listing fields and limits](https://learn.microsoft.com/en-us/windows/apps/publish/publish-your-app/msix/add-and-edit-store-listing-info)
- [MSIX listing and submission requirements](https://learn.microsoft.com/en-us/windows/apps/publish/publish-your-app/msix/create-app-submission?pivots=store-installer-msix)
- [Windows 11 release and servicing information](https://learn.microsoft.com/en-us/windows/release-health/windows11-release-information)
