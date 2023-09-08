import PreviewSupportModule from 'diagram-js/lib/features/preview-support';

import landscapeReplacePreview from './landscapeReplacePreview';

export default {
  __depends__: [
    PreviewSupportModule
  ],
  __init__: [ 'landscapeReplacePreview' ],
  landscapeReplacePreview: [ 'type', landscapeReplacePreview ]
};
