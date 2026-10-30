# @sourdough/ui

The look and the common pieces of every Sourdough Calculators web app, taken from the pasta app (PressRatio) so the apps feel like one family.

- `src/styles.css`: one stylesheet. Light by default, dark when the device is dark, and `html[data-theme="light" | "dark"]` forces one (the Settings screen sets it). `--field` is the border of controls and is darker than `--line`, so controls meet the 3:1 contrast rule.
- `src/components.tsx`: `Header`, `TabBar`, `ChipGroup`, `NumField`, `Check`, `Note`, `EstimateBadge`, `KV`, `OtherCalculators` (every calculator, the current one marked) and `MorePage`: the last tab of every web app, holding a Settings row, the calculators list (pasta is a link out) and the About, Privacy and Source links. Settings is reached from More, and the bar keeps More lit while Settings shows.
- `src/SettingsScreen.tsx`: theme, units, optional kitchen temperature, reset. Apps pass their own extra sections as children.

Imported as `@sourdough/ui/<file>` (the stylesheet as `@sourdough/ui/styles.css`). React is the app's own copy: each app's Vite config dedupes it.
