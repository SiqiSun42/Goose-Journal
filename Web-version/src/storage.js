/*
Tiny localStorage wrapper.
If saved data ever breaks, the app falls back to starter content instead of crashing.
saveState now returns true/false so callers can show accurate feedback.
*/

const KEY = "gooseJournal.prettyBasic.v1";

export function loadSavedState() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
    return true;   // FIX: signal success so callers can show accurate feedback
  } catch {
    // localStorage can fail in private browsing or sandboxed environments.
    return false;  // FIX: signal failure instead of silently swallowing it
  }
}