import {
  assign,
} from 'min-dash';

import {
  isAny
} from './util/ModelingUtil';

import {
  is
} from '../../util/ModelUtil';


export default function PositFactory(moddle) {
  this._model = moddle;
}

PositFactory.$inject = [ 'moddle' ];


PositFactory.prototype._needsId = function(element) {
  return isAny(element, [
    'landscape:BoardElement'
  ]);
};

PositFactory.prototype._ensureId = function(element) {

  // generate semantic ids for elements
  // landscape:landscape -> Positit_ID
  var prefix;

  if (is(element, 'landscape:landscape')) {
    prefix = 'landscape';
  } else {
    prefix = (element.$type || '').replace(/^[^:]*:/g, '');
  }

  prefix += '_';

  if (!element.id && this._needsId(element)) {
    element.id = this._model.ids.nextPrefixed(prefix, element);
  }
};


PositFactory.prototype.create = function(type, attrs) {
  var element = this._model.create(type, attrs || {});

  this._ensureId(element);

  return element;
};


PositFactory.prototype.createDiLabel = function() {
  return this.create('landscapeDi:landscapeLabel', {
    bounds: this.createDiBounds()
  });
};


PositFactory.prototype.createDiShape = function(semantic, bounds, attrs) {

  return this.create('landscapeDi:landscapeShape', assign({
    boardElement: semantic,
    bounds: this.createDiBounds(bounds)
  }, attrs));
};


PositFactory.prototype.createDiBounds = function(bounds) {
  return this.create('dc:Bounds', bounds);
};


PositFactory.prototype.createDiPlane = function(semantic) {
  return this.create('landscapeDi:landscapePlane', {
    boardElement: semantic
  });
};