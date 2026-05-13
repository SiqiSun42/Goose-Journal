import React, { useMemo, useState } from 'react';
import { IonButton, IonButtons, IonItem, IonLabel, IonPopover } from '@ionic/react';
import type { GooseJournalController } from '../../state/useGooseJournal';

const emojiMenus = {
  location: ['🏠', '☕', '🌳', '🏫', '🏢', '🚗', '✈️', '🏖️'],
  weather: ['☀️', '🌤️', '🌧️', '⛈️', '❄️', '🌫️', '🌈', '🌙'],
  mood: ['😊', '😌', '🥰', '😐', '😔', '😤', '🥱', '🤩'],
} as const;

type Props = { journal: GooseJournalController };

export function EmojiPickersRow({ journal }: Props) {
  const entry = journal.activeEntry;
  const [open, setOpen] = useState<null | keyof typeof emojiMenus>(null);
  const [event, setEvent] = useState<MouseEvent | undefined>(undefined);

  const items = useMemo(() => (open ? emojiMenus[open] : []), [open]);

  return (
    <>
      <IonItem>
        <IonLabel>Meta</IonLabel>
        <IonButtons slot="end">
          <IonButton
            onClick={(e) => {
              setEvent(e.nativeEvent);
              setOpen('location');
            }}
          >
            {entry.location}
          </IonButton>
          <IonButton
            onClick={(e) => {
              setEvent(e.nativeEvent);
              setOpen('weather');
            }}
          >
            {entry.weather}
          </IonButton>
          <IonButton
            onClick={(e) => {
              setEvent(e.nativeEvent);
              setOpen('mood');
            }}
          >
            {entry.mood}
          </IonButton>
        </IonButtons>
      </IonItem>

      <IonPopover
        isOpen={open !== null}
        event={event}
        onDidDismiss={() => setOpen(null)}
        showBackdrop
        side="bottom"
        alignment="start"
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 44px)', gap: 8, padding: 12 }}>
          {items.map((emoji) => (
            <button
              key={emoji}
              style={{
                width: 44,
                height: 44,
                border: '0',
                borderRadius: 12,
                background: 'transparent',
                fontSize: 22,
                cursor: 'pointer',
              }}
              onClick={() => {
                if (!open) return;
                journal.updateActiveEntry({ [open]: emoji } as any);
                setOpen(null);
              }}
            >
              {emoji}
            </button>
          ))}
        </div>
      </IonPopover>
    </>
  );
}

