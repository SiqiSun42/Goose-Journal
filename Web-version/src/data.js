/*
  Shared data for the app.
  Keep palettes, fonts, stickers, and starter entries here so the UI files stay readable.
*/

export const palettes = [
  {
    id: "blushTea",
    name: "Blush Tea",
    colors: {
      paper: "#fffaf6",
      wash: "#f7e9e1",
      accent: "#d9a7a7",
      accentSoft: "#f1caca",
      ink: "#463a37",
      muted: "#9a8580"
    }
  },
  {
    id: "cloudMilk",
    name: "Cloud Milk",
    colors: {
      paper: "#fbfdff",
      wash: "#e9f1f8",
      accent: "#9bb8d3",
      accentSoft: "#dbe8f3",
      ink: "#33424f",
      muted: "#768899"
    }
  },
  {
    id: "matchaLinen",
    name: "Matcha Linen",
    colors: {
      paper: "#fffdf4",
      wash: "#eef4e8",
      accent: "#9caf88",
      accentSoft: "#dfe9d4",
      ink: "#3e4638",
      muted: "#7a856d"
    }
  },
  {
    id: "lavenderFog",
    name: "Lavender Fog",
    colors: {
      paper: "#fffbff",
      wash: "#f0eafb",
      accent: "#b6a0d4",
      accentSoft: "#e5daf7",
      ink: "#463a55",
      muted: "#837492"
    }
  },
  {
    id: "peachHour",
    name: "Peach Hour",
    colors: {
      paper: "#fffaf2",
      wash: "#fde8d6",
      accent: "#e1a173",
      accentSoft: "#f8d8bf",
      ink: "#594035",
      muted: "#9b7867"
    }
  },
  {
    id: "moonPaper",
    name: "Moon Paper",
    colors: {
      paper: "#f8f4ea",
      wash: "#ded8ca",
      accent: "#8b8679",
      accentSoft: "#d5cec0",
      ink: "#39352f",
      muted: "#777064"
    }
  }
];

export const fonts = [
  { id: "georgia", name: "Georgia", stack: "Georgia, 'Times New Roman', serif" },
  { id: "palatino", name: "Palatino", stack: "'Palatino Linotype', Palatino, serif" },
  { id: "atkinson", name: "Atkinson", stack: "'Atkinson Hyperlegible', Arial, sans-serif" },
  { id: "inter", name: "Inter", stack: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" },
  { id: "nunito", name: "Nunito", stack: "Nunito, Verdana, sans-serif" },
  { id: "verdana", name: "Verdana", stack: "Verdana, Geneva, sans-serif" }
];

export const stickerPack = ["🌷", "✨", "🍵", "🕯️", "🫧", "🐚", "🍓", "🌙", "🪽", "🐇"];

export const emojiMenus = {
  location: ["🏠", "☕", "🌳", "🏫", "🏢", "🚗", "✈️", "🏖️"],
  weather: ["☀️", "🌤️", "🌧️", "⛈️", "❄️", "🌫️", "🌈", "🌙"],
  mood: ["😊", "😌", "🥰", "😐", "😔", "😤", "🥱", "🤩"]
};

export const gooseLines = [
  "soft landing.",
  "one sentence counts.",
  "tiny thoughts welcome.",
  "decorate gently.",
  "fresh page energy.",
  "honking quietly."
];

export const starterEntries = [
  {
    id: crypto.randomUUID(),
    title: "Morning by the window",
    date: "2026.04.28",
    time: "09:14",
    location: "🏠",
    weather: "☀️",
    mood: "😌",
    body: "Today felt unusually light. I made a cup of coffee and just sat by the window for a while, doing nothing.<br><br>The sunlight came in at just the right angle. A bird kept singing outside. I tried to think of something, but nothing came. Just silence, and it felt good.",
    stickers: []
  },
  {
    id: crypto.randomUUID(),
    title: "Petals everywhere",
    date: "2026.04.24",
    time: "16:20",
    location: "🌳",
    weather: "🌤️",
    mood: "😊",
    body: "The sidewalk was covered in little pink petals today. It made the whole block feel softer. I walked slower than usual, which was maybe the whole point.",
    stickers: []
  },
  {
    id: crypto.randomUUID(),
    title: "Quiet reset",
    date: "2026.04.18",
    time: "22:05",
    location: "🏠",
    weather: "🌙",
    mood: "🥱",
    body: "I didn’t do everything I wanted to do, but I did enough. The room is clean, the lights are low, and tomorrow can be tomorrow’s creature.",
    stickers: []
  }
];
