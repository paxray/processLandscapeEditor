import KeyboardModule from 'diagram-js/lib/features/keyboard';

import landscapeKeyboardBindings from './landscapeKeyboardBindings';

export default {
  __depends__: [
    KeyboardModule
  ],
  __init__: [ 'keyboardBindings' ],
  keyboardBindings: [ 'type', landscapeKeyboardBindings ]
};
