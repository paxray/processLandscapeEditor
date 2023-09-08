import landscapeCreateMoveSnapping from './landscapeCreateMoveSnapping';
import SnappingModule from 'diagram-js/lib/features/snapping';

export default {
  __depends__: [ SnappingModule ],
  __init__: [
    'createMoveSnapping'
  ],
  createMoveSnapping: [ 'type', landscapeCreateMoveSnapping ]
};