export default function UpdateSemanticParentHandler(landscapeUpdater) {
  this._landscapeUpdater = landscapeUpdater;
}

UpdateSemanticParentHandler.$inject = [ 'landscapeUpdater' ];


UpdateSemanticParentHandler.prototype.execute = function(context) {
  var dataStoreBo = context.dataStoreBo,
      newSemanticParent = context.newSemanticParent,
      newDiParent = context.newDiParent;

  context.oldSemanticParent = dataStoreBo.$parent;
  context.oldDiParent = dataStoreBo.di.$parent;

  // update semantic parent
  this._landscapeUpdater.updateSemanticParent(dataStoreBo, newSemanticParent);

  // update DI parent
  this._landscapeUpdater.updateDiParent(dataStoreBo.di, newDiParent);
};

UpdateSemanticParentHandler.prototype.revert = function(context) {
  var dataStoreBo = context.dataStoreBo,
      oldSemanticParent = context.oldSemanticParent,
      oldDiParent = context.oldDiParent;

  // update semantic parent
  this._landscapeUpdater.updateSemanticParent(dataStoreBo, oldSemanticParent);

  // update DI parent
  this._landscapeUpdater.updateDiParent(dataStoreBo.di, oldDiParent);
};

