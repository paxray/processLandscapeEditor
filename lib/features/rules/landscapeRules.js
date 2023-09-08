import {
  every
} from 'min-dash';

import inherits from 'inherits-browser';

import {
  is
} from '../../util/ModelUtil';

import {
  isLabel
} from '../../util/LabelUtil';

import RuleProvider from 'diagram-js/lib/features/rules/RuleProvider';
import { isAny } from '../modeling/util/ModelingUtil';


/**
 * landscape specific modeling rule
 */
export default function landscapeRules(eventBus) {
  RuleProvider.call(this, eventBus);
}

inherits(landscapeRules, RuleProvider);

landscapeRules.$inject = [ 'eventBus' ];

landscapeRules.prototype.init = function() {

  this.addRule('shape.resize', function(context) {

    var shape = context.shape,
        newBounds = context.newBounds;

    return canResize(shape, newBounds);
  });

  this.addRule('elements.create', function(context) {
    var elements = context.elements,
        position = context.position,
        target = context.target;

    return every(elements, function(element) {
      if (element.host) {
        return canAttach(element, element.host, null, position);
      }

      return canCreate(element, target, null, position);
    });
  });

  this.addRule('elements.move', function(context) {

    var target = context.target,
        shapes = context.shapes,
        position = context.position;

    return canAttach(shapes, target, null, position) ||
           canMove(shapes, target, position);
  });

  this.addRule('shape.create', function(context) {
    return canCreate(
      context.shape,
      context.target,
      context.source,
      context.position
    );
  });

  this.addRule('shape.attach', function(context) {

    return canAttach(
      context.shape,
      context.target,
      null,
      context.position
    );
  });

  this.addRule('element.copy', function(context) {
    var element = context.element,
        elements = context.elements;

    return canCopy(elements, element);
  });
};

landscapeRules.prototype.canMove = canMove;

landscapeRules.prototype.canAttach = canAttach;

landscapeRules.prototype.canDrop = canDrop;

landscapeRules.prototype.canCreate = canCreate;

landscapeRules.prototype.canReplace = canReplace;

landscapeRules.prototype.canResize = canResize;

landscapeRules.prototype.canCopy = canCopy;

/**
 * Utility functions for rule checking
 */

function isSame(a, b) {
  return a === b;
}

function getParents(element) {

  var parents = [];

  while (element) {
    element = element.parent;

    if (element) {
      parents.push(element);
    }
  }

  return parents;
}

function isParent(possibleParent, element) {
  var allParents = getParents(element);
  return allParents.indexOf(possibleParent) !== -1;
}

function isGroup(element) {
  return is(element, 'landscape:Group') && !element.labelTarget;
}

/**
 * Can an element be dropped into the target element
 *
 * @return {Boolean}
 */
function canDrop(element, target) {

  // can move labels
  if (isLabel(element) || isGroup(element)) {
    return true;
  }

  // drop board elements onto boards
  if (is(element, 'landscape:BoardElement') && is(target, 'landscape:landscapeBoard')) {
    return true;
  }

  return false;
}

function canReplace(elements, target) {

  if (!target) {
    return false;
  }

  return true;
}


function canAttach(elements, target) {

  if (!Array.isArray(elements)) {
    elements = [ elements ];
  }

  // only (re-)attach one element at a time
  if (elements.length !== 1) {
    return false;
  }

  var element = elements[0];

  // do not attach labels
  if (isLabel(element)) {
    return false;
  }

  if (is(target, 'landscape:BoardElement')) {
    return false;
  }

  return 'attach';
}


function canMove(elements, target) {

  // allow default move check to start move operation
  if (!target) {
    return true;
  }

  return elements.every(function(element) {
    return canDrop(element, target);
  });
}

function canCreate(shape, target, source, position) {

  if (!target) {
    return false;
  }

  if (isLabel(shape) || isGroup(shape)) {
    return true;
  }

  if (isSame(source, target)) {
    return false;
  }

  // ensure we do not drop the element
  // into source
  if (source && isParent(source, target)) {
    return false;
  }

  return canDrop(shape, target, position);
}

function canResize(shape, newBounds) {

  if (isAny(shape, [ 'landscape:landscape', 'landscape:TextBox' ])) {
    return !newBounds || (newBounds.width >= 50 && newBounds.height >= 50);
  }

  if (is(shape, 'landscape:Group')) {
    return true;
  }

  if (is(shape, 'landscape:Image')) {
    return true;
  }

  return false;
}

function canCopy(elements, element) {
  return true;
}
