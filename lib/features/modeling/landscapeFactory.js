import {
  assign,
} from 'min-dash';

import {
  isAny
} from './util/ModelingUtil';

import {
  is
} from '../../util/ModelUtil';


export default function landscapeFactory(moddle) {
  this._model = moddle;
}

landscapeFactory.$inject = [ 'moddle' ];


landscapeFactory.prototype._needsId = function(element) {
  return isAny(element, [
    'landscape:BoardElement'
  ]);
};

landscapeFactory.prototype._ensureId = function(element) {

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


landscapeFactory.prototype.create = function(type, attrs) {
  var element = this._model.create(type, attrs || {});

  this._ensureId(element);

  return element;
};


landscapeFactory.prototype.createDiLabel = function() {
  return this.create('landscapeDi:landscapeLabel', {
    bounds: this.createDiBounds()
  });
};


landscapeFactory.prototype.createDiShape = function(semantic, bounds, attrs) {

  return this.create('landscapeDi:LandscapeShape', assign({
    boardElement: semantic,
    bounds: this.createDiBounds(bounds)
  }, attrs));
};


landscapeFactory.prototype.createDiBounds = function(bounds) {
  return this.create('dc:Bounds', bounds);
};


landscapeFactory.prototype.createDiPlane = function(semantic) {
  return this.create('landscapeDi:LandscapePlane', {
    boardElement: semantic
  });
};