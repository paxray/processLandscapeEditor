import {
  assign,
  isArray,
  keys,
  forEach
} from 'min-dash';

import {
  hasPrimaryModifier
} from 'diagram-js/lib/util/Mouse';

import COLORS from '../../util/ColorUtil';
import { is, getBusinessObject } from '../../util/ModelUtil';


/**
 * A provider for landscape elements context pad
 */
export default function ContextPadProvider(
    config, injector, eventBus,
    contextPad, modeling, rules,
    imageSelection, translate) {

  config = config || {};

  contextPad.registerProvider(this);

  this._contextPad = contextPad;

  this._modeling = modeling;

  this._rules = rules;
  this._imageSelection = imageSelection;
  this._translate = translate;

  if (config.autoPlace !== false) {
    this._autoPlace = injector.get('autoPlace', false);
  }

  eventBus.on('create.end', 250, function(event) {
    var context = event.context,
        shape = context.shape;

    if (!hasPrimaryModifier(event) || !contextPad.isOpen(shape)) {
      return;
    }

    var entries = contextPad.getEntries(shape);

    if (entries.replace) {
      entries.replace.action.click(event, shape);
    }
  });
}

ContextPadProvider.$inject = [
  'config.contextPad',
  'injector',
  'eventBus',
  'contextPad',
  'modeling',
  'rules',
  'imageSelection',
  'translate'
];


ContextPadProvider.prototype.getContextPadEntries = function(element) {

  const {
    _rules: rules,
    _modeling: modeling,
    _imageSelection: imageSelection,
    _translate: translate
  } = this;

  let actions = {};

  function removeElement(e) {
    modeling.removeElements([ element ]);
  }

  function setColor(color) {
    modeling.setColor(element, color);
  }

  function createDeleteEntry(actions) {

    // delete element entry, only show if allowed by rules
    let deleteAllowed = rules.allowed('elements.delete', { elements: [ element ] });

    if (isArray(deleteAllowed)) {

      // was the element returned as a deletion candidate?
      deleteAllowed = deleteAllowed[0] === element;
    }

    if (deleteAllowed) {
      assign(actions, {
        'delete': {
          group: 'edit',
          className: 'bpmn-icon-trash',
          title: translate('Remove'),
          action: {
            click: removeElement
          }
        }
      });
    }
  }

  function createColoringEntries(actions) {
    forEach(keys(COLORS), key => {
      var color = COLORS[key];

      function getClassNames() {
        var classNames = [];

        if (color === getColor(element)) {

          classNames.push('pjs-color-entry-disabled');
        }

        classNames.push('pjs-color-entry-' + key);

        return classNames;
      }

      assign(actions, {
        ['color-' + key]: {
          group: 'color',
          className: getClassNames(),
          title: translate('Set Color'),
          action: {
            click: (event) => setColor(color)
          }
        }
      });
    });
  }

  if (element.type === 'label') {
    return actions;
  }

  if (is(element, 'landscape:landscape')) {
    createColoringEntries(actions);
  }

  if (is(element, 'landscape:Image')) {
    assign(actions, {
      'replace.image': {
        group: 'replace',
        className: 'bpmn-icon-screw-wrench',
        title: translate('Change image source'),
        action: {
          click: (event) => imageSelection.select(element)
        }
      }
    });
  }

  createDeleteEntry(actions);

  return actions;
};

// helpers //////////

function getColor(element) {
  var bo = getBusinessObject(element);

  return bo.color || element.color;
}
