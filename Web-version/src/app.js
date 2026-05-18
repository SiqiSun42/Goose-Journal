/*
Goose Journal app controller
----------------------------
This is the only file that directly coordinates state and UI behavior.
The rest of the files are small helpers so humans can find things quickly.

PATCHES APPLIED:
  1. newEntryBtn: wrapped createNewEntry in arrow fn so MouseEvent is never
     passed as the `date` param (broken entry dates / saves that appeared
     to work but stored `{}` for date after JSON round-trip).
  2. pointerdown: added missing closing `}` for the if-block so the
     listener is properly terminated.
  3. Mobile sidebar: on narrow viewports the CSS shows the sidebar when
     `sidebar-hidden` is absent, but the class was never added on init,
     so the panel covered the page on first load. Fixed by adding the
     class during init when the viewport is ≤850 px.
  4. saveState return value: saveAndRender / saveAndRenderLightly now check
     whether the write actually succeeded before calling flashSaved; if it
     failed they show a warning instead of a false-positive "Saved locally".
  5. Emoji-menu double render: openEmojiMenu's onChoose callback called
     both saveAndRenderLightly() (which already calls renderEntries inside)
     AND a second standalone renderEntries(), causing every emoji pick to
     rebuild the entry list twice. Removed the redundant second call.
*/

import { askGooseGroq } from "./goose-api.js";
/* Roll back to teammate static bubble lines: uncomment gooseLines in data.js, swap this file’s data import for the line below, uncomment gooseIndex and the old goose button listener, and drop askGooseGroq / onGooseAsk if unused.
import { palettes, fonts, stickerPack, emojiMenus, gooseLines, starterEntries } from "./data.js";
*/
import { palettes, fonts, stickerPack, emojiMenus, starterEntries } from "./data.js";
import { loadSavedState, saveState } from "./storage.js";
import { todayString, nowTimeString, countWordsFromHtml } from "./helpers.js";
import { renderCalendar } from "./calendar.js";
import { renderStickers } from "./stickers.js";
import {
  applyPalette,
  applyFont,
  renderPaletteButtons,
  renderFontButtons,
  renderStickerPicker,
  renderEntryList,
  showEmojiMenu
} from "./render.js";

const $ = (selector) => document.querySelector(selector);

const els = {
  app: $("#app"),
  sidebar: $("#sidebar"),
  hideSidebarBtn: $("#hideSidebarBtn"),
  showSidebarBtn: $("#showSidebarBtn"),
  searchInput: $("#searchInput"),
  entryList: $("#entryList"),
  calendarTitle: $("#calendarTitle"),
  calendarGrid: $("#calendarGrid"),
  prevMonthBtn: $("#prevMonthBtn"),
  nextMonthBtn: $("#nextMonthBtn"),
  customizeBtn: $("#customizeBtn"),
  customizePanel: $("#customizePanel"),
  focusBtn: $("#focusBtn"),
  newEntryBtn: $("#newEntryBtn"),
  paletteList: $("#paletteList"),
  fontList: $("#fontList"),
  stickerPicker: $("#stickerPicker"),
  stickerLayer: $("#stickerLayer"),
  dateInput: $("#dateInput"),
  timeInput: $("#timeInput"),
  titleInput: $("#titleInput"),
  bodyInput: $("#bodyInput"),
  locationBtn: $("#locationBtn"),
  weatherBtn: $("#weatherBtn"),
  moodBtn: $("#moodBtn"),
  emojiMenu: $("#emojiMenu"),
  titleToggleBtn: $("#titleToggleBtn"),
  wordCount: $("#wordCount"),
  saveStatus: $("#saveStatus"),
  gooseButton: $("#gooseButton"),
  gooseBubble: $("#gooseBubble"),
  deepseekModelInput: $("#deepseekModelInput")
};

const saved = loadSavedState();
const now = new Date();

let state = saved || {
  entries: starterEntries,
  activeEntryId: starterEntries[0].id,
  activePaletteId: "blushTea",
  activeFontId: "georgia",
  titleVisible: true,
  calendarYear: now.getFullYear(),
  calendarMonth: now.getMonth()
};

const LS_DEEPSEEK_MODEL = "goose-journal-deepseek-model";

/*
let gooseIndex = 0;
*/

init();

function init() {
  // PATCH 3: sidebar must start hidden on mobile because the CSS rule
  // `.app:not(.sidebar-hidden) .sidebar { transform: translateX(0) }`
  // slides it open whenever the class is absent.
  if (window.innerWidth <= 850) {
    els.app.classList.add("sidebar-hidden");
  }

  try {
    els.deepseekModelInput.value =
      localStorage.getItem(LS_DEEPSEEK_MODEL) ||
      import.meta.env.VITE_DEEPSEEK_MODEL ||
      "deepseek-v4-pro";
  } catch {
    els.deepseekModelInput.value =
      import.meta.env.VITE_DEEPSEEK_MODEL || "deepseek-v4-pro";
  }

  els.deepseekModelInput.addEventListener("input", () => {
    try {
      localStorage.setItem(LS_DEEPSEEK_MODEL, els.deepseekModelInput.value);
    } catch {}
  });

  wireEvents();
  renderAll();

  function wireEvents() {
    els.hideSidebarBtn.addEventListener("click", () => els.app.classList.add("sidebar-hidden"));
    els.showSidebarBtn.addEventListener("click", () => els.app.classList.remove("sidebar-hidden"));

    els.searchInput.addEventListener("input", renderEntries);

    els.prevMonthBtn.addEventListener("click", () => moveCalendar(-1));
    els.nextMonthBtn.addEventListener("click", () => moveCalendar(1));

    els.customizeBtn.addEventListener("click", () => {
      els.customizePanel.hidden = !els.customizePanel.hidden;
    });

    els.focusBtn.addEventListener("click", () => {
      els.app.classList.toggle("focus-mode");
      els.focusBtn.textContent = els.app.classList.contains("focus-mode") ? "Exit focus" : "Focus";
    });

    // PATCH 1: wrap in an arrow function so the click MouseEvent is never
    // received as the `date` argument (default param only triggers on
    // undefined, not on an Event object, so the date became `{}` in JSON).
    els.newEntryBtn.addEventListener("click", () => createNewEntry());

    els.titleToggleBtn.addEventListener("click", toggleTitle);

    [els.dateInput, els.timeInput, els.titleInput].forEach((input) => {
      input.addEventListener("input", updateActiveEntryFromInputs);
    });

    els.bodyInput.addEventListener("input", updateActiveEntryFromInputs);

    els.locationBtn.addEventListener("click", () => openEmojiMenu("location", els.locationBtn));
    els.weatherBtn.addEventListener("click", () => openEmojiMenu("weather", els.weatherBtn));
    els.moodBtn.addEventListener("click", () => openEmojiMenu("mood", els.moodBtn));

    // PATCH 2: the original if-block was missing its closing `}`, leaving
    // the arrow-function body open and making the structure ambiguous.
    document.addEventListener("pointerdown", (event) => {
      if (!event.target.closest(".emoji-menu") && !event.target.closest(".emoji-button")) {
        els.emojiMenu.hidden = true;
      }  // ← closing brace was missing in the original
    });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && els.app.classList.contains("focus-mode")) {
      els.app.classList.remove("focus-mode");
      els.focusBtn.textContent = "Focus";
    }
  });

    /*
    els.gooseButton.addEventListener("click", () => {
      gooseIndex = (gooseIndex + 1) % gooseLines.length;
      els.gooseBubble.textContent = gooseLines[gooseIndex];
    });
    */

    els.gooseButton.addEventListener("click", () => {
      void onGooseAsk();
    });
  }

  async function onGooseAsk() {
    const entry = getActiveEntry();
    if (!entry) return;

    const bodyText = (els.bodyInput.innerText || "").trim();
    const titleText = (entry.title || "").trim();
    if (!bodyText && !titleText) {
      els.gooseBubble.textContent = "Write something on the page first.";
      return;
    }

    const prompt = buildDiaryPrompt(entry, els.bodyInput);

    els.gooseButton.disabled = true;
    els.gooseBubble.textContent = "Honking…";

    try {
      const reply = await askGooseGroq(prompt, els.deepseekModelInput.value);
      els.gooseBubble.textContent = reply;
    } catch (e) {
      const msg =
        e instanceof Error && e.message && e.message.length < 280
          ? e.message
          : "Something went wrong.";
      els.gooseBubble.textContent = msg;
    } finally {
      els.gooseButton.disabled = false;
    }
  }

  function buildDiaryPrompt(entry, bodyEl) {
    const title = (entry.title || "").trim();
    const bodyText = (bodyEl.innerText || "").trim();
    const tags = [entry.location, entry.weather, entry.mood]
      .filter(Boolean)
      .join(" ");
    const lines = [];
    if (title) lines.push(`Title: ${title}`);
    if (tags) lines.push(`Tags: ${tags}`);
    lines.push(bodyText || "(empty page)");
    return lines.join("\n");
  }

  function renderAll() {
    const palette = palettes.find((item) => item.id === state.activePaletteId) || palettes[0];
    const font = fonts.find((item) => item.id === state.activeFontId) || fonts[0];

    applyPalette(palette);
    applyFont(font);

    renderPaletteButtons({
      container: els.paletteList,
      palettes,
      activeId: state.activePaletteId,
      onChoose: choosePalette
    });

    renderFontButtons({
      container: els.fontList,
      fonts,
      activeId: state.activeFontId,
      onChoose: chooseFont
    });

    renderStickerPicker({
      container: els.stickerPicker,
      stickerPack,
      onChoose: addSticker
    });

    renderEntries();
    renderActiveEntry();
    renderMiniCalendar();
  }

  function renderEntries() {
    renderEntryList({
      container: els.entryList,
      entries: state.entries,
      activeId: state.activeEntryId,
      query: els.searchInput.value,
      onChoose: chooseEntry
    });
  }

  function renderActiveEntry() {
    const entry = getActiveEntry();
    if (!entry) return;

    els.dateInput.value = entry.date;
    els.timeInput.value = entry.time;
    els.titleInput.value = entry.title;
    els.bodyInput.innerHTML = entry.body;
    els.locationBtn.textContent = entry.location;
    els.weatherBtn.textContent = entry.weather;
    els.moodBtn.textContent = entry.mood;
    els.titleInput.hidden = !state.titleVisible;
    els.titleToggleBtn.textContent = state.titleVisible ? "Hide title" : "Show title";

    updateWordCount();
    renderStickerLayer();
  }

  function renderMiniCalendar() {
    const entry = getActiveEntry();

    renderCalendar({
      container: els.calendarGrid,
      title: els.calendarTitle,
      year: state.calendarYear,
      month: state.calendarMonth,
      entries: state.entries,
      activeDate: entry?.date,
      onPickDate: chooseDate
    });
  }

  function renderStickerLayer() {
    const entry = getActiveEntry();

    renderStickers({
      layer: els.stickerLayer,
      stickers: entry.stickers || [],
      onMove: moveSticker,
      onRemove: removeSticker
    });
  }

  function choosePalette(id) {
    state.activePaletteId = id;
    saveAndRender();
  }

  function chooseFont(id) {
    state.activeFontId = id;
    saveAndRender();
  }

  function chooseEntry(id) {
    state.activeEntryId = id;
    renderEntries();
    renderActiveEntry();
    renderMiniCalendar();
    saveState(state);
  }

  function chooseDate(date) {
    const existing = state.entries.find((entry) => entry.date === date);

    if (existing) {
      chooseEntry(existing.id);
      return;
    }

    createNewEntry(date);
  }

  function createNewEntry(date = todayString()) {
    const entry = {
      id: crypto.randomUUID(),
      title: "",
      date,
      time: nowTimeString(),
      location: "🏠",
      weather: "🌤️",
      mood: "😌",
      body: "",
      stickers: []
    };

    state.entries.unshift(entry);
    state.activeEntryId = entry.id;
    saveAndRender();
    els.bodyInput.focus();
  }

  function updateActiveEntryFromInputs() {
    const entry = getActiveEntry();
    if (!entry) return;

    entry.date = els.dateInput.value;
    entry.time = els.timeInput.value;
    entry.title = els.titleInput.value;
    entry.body = els.bodyInput.innerHTML;

    updateWordCount();
    saveAndRenderLightly();
  }

  function openEmojiMenu(type, anchor) {
    showEmojiMenu({
      menu: els.emojiMenu,
      anchor,
      emojis: emojiMenus[type],
      onChoose: (emoji) => {
        const entry = getActiveEntry();
        if (!entry) return;

        entry[type] = emoji;
        anchor.textContent = emoji;
        els.emojiMenu.hidden = true;
        // PATCH 5: saveAndRenderLightly already calls renderEntries internally;
        // the extra standalone renderEntries() call below was rebuilding the
        // entry list a second time on every emoji pick. Removed.
        saveAndRenderLightly();
      }
    });
  }

  function addSticker(emoji) {
    const entry = getActiveEntry();
    if (!entry) return;

    const count = entry.stickers?.length || 0;
    entry.stickers ||= [];

    // Predictable placement, not random. No surprise sticker on first load.
    entry.stickers.push({
      id: crypto.randomUUID(),
      emoji,
      x: 70 + count * 28,
      y: 150 + count * 18,
      size: 30
    });

    renderStickerLayer();
    saveAndRenderLightly();
  }

  function moveSticker(id, x, y, shouldSave) {
    const entry = getActiveEntry();
    const sticker = entry?.stickers?.find((item) => item.id === id);
    if (!sticker) return;

    sticker.x = x;
    sticker.y = y;

    if (shouldSave) saveAndRenderLightly(false);
  }

  function removeSticker(id) {
    const entry = getActiveEntry();
    if (!entry) return;

    entry.stickers = entry.stickers.filter((sticker) => sticker.id !== id);
    renderStickerLayer();
    saveAndRenderLightly();
  }

  function toggleTitle() {
    state.titleVisible = !state.titleVisible;
    renderActiveEntry();
    saveState(state);
  }

  function moveCalendar(direction) {
    state.calendarMonth += direction;

    if (state.calendarMonth > 11) {
      state.calendarMonth = 0;
      state.calendarYear += 1;
    }

    if (state.calendarMonth < 0) {
      state.calendarMonth = 11;
      state.calendarYear -= 1;
    }

    renderMiniCalendar();
    saveState(state);
  }

  function updateWordCount() {
    els.wordCount.textContent = `Words: ${countWordsFromHtml(els.bodyInput.innerHTML)}`;
  }

  // PATCH 4: check the boolean returned by saveState before flashing.
  function saveAndRender() {
    const ok = saveState(state);
    renderAll();
    ok ? flashSaved() : flashFailed();
  }

  // Lighter save path for typing: avoids replacing the editor while someone writes.
  // PATCH 4 continued: same success-check applied here.
  function saveAndRenderLightly(shouldFlash = true) {
    const ok = saveState(state);
    renderEntries();
    renderMiniCalendar();
    if (shouldFlash) ok ? flashSaved() : flashFailed();
  }

  function flashSaved() {
    els.saveStatus.textContent = "Saved locally";
    clearTimeout(flashSaved.timer);
    flashSaved.timer = setTimeout(() => {
      els.saveStatus.textContent = "All quiet";
    }, 900);
  }

  function flashFailed() {
    els.saveStatus.textContent = "⚠ Could not save";
    clearTimeout(flashSaved.timer);
    flashSaved.timer = setTimeout(() => {
      els.saveStatus.textContent = "All quiet";
    }, 2500);
  }

  function getActiveEntry() {
    return state.entries.find((entry) => entry.id === state.activeEntryId);
  }
}