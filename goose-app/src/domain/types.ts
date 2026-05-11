export type Emoji = string;

export type EntryId = string;

export type JournalEntry = {
  id: EntryId;
  title: string;
  date: string; // YYYY.MM.DD
  time: string; // HH:MM
  location: Emoji;
  weather: Emoji;
  mood: Emoji;
  body: string; // MVP: plain text (migrate to HTML later)
  stickers: Array<{
    id: string;
    emoji: Emoji;
    x: number;
    y: number;
    size?: number;
  }>;
};

export type GooseJournalState = {
  entries: JournalEntry[];
  activeEntryId: EntryId;
  activePaletteId: string;
  calendarYear: number;
  calendarMonth: number; // 0-11
};

