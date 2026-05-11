import { Preferences } from '@capacitor/preferences';
import type { GooseJournalState } from '../domain/types';
import { createSeedState } from '../domain/seed';

const KEY = 'gooseJournal.ionic.v1';

function normalizeState(input: GooseJournalState): GooseJournalState {
  const now = new Date();
  const entries = (input.entries ?? []).map((e: any) => ({
    id: String(e.id ?? ''),
    title: String(e.title ?? ''),
    date: String(e.date ?? ''),
    time: String(e.time ?? ''),
    location: String(e.location ?? '🏠'),
    weather: String(e.weather ?? '🌤️'),
    mood: String(e.mood ?? '😌'),
    body: String(e.body ?? ''),
    stickers: Array.isArray(e.stickers) ? e.stickers : [],
  }));

  const activeEntryId = String(input.activeEntryId ?? entries[0]?.id ?? '');
  const activePaletteId = String((input as any).activePaletteId ?? 'blushTea');
  const calendarYear = Number((input as any).calendarYear ?? now.getFullYear());
  const calendarMonthRaw = Number((input as any).calendarMonth ?? now.getMonth());
  const calendarMonth = Number.isFinite(calendarMonthRaw) ? Math.max(0, Math.min(11, calendarMonthRaw)) : now.getMonth();

  return { entries, activeEntryId, activePaletteId, calendarYear, calendarMonth };
}

export async function loadJournalState(): Promise<GooseJournalState | null> {
  try {
    const { value } = await Preferences.get({ key: KEY });
    if (!value) return null;
    const parsed = JSON.parse(value) as GooseJournalState;
    if (!parsed?.entries?.length || !parsed.activeEntryId) return null;
    return normalizeState(parsed);
  } catch {
    return null;
  }
}

export async function saveJournalState(state: GooseJournalState): Promise<boolean> {
  try {
    await Preferences.set({ key: KEY, value: JSON.stringify(state) });
    return true;
  } catch {
    return false;
  }
}

export async function resetJournalStateToSeed(): Promise<GooseJournalState> {
  const seed = createSeedState();
  await saveJournalState(seed);
  return seed;
}

