export function pad(value: number) {
  return String(value).padStart(2, '0');
}

export function todayString(now = new Date()) {
  return `${now.getFullYear()}.${pad(now.getMonth() + 1)}.${pad(now.getDate())}`;
}

export function nowTimeString(now = new Date()) {
  return `${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

export function monthKey(dateString: string) {
  return dateString.slice(0, 7);
}

export function makeId() {
  return globalThis.crypto?.randomUUID?.() ?? `id_${Math.random().toString(16).slice(2)}`;
}

