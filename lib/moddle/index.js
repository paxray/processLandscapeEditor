
import {
  assign
} from 'min-dash';

import Moddle from './Moddle';

import landscapeDescriptors from './resources/landscape.json';
import DiDescriptors from './resources/landscapeDi.json';
import DcDescriptors from './resources/dc.json';

var packages = {
  landscape: landscapeDescriptors,
  landscapeDi: DiDescriptors,
  dc: DcDescriptors,
};

export default function(additionalPackages, options) {
  var pks = assign({}, packages, additionalPackages);

  return new Moddle(pks, options);
}
