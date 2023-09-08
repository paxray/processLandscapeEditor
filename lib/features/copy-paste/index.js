import CopyPasteModule from 'diagram-js/lib/features/copy-paste';

import landscapeCopyPaste from './landscapeCopyPaste';
import ModdleCopy from './ModdleCopy';

export default {
  __depends__: [
    CopyPasteModule
  ],
  __init__: [ 'landscapeCopyPaste', 'moddleCopy' ],
  landscapeCopyPaste: [ 'type', landscapeCopyPaste ],
  moddleCopy: [ 'type', ModdleCopy ]
};
