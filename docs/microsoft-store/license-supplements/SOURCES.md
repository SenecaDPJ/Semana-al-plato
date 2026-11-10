# Supplemental Cargo license texts

These files fill license-text gaps in six locked Windows x64 crates whose published source archives do not contain a license text. They preserve each crate's declared SPDX expression; they do **not** complete the manual review of the 247-crate graph or constitute legal advice or clearance. The inventory records which text was supplemented and its upstream reference.

| Locked crate | Declared license | Bundled text | Provenance and review note |
|---|---|---|---|
| `alloc-stdlib 0.3.0` | BSD-3-Clause | `alloc-stdlib-0.3.0-BSD-3-Clause.txt` | Text copied from the companion crate's same upstream project. The Dropbox repository root `LICENSE` confirms the BSD-3-Clause text and 2016 copyright notice: [upstream LICENSE](https://github.com/dropbox/rust-alloc-no-stdlib/blob/master/LICENSE). |
| `selectors 0.38.0` | MPL-2.0 | `selectors-0.38.0-MPL-2.0.txt` | Canonical MPL-2.0 text copied from the locked graph's `cssparser 0.37.0` license file and checked against [Mozilla's MPL 2.0](https://www.mozilla.org/en-US/MPL/2.0/). The pinned [Stylo source](https://github.com/servo/stylo/tree/890aa121c6aa930c1a3c52f307fd4ba5d9410068) declares MPL-2.0; an upstream [issue documents the missing crate text](https://github.com/servo/stylo/issues/317). |
| `tauri-plugin 2.7.2` | Apache-2.0 OR MIT | `tauri-plugin-2.7.2-Apache-2.0.txt`, `tauri-plugin-2.7.2-MIT.txt` | Texts copied from the `tauri 2.12.5` crate in the same locked graph; `tauri-plugin` identifies the [Tauri repository](https://docs.rs/crate/tauri-plugin/2.7.2) as its upstream. The root license files are available as [Apache-2.0](https://github.com/tauri-apps/tauri/blob/dev/LICENSE-APACHE-2.0) and [MIT](https://github.com/tauri-apps/tauri/blob/dev/LICENSE-MIT). Confirm the exact release source before submission. |
| `webview2-com 0.39.1` | MIT | `webview2-rs-0.39.1-MIT.txt` | Text copied from the upstream workspace root [LICENSE](https://github.com/wravery/webview2-rs/blob/main/LICENSE). Its [Cargo workspace manifest](https://github.com/wravery/webview2-rs/blob/main/Cargo.toml) declares version `0.39.1` and MIT; the same text is used for the workspace's `webview2-com-macros` and `webview2-com-sys` crates. |
| `webview2-com-macros 0.8.1` | MIT | `webview2-rs-0.39.1-MIT.txt` | Same `webview2-rs` workspace and license as above. |
| `webview2-com-sys 0.39.1` | MIT | `webview2-rs-0.39.1-MIT.txt` | Same `webview2-rs` workspace and license as above. |

## SHA-256 of checked-in texts

| File | SHA-256 |
|---|---|
| `alloc-stdlib-0.3.0-BSD-3-Clause.txt` | `C0C56F26D9C051CAC4D200C34C84E7AE9AAA853E01A982A1DF08B09931E518AE` |
| `selectors-0.38.0-MPL-2.0.txt` | `FAB3DD6BDAB226F1C08630B1DD917E11FCB4EC5E1E020E2C16F83A0A13863E85` |
| `tauri-plugin-2.7.2-Apache-2.0.txt` | `0D542E0C8804E39AA7F37EB00DA5A762149DC682D7829451287E11B938E94594` |
| `tauri-plugin-2.7.2-MIT.txt` | `9DD42EA92CFF2EDE5CD477CBFCCE051B2D0115C0AC7F368EE88CB545055DFF1D` |
| `webview2-rs-0.39.1-MIT.txt` | `0DCF41516E608BBCB6CDC5229FEB7B86FE4A643B85E7DF251133C93408FDAC73` |

The source copies are pinned in Git and the exporter records their use, but the license choices and any obligations specific to the distributed binaries still require human review.
