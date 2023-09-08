import {
  assign,
  forEach
} from 'min-dash';

import inherits from 'inherits-browser';

import {
  remove as collectionRemove
} from 'diagram-js/lib/util/Collections';

import {
  is
} from '../../util/ModelUtil';

import { isLabel } from '../../util/LabelUtil';

import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';

/**
 * A handler responsible for updating the underlying landscape XML + DI
 * once changes on the diagram happen
 */
export default function landscapeUpdater(
    eventBus, landscapeFactory, connectionDocking,
    translate) {

  CommandInterceptor.call(this, eventBus);

  this._landscapeFactory = landscapeFactory;
  this._translate = translate;

  var self = this;


  // landscape + DI update //////////////////////


  // update parent
  function updateParent(e) {
    var context = e.context;

    self.updateParent(context.shape || context.connection, context.oldParent);
  }

  function reverseUpdateParent(e) {
    var context = e.context;

    var element = context.shape || context.connection,

        // oldParent is the (old) new parent, because we are undoing
        oldParent = context.parent || context.newParent;

    self.updateParent(element, oldParent);
  }

  this.executed([
    'shape.move',
    'shape.create',
    'shape.delete'
  ], iflandscape(updateParent));

  this.reverted([
    'shape.move',
    'shape.create',
    'shape.delete'
  ], iflandscape(reverseUpdateParent));

  /*
   * ## Updating Parent
   *
   * When morphing a root element
   * make sure that both the *semantic* and *di* parent of each element
   * is updated.
   *
   */
  function updateRoot(event) {
    var context = event.context,
        oldRoot = context.oldRoot,
        children = oldRoot.children;

    forEach(children, function(child) {
      if (is(child, 'landscape:BoardElement')) {
        self.updateParent(child);
      }
    });
  }

  this.executed([ 'canvas.updateRoot' ], updateRoot);
  this.reverted([ 'canvas.updateRoot' ], updateRoot);


  // update bounds
  function updateBounds(e) {
    var shape = e.context.shape;

    if (!is(shape, 'landscape:BoardElement')) {
      return;
    }

    self.updateBounds(shape);
  }

  this.executed([ 'shape.move', 'shape.create', 'shape.resize' ], iflandscape(function(event) {

    // exclude labels because they're handled separately during shape.changed
    if (event.context.shape.type === 'label') {
      return;
    }

    updateBounds(event);
  }));

  this.reverted([ 'shape.move', 'shape.create', 'shape.resize' ], iflandscape(function(event) {

    // exclude labels because they're handled separately during shape.changed
    if (event.context.shape.type === 'label') {
      return;
    }

    updateBounds(event);
  }));

  // Handle labels separately. This is necessary, because the label bounds have to be updated
  // every time its shape changes, not only on move, create and resize.
  eventBus.on('shape.changed', function(event) {
    if (event.element.type === 'label') {
      updateBounds({ context: { shape: event.element } });
    }
  });

}

inherits(landscapeUpdater, CommandInterceptor);

landscapeUpdater.$inject = [
  'eventBus',
  'landscapeFactory',
  'connectionDocking',
  'translate'
];


// implementation //////////////////////

landscapeUpdater.prototype.updateAttachment = function(context) {

  var shape = context.shape,
      businessObject = shape.businessObject,
      host = shape.host;

  businessObject.attachedToRef = host && host.businessObject;
};

landscapeUpdater.prototype.updateParent = function(element, oldParent) {

  // do not update label parent
  if (isLabel(element)) {
    return;
  }

  var parentShape = element.parent;

  var businessObject = element.businessObject,
      parentBusinessObject = parentShape && parentShape.businessObject,
      parentDi = parentBusinessObject && parentBusinessObject.di;

  this.updateSemanticParent(businessObject, parentBusinessObject);

  this.updateDiParent(businessObject.di, parentDi);
};


landscapeUpdater.prototype.updateBounds = function(shape) {

  var di = shape.businessObject.di;

  var target = (isLabel(shape)) ? this._getLabel(di) : di;

  var bounds = target.bounds;

  if (!bounds) {
    bounds = this._landscapeFactory.createDiBounds();
    target.set('bounds', bounds);
  }

  assign(bounds, {
    x: shape.x,
    y: shape.y,
    width: shape.width,
    height: shape.height
  });
};


landscapeUpdater.prototype.updateDiParent = function(di, parentDi) {

  if (parentDi && !is(parentDi, 'landscapeDi:landscapePlane')) {
    parentDi = parentDi.$parent;
  }

  if (di.$parent === parentDi) {
    return;
  }

  var planeElements = (parentDi || di.$parent).get('planeElement');

  if (parentDi) {
    planeElements.push(di);
    di.$parent = parentDi;
  } else {
    collectionRemove(planeElements, di);
    di.$parent = null;
  }
};


landscapeUpdater.prototype.updateSemanticParent = function(businessObject, newParent, visualParent) {

  var containment,
      translate = this._translate;

  if (businessObject.$parent === newParent) {
    return;
  }


  if (is(businessObject, 'landscape:BoardElement')) {
    containment = 'boardElements';
  }

  if (!containment) {
    throw new Error(translate(
      'no parent for {element} in {parent}',
      {
        element: businessObject.id,
        parent: newParent.id
      }
    ));
  }

  var children;

  if (businessObject.$parent) {

    // remove from old parent
    children = businessObject.$parent.get(containment);
    collectionRemove(children, businessObject);
  }

  if (!newParent) {
    businessObject.$parent = null;
  } else {

    // add to new parent
    children = newParent.get(containment);
    children.push(businessObject);
    businessObject.$parent = newParent;
  }

  if (visualParent) {
    var diChildren = visualParent.get(containment);

    collectionRemove(children, businessObject);

    if (newParent) {

      if (!diChildren) {
        diChildren = [];
        newParent.set(containment, diChildren);
      }

      diChildren.push(businessObject);
    }
  }
};


// helpers //////////////////////

landscapeUpdater.prototype._getLabel = function(di) {
  if (!di.label) {
    di.label = this._landscapeFactory.createDiLabel();
  }

  return di.label;
};


/**
 * Make sure the event listener is only called
 * if the touched element is a landscape element.
 *
 * @param  {Function} fn
 * @return {Function} guarded function
 */
function iflandscape(fn) {

  return function(event) {

    var context = event.context,
        element = context.shape || context.connection;

    if (is(element, 'landscape:BoardElement')) {
      fn(event);
    }
  };
}
