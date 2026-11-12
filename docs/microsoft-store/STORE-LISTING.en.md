# Microsoft Store listing — English (United Kingdom)

Partner Center draft reviewed against local candidate 2.3.3.0. It includes drag-to-move for multi-selections; it does not claim that this version is released or certified. User-reported functional checks and the local WACK result are documented in `STORE-CANDIDATE-2.3.3.0.en.md`.

## Name

**Semana al Plato**

## Short description

Plan meals from Monday to Sunday, organise recipes and keep your menu on this device with JSON backups.

## Description

Organise your weekly meals with Semana al Plato. Plan breakfast, lunch and dinner for each day, combine multiple entries in a slot and change weeks whenever you need to.

Add dishes, food items and recipes to editable catalogues. Create colour-coded categories, search for entries and read recipes without closing the calendar. Each recipe can include ingredients, preparation steps, time and servings.

Move entries between days in the same meal row, change their order and clone them individually. You can also select several entries and drag them together to another day in the displayed week, clone them or delete them; bulk deletion requires confirmation.

The interface is available in Spanish and English, with light and dark themes. The current week appears at startup; choose another date, move backwards or forwards, or return to today.

Your data stays on this device. The calendar is saved automatically in the application's local storage; no account is needed and the app does not sync menus to a server. You can export a JSON backup to a location you choose and restore a compatible file. Restore replaces the current data, so export a backup first if you need to keep it.

The application is for 64-bit Windows 11 and uses Microsoft Edge WebView2, which is included with Windows 11. The GitHub profile link opens in the default browser only after you confirm.

## Features

- Monday-to-Sunday plan with breakfast, lunch and dinner.
- Add multiple dishes, food items and recipes to one calendar slot.
- Editable catalogues with search, filters and colour-coded categories.
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

Both images were copied unchanged from the user's supplied screenshots; they show the same calendar with three meals in the real app and contain no VM frame or Evaluation watermark. Both are PNG, exceed the desktop minimum of 1366 × 768 and are under 50 MB. One screenshot per device family is the minimum; Microsoft recommends at least four per family and allows up to ten. Three additional screenshots per language can better complete the listing by showcasing other features. Partner Center requires images and captions to be uploaded separately for each listing language.

Suggested localized captions (official maximum: 200 characters per caption):

- Screenshot 1 (light theme): `Plan breakfast, lunch and dinner in your weekly calendar.`
- Screenshot 2 (dark theme): `View the weekly plan with each day and meal time.`
- Additional screenshot: `Select several entries to clone, move together or delete them.`
- Additional screenshot: `Switch between light and dark themes and English and Spanish.`

## Listing field limits

The current short description has 103 characters (field limit: 1,000; Microsoft recommends fewer than 270). The 11 product features are at most 69 characters each (up to 20, maximum 200 per feature). The description field accepts up to 10,000 characters. These drafts are prepared for `es-ES` and `en-GB`; complete each language separately in Partner Center. The package manifest declares `es-ES` and `en-US`, so decide whether British English will be an additional Store listing language or whether the listing should use US English.

## Partner Center decisions still pending

In Partner Center, check the reserved name and product identity; choose the required category, markets and price/availability; complete the age-rating questionnaire; review licence terms; and verify the published privacy URL: `https://senecadpj.github.io/Semana-al-plato/`. Complete Spanish and English listings; decide whether British English (`en-GB`) should be an additional listing next to the package's US English (`en-US`) resource. Leave “What's new” blank for a first submission. Review whichever contact details are required for the account type. Proposed support URL: public GitHub issue form at `https://github.com/SenecaDPJ/Semana-al-plato/issues/new` (issues are public; users should not include personal data). No draft or certification submission has been created.
