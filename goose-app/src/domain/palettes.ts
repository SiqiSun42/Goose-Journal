export type Palette = {
  id: string;
  name: string;
  colors: {
    paper: string;
    wash: string;
    accent: string;
    accentSoft: string;
    ink: string;
    muted: string;
  };
};

export const palettes: Palette[] = [
  {
    id: 'blushTea',
    name: 'Blush Tea',
    colors: {
      paper: '#fffaf6',
      wash: '#f7e9e1',
      accent: '#d9a7a7',
      accentSoft: '#f1caca',
      ink: '#463a37',
      muted: '#9a8580',
    },
  },
  {
    id: 'cloudMilk',
    name: 'Cloud Milk',
    colors: {
      paper: '#fbfdff',
      wash: '#e9f1f8',
      accent: '#9bb8d3',
      accentSoft: '#dbe8f3',
      ink: '#33424f',
      muted: '#768899',
    },
  },
  {
    id: 'matchaLinen',
    name: 'Matcha Linen',
    colors: {
      paper: '#fffdf4',
      wash: '#eef4e8',
      accent: '#9caf88',
      accentSoft: '#dfe9d4',
      ink: '#3e4638',
      muted: '#7a856d',
    },
  },
  {
    id: 'lavenderFog',
    name: 'Lavender Fog',
    colors: {
      paper: '#fffbff',
      wash: '#f0eafb',
      accent: '#b6a0d4',
      accentSoft: '#e5daf7',
      ink: '#463a55',
      muted: '#837492',
    },
  },
  {
    id: 'peachHour',
    name: 'Peach Hour',
    colors: {
      paper: '#fffaf2',
      wash: '#fde8d6',
      accent: '#e1a173',
      accentSoft: '#f8d8bf',
      ink: '#594035',
      muted: '#9b7867',
    },
  },
  {
    id: 'moonPaper',
    name: 'Moon Paper',
    colors: {
      paper: '#f8f4ea',
      wash: '#ded8ca',
      accent: '#8b8679',
      accentSoft: '#d5cec0',
      ink: '#39352f',
      muted: '#777064',
    },
  },
];

export function applyPalette(palette: Palette) {
  const root = document.documentElement;
  root.style.setProperty('--goose-paper', palette.colors.paper);
  root.style.setProperty('--goose-wash', palette.colors.wash);
  root.style.setProperty('--goose-accent', palette.colors.accent);
  root.style.setProperty('--goose-ink', palette.colors.ink);
  root.style.setProperty('--goose-muted', palette.colors.muted);
  // keep accentSoft available for future UI; not used heavily yet
  root.style.setProperty('--goose-accent-soft', palette.colors.accentSoft);
}

