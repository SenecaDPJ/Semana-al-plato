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

**Status:** prepared, pending Windows functional tests. The candidate `.msixupload` has been generated, but it is not ready for Partner Center: installation/update has not been tested and WACK has not run. The exact identity was supplied and is configured in this branch's workflow.

- Starting point: tag `v2.2.0` at `39423451edeccc7640ed1826582426333cf17d48`; Windows run `42425539797` has the same SHA and completed `success`. The private release publishes `Semana.al.Plato_2.2.0_x64-setup.exe`, 1,987,741 bytes. SHA-256 reported by the GitHub API: `978792095f68dde221bf4a2f1f5dc997abf6249511e3a0c13f6d9253dfe29717` (not recalculated locally; the binary was not downloaded or executed).
- Binary review: version inferred from the tag/name is 2.2.0; PE metadata and Authenticode **NOT RUN** because no local file is available. The release workflow does not configure an Authenticode certificate. The v2.1.0 SmartScreen screenshot is not used as evidence of v2.2.0 signature state.
- Source review: Tauri 2/Rust, HTML/CSS/JS interface; current output is NSIS x64, not portable. Tauri's default configuration downloads the WebView2 bootstrapper if the runtime is missing. No writes beside the executable, auto-updater, service, driver, elevation requirement or telemetry were found. Data stays in WebView2 local storage/localStorage; NSIS-to-MSIX migration and uninstall cleanup need testing.
- `npm test`: **PASS**, 30/30 tests, 0 failures, on the Windows runner in run [42433732980](https://github.com/SenecaDPJ/Semana-al-plato/actions/runs/42433732980).
- `git diff --check`: **PASS**.
- PowerShell parser for the MSIX script: **PASS**; manifest XML parse: **PASS**.
- Tauri CLI generated package icons at 44×44, 50×50 and 150×150 plus a 300×300 Store tile from SVG: **PASS**. The tile and branding bar were visually reviewed; this is not an app screenshot.
- Clean Tauri x64 build and `MakeAppx`: **PASS** in GitHub Actions run [42433732980](https://github.com/SenecaDPJ/Semana-al-plato/actions/runs/42433732980), from commit `257e0411fd09dae1d9cbdc67077a7c496b0fed2e`. Run environment: Windows `windows-latest`, Node `v22.23.4`, npm `10.9.9`, Rust `1.99.1`; exact Cargo, Tauri CLI, MakeAppx and SDK details are in the artifact's `BUILD-METADATA.txt`. The local environment still lacks Rust/Cargo and MakeAppx.
- Candidate package generated: `Semana-al-Plato_2.2.0.0_x64.msix`, SHA-256 `f360916080a77dda1010d5366fd5bf693033304f558be5c623f666191820996b`; `Semana-al-Plato_2.2.0.0_x64.msixupload`, SHA-256 `605ad2b5c3d690947f64c927545aed647f0afea12227ce5aef8d6b59413671c8`. Private artifact [msstore-msix-2.2.0](https://github.com/SenecaDPJ/Semana-al-plato/actions/runs/42433732980/artifacts/13599156206), 5,576,398 bytes, SHA-256 `c31c66a381c7af5e70b7cf1d7ad34841b1a7820de95b2e02979ca9e2ed7c9651`, expires 22 Nov 2026. `MaxVersionTested=10.0.22000.0` remains provisional and is not a real test.
- The run concluded `success`. Its logs retain non-blocking Node 20 deprecation notices for v4 actions (forced to Node 24) and `punycode`/`url.parse` dependency warnings; the job had no errors.
- Standard-user install, first launch, save/reopen, NSIS/MSIX update, uninstall/residual data, Defender/SmartScreen and Windows App Certification Kit: **NOT RUN**.
- Store listing copy and privacy drafts in Spanish and English are prepared under `docs/microsoft-store/`. Authentic screenshots linked in the README are not available here as Store PNG files; final captures must come from a verified MSIX build.
- Actions workflow for MSIX packaging completed successfully and stored the candidate as a temporary artifact without creating a release or Partner Center submission. Manual dispatch will be available after the workflow is included on the default branch.
- Exact identity supplied: `SenecaDPJ.Semanaalplato`, `CN=6F3CA482-2B0E-4C58-95F1-BFA42598F4C9`, `SenecaDPJ`; verify against Product identity again before final submission.
- Transitive Cargo licenses: review **INCOMPLETE** because Cargo is unavailable; third-party clearance is not claimed until the inventory is complete. Search for common secret patterns in product code found no matches.
- GitHub visibility: the API reported the repository as private at the original check; its owner later changed it to public. This work did not change that setting. No new release or Partner Center submission was created.

Details and repeat steps: [MSIX preparation](docs/microsoft-store/README.en.md). The script generates packages when run on Windows with the required tools and identity.

### Follow-up — 9 November 2026

- `npm test`: **PASSED locally, 30/30**. Only the reopen test was adjusted to explicitly select the week containing its saved data; the app still opens the current week.
- Manifest XML and PowerShell packaging/inventory scripts parsed successfully. `git diff --check`: **PASSED**.
- `MaxVersionTested=10.0.26300.0` is confirmed by the VM's WACK XML; the manifest retains the technical minimum `10.0.22000.0`, which has not been tested. Rebuilding the MSIX in Actions and rerunning WACK on that package remain pending.
- The workflow now generates a Cargo dependency and notice inventory. It must run on Windows and requires a human review of obligations; it is not legal clearance.
- The bilingual privacy policy is prepared at `docs/microsoft-store/privacy/index.html`, with the public issue form as the proposed contact. The `gh-pages` branch still needs to be published and Pages enabled in repository settings before the public URL can be confirmed.
- Still pending: NSIS-to-MSIX update with JSON backup preservation, real screenshots from the final MSIX, new WACK, legal review of the inventory, and Partner Center fields/decisions.
- The owner changed repository visibility to public. No new release was published and the product was not submitted for certification.
