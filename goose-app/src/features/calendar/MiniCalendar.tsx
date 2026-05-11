import React, { useMemo } from 'react';
import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle } from '@ionic/react';
import type { GooseJournalController } from '../../state/useGooseJournal';
import { pad } from '../../domain/helpers';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;
const DOW = ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as const;

export function MiniCalendar({ journal }: { journal: GooseJournalController }) {
  const { calendarYear: year, calendarMonth: month } = journal.state;
  const activeDate = journal.activeEntry?.date;

  const { blanks, daysInMonth, entryDates } = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const dim = new Date(year, month + 1, 0).getDate();
    return {
      blanks: firstDay,
      daysInMonth: dim,
      entryDates: new Set(journal.state.entries.map((e) => e.date)),
    };
  }, [journal.state.entries, month, year]);

  return (
    <IonCard>
      <IonCardHeader style={{ paddingBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <IonButtons>
            <IonButton size="small" onClick={() => journal.moveCalendar(-1)}>
              ‹
            </IonButton>
          </IonButtons>
          <IonCardTitle style={{ fontSize: 14 }}>{MONTHS[month]} {year}</IonCardTitle>
          <IonButtons>
            <IonButton size="small" onClick={() => journal.moveCalendar(1)}>
              ›
            </IonButton>
          </IonButtons>
        </div>
      </IonCardHeader>
      <IonCardContent style={{ paddingTop: 8 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, textAlign: 'center' }}>
          {DOW.map((d) => (
            <div key={d} style={{ fontSize: 11, color: 'var(--goose-muted)', fontWeight: 700 }}>
              {d}
            </div>
          ))}

          {Array.from({ length: blanks }).map((_, idx) => (
            <div key={`b_${idx}`} />
          ))}

          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const day = idx + 1;
            const date = `${year}.${pad(month + 1)}.${pad(day)}`;
            const hasEntry = entryDates.has(date);
            const isActive = date === activeDate;

            return (
              <button
                key={date}
                onClick={() => journal.pickDate(date)}
                style={{
                  height: 30,
                  borderRadius: 999,
                  border: '0',
                  cursor: 'pointer',
                  background: isActive
                    ? 'var(--goose-accent)'
                    : hasEntry
                      ? 'color-mix(in srgb, var(--goose-accent) 22%, white)'
                      : 'transparent',
                  color: isActive ? 'white' : 'var(--goose-ink)',
                  fontSize: 12,
                }}
                aria-label={date}
              >
                {day}
              </button>
            );
          })}
        </div>
      </IonCardContent>
    </IonCard>
  );
}

