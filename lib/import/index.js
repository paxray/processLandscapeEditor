import translate from 'diagram-js/lib/i18n/translate';

import landscapeImporter from './landscapeImporter';

export default {
  __depends__: [
    translate
  ],
  landscapeImporter: [ 'type', landscapeImporter ]
};