import landscapeRenderer from './landscapeRenderer';
import TextRenderer from './TextRenderer';

import PathMap from './PathMap';

export default {
  __init__: [ 'landscapeRenderer' ],
  landscapeRenderer: [ 'type', landscapeRenderer ],
  textRenderer: [ 'type', TextRenderer ],
  pathMap: [ 'type', PathMap ]
};
