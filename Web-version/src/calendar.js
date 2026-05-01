/*
  Mini calendar renderer.
  This calendar is embedded in the sidebar, so there is no floating-position bug.
*/

import { pad } from "./helpers.js";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DOW = ["S", "M", "T", "W", "T", "F", "S"];

export function renderCalendar({ container, title, year, month, entries, activeDate, onPickDate }) {
  title.textContent = `${MONTHS[month]} ${year}`;
  container.innerHTML = "";

  DOW.forEach((day) => {
    const el = document.createElement("div");
    el.className = "calendar-dow";
    el.textContent = day;
    container.appendChild(el);
  });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const entryDates = new Set(entries.map((entry) => entry.date));

  for (let i = 0; i < firstDay; i++) {
    container.appendChild(document.createElement("div"));
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = `${year}.${pad(month + 1)}.${pad(day)}`;
    const button = document.createElement("button");
    button.className = "calendar-day";
    button.type = "button";
    button.textContent = day;

    if (entryDates.has(date)) button.classList.add("has-entry");
    if (date === activeDate) button.classList.add("is-active");

    button.addEventListener("click", () => onPickDate(date));
    container.appendChild(button);
  }
}
