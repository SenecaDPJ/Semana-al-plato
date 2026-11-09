# Semana al Plato validation record

## Inherited v1.0.1 record

- The v1.0.1 release, published on 5 November 2026, stated that export and restore had been checked in the installed app. The manual record for that version left both checks pending.
- This historical discrepancy is preserved as unresolved: the available evidence does not confirm which statement is correct.
- v1.0.1 records 17 passing tests and a Windows 11 NSIS x64 build. Its installer, excluded from Git, had SHA-256 `E12A9BEF6E6A0F3F1BC67AE5228D685D907FB4FD9B1E9BF948CFB9E5178FAEE2`.

## v1.0.2 checks

- `npm ci`: lockfile dependencies installed; the audit reported zero vulnerabilities.
- `npm test`: 18 passing tests, including all 196 contrast combinations and updating default colours when loading older backups without changing other data.
- `npm run build`: successful; generated `dist/index.html`, which is excluded from Git.
- The palette contrast calculation has a minimum of 4.97:1. The automated test checks the AA threshold of 4.5:1 for all 196 combinations.
- The [Publish Windows installer](https://github.com/SenecaDPJ/semana-al-plato/actions/runs/42386548479) workflow completed successfully on Windows: tests and NSIS x64 build.
- The private [v1.0.2 release](https://github.com/SenecaDPJ/semana-al-plato/releases/tag/v1.0.2) contains `Semana.al.Plato_1.0.2_x64-setup.exe` (1,970,092 bytes; SHA-256 `36f4afecac82dd0ab65bf0c7027330e129fdfdc6767f3a8fdb6e1484cbcb5426`).
- The repository was confirmed to remain private.

## Manual checks pending for v1.0.2

- Install the package and visually review the installer and uninstaller icons, category labels, and light and dark themes.
- Test backup export and restore while preserving data, and review a calendar with many entries.
- An automated build alone does not demonstrate visual review of the installer or manual operation on another PC.

## v1.0.3 checks

- `npm test`: 26 passing tests. The tests include both cloning destinations, reordering and moving between days in the same row, group cloning, the two delete confirmations, and permission before opening the GitHub profile.
- `git diff --check`: successful.
- `npm run build`: successful; generated `dist/index.html`, which is excluded from Git.
- The [Windows release workflow](https://github.com/SenecaDPJ/semana-al-plato/actions/runs/42403188032) completed successfully: tests and NSIS x64 build.
- The private [v1.0.3 release](https://github.com/SenecaDPJ/semana-al-plato/releases/tag/v1.0.3) contains `Semana.al.Plato_1.0.3_x64-setup.exe` (1,981,890 bytes; SHA-256 `183334182d63a0ceb74cb184c6f627efb1ea4fd6bc131b54c830c2227a1cbb5b`).
- Automated tests verify that cancelling does not open the link and accepting invokes the native opener. The default browser has not been manually checked from the installed app.
- At that historical check, GitHub confirmed that the repository was still private; its owner made it public later.

## v2.0.0 checks

- `npm test`: 30 passing tests. They cover the language selector and persistence, translations for the calendar, categories, examples, recipes and dialogs, and ensure the preference does not modify saved data.
- `npm run build`: successful; generated `dist/index.html`, which is excluded from Git.
- `git diff --check`: successful.
- The local Tauri build could not run because Cargo is not installed in this environment. The [Windows workflow completed successfully](https://github.com/SenecaDPJ/Semana-al-plato/actions/runs/42411277902): it ran the tests and built an NSIS x64 installer, published as a downloadable artifact.
- The private [v2.0.0 release](https://github.com/SenecaDPJ/semana-al-plato/releases/tag/v2.0.0) contains `Semana.al.Plato_2.0.0_x64-setup.exe` (1,988,945 bytes; SHA-256 `34cf2cb9ab2fe783536f662f589a86a576fc2d7130a3047578f43e4fc82d1928`).
- The repository was confirmed to remain private.
- The installer was not visually reviewed and no manual Windows check was recorded.

## v2.1.0 preview

- The preview branch added flags for the active language (Spain/UK), reordered multi-selection actions and strengthened invalid-move feedback. The final flag correction explicitly sets the visibility state for each flag.
- `npm run build`: successful locally. The local Tauri build could not run because Cargo is not installed.
- The Windows workflow for [PR #6](https://github.com/SenecaDPJ/semana-al-plato/pull/6) completed successfully in [run 42422715713](https://github.com/SenecaDPJ/semana-al-plato/actions/runs/42422715713): 30 passing tests, 0 failures and an NSIS x64 build.
- The build was distributed only as a test artifact (ID `13594795072`; ZIP size 1,972,572 bytes; SHA-256 `f9c481cb7cff5294069e59acf0d20a6b6de89b2718e15ddc39fc9437a0472160`). v2.1.0 was not published as a release.
- An automated build alone does not confirm the installer's visual appearance or replace a manual check of this specific build on Windows.

## v2.2.0 validation

- v2.2.0 retains v2.1.0 features. Both README files now document the Spain and UK flags, application/installer/uninstaller icon, category palette, theme controls, cloning, moving, multi-selection, and the SmartScreen warning for an installer without a recognised signature.
- `npm test`: 30 passing tests and 0 failures, including palette contrast, language and flags, themes, cloning, movement, multi-selection, backups and external-link permission.
- `npm run build`: successful; generated `dist/index.html`, which is excluded from Git. `git diff --check`: successful.
- The final Windows workflow for [PR #6](https://github.com/SenecaDPJ/semana-al-plato/pull/6) completed successfully in [run 42424907500](https://github.com/SenecaDPJ/semana-al-plato/actions/runs/42424907500): 30 passing tests, 0 failures and an NSIS x64 build.
- The test installer was uploaded as an artifact (ID `13594654641`; ZIP size 1,973,055 bytes; SHA-256 `7dec3dc6797d3ab6e02b6cef40b9dee7b2f3f25933a17d6913ea270279b65854`). It is retained for 14 days.
- After PR #6 was merged, release workflow [42425539797](https://github.com/SenecaDPJ/semana-al-plato/actions/runs/42425539797) passed 30 tests again and published the production NSIS x64 installer.
- The [v2.2.0 release](https://github.com/SenecaDPJ/semana-al-plato/releases/tag/v2.2.0) contains `Semana.al.Plato_2.2.0_x64-setup.exe` (1,987,741 bytes; SHA-256 `978792095f68dde221bf4a2f1f5dc997abf6249511e3a0c13f6d9253dfe29717`). The repository was private at the original check; its owner made it public later.
- Visual review of the installer on Windows is pending; successful automation is not a visual check or a test on another computer.

## Microsoft Store preparation (`msstore/v2.2.0-msix-prep` branch)

**Status:** PREPARED, PENDING FINAL WINDOWS TESTS AND OTHER PUBLICATION REQUIREMENTS. The current MSIX candidate `2.2.0.0` was rebuilt in Actions with `MaxVersionTested=10.0.26300.0`. During the NSIS-to-MSIX transition, PowerShell Direct uninstalled NSIS (exit code 0), removed the prior MSIX and its data profile (264 files/66,353,836 bytes), and installed the local test copy with `PackageStatus=Ok`. The user imported the JSON exported from NSIS, and screenshots show both restored calendar slots; the app was then closed. A read-only check confirms package `Ok`, its data directory present, the app closed and the external backup intact. A reopen after this restore has not been confirmed. WACK recorded `OVERALL_RESULT=PASS` (23/24 tests; one optional failure and no required failures). Defender reported zero detections. The `10.0.22000.0` minimum, an MSIX-to-MSIX update and an in-place NSIS-to-MSIX install remain untested. License review, final screenshots and Partner Center decisions are pending. It is not ready for Partner Center. The exact identity was supplied and is configured on the branch.

- Starting point: tag `v2.2.0` at `39423451edeccc7640ed1826582426333cf17d48`; Windows run `42425539797` has the same SHA and completed `success`. The release publishes `Semana.al.Plato_2.2.0_x64-setup.exe`, 1,987,741 bytes. The VM downloaded the file and its SHA-256 matches the value reported by GitHub's API: `978792095f68dde221bf4a2f1f5dc997abf6249511e3a0c13f6d9253dfe29717`.
- Static review and isolated execution in the VM: outer setup is x86 PE (`Machine=0x014C`), file/product version `2.2.0`, Authenticode `NotSigned`; the asset installs the x64 app build, but embedded PEs were not inventoried. Defender's custom scan completed with real-time protection enabled and zero detections. The user later ran the installer in the VM. `Zone.Identifier` was absent after the PowerShell Direct download; none was removed or altered. Static report excluded from Git: `../Compilacion_W11/LocalTest/nsis-release-static-review-20261109-134102.json`, SHA-256 `298029BD9DF33754C877BDE4919420A4D1E81FCC0BB3241660F7956FC33FAED3`. The release workflow does not configure Authenticode signing; the v2.1.0 SmartScreen screenshot is not used as evidence of v2.2.0 signature state.
- NSIS v2.2.0 installation as `test-semana-standard`: the user confirmed first launch, language and theme changes, and persistence of those preferences after closing/reopening. PowerShell Direct verified version `2.2.0`, executable, uninstaller and shortcuts present; the app was closed at inspection. It also confirmed that MSIX `2.2.0.0` and its data directory remain present for that user: the installations coexist, so an update or NSIS-to-MSIX migration has not been tested. The installed app PE reports Authenticode `NotSigned`. Local report excluded from Git: `../Compilacion_W11/LocalTest/vm-nsis-install-verification-20261109-143348.json`, SHA-256 `BA5B5254727BB137AD4E6C099F0272EE0B1983ACFE7FAA1D38D45C46ACD25431`. NSIS uninstall remains untested.
- Migration preflight, with no package changes: the user restored `backup-before-msix-refresh.json` in NSIS and exported it again as `nsis-pre-migration-with-plan.json`. The new file passed JSON parsing and schema v1 validation: 9,246 bytes, SHA-256 `74BCD00C2E0B6DC93EAF6947F9CFFFB027BC9CE844BDEFF85B1B9323110DDBF9`, 3 categories, 60 foods, 3 recipes and 2 calendar slots. Its hash matches the source backup, confirming the restore/export round trip; this is not yet an NSIS-to-MSIX test. The signed MSIX for reinstall is available with SHA-256 `18E1F5F32C16DFCC705C3ACBA741955A91AFC682F84381D10C36BD883E56A6DA`, expected identity/publisher, version `2.2.0.0`, x64, and public certificate thumbprint `CBED60A51A124362893EB9D1CA9AC3870E1D614D`. Hyper-V checkpoint `Before-NSIS-to-MSIX-after-backup-20261109` was created before changing installations. PowerShell Direct detected NSIS was still open; no package was uninstalled or changed. Local report excluded from Git: `../Compilacion_W11/LocalTest/vm-nsis-install-verification-20261109-151822.json`, SHA-256 `7F351E5A31D1D35F2401998B25A0A55797517AF7B16AD2AE6077DE0566409059`.
- Source review: Tauri 2/Rust, HTML/CSS/JS interface; current output is NSIS x64, not portable. Tauri's default configuration downloads the WebView2 bootstrapper if the runtime is missing. No writes beside the executable, auto-updater, service, driver, elevation requirement or telemetry were found. Data stays in WebView2 local storage/localStorage. Manual JSON migration is complete and the restore was visually confirmed; the prior MSIX profile was removed during uninstall. This does not validate an in-place update or automatic profile reuse.
- `npm test`: **PASS**, 30/30 tests, 0 failures, on the Windows runner in run [42590341105](https://github.com/SenecaDPJ/Semana-al-plato/actions/runs/42590341105).
- `git diff --check`: **PASS**.
- PowerShell parser for the MSIX script: **PASS**; manifest XML parse: **PASS**.
- Tauri CLI generated package icons at 44×44, 50×50 and 150×150 plus a 300×300 Store tile from SVG: **PASS**. The tile and branding bar were visually reviewed; this is not an app screenshot.
- Clean Tauri x64 build, `npm test` and `MakeAppx`: **PASS** in Actions run [42590341105](https://github.com/SenecaDPJ/Semana-al-plato/actions/runs/42590341105), from commit `02adc670d3284fb2d3b307383cf40203feffecec`. Windows `windows-latest`, Node `v22.23.4`, npm `10.9.9`, Rust `1.99.1`, Cargo `1.99.1`, Tauri CLI `2.12.4`, MakeAppx `10.0.26100.9457`; package XML confirms x64, version `2.2.0.0`, exact identity and `MaxVersionTested=10.0.26300.0`.
- Current package: `Semana-al-Plato_2.2.0.0_x64.msix`, SHA-256 `e5da0d373c2106aea894f4ed4b8c01a09bf48858cf3321de7e201e43b8ed074d`; `.msixupload`, SHA-256 `4bd3d087593ecd676b94247c8ac7843b7995b0368f87e2b24cd7fc1d303d0ada`. Actions ZIP artifact `13660379174`, 6,576,381 bytes, SHA-256 `11375f21b8e5bcd407e21162cd96e676f6af0d86a63cdc8a432dfb0c530a1428`, expires 23 Nov 2026. It is unsigned; build/package success does not establish installation or WACK.
- The run concluded `success`. Its logs retain non-blocking Node 20 deprecation notices for v4 actions (forced to Node 24) and `punycode`/`url.parse` dependency warnings; the job had no errors.
- Windows tests on the earlier locally signed MSIX: the user confirmed install/first launch and functionality/persistence in `test-semana-standard`. That package has SHA-256 `1332C10E50DFF8C017615E00DEB76DBD13901F9A6E88990C337C06589EF73624` and `MaxVersionTested=10.0.22000.0`, so it is not the current candidate. Uninstalling from another test account removed its package and local directory (288 files/67,619,374 bytes before; absent afterwards).
- Candidate test before the transition in `test-semana-standard`, Windows 11 Enterprise Evaluation x64 build 26300: locally signed copy installed, version `2.2.0.0`, `PackageStatus=Ok`, expected identity and publisher. Signed-copy SHA-256: `18E1F5F32C16DFCC705C3ACBA741955A91AFC682F84381D10C36BD883E56A6DA`; manifest `MaxVersionTested=10.0.26300.0`. Before the transition, the user exported and restored data and confirmed it persisted after closing and reopening. That installation was then removed and Windows deleted its profile; the check after the new import is recorded separately below.
- Defender scanned the current unsigned MSIX in the VM (SHA-256 `E5DA0D373C2106AEA894F4ED4B8C01A09BF48858CF3321DE7E201E43B8ED074D`) and its locally test-signed copy (SHA-256 `18E1F5F32C16DFCC705C3ACBA741955A91AFC682F84381D10C36BD883E56A6DA`): both custom scans exited 0 with no detections, and real-time protection was enabled. Local JSON report, excluded from Git: `Compilacion_W11/LocalTest/defender-msix-report-20261109-current-artifact.json`.
- WACK 10.0.26100.9457 on Windows 11 Enterprise Evaluation x64 build 26300.0, against the current locally signed copy (`18E1F5F32C16DFCC705C3ACBA741955A91AFC682F84381D10C36BD883E56A6DA`, manifest `MaxVersionTested=10.0.26300.0`): exit code 0, `OVERALL_RESULT=PASS`, 23/24 tests passed; optional **Blocked executables** failed and no required tests failed. XML outside Git: `Compilacion_W11/LocalTest/WACK-current-candidate-20261109-124317.xml`, SHA-256 `03989A2F97D75DA1D6F0B46E3733326CE7CB3BCF8E398D118BB83B5C0024FDF4`. It detected `CreateProcessW`, `ShellExecuteW` and `CDb`, `basH`, `cmd`, `CSi`, `cmd.exe`, `\\cmd.exe`. Source review confirms `ShellExecuteW` only opens GitHub after consent; the other references have not been traced. This is not labelled a false positive or Store certification.
- Store listing copy and privacy drafts in Spanish and English are prepared under `docs/microsoft-store/`. One real candidate screenshot in Spanish is staged outside the repository and includes the Windows Evaluation watermark and VM margins; decide whether to use it or take a cleaner capture. An English screenshot is still needed.
- Actions workflow for MSIX packaging completed successfully and stored the candidate as a temporary artifact without creating a release or Partner Center submission. Manual dispatch will be available after the workflow is included on the default branch.
- Exact identity supplied: `SenecaDPJ.Semanaalplato`, `CN=6F3CA482-2B0E-4C58-95F1-BFA42598F4C9`, `SenecaDPJ`; verify against Product identity again before final submission.
- Cargo inventory filtered to `x86_64-pc-windows-msvc`: 247 external crates, 433 license texts included, 0 missing SPDX expressions and 6 without license text (`alloc-stdlib`, `selectors`, `tauri-plugin`, `webview2-com`, `webview2-com-macros`, `webview2-com-sys`). The inventory declares 5 MPL-2.0 packages and 18 Unicode-3.0 packages, with no GPL/LGPL/AGPL SPDX expressions. This summarizes metadata; it does not determine obligations. All 247 need terms review and the six gaps need resolution; legal review is **INCOMPLETE**, with no third-party clearance claimed. Search for common secret patterns in product code found no matches.
- GitHub visibility: the API reported the repository as private at the original check; its owner later changed it to public. This work did not change that setting. No new release or Partner Center submission was created.

Details and repeat steps: [MSIX preparation](docs/microsoft-store/README.en.md). The script generates packages when run on Windows with the required tools and identity.

### Follow-up — 9 November 2026

- `npm test`: **PASSED locally, 30/30**. Only the reopen test was adjusted to explicitly select the week containing its saved data; the app still opens the current week.
- Manifest XML and PowerShell packaging/inventory scripts parsed successfully. `git diff --check`: **PASSED**.
- The current candidate from Actions run [42590341105](https://github.com/SenecaDPJ/Semana-al-plato/actions/runs/42590341105) was rebuilt with `MaxVersionTested=10.0.26300.0`; MSIX SHA-256 `e5da0d373c2106aea894f4ed4b8c01a09bf48858cf3321de7e201e43b8ed074d`; `.msixupload` SHA-256 `4bd3d087593ecd676b94247c8ac7843b7995b0368f87e2b24cd7fc1d303d0ada`. Installation, visual backup import and WACK are complete within the scope recorded above; reopening after this import to confirm persistence remains pending. The `10.0.22000.0` minimum remains untested.
- Cargo inventory was generated on Windows for the x64 MSVC graph: 247 crates, 433 license texts, 0 missing expressions and 6 missing texts; human/legal review remains pending.
- The Store `.msixupload` was extracted to `../Compilacion_W11/Entrega-Store-2.2.0.0-x64/`, outside Git, alongside the MSIX, metadata, inventory and third-party notices. `.msixupload` SHA-256: `4bd3d087593ecd676b94247c8ac7843b7995b0368f87e2b24cd7fc1d303d0ada`; `.msix` SHA-256: `e5da0d373c2106aea894f4ed4b8c01a09bf48858cf3321de7e201e43b8ed074d`. The upload package is unsigned for Microsoft to sign after certification; it contains no test certificate or keys.
- The bilingual privacy policy is served from `gh-pages` (only `index.html`). The repository API reports `has_pages=true`; an HTTP check on 9 Nov 2026 confirmed `https://senecadpj.github.io/Semana-al-plato/` returned 200 and includes Spanish and English content.
- Still pending: reopen the app after importing the backup to confirm persistence, test an in-place NSIS update, verify an MSIX-to-MSIX update when a prior version exists, prepare final screenshots, review/resolve licenses, complete Partner Center decisions, and evaluate the optional WACK finding.
- The owner changed repository visibility to public. No new release was published and the product was not submitted for certification.

### Lab transition from NSIS to MSIX — 9 November 2026

- The app was closed and no `semana-al-plato.exe` process was running. PowerShell Direct verified `test-semana-standard` was a standard account, package and backup hashes, the temporary certificate already present in `LocalMachine\TrustedPeople`, and both installed products at v2.2.0.
- `nsis-pre-migration-with-plan.json` is valid (schema v1, 9,246 bytes, SHA-256 `74BCD00C2E0B6DC93EAF6947F9CFFFB027BC9CE844BDEFF85B1B9323110DDBF9`): 3 categories, 60 items, 3 recipes and 2 calendar slots. The backup remains outside the app directory.
- The NSIS uninstaller exited with code 0; its directory and uninstall registration disappeared. Removing the prior MSIX caused Windows to delete its package-local profile containing 264 files/66,353,836 bytes. The external JSON remained available.
- The locally test-signed MSIX was freshly installed for the standard account: identity `SenecaDPJ.Semanaalplato`, version `2.2.0.0`, x64 and `PackageStatus=Ok`; SHA-256 `18E1F5F32C16DFCC705C3ACBA741955A91AFC682F84381D10C36BD883E56A6DA`. The user imported the JSON and screenshots show both calendar slots restored; the app was then closed. PowerShell Direct confirmed package `Ok`, its data directory present (8 files/81,920 bytes), no running app process, and the external backup with the expected hash and counts (3 categories, 60 items, 3 recipes and 2 calendar slots). This does not confirm a reopen after restoring.
- Local PowerShell Direct reports, excluded from Git: migration `../Compilacion_W11/LocalTest/vm-nsis-to-msix-migration-20261109-152929.json`, SHA-256 `E12FE7C0E87DD6135DC63701157BD8B7C9742E8A2B6D1355BF765615F3B88474`; post-migration check `../Compilacion_W11/LocalTest/vm-post-migration-msix-data-20261109-160733.json`, SHA-256 `A91A1AE9C27E109FE888B52D577664F1D1C8AE9972FC4F8263AAAEFE184A9F36`. No release was published and the package was not submitted for certification.
