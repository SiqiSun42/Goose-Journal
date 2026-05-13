import React, { useMemo } from 'react';
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonMenuButton,
  IonPage,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from '@ionic/react';

import type { GooseJournalController } from '../../state/useGooseJournal';
import { EmojiPickersRow } from './EmojiPickersRow';
import { ComingSoonCard } from '../followups/ComingSoonCard';

type Props = {
  journal: GooseJournalController;
};

export function EditorPage({ journal }: Props) {
  const entry = journal.activeEntry;

  const statusText = useMemo(() => {
    if (journal.saveStatus === 'saving') return 'Saving…';
    if (journal.saveStatus === 'saved') return 'Saved';
    if (journal.saveStatus === 'error') return 'Could not save';
    return 'All quiet';
  }, [journal.saveStatus]);

  return (
    <IonPage id="main">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Today’s page</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div style={{ maxWidth: 1024, margin: '0 auto', padding: '16px 14px 28px' }}>
          <div className="goosePaper" style={{ padding: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
            <IonItem>
              <IonLabel position="stacked">Date (YYYY.MM.DD)</IonLabel>
              <IonInput
                value={entry.date}
                inputMode="numeric"
                onIonInput={(e) => journal.updateActiveEntry({ date: String(e.detail.value ?? '') })}
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Time (HH:MM)</IonLabel>
              <IonInput
                value={entry.time}
                inputMode="numeric"
                onIonInput={(e) => journal.updateActiveEntry({ time: String(e.detail.value ?? '') })}
              />
            </IonItem>

            <EmojiPickersRow journal={journal} />

            <IonItem>
              <IonLabel position="stacked">Title</IonLabel>
              <IonInput value={entry.title} onIonInput={(e) => journal.updateActiveEntry({ title: String(e.detail.value ?? '') })} />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Body</IonLabel>
              <IonTextarea
                value={entry.body}
                autoGrow
                rows={10}
                onIonInput={(e) => journal.updateActiveEntry({ body: String(e.detail.value ?? '') })}
                placeholder="Start gently. One sentence is enough."
              />
            </IonItem>

            <div style={{ color: 'var(--goose-muted)', fontSize: 12, padding: '0 6px' }}>{statusText}</div>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}

