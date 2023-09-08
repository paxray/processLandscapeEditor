import EditorActionsModule from 'diagram-js/lib/features/editor-actions';

import landscapeEditorActions from './landscapeEditorActions';

export default {
  __depends__: [
    EditorActionsModule
  ],
  editorActions: [ 'type', landscapeEditorActions ]
};
