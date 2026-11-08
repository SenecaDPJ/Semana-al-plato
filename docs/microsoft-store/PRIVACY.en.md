# Privacy policy draft — Semana al Plato

**Status:** draft for review before publication. It describes the inspected v2.2.0 code; retention while and after uninstalling the MSIX package still requires a Windows test. Do not publish this draft as the final policy URL until the publisher's public contact is added and that test is complete.

## Data and storage

Semana al Plato stores the calendar plan, names of dishes and food items, categories, and recipe names, ingredients, preparation steps, times and servings on the device. Calendar data is saved automatically in `localStorage` inside the app's WebView2 profile. Theme and language preferences are saved separately on the same device. The app does not ask you to create an account.

There is no cloud sync, analytics, advertising or app telemetry. The inspected code does not send menus, recipes or preferences to a Semana al Plato server.

## External connections

The only network action initiated by the interface is opening `https://github.com/SenecaDPJ` in the default browser after a confirmation prompt. If you accept, navigation and any data shared by the browser are governed by GitHub's and the selected browser's privacy policies.

The application uses Microsoft Edge WebView2. Windows/Microsoft services the Evergreen runtime. The current NSIS installer may download the WebView2 bootstrapper if the runtime is missing. The Microsoft Store package will target Windows 11, which includes WebView2 Evergreen.

## Backups and user control

**My data → Export backup** creates a JSON file at a location you choose. That file may contain the data listed above; store and share it carefully. **Restore backup** reads a JSON file you select, validates it and replaces the current data after confirmation. The JSON backup does not include theme and language preferences.

The app does not send backups off the device. You control whether to export, where to save the file and whether to share it with anyone else.

## Retention and deletion

Working data remains in the app's local profile until Windows removes it or the user deletes it using Windows tools. The app does not provide a separate “delete all my data” feature.

**Verification pending:** test in a Windows 11 VM whether uninstalling the MSIX package causes Windows to remove Tauri's WebView2 profile or leaves data outside the package. Until that test is complete, this policy does not promise that uninstall removes all data. Export a JSON backup before migrating from NSIS.

## Children and sensitive data

The app does not request or require special-category personal data. Names, recipe text and dates you enter may be personal information if you choose to include it. Do not enter information that you do not want stored locally or included in a shared backup.

## Changes and contact

This policy will be updated if the app's collection, storage or connection behaviour changes.

**Publisher's public contact:** to be added before publishing the listing or linking this policy.
