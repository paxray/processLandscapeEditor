import translate from 'diagram-js/lib/i18n/translate';

import landscapeOrderingProvider from './landscapeOrderingProvider';

export default {
  __depends__: [
    translate
  ],
  __init__: [ 'landscapeOrderingProvider' ],
  landscapeOrderingProvider: [ 'type', landscapeOrderingProvider ]
};