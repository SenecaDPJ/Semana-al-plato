# Microsoft Store listing — English (United States)

The `en-US` listing is saved in Partner Center submission 1 for MSIX 2.3.3.0. Traditional release v2.3.3 is published on GitHub; the MSIX is **in Microsoft's certification process** and is not yet published in Store. The listing covers the app and drag-to-move for multi-selections. User-reported functional checks and WACK are documented in `STORE-CANDIDATE-2.3.3.0.en.md`.

## Name

**Semana al Plato**

## Short description

Plan meals from Monday to Sunday, organize recipes and keep your menu on this device with JSON backups.

## Description

Organize your weekly meals with Semana al Plato. Plan breakfast, lunch and dinner for each day, combine multiple entries in a slot and change weeks whenever you need to.

Add dishes, food items and recipes to editable catalogs. Create color-coded categories, search for entries and read recipes without closing the calendar. Each recipe can include ingredients, preparation steps, time and servings.

Move entries between days in the same meal row, change their order and clone them individually. You can also select several entries and drag them together to another day in the displayed week, clone them or delete them; bulk deletion requires confirmation.

The interface is available in Spanish and English, with light and dark themes. The current week appears at startup; choose another date, move backwards or forwards, or return to today.

Your data stays on this device. The calendar is saved automatically in the application's local storage; no account is needed and the app does not sync menus to a server. You can export a JSON backup to a location you choose and restore a compatible file. Restore replaces the current data, so export a backup first if you need to keep it.

The application is for 64-bit Windows 11 and uses Microsoft Edge WebView2, which is included with Windows 11. The GitHub profile link opens in the default browser only after you confirm.

## Features

- Monday-to-Sunday plan with breakfast, lunch and dinner.
- Add multiple dishes, food items and recipes to one calendar slot.
- Editable catalogs with search, filters and color-coded categories.
- Recipes with ingredients, steps, time and servings.
- Clone entries to another day in the current week or a later date.
- Drag and reorder entries within the same meal row.
- Select several entries to clone, move by drag within the week or delete with confirmation.
- Spanish and English interface, with light and dark themes.
- Local saving and JSON backup export/restore.
- No account or meal-planning service synchronisation required.
- Opens the GitHub profile only after explicit permission.

## Suggested search terms

`meal planner`, `weekly menu`, `food calendar`, `recipes`, `meal planning`, `planificador de comidas`

## Required screenshots

Real candidate screenshots of app version 2.3.3.0, captured during the standard-profile test and staged outside Git in `Compilacion_W11/Entrega-Store-2.3.3.0-x64/`:

- Spanish, light theme: `Store-screenshot-es-ES-2.3.3.0.png`, 1395 × 981, 150,966 bytes; SHA-256 `1CB7376B94A39FEE65156C63D62A508055DF0A93AE1936FECEE75400A6E026F4`.
- English, dark theme: `Store-screenshot-en-2.3.3.0.png`, 1393 × 977, 120,409 bytes; SHA-256 `506BBFEA81BD202B1E99EA01AA3B1FEC71D0CE4D1A6A5EDF8215BE74B789DB24`.

Both images were copied unchanged from the user's supplied screenshots; they show the same calendar with three meals in the real app and contain no VM frame or Evaluation watermark. Both are PNG, exceed the desktop minimum of 1366 × 768 and are under 50 MB. The owner chose to use these two images only, one per language; no further screenshots will be added. Microsoft recommends at least four per device family and allows up to ten. Partner Center requires each image and its caption to be uploaded separately for each listing language.

Captions for the two selected screenshots (official maximum: 200 characters per caption):

- Spanish screenshot (`es-ES`): `Organiza desayunos, comidas y cenas en tu calendario semanal.`
- English screenshot (`en-US`): `Plan breakfast, lunch and dinner in your weekly calendar.`

## Listing field limits

The short description has 103 characters (field limit: 1,000; Microsoft recommends fewer than 270). The 11 product features are at most 69 characters each (up to 20, maximum 200 per feature). The description field accepts up to 10,000 characters. The `en-US` and `es-ES` listing text was saved separately in Partner Center; the package manifest declares both locales.

## Listing and certification status

The owner selected **Food + dining**, free pricing, all available markets, and listing languages **es-ES** and **en-US**. Partner Center marked pricing, properties, age ratings, packages, Store descriptions and submission options complete. Both listings were saved with the MIT licence link, one captioned screenshot per language and the completed IARC questionnaire (generated rating: 3+). Properties records “Bars and restaurants,” “Yes” for the possibility that user-entered content contains personal information, the published privacy page at `https://senecadpj.github.io/Semana-al-plato/`, the public repository as Website (`https://github.com/SenecaDPJ/Semana-al-plato`), and the public issue form as support (`https://github.com/SenecaDPJ/Semana-al-plato/issues/new`). Alternate-drive installation remains enabled; automatic OneDrive backups and game clip recording are disabled; other declarations and hardware requirements are unset. The bilingual privacy page is in `gh-pages/index.html`; the version update does not change data handling. Submission 1 is **in Microsoft's certification process**; the latest available screenshot showed preprocessing. There is no decision or Store publication yet. Publication was held until the owner selects “Publish now” after approval.
