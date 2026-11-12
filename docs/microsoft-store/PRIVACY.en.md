# Privacy policy — Semana al Plato

**Status:** source text updated for local candidate v2.3.2.0. The DPI manifest change does not alter data, telemetry or connections; moving multi-selections reorganises existing local data. The uninstall observations below concern v2.2.0 and were not repeated for 2.3.2.0. The bilingual web source remains on the `gh-pages` branch; an HTTP check could not confirm that the deployed page is current. This policy describes local storage and test limits; it does not guarantee that Windows will remove or retain data on every version or account.

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

**Tests performed:** in a standard account on a Windows 11 Enterprise LTSC 24H2 VM, uninstalling MSIX 2.2.0.0 left the app's local profile in place: 183 files and 5,205,784 bytes. Comparison with a pre-uninstall copy found the persistent data unchanged; seven volatile WebView2 cache files differed. In a separate uninstall test and account, Windows removed the package directory. These results show that retention may vary by profile and installation context; neither retention nor removal of local data is guaranteed. Export a JSON backup before uninstalling or migrating. JSON files exported elsewhere and copies a user has shared are not removed with the app.

## Children and sensitive data

The app does not request or require special-category personal data. Names, recipe text and dates you enter may be personal information if you choose to include it. Do not enter information that you do not want stored locally or included in a shared backup.

## Changes and contact

This policy will be updated if the app's collection, storage or connection behaviour changes.

**Publisher contact:** [public GitHub issue form](https://github.com/SenecaDPJ/Semana-al-plato/issues/new). Issues are public; do not include personal data, sensitive information or copies of your menus.
