import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { GooseJournalState, JournalEntry } from '../domain/types';
import { makeId, nowTimeString, todayString } from '../domain/helpers';
import { createSeedState } from '../domain/seed';
import { loadJournalState, saveJournalState } from '../storage/preferencesStore';
import { applyPalette, palettes } from '../domain/palettes';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export type GooseJournalController = {
  state: GooseJournalState;
  activeEntry: JournalEntry;
  saveStatus: SaveStatus;
  query: string;
  setQuery: (value: string) => void;
  selectEntry: (id: string) => void;
  createNewEntry: (date?: string) => void;
  updateActiveEntry: (patch: Partial<JournalEntry>) => void;
  setActivePalette: (id: string) => void;
  moveCalendar: (direction: number) => void;
  pickDate: (date: string) => void;
};

export function useGooseJournal(): GooseJournalController {
  const [state, setState] = useState<GooseJournalState>(() => createSeedState());
  const [query, setQuery] = useState('');
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');

  const saveTimer = useRef<number | null>(null);
  const loadedOnce = useRef(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const loaded = await loadJournalState();
      if (cancelled) return;
      if (loaded) setState(loaded);
      loadedOnce.current = true;
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const palette = palettes.find((p) => p.id === state.activePaletteId) ?? palettes[0];
    applyPalette(palette);
  }, [state.activePaletteId]);

  const scheduleSave = useCallback((next: GooseJournalState) => {
    if (!loadedOnce.current) return;
    setSaveStatus('saving');
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(async () => {
      const ok = await saveJournalState(next);
      setSaveStatus(ok ? 'saved' : 'error');
      if (ok) {
        window.setTimeout(() => setSaveStatus('idle'), 900);
      }
    }, 250);
  }, []);

  const selectEntry = useCallback(
    (id: string) => {
      setState((prev) => {
        const next = { ...prev, activeEntryId: id };
        scheduleSave(next);
        return next;
      });
    },
    [scheduleSave],
  );

  const createNewEntry = useCallback(
    (date?: string) => {
      const now = new Date();
      const entry: JournalEntry = {
        id: makeId(),
        title: '',
        date: date ?? todayString(now),
        time: nowTimeString(now),
        location: '🏠',
        weather: '🌤️',
        mood: '😌',
        body: '',
        stickers: [],
      };

      setState((prev) => {
        const next: GooseJournalState = { entries: [entry, ...prev.entries], activeEntryId: entry.id };
        scheduleSave(next);
        return next;
      });
    },
    [scheduleSave],
  );

  const setActivePalette = useCallback(
    (id: string) => {
      setState((prev) => {
        const next = { ...prev, activePaletteId: id };
        scheduleSave(next);
        return next;
      });
    },
    [scheduleSave],
  );

  const moveCalendar = useCallback(
    (direction: number) => {
      setState((prev) => {
        let year = prev.calendarYear;
        let month = prev.calendarMonth + direction;
        if (month > 11) {
          month = 0;
          year += 1;
        }
        if (month < 0) {
          month = 11;
          year -= 1;
        }
        const next = { ...prev, calendarYear: year, calendarMonth: month };
        scheduleSave(next);
        return next;
      });
    },
    [scheduleSave],
  );

  const pickDate = useCallback(
    (date: string) => {
      const existing = state.entries.find((e) => e.date === date);
      if (existing) {
        selectEntry(existing.id);
        return;
      }
      createNewEntry(date);
    },
    [createNewEntry, selectEntry, state.entries],
  );

  const updateActiveEntry = useCallback(
    (patch: Partial<JournalEntry>) => {
      setState((prev) => {
        const nextEntries = prev.entries.map((e) => (e.id === prev.activeEntryId ? { ...e, ...patch } : e));
        const next: GooseJournalState = { ...prev, entries: nextEntries };
        scheduleSave(next);
        return next;
      });
    },
    [scheduleSave],
  );

  const activeEntry = useMemo(() => {
    return state.entries.find((e) => e.id === state.activeEntryId) ?? state.entries[0];
  }, [state.activeEntryId, state.entries]);

  return {
    state,
    activeEntry,
    saveStatus,
    query,
    setQuery,
    selectEntry,
    createNewEntry,
    updateActiveEntry,
    setActivePalette,
    moveCalendar,
    pickDate,
  };
}

