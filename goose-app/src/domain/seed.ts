import { makeId, nowTimeString, todayString } from './helpers';
import type { GooseJournalState, JournalEntry } from './types';

function seedEntries(): JournalEntry[] {
  return [
    {
      id: makeId(),
      title: 'Morning by the window',
      date: '2026.04.28',
      time: '09:14',
      location: '🏠',
      weather: '☀️',
      mood: '😌',
      body:
        "Today felt unusually light. I made a cup of coffee and just sat by the window for a while, doing nothing.\n\nThe sunlight came in at just the right angle. A bird kept singing outside. I tried to think of something, but nothing came. Just silence, and it felt good.",
      stickers: [],
    },
    {
      id: makeId(),
      title: 'Petals everywhere',
      date: '2026.04.24',
      time: '16:20',
      location: '🌳',
      weather: '🌤️',
      mood: '😊',
      body:
        'The sidewalk was covered in little pink petals today. It made the whole block feel softer. I walked slower than usual, which was maybe the whole point.',
      stickers: [],
    },
    {
      id: makeId(),
      title: 'Quiet reset',
      date: '2026.04.18',
      time: '22:05',
      location: '🏠',
      weather: '🌙',
      mood: '🥱',
      body:
        "I didn’t do everything I wanted to do, but I did enough. The room is clean, the lights are low, and tomorrow can be tomorrow’s creature.",
      stickers: [],
    },
  ];
}

export function createSeedState(now = new Date()): GooseJournalState {
  const entry: JournalEntry = {
    id: makeId(),
    title: '',
    date: todayString(now),
    time: nowTimeString(now),
    location: '🏠',
    weather: '🌤️',
    mood: '😌',
    body: '',
    stickers: [],
  };

  const entries = [entry, ...seedEntries()];
  return {
    entries,
    activeEntryId: entries[0].id,
    activePaletteId: 'blushTea',
    calendarYear: now.getFullYear(),
    calendarMonth: now.getMonth(),
  };
}

