import React, { useMemo } from 'react';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonTitle,
  IonToolbar,
} from '@ionic/react';

import type { GooseJournalController } from '../../state/useGooseJournal';
import { monthKey } from '../../domain/helpers';
import { palettes } from '../../domain/palettes';
import { MiniCalendar } from '../calendar/MiniCalendar';

type Props = {
  journal: GooseJournalController;
};

export function EntryShelf({ journal }: Props) {
  const grouped = useMemo(() => {
    const q = journal.query.trim().toLowerCase();
    const entries = journal.state.entries.filter((e) => {
      if (!q) return true;
      const hay = `${e.title} ${e.body} ${e.date}`.toLowerCase();
      return hay.includes(q);
    });

    const groups: Array<{ month: string; entries: typeof entries }> = [];
    for (const entry of entries) {
      const month = monthKey(entry.date);
      const last = groups.at(-1);
      if (!last || last.month !== month) groups.push({ month, entries: [entry] });
      else last.entries.push(entry);
    }
    return groups;
  }, [journal.query, journal.state.entries]);

  return (
    <IonMenu class = "ion-menu" contentId="main" type="push" disabled={false}>
      <IonHeader>
        <IonToolbar>
          <IonTitle className="gooseShelfHeaderTitle">Entries</IonTitle>
          <IonButtons slot="end">
            <IonButton ionBlur onClick={() => journal.createNewEntry()}>+</IonButton>
          </IonButtons>
        </IonToolbar>
        <IonToolbar>
          <IonInput
            value={journal.query}
            onIonInput={(e) => journal.setQuery(String(e.detail.value ?? ''))}
            placeholder="Search Memories…"
            clearInput
          />
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div style={{ padding: '12px 0' }}>
          <IonList inset>
            <MiniCalendar journal={journal} />
            <IonCard>
              <IonCardContent>
                <div style={{ fontSize: 12, color: 'var(--goose-muted)', marginBottom: 8, fontWeight: 700 }}>Palette</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {palettes.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => journal.setActivePalette(p.id)}
                      aria-label={p.name}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '8px 10px',
                        borderRadius: 999,
                        border: p.id === journal.state.activePaletteId ? '2px solid var(--goose-accent)' : '1px solid rgba(0,0,0,0.12)',
                        background: 'rgba(255,255,255,0.6)',
                        cursor: 'pointer',
                        fontSize: 12,
                      }}
                    >
                      <span style={{ display: 'inline-flex', gap: 3 }}>
                        {(['paper', 'wash', 'accent'] as const).map((k) => (
                          <i
                            key={k}
                            style={{
                              width: 10,
                              height: 10,
                              borderRadius: 999,
                              background: p.colors[k],
                              display: 'inline-block',
                            }}
                          />
                        ))}
                      </span>
                      {p.name}
                    </button>
                  ))}
                </div>
              </IonCardContent>
            </IonCard>
          </IonList>
        </div>

        <IonList inset>
          {grouped.length === 0 ? (
            <IonItem>
              <IonLabel className="gooseShelfMeta">No entries found</IonLabel>
            </IonItem>
          ) : (
            grouped.flatMap((g) => [
              <IonItem key={`m_${g.month}`} lines="none" color="light">
                <IonLabel className="gooseShelfMeta">{g.month}</IonLabel>
              </IonItem>,
              ...g.entries.map((entry) => (
                <IonItem
                  key={entry.id}
                  button
                  detail={false}
                  onClick={() => journal.selectEntry(entry.id)}
                  color={entry.id === journal.state.activeEntryId ? 'secondary' : undefined}
                >
                  <IonLabel>
                    <div>
                      <strong>{entry.title || 'Untitled page'}</strong>
                    </div>
                    <div className="gooseShelfMeta">
                      {entry.mood} {entry.weather} · {entry.date}
                    </div>
                  </IonLabel>
                </IonItem>
              )),
            ])
          )}
        </IonList>
      </IonContent>
    </IonMenu>
  );
}

