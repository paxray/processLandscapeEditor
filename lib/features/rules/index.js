import RulesModule from 'diagram-js/lib/features/rules';

import landscapeRules from './landscapeRules';

export default {
  __depends__: [
    RulesModule
  ],
  __init__: [ 'landscapeRules' ],
  landscapeRules: [ 'type', landscapeRules ]
};
