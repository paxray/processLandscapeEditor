import {
  assign
} from 'min-dash';

import COLORS from '../../util/ColorUtil';


/**
 * A palette provider for landscape elements.
 */
export default function PaletteProvider(
    palette, create, elementFactory,
    spaceTool, lassoTool, handTool, translate) {

  this._palette = palette;
  this._create = create;
  this._elementFactory = elementFactory;
  this._spaceTool = spaceTool;
  this._lassoTool = lassoTool;
  this._handTool = handTool;
  this._translate = translate;

  palette.registerProvider(this);
}

PaletteProvider.$inject = [
  'palette',
  'create',
  'elementFactory',
  'spaceTool',
  'lassoTool',
  'handTool',
  'translate'
];


PaletteProvider.prototype.getPaletteEntries = function(element) {

  var actions = {},
      create = this._create,
      elementFactory = this._elementFactory,
      spaceTool = this._spaceTool,
      lassoTool = this._lassoTool,
      handTool = this._handTool,
      translate = this._translate;

  function createAction(type, group, className, title, options) {

    function createListener(event) {
      var shape = elementFactory.createShape(assign({ type: type }, options));
      create.start(event, shape);
    }

    var shortType = type.replace(/^landscape:/, '');

    return {
      group: group,
      className: className,
      title: title || translate('Create {type}', { type: shortType }),
      action: {
        dragstart: createListener,
        click: createListener
      }
    };
  }

  function createImage(event) {
    var shape = elementFactory.createShape({
      type: 'landscape:Image'
    });

    create.start(event, shape, {
      hints: { selectImage: true }
    });
  }

  assign(actions, {
    'hand-tool': {
      group: 'tools',
      className: 'bpmn-icon-hand-tool',
      title: translate('Activate the hand tool'),
      action: {
        click: function(event) {
          handTool.activateHand(event);
        }
      }
    },
    'lasso-tool': {
      group: 'tools',
      className: 'bpmn-icon-lasso-tool',
      title: translate('Activate the lasso tool'),
      action: {
        click: function(event) {
          lassoTool.activateSelection(event);
        }
      }
    },
    'space-tool': {
      group: 'tools',
      className: 'bpmn-icon-space-tool',
      title: translate('Activate the create/remove space tool'),
      action: {
        click: function(event) {
          spaceTool.activateSelection(event);
        }
      }
    },
    'tool-separator': {
      group: 'tools',
      separator: true
    },
    'create.square-landscape': createAction(
      'landscape:Squarelandscape', 'landscapes', 'pjs-landscape-square',
      translate('Create Square landscape'), { color: COLORS.WHITE }
    ),
    'create.triangle-landscape': createAction(
      'landscape:Trianglelandscape', 'landscapes', 'pjs-landscape-triangle',
      translate('Create Triangle landscape'), { color: COLORS.WHITE }
    ),
    'create.process-landscape': createAction(
      'landscape:Processlandscape', 'landscapes', 'pjs-landscape-process',
      translate('Create Process landscape'), { color: COLORS.WHITE }
    ),
    'landscape-separator': {
      group: 'landscapes',
      separator: true
    },
    'create.text-box': createAction(
      'landscape:TextBox', 'artifact', 'pjs-text-box',
      translate('Create Text')
    ),
    'create.group': createAction(
      'landscape:Group', 'artifact', 'pjs-group',
      translate('Create Group')
    )
  });

  return actions;
};
