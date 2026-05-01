/* Small date and text helpers. */

export function pad(value) {
  return String(value).padStart(2, "0");
}

export function todayString() {
  const d = new Date();
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`;
}

export function nowTimeString() {
  const d = new Date();
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function monthKey(dateString) {
  return dateString.slice(0, 7);
}

export function countWordsFromHtml(html) {
  const div = document.createElement("div");
  div.innerHTML = html;
  const text = div.innerText.trim();
  return text ? text.split(/\s+/).length : 0;
}
