# Goose Journal — Pretty Basic Vanilla JS

A soft pastel journal prototype with a simple modular codebase. No React, no build step, no bundler. Just browser-native ES modules.

## What changed in this version
- MobileUI
- Calmer, softer UI with lighter animation.
- Calendar is embedded in the sidebar, not a floating popup, so it does not drift into the top-left corner.
- No stickers appear by default. Stickers only appear when selected from the Customize panel.
- Code is split into small, commented files so humans can navigate it.
- Entries, palette, font, title visibility, stickers, and calendar month save to `localStorage`.

## File map

```txt
index.html              App markup
styles/base.css         CSS variables, reset, global styles
styles/app.css          Sidebar, topbar, customize panel, goose mascot
styles/journal.css      Journal page, metadata, editor, stickers
src/app.js              Main app controller
src/data.js             Palettes, fonts, stickers, sample entries
src/render.js           UI rendering helpers
src/calendar.js         Mini calendar rendering
src/stickers.js         Draggable sticker behavior
src/storage.js          localStorage helpers
src/helpers.js          Date/text helpers
assets/goose.svg        Goose mascot
```

## Run locally

Because this uses ES modules, run it through a small local server:

```bash
python3 -m http.server 5173
```

Then open:

```txt
http://localhost:5173
```

If you are inside the project folder, that is enough. If you run the server from a parent folder, open the `goose-journal-pretty-basic/` path.
