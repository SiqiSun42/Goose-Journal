import React from 'react';
import { IonApp, IonSplitPane } from '@ionic/react';

import { EntryShelf } from './features/entries/EntryShelf';
import { EditorPage } from './features/editor/EditorPage';
import { useGooseJournal } from './state/useGooseJournal';

export function App() {
  const journal = useGooseJournal();

  return (
    <IonApp>
      <IonSplitPane>
        <EntryShelf journal={journal} />
        <EditorPage journal={journal} />
      </IonSplitPane>
    </IonApp>
  );
}

