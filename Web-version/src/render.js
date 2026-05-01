/*
  Rendering utilities for palettes, fonts, entries, and emoji menus.
  The app controller wires these functions to real state changes.
*/

import { monthKey } from "./helpers.js";

export function applyPalette(palette) {
  Object.entries(palette.colors).forEach(([name, value]) => {
    document.documentElement.style.setProperty(`--${kebab(name)}`, value);
  });
}

export function applyFont(font) {
  document.documentElement.style.setProperty("--font-journal", font.stack);
}

export function renderPaletteButtons({ container, palettes, activeId, onChoose }) {
  container.innerHTML = "";

  palettes.forEach((palette) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "palette-button";
    if (palette.id === activeId) button.classList.add("active");

    const dots = document.createElement("span");
    dots.className = "palette-dots";
    ["paper", "wash", "accent", "accentSoft", "ink", "muted"].forEach((key) => {
      const dot = document.createElement("i");
      dot.style.background = palette.colors[key];
      dots.appendChild(dot);
    });

    button.append(dots, palette.name);
    button.addEventListener("click", () => onChoose(palette.id));
    container.appendChild(button);
  });
}

export function renderFontButtons({ container, fonts, activeId, onChoose }) {
  container.innerHTML = "";

  fonts.forEach((font) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "font-button";
    button.textContent = font.name;
    button.style.fontFamily = font.stack;
    if (font.id === activeId) button.classList.add("active");
    button.addEventListener("click", () => onChoose(font.id));
    container.appendChild(button);
  });
}

export function renderStickerPicker({ container, stickerPack, onChoose }) {
  container.innerHTML = "";

  stickerPack.forEach((emoji) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "sticker-button";
    button.textContent = emoji;
    button.addEventListener("click", () => onChoose(emoji));
    container.appendChild(button);
  });
}

export function renderEntryList({ container, entries, activeId, query, onChoose }) {
  container.innerHTML = "";

  const cleanQuery = query.trim().toLowerCase();
  const filtered = entries.filter((entry) => {
    if (!cleanQuery) return true;
    return `${entry.title} ${entry.body} ${entry.date}`.toLowerCase().includes(cleanQuery);
  });

  if (!filtered.length) {
    const empty = document.createElement("p");
    empty.className = "month-label";
    empty.textContent = "No entries found";
    container.appendChild(empty);
    return;
  }

  let lastMonth = "";
  filtered.forEach((entry) => {
    const currentMonth = monthKey(entry.date);
    if (currentMonth !== lastMonth) {
      const label = document.createElement("div");
      label.className = "month-label";
      label.textContent = currentMonth;
      container.appendChild(label);
      lastMonth = currentMonth;
    }

    const button = document.createElement("button");
    button.type = "button";
    button.className = "entry-card";
    if (entry.id === activeId) button.classList.add("active");

    const title = document.createElement("strong");
    title.textContent = entry.title || "Untitled page";

    const meta = document.createElement("span");
    meta.textContent = `${entry.mood} ${entry.weather} · ${entry.date}`;

    button.append(title, meta);
    button.addEventListener("click", () => onChoose(entry.id));
    container.appendChild(button);
  });
}

export function showEmojiMenu({ menu, anchor, emojis, onChoose }) {
  menu.innerHTML = "";

  emojis.forEach((emoji) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "emoji-choice";
    button.textContent = emoji;
    button.addEventListener("click", () => onChoose(emoji));
    menu.appendChild(button);
  });

  const rect = anchor.getBoundingClientRect();
  const pageRect = menu.parentElement.getBoundingClientRect();
  menu.style.left = `${rect.left - pageRect.left}px`;
  menu.style.top = `${rect.bottom - pageRect.top + 8}px`;
  menu.hidden = false;
}

function kebab(value) {
  return value.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}
