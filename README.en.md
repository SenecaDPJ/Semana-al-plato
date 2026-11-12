# Semana al Plato

**Your week, one meal at a time.** A meal planner for Windows 11 to organise breakfast, lunch and dinner, keep your recipes and build a menu that suits you.

[Español](README.md) · **English**

[Download for Windows 11 · x64 · v2.2.0](https://github.com/SenecaDPJ/semana-al-plato/releases/download/v2.2.0/Semana.al.Plato_2.2.0_x64-setup.exe) · [Releases](https://github.com/SenecaDPJ/semana-al-plato/releases) · [Report an issue](https://github.com/SenecaDPJ/semana-al-plato/issues)

The v2.3.3 test candidate includes drag-to-move for selected groups within the displayed week and fixes the version shown in the interface. It remains a test build; the latest public download is still v2.2.0. The MSIX package status is in the [Microsoft Store preparation notes](docs/microsoft-store/STORE-CANDIDATE-2.3.3.0.en.md).

<img width="1397" height="1013" alt="Semana al Plato screenshot from 7 November 2026" src="https://github.com/user-attachments/assets/0979efb0-9209-41ca-82d7-4d47ece8d2a4" />

<img width="1394" height="1010" alt="Second Semana al Plato screenshot from 7 November 2026" src="https://github.com/user-attachments/assets/fe564464-a3e8-4745-8dbf-34e497739123" />

## What you can do

Semana al Plato brings your calendar and catalogues together. Plan complete dishes, add individual food items, or schedule recipes with ingredients and preparation steps. Each slot supports multiple entries: for example, coffee, toast and fruit for Monday's breakfast.

It works locally, without an account or a meal-planning service. Your menu stays on your device and can be transferred through a JSON backup. Everyday planning does not require a connection; downloading the application and setting up its development tools may require one.

| Feature | What it does |
| --- | --- |
| Monday-to-Sunday calendar | Shows a full week with breakfast, lunch and dinner every day. |
| Current week on startup | Opens the relevant week and highlights the current day. |
| Week picker, arrows and Today | Lets you plan future weeks, review previous ones and return to the current week. |
| Multiple entries per slot | Combines dishes, drinks, food items and recipes without replacing existing entries. |
| Editable catalogues | Creates, searches, filters by category, edits and deletes dishes and food items. |
| Colour-coded categories | More distinct default colours and a palette of 14 text colours by 14 fills: 196 combinations with legible contrast. |
| Application icon | Shows the Semana al Plato icon in the app, Windows installer and uninstaller. |
| Built-in recipe collection | Stores ingredients, instructions, minutes and servings, and schedules recipes. |
| Non-modal recipe panels | Keeps the calendar usable while viewing a recipe; panels can be moved by their headers. |
| Light and dark themes | Switches appearance with the moon/sun button and remembers the choice. |
| Spanish and English | Translates the interface, calendar, original categories and starter examples. Shows the Spanish flag for Español and the UK flag for English. The label is red and the button is lime green or blue according to the selected language. Remembers your choice; Spanish is selected on first launch. |
| Individual and group cloning | Copies entries to another day in the current week or to a date in another week, preserving each meal slot. |
| Drag and reorder | Moves entries between days in the same row and changes their order within a slot. |
| Invalid move feedback | Marks an invalid target with a prohibition symbol and a prominent warning in both themes. |
| Multi-selection | Drag from an empty calendar area to select entries, then choose **Move within this week**, **Clone ALL**, **Delete ALL** or cancel. Group movement preserves rows and day offsets; deletion requires two confirmations. |
| Confirmed profile link | Opens the GitHub profile only after you confirm. |
| Local saving and JSON backups | Retains your plans and lets you export or restore them. |
| Change confirmation | Lets you review where an entry will be added and confirm deletions. |

## Download and install

1. Download **Semana.al.Plato_2.2.0_x64-setup.exe** using the link above or the [v2.2.0 release](https://github.com/SenecaDPJ/semana-al-plato/releases/tag/v2.2.0).
2. Run the installer and follow its instructions.
3. Open **Semana al Plato** and start planning.

The available installer targets **64-bit Windows 11**. You do not need Node.js, Rust or programming tools to use it. The application uses Microsoft Edge WebView2 to render its interface on Windows.

Because the installer is not signed with a recognised publisher certificate, Microsoft Defender SmartScreen may show “Windows protected your PC” or “Unknown publisher”. This is a Windows reputation warning. The application does not change security settings or run commands to bypass it. Download the installer only from this repository's official release and continue only if you trust its source.

**Project status:** the author is currently the only person who has installed the application. It is not presented as community-validated software or as tested on other computers. Recorded build and verification details are available in the [Spanish validation log](VALIDACION.md) and [English](VALIDACION.en.md).

## Getting started

The application starts in Spanish. Use **Language → English** in the header to switch the interface. The preference is saved on this device.

### 1. Choose a week

The current week appears on startup. Under **WEEK**, choose any date to display the week containing it. Use **← / →** to move between weeks and **Today** to return to the current week.

The three rows are **Breakfast**, **Lunch** and **Dinner**. The “X of 21 time slots” counter shows how many slots contain entries, not the number of dishes or servings.

### 2. Add what you want to eat

There are two starting points:

- **Top buttons:** select **Add dish** or **Add food**, search or filter the catalogue and choose an entry. A banner asks you to select a slot. Click the desired day and meal, then confirm.
- **A calendar slot:** click **+**, choose a dish, food item or recipe, select the entry and confirm adding it to that slot.

Repeat to add several entries. Existing entries are retained. **Cancel** exits without adding the entry.

**Example:** add “Café”, “Tostada con tomate” and “Fruta” to Monday's breakfast. Food items and complete dishes can share a slot.

### 3. Personalise your catalogues

In the relevant catalogue, select **Add a new dish** or **Add new food**, enter a name and assign a category. Built-in entries can also be edited with **Edit** or deleted with **Delete**.

Duplicate names are rejected within each catalogue, ignoring differences in letter case, accents and repeated spaces. Editing an entry updates its appearances in the calendar.

### 4. Organise with categories

Select **Add category**, enter a name and choose text and fill colours. A preview shows the result before you save it.

The original **Breakfast**, **Lunch** and **Dinner** categories are protected. Custom categories can be edited and deleted, provided no food items, dishes or recipes use them.

Categories are labels: they do not add calendar rows or restrict placement. A dish categorised as dinner can also be scheduled for lunch.

### 5. Use your recipes

Select **Add recipe** to open the collection. Double-click a recipe or select **Open** to view its ingredients and instructions in another panel. Both panels leave the calendar usable.

Use **Create a new recipe** to save a name, category, minutes, servings, ingredients and method. Recipes can be edited, deleted and scheduled with **Add to calendar**.

### 6. Change the theme

Click the **☾ / ☀** button in the header to switch between light and dark themes. In the light theme, the black button shows a white moon; in the dark theme, the white button shows a yellow sun. The preference is saved locally. This is a manual choice; there is no setting to follow the operating system theme automatically.

### 7. Change the language

The application starts in **Español** and displays the Spanish flag beside the language name. Select **Idioma → English** to switch; the UK flag is displayed. The interface, calendar, original categories and starter examples are translated. The preference is saved on this device. Names you enter yourself stay as written.

### 8. Remove an entry without deleting it from the catalogue

Click an entry in the calendar and choose **Remove from this slot**. It remains available for other days.

Deleting it from its catalogue or the recipe collection also removes its calendar appearances. The confirmation reports the affected appearances.

### 9. Clone, move and select multiple entries

- Click a calendar entry and choose **Clone** to copy it to another day in the same week or to a date in another week. Its breakfast, lunch or dinner row is preserved.
- Press and hold an entry, then drag it to reorder it within its row or move it to another day in that row.
- If you try to drop it into a different row, the cell shows a large prohibition symbol and a prominent red warning, dark-filled in the light theme and light-filled in the dark theme.
- To work with multiple entries, drag from an empty area of the calendar. Choose **Move within this week**, **Clone ALL** or **Delete ALL**. When moving, the selection stays highlighted: drag one selected card to another day and the group keeps its rows and day offsets within the displayed week. Cloning asks for a destination day; deleting requires two confirmations.
- The **github.com/SenecaDPJ** link asks for confirmation before opening the profile in the default browser.

## Starter content

The first run includes **30 food items and 30 dishes**: ten of each type for each original category. These are editable examples, not a mandatory meal plan.

| Category | Example food items | Example dishes |
| --- | --- | --- |
| Breakfast | Coffee, milk, fruit, oats | Omelette, tomato toast, yoghurt with fruit |
| Lunch | Lettuce, oily fish, chickpeas | Spaghetti Bolognese, Spanish stew, paella |
| Dinner | Rice, eggs, courgette | Poached hake fillet, boiled egg, courgette soup |

The recipe collection starts with **tomato and olive oil toast**, **simple chickpea salad** and **creamy courgette soup**, including ingredients, method, time and servings. The starter examples follow the selected language.

## Your data and backups

Confirmed changes are saved automatically in the application's local storage. There is no account, menu server or automatic cross-device synchronisation.

- **Export:** open **My data → Export backup**. The Windows application opens a native dialog to choose where to save `Semana_al_Plato_copia.json`. The standalone HTML version starts a browser download.
- **Restore:** open **My data → Restore backup**, choose a compatible JSON file and confirm. Its structure is validated before changes are applied.
- **Backup contents:** calendar, food items, dishes, recipes and categories. Theme and language preferences are stored separately and **are not included**.
- **Replace, not merge:** restoring replaces current data. Export first if you want to keep it. Files of up to 5 MB are accepted.
- **Another device or browser:** use export and restore. The standalone HTML and installed application do not share their data automatically.

Keep backups before clearing application data, changing computers or making major changes. A JSON file contains the names and text you entered: only share it if you also intend to share that information.

## Technologies and development

| Technology | Role |
| --- | --- |
| HTML, CSS and modular JavaScript | Calendar, forms, panels, themes and interactions, without a frontend framework. |
| Tauri 2 and Rust | Desktop shell and native functions, including a Windows backup save dialog. |
| Microsoft Edge WebView2 | Interface rendering engine on Windows. |
| localStorage and JSON | Local persistence and structurally validated backups. |
| Node.js | Local development server and standalone HTML generation. |
| Node Test Runner and jsdom | Logic and interaction tests in a simulated DOM. |
| NSIS | Windows installer generation. |

Separating the logic, interface and desktop shell supports work on future ports. **Linux/Ubuntu and Android remain future targets; this release does not provide verified native versions for those systems.**

### Run from source

This section is for development and builds; it is not required to install the EXE. The interface requires Node.js compatible with the project's dependencies. Windows Tauri builds also require Rust/MSVC, Microsoft C++ Build Tools, the Windows SDK and WebView2. See the [Tauri prerequisites](https://v2.tauri.app/start/prerequisites/).

Run these commands from the repository root.

🔴 EJECUCIÓN⚙️🚨 — Installs locked dependencies into `node_modules`.

```powershell
npm ci
```

🔴 EJECUCIÓN⚙️🚨 — Regenerates `dist/` and runs tests. Does not modify the user's saved menus.

```powershell
npm test
```

🔴 EJECUCIÓN⚙️🚨 — Starts the local interface server; open `http://127.0.0.1:1420`. Stop it with Ctrl+C.

```powershell
npm run dev
```

🔴 EJECUCIÓN⚙️🚨 — Builds and opens the desktop application in development mode; may download dependencies and create build files.

```powershell
npm run tauri -- dev
```

🔴 EJECUCIÓN⚙️🚨 — Generates the interface and Windows installer. Does not install the resulting application automatically.

```powershell
npm run tauri -- build
```

The installer is generated in `src-tauri/target/release/bundle/nsis/`. `npm run build` produces `dist/index.html`, which can also be opened in Edge as standalone HTML. Edit `src/` and `index.html`; `dist/` is generated.

| Path | Contents |
| --- | --- |
| `src/domain.js` | Local dates, starter data, rules and validation |
| `src/storage.js` | Persistence and backup export |
| `src/app.js` | Calendar, catalogues, recipes, language and theme |
| `src/i18n.js` | Interface and starter-content translations |
| `src/style.css` | Layout, size adaptation and themes |
| `scripts/` | Build and development server |
| `tests/` | Logic and simulated interaction tests |
| `src-tauri/` | Rust code, native configuration and icons |
| `docs/` | Documentation resources |

## Current scope

The interface starts in **Spanish** and can be switched to English from the language selector. Text entered by the user stays in the language in which it was written.

There is no automatic menu generation, nutritional analysis, automatic shopping list or cloud synchronisation. Simulated tests do not replace real installation, window and saving checks on Windows.

## Author and licence

Created by [David De Prado · SenecaDPJ](https://github.com/SenecaDPJ).

© 2026 David De Prado. Distributed under the [MIT licence](LICENSE).

## Microsoft Store preparation

MSIX preparation is documented in [docs/microsoft-store](docs/microsoft-store/README.en.md). Local candidate 2.3.2.0 adds a per-monitor DPI manifest and keeps `MinVersion=10.0.26100.1742`. `npm test` passed 32/32; Defender found no threats, and the 2.3.1.0→2.3.2.0 update preserved all six `localStorage` LevelDB files byte for byte on Windows 11 Enterprise LTSC Evaluation 24H2 x64, build 26100.1742. PowerShell Direct later confirmed package 2.3.2.0 `Ok`, the app closed, and 174 files in the WebView2 profile, including all six LevelDB files; on-screen content confirmation is still pending. WACK completed with a DPI warning and an optional Blocked Executables failure. Microsoft describes WACK as deprecated and optional for local pre-submission checks; this result remains a technical warning, not certification or an automatic submission block. The owner confirmed manual review of copyright headers and `NOTICE` files; final legal authorization remains pending. The bilingual 2.3.2 policy is published on GitHub Pages and returned HTTP 200 on 12 Nov 2026. Before Partner Center, the visual confirmation, final screenshots and listing decisions remain. The latest public download remains v2.2.0; no release has been created and the product has not been submitted for certification.
