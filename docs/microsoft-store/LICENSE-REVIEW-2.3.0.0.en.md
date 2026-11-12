# Manual Rust licence review — MSIX candidate 2.3.0.0 x64

> **Historical report for candidate 2.3.0.0.** For the notice status in package 2.3.2.0, the owner's confirmation of manual header review and remaining decisions, see the [2.3.2.0 update](LICENSE-REVIEW-UPDATE-2.3.2.0.en.md). Conclusions below describe candidate 2.3.0.0, not the current package.

**Status: technical screening of expressions and bundled texts completed for all 247 records; legal authorization to distribute is NOT complete.** This is not a legal opinion, does not confirm compatibility of every licence, and does not declare the package authorized for publication.

## Scope and reviewed material

- Candidate: product version `2.3.0`, package version `2.3.0.0`, x64, target `x86_64-pc-windows-msvc`.
- Origin: [Actions run 42812887051](https://github.com/SenecaDPJ/semana-al-plato/actions/runs/42812887051), commit `888f95cf7440911c84c1e42ff7a8e3323eb3b6cb`.
- Unsigned Store MSIX: `Semana-al-Plato_2.3.0.0_x64.msix`, SHA-256 `E695F60F086E95A2D6FCAF1AD48B0D1FAD27824132E7AD5AEB1DEC7B2F97E2C6`.
- The 247 rows in `CARGO-LICENSE-INVENTORY.csv`, their literal expressions and included file names were checked; every referenced path was verified after normalizing the `;` separator. The candidate inventory's 440 files (including 7 supplements) were grouped by SHA-256 into 168 distinct contents. All 168 complete text bodies were verified to appear in `THIRD-PARTY-NOTICES.txt` after normalizing line endings. A later source-tree audit found three nested legal texts absent from that inventory; see the source section. Individual rows are listed in [LICENSE-REVIEW-2.3.0.0-CRATES.csv](LICENSE-REVIEW-2.3.0.0-CRATES.csv).
- Candidate evidence hashes: inventory `1CC3DA8B2974F8523345E6DE01B1D1B0A2FB32BDE0C2C9B279F947A678E38BE4`; JSON summary `081359A26C0F651D1591596D47D3EE294C8C24A19996BDF330BCC5C3B78756A1`; aggregate notices `0797705C250E2FB800D1685733CA14B81169B538C32BE8C88D745ED7BC7BA261`.

## Screening result

| Check | Result | Evidence |
|---|---|---|
| Package/version records in the x64 graph | **247 reviewed** | Candidate CSV; 239 distinct crate names |
| Declared licence expression | **247/247 present** | JSON summary: zero missing expressions |
| Files declared in candidate inventory | **247/247** | 440 paths declared; their 168 distinct texts appear in the aggregate notices. The recursive source audit found three additional legal texts missing from the candidate. |
| Supplemental licence texts | **7 of the 440 texts, for 6 crates** | `license-supplements/SOURCES.md`; published VCS revisions and text comparisons have been checked for all six crates |
| GPL/LGPL/AGPL declared in metadata | **None** | Describes Cargo declarations only; not an analysis of distributed code |
| Legal authorization to distribute | **NOT COMPLETE** | Requires resolving the issues below |

The JSON embedded in the package predates this review and still says `PackagesRequiringManualLicenseReview=247`. That counter reflects build-time state and was not updated; the current technical screening is recorded in this report and matrix. `LegalReviewComplete=false` remains accurate while distribution requirements and legal authorization are unresolved. The MSIX was not changed or rebuilt.

The most common expressions are `MIT OR Apache-2.0` (120), `MIT` (44), `Apache-2.0 OR MIT` (28), `Unicode-3.0` (18), `Unlicense OR MIT` (8) and `MPL-2.0` (5). The count of 18 is for the exact literal expression; `unicode-ident` adds a compound `(MIT OR Apache-2.0) AND Unicode-3.0` case, so 19 rows contain Unicode obligations. Cargo defines `OR` as a choice and `AND` as simultaneous compliance; the field is an SPDX expression. Cargo marks `/` as deprecated, while the Rust Style Guide documents its widespread convention as a substitute for `OR` ([Cargo](https://doc.rust-lang.org/cargo/reference/manifest.html#the-license-and-license-file-fields), [Rust Style Guide](https://doc.rust-lang.org/style-guide/cargo.html)). The nine legacy slash declarations were preserved literally and screened as declared; the inventory was not rewritten.

Two compound expressions were checked package by package: `brotli 9.1.1` declares `BSD-3-Clause AND MIT`, both texts are present, and both sets of obligations apply; `unicode-ident 1.0.27` declares `(MIT OR Apache-2.0) AND Unicode-3.0`, with all three texts present. For `unicode-ident`, one MIT/Apache branch is selected and the Unicode notice and restrictions also remain applicable. The matrix records each package.

## Downloaded source audit

- Read-only `cargo metadata --offline --locked --filter-platform x86_64-pc-windows-msvc` resolved 247 external packages; all 247 crate/version pairs match the matrix and their source directories are present in the cache. No build or application execution was performed.
- A recursive search for files named `LICENSE`, `LICENCE`, `COPYING`, `NOTICE` or `COPYRIGHT` found 436 files in those source trees. No file whose name starts with `NOTICE` was found. The previous exporter collected legal files only from a package root and its `LICENSES/` directory, so three nested files were absent from candidate 2.3.0.0:

| Crate | Omitted source file and SHA-256 | Relevance to Windows x64 |
|---|---|---|
| `regex-syntax 0.8.11` | `src/unicode_tables/LICENSE-UNICODE` — `74DB5BAF44A41B1000312C673544B3374E4198AF5605C7F9080A402CEC42CFA3` | `cargo tree -e features` confirms active Unicode features in `regex-syntax`; the Unicode data notice should accompany those tables. |
| `tracing-core 0.1.36` | `src/spin/LICENSE` — `58545FED1565E42D687AECEC6897D35C6D37CCB71479A137C0DEB2203E125C79` | The resolved graph has `tracing-core` without `std`; the `spin` fallback and its MIT text are conservatively retained. |
| `rfd 0.17.2` | `src/backend/xdg_desktop_portal/window_identifier/LICENSE` — `AE26BC7B1BC91FB8648F6A298DECBB1A77090A56C9D04E2C23B8365E5F54ACB5` | This is under the Linux-only XDG backend, not the Windows backend; it will still be included to preserve attribution conservatively when distributing the crate. |

- Comment lines containing `Copyright`, `©` or `SPDX-License-Identifier` were searched in the first 40 lines of 24 source/documentation-code extensions. The scan found 1,630 matches across 62 crate names (85 distinct normalized lines). Reproducible crate/path/line details are in [SOURCE-HEADER-SCAN-2.3.0.0.csv](SOURCE-HEADER-SCAN-2.3.0.0.csv), SHA-256 `5DF0881A9FE87B5B9DB9822E03F9F342F21FBB7F1688A6469F58FD015269C90E`. This includes SPDX identifiers and repeated mentions; it is not an individual legal determination for each file and does not cover comments after line 40.
- The branch exporter now finds these legal files recursively, preserves relative paths and adds the located header mentions to generated notices. Candidate 2.3.0.0 is immutable and **was not regenerated**: it still lacks the three nested texts and that header appendix. The next delivery needs a new, unique payload/version.

## Obligations observed by licence family

- **MIT:** retain the complete copyright, permission and warranty/liability disclaimer ([SPDX text](https://spdx.org/licenses/MIT.html)).
- **Apache-2.0:** retain copyright, licence text and applicable notices; mark changes to covered files if modified ([SPDX text](https://spdx.org/licenses/Apache-2.0.html)). The recursive scan found no files named `NOTICE` in the 247 crate trees; this does not rule out notices under other names or linked external code.
- **BSD-3-Clause:** retain copyright, conditions, disclaimer and prohibition on using contributor/holder names to endorse the product ([SPDX text](https://spdx.org/licenses/BSD-3-Clause.html)).
- **Unicode-3.0:** preserve the Unicode copyright/permission notice and do not use the holder's name for promotion without permission ([SPDX text](https://spdx.org/licenses/Unicode-3.0.html)).
- **MPL-2.0:** file-level copyleft. Executable distribution requires informing recipients how to obtain MPL source; covered modifications, if distributed, must also be made available under the MPL. Mozilla's FAQ explains these obligations and recommends reading the licence text for the specific case ([official FAQ](https://www.mozilla.org/en-US/MPL/2.0/FAQ/), [MPL 2.0 text](https://www.mozilla.org/en-US/MPL/2.0/)).
- **Unlicense, CC0-1.0, MIT-0, 0BSD and Zlib:** bundled texts/notices were retained; apply the terms and disclaimers of the selected alternative. SPDX links to the reference texts ([SPDX License List](https://spdx.org/licenses/)).

## Cases requiring follow-up before submission

| Crate(s) | Screening result | Pending action |
|---|---|---|
| `cssparser 0.37.0`, `cssparser-macros 0.7.1`, `dtoa-short 0.3.5`, `option-ext 0.2.0`, `selectors 0.38.0` | Five `MPL-2.0` declarations; the full MPL text is in the notices. | The current immutable candidate only shows the generic crates.io index. The branch exporter has been updated to include a versioned crate page and versioned source archive for each package on the next generation. Before distribution, regenerate the notices/MSIX and check that all ten URLs are present; also review whether any MPL-covered file was modified. Mozilla requires distributors to tell recipients how to obtain the source. |
| `dpi 0.1.2` | Declares `Apache-2.0 AND MIT`; both texts are included. `dpi` documentation says its default `std` feature changes the effective licence to Apache-2.0, while disabling `std` uses MIT-licensed `libm` code ([version docs](https://docs.rs/crate/dpi/0.1.2), [upstream README](https://github.com/rust-windowing/winit/blob/master/dpi/README.md)). | `cargo tree --offline --locked --target x86_64-pc-windows-msvc -e features -i dpi@0.1.2` confirms `dpi [default,serde,std]`; `dpi/std` is active in the resolved graph. Both declared texts are included. ([Cargo](https://doc.rust-lang.org/cargo/reference/features.html), [Tauri 2.12.2](https://docs.rs/crate/tauri/2.12.2/features), [Wry 0.57.1 manifest](https://docs.rs/crate/wry/0.57.1/source/Cargo.toml), [dpi 0.1.2](https://docs.rs/crate/dpi/0.1.2)) |
| `brotli-decompressor 6.2.0` | Literal declaration `BSD-3-Clause/MIT`; only the full BSD-3 text is present. | Cargo/Rust convention permits `/` to stand for `OR`; the BSD branch is available. Keep its complete text and conditions in the final package. |
| `ident_case 1.0.1` | Declares `MIT/Apache-2.0`; the included crate file is MIT. | Under the `/`-as-`OR` convention, the MIT branch is available; retain its full notice. |
| `dunce 1.0.5` | Declares `CC0-1.0 OR MIT-0 OR Apache-2.0`; the complete CC0-1.0 text is included. | The CC0 branch is available; retain the bundled text. |
| `crossbeam-channel 0.5.17` | Includes MIT and Apache plus an additional `LICENSE-THIRD-PARTY` file of about 33 KB. | Retain the complete third-party file too; do not reduce it to the main MIT/Apache notice. |

### Supplemental texts

The supplements cover `alloc-stdlib 0.3.0` (BSD-3), `selectors 0.38.0` (MPL-2.0), `tauri-plugin 2.7.2` (Apache-2.0 OR MIT), `webview2-com 0.39.1`, `webview2-com-macros 0.8.1` and `webview2-com-sys 0.39.1` (MIT). Published versions and VCS revisions were checked for all six crates, and each supplemental text was compared with the exact revision's license file or, for `selectors` whose crate archive has no licence file, with canonical MPL text from a locked dependency and Mozilla. References and hashes are in [license-supplements/SOURCES.md](license-supplements/SOURCES.md).

## Limits and outstanding decisions

1. The source audit is a reproducible file-name and header-mention scan, not a line-by-line legal review of all code, crate-specific exceptions, linked components or atypically named notices. The automatic header detail covers the first 40 lines of the source types listed in the scan CSV.
2. The current candidate contains no versioned per-crate MPL source links and omits the three nested texts found in the audit. The exporter will include them in a new generation, but a unique-version payload must be rebuilt and reviewed before distribution.
3. `dpi/std` is confirmed by Cargo resolver output. Both declared texts are present; the source audit adds the nested notices documented above.
4. No file named `NOTICE*` was found; this does not establish that equivalent notices do not exist under other names, nor does it replace human review of the 1,630 header candidates.
5. A responsible publisher must confirm that notices remain in the final MSIX and decide whether professional legal review is needed. An open-source licence or successful WACK result is not automatic redistribution permission.

**Conclusion:** screening of the 247 records, texts and six supplemental provenance checks, along with the source/header scan, is documented. Three nested texts missing from candidate 2.3.0.0 were identified; the corrected exporter will add them and the header mentions on the next generation. Legal distribution authorization and final human review of the header candidates remain open. No tests or builds were run, the MSIX was not rebuilt or changed, and nothing was published.
