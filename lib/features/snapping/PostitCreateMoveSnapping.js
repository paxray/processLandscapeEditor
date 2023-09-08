import inherits from 'inherits-browser';

import CreateMoveSnapping from 'diagram-js/lib/features/snapping/CreateMoveSnapping';

/**
 * Snap during create and move.
 *
 * @param {EventBus} eventBus
 * @param {Injector} injector
 */
export default function landscapeCreateMoveSnapping(injector) {
  injector.invoke(CreateMoveSnapping, this);
}

inherits(landscapeCreateMoveSnapping, CreateMoveSnapping);

landscapeCreateMoveSnapping.$inject = [
  'injector'
];

landscapeCreateMoveSnapping.prototype.initSnap = function(event) {
  return CreateMoveSnapping.prototype.initSnap.call(this, event);
};

landscapeCreateMoveSnapping.prototype.addSnapTargetPoints = function(snapPoints, shape, target) {
  return CreateMoveSnapping.prototype.addSnapTargetPoints.call(this, snapPoints, shape, target);
};

landscapeCreateMoveSnapping.prototype.getSnapTargets = function(shape, target) {
  return CreateMoveSnapping.prototype.getSnapTargets.call(this, shape, target);
};
