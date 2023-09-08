import {
  delegate as domDelegate
} from 'min-dom';

import {
  assign
} from 'min-dash';

import {
  getBusinessObject
} from '../../util/ModelUtil';

import COLORS from '../../util/ColorUtil';

import {
  toPoint
} from 'diagram-js/lib/util/Event';
import { isAny } from '../modeling/util/ModelingUtil';

var DEFAULT_SHAPE = {
  type: 'landscape:Squarelandscape',
  color: COLORS.GREEN,
  $instanceOf: function() { return true; }
};

export default function CanvasCreate(
    eventBus, elementFactory, canvas, directEditing, modeling) {

  var lastCreatedShape = DEFAULT_SHAPE;

  function _getNewShapePosition(event) {
    var eventPoint = toPoint(event);

    return {
      x: eventPoint.x,
      y: eventPoint.y
    };
  }

  function _activateDirectEdit(element) {
    if (isAny(element, [ 'landscape:landscape', 'landscape:Group', 'landscape:TextBox' ])) {

      directEditing.activate(element);
    }
  }

  function _createShapeOnCanvas(event) {
    var position = _getNewShapePosition(event);

    var newShape = elementFactory.createlandscapeElement(
      'shape', assign(lastCreatedShape, position));

    var root = canvas.getRootElement();

    var createdShape = modeling.createShape(newShape, position, root);

    _activateDirectEdit(createdShape);
  }

  function _saveLastCreatedShape(shape) {
    if (!shape) {
      lastCreatedShape = DEFAULT_SHAPE;
      return;
    }

    var bo = getBusinessObject(shape);

    lastCreatedShape = {
      type: shape.type,
      color: shape.color || bo.color,
      $instanceOf: function(type) {
        return (typeof bo.$instanceOf === 'function') && bo.$instanceOf(type);
      }
    };
  }


  eventBus.on('canvas.init', function(context) {
    var svg = context.svg;

    domDelegate.bind(svg, 'svg', 'dblclick', function(event) {
      if (event.target !== svg) {
        return;
      }

      _createShapeOnCanvas(event);
    });

    eventBus.on('create.end', function(context) {
      var shape = context.shape;
      _saveLastCreatedShape(shape);
    });
  });
}

CanvasCreate.prototype.$inject = [
  'eventBus',
  'elementFactory',
  'canvas',
  'directEditing',
  'modeling'
];