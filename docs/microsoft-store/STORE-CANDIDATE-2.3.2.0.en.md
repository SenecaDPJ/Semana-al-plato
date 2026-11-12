# MSIX 2.3.2.0 preparation status

**Date:** 12 November 2026
**Status:** LOCAL CANDIDATE PREPARED; a visual check of this version and resolution of two WACK results remain. It is not ready for Partner Center submission.

## Scope and identity

Version 2.3.2 adds a per-monitor DPI-awareness manifest to the executable to address the warning from the previous round. It does not change application data or features. The minimum remains `10.0.26100.1742`, the exact Windows build tested.

| Field | Value |
|---|---|
| Product / MSIX version | Semana al Plato / `2.3.2.0` |
| Architecture | x64 (`x86_64-pc-windows-msvc`) |
| Package identity | `SenecaDPJ.Semanaalplato` |
| Publisher | `CN=6F3CA482-2B0E-4C58-95F1-BFA42598F4C9` |
| Publisher display name | `SenecaDPJ` |
| MinVersion / MaxVersionTested | `10.0.26100.1742` / `10.0.26300.0` |
| Source commit | `59d49fb26902415f0165545691a029c7830e9b9f` |
| Store package signature | Unsigned; Microsoft would sign after certification and publication |

## Local artifacts

Directory: `artifacts/msstore/2.3.2.0-x64-cleanbuild-retry1/` (Git-ignored; contains no private keys).

| Artifact | SHA-256 | Purpose |
|---|---|---|
| `Semana-al-Plato_2.3.2.0_x64.msix` | `C25162A06916DA8B285E26A47894C5FCB7C3B310A27201CF71F324B34B1D99F9` | Unsigned Store package |
| `Semana-al-Plato_2.3.2.0_x64.msixupload` | `85984E1CCCC2941F2E483BEB73978C43387185E27139D59B4EA9F3DB937E4DBC` | Local Partner Center upload file, without symbols |
| `Semana-al-Plato_2.3.2.0_x64-LOCALTEST.msix` | `5EF90E0D851B7835A845717E91E04CDB3BBB0E990C2A1116388A465D515C2BF2` | Locally signed package for isolated testing only |

The public test certificate expires on 26 November 2026 and was trusted only in the LTSC VM. No PFX or private key is included. The Store package and `.msixupload` are distinct from the signed test package.

## Checks

| Check | Status | Evidence and scope |
|---|---|---|
| `npm ci` and npm dependency audit | **PASS** | 41 packages; 0 vulnerabilities reported across 42 audited packages. |
| `npm test` | **PASS** | 32/32 tests. |
| Tauri x64 build and MakeAppx packaging | **PASS** | Node 22.21.0, npm 10.9.4, Rust/Cargo 1.99.1, Tauri CLI 2.12.4 and MakeAppx 10.0.19041.5609; Windows 10.0.26300.0. |
| Package identity and manifest | **PASS** | Identity, Publisher, version, architecture and minimum match the supplied values and target VM. The executable contains `true/pm` and `PerMonitorV2,PerMonitor`. |
| 2.3.1.0 → 2.3.2.0 update on Windows | **PASS, file-level scope** | Windows 11 Enterprise LTSC Evaluation 24H2 x64, build 26100.1742, administrator profile. MSIX status was `Ok`. The data directory had 174 files before and after; all six LevelDB files for `localStorage` retained identical SHA-256 values (manifest hash: `14C282387E2D6501185992EAC497934237C68993F4C296E538607BA903E0E0E2`). This is not a visual inspection of every record. |
| Defender | **PASS** | Custom scan of the artifact directory, including the signed test package: exit code 0, no detections. Run on the development host; this is not a Microsoft Store scan. |
| WACK 10.0.26100.9457 | **WARNING** | Complete run, exit code 0, `PARTIAL_RUN=FALSE`, 22/24 tests PASS. Optional `Blocked Executables` failed on references to `CreateProcessW` and `ShellExecuteW`. Required `DPIAwarenessValidation` returned `WARNING` despite the DPI manifest in the PE. This is not a clean result or certification. |
| Visual launch and interactive test of 2.3.2.0 | **PENDING** | Open this version in the VM and visually confirm the restored data, then close and reopen once. Earlier manual checks were on previous versions and are not attributed to 2.3.2.0. |
| Standard-profile update/uninstall and persistence on 2.3.2.0 | **NOT RUN** | The update and file comparison used the administrator profile. Earlier 2.3.x checks do not replace this version-specific check. |
| Microsoft Store certification | **NOT RUN** | The package was not submitted to Partner Center. |

### WACK and DPI

WACK reports a required DPI warning. Although the PE manifest contains `dpiAware=true/pm` and `dpiAwareness=PerMonitorV2,PerMonitor`, WACK says it could not process the binary and concludes that it did not detect a DPI-awareness level. This is not treated as a false positive. The XML SHA-256 is `71C3E29BD6E07F526F16024AFD394859F6577C881C19A5F7A7B1EA598D6A9EDA`; the log SHA-256 is `36E089CB4DE5A7E2A5DB721AB5C8C9A1ACA4B342F0C92D200A1AA5DAF318D791`. Both remain in the local artifact directory; the full files are not published because they contain internal VM paths.

The optional Blocked Executables test reports references to `kernel32.dll!CreateProcessW` and `shell32.dll!ShellExecuteW`. Their presence alone does not prove that the app calls these APIs during use; it has also not been proven that the references are unreachable. Keep this as an unresolved finding.

## Licences and notices

The candidate inventory records 247 crates, 443 licence files, 7 supplemental texts for 6 packages, 1,630 source-header mention lines across 64 packages, zero missing SPDX expressions and zero missing licence texts. The MSIX contains `THIRD-PARTY-NOTICES.txt`, a CSV inventory and JSON summary; it includes the three nested texts omitted from candidate 2.3.0.0 and versioned source links for the five MPL crates.

The owner confirmed on 12 November 2026 that they completed the manual review of copyright headers and `NOTICE` files. No decision log or findings list from that review has been added. `LegalReviewComplete=false` in the automated summary remains deliberately conservative: a technical inventory and header review do not constitute legal authorization to distribute. The publisher's final licence/rights clearance remains pending. See the [bilingual licence-review update](LICENSE-REVIEW-UPDATE-2.3.2.0.en.md).

## Remaining before Partner Center

- Open 2.3.2.0 in the VM administrator profile, visually confirm the preserved data and repeat close/reopen. If standard-account evidence is required, install and test the same package in `test-semana24H2-std` afterward.
- Resolve the required DPI warning and assess the optional Blocked Executables finding; rerun WACK on the final artifact if the package changes.
- Obtain final legal authorization to distribute dependencies and notices.
- Verify the GitHub Pages privacy policy over HTTP. The bilingual source is in the repository, but the published URL could not be reached in this session's check.
- Select current real screenshots in Spanish and English and complete the remaining Partner Center decisions (age rating, markets, pricing/availability, category and listing).

The Partner Center identity supplied by the owner is incorporated and matches the package. Repository visibility was not changed, no public release was created and certification was not started.
