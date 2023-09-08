import {
  add as collectionAdd,
  remove as collectionRemove
} from 'diagram-js/lib/util/Collections';


export default function UpdateCanvasRootHandler(canvas, modeling) {
  this._canvas = canvas;
  this._modeling = modeling;
}

UpdateCanvasRootHandler.$inject = [
  'canvas',
  'modeling'
];


UpdateCanvasRootHandler.prototype.execute = function(context) {

  var canvas = this._canvas;

  var newRoot = context.newRoot,
      newRootBusinessObject = newRoot.businessObject,
      oldRoot = canvas.getRootElement(),
      oldRootBusinessObject = oldRoot.businessObject,
      landscapeDefinitions = oldRootBusinessObject.$parent,
      diPlane = oldRootBusinessObject.di;

  // (1) replace process old <> new root
  canvas.setRootElement(newRoot, true);

  // (2) update root elements
  collectionAdd(landscapeDefinitions.rootElements, newRootBusinessObject);
  newRootBusinessObject.$parent = landscapeDefinitions;

  collectionRemove(landscapeDefinitions.rootElements, oldRootBusinessObject);
  oldRootBusinessObject.$parent = null;

  // (3) wire di
  oldRootBusinessObject.di = null;

  diPlane.boardElement = newRootBusinessObject;
  newRootBusinessObject.di = diPlane;

  context.oldRoot = oldRoot;

  // TODO(nikku): return changed elements?
  // return [ newRoot, oldRoot ];
};


UpdateCanvasRootHandler.prototype.revert = function(context) {

  var canvas = this._canvas;

  var newRoot = context.newRoot,
      newRootBusinessObject = newRoot.businessObject,
      oldRoot = context.oldRoot,
      oldRootBusinessObject = oldRoot.businessObject,
      landscapeDefinitions = newRootBusinessObject.$parent,
      diPlane = newRootBusinessObject.di;

  // (1) replace process old <> new root
  canvas.setRootElement(oldRoot, true);

  // (2) update root elements
  collectionRemove(landscapeDefinitions.rootElements, newRootBusinessObject);
  newRootBusinessObject.$parent = null;

  collectionAdd(landscapeDefinitions.rootElements, oldRootBusinessObject);
  oldRootBusinessObject.$parent = landscapeDefinitions;

  // (3) wire di
  newRootBusinessObject.di = null;

  diPlane.boardElement = oldRootBusinessObject;
  oldRootBusinessObject.di = diPlane;

  // TODO(nikku): return changed elements?
  // return [ newRoot, oldRoot ];
};