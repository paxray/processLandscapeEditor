# landscape-js

[![Netlify Status](https://api.netlify.com/api/v1/badges/72130b1d-f56b-473e-8f3b-50a5af916e64/deploy-status)](https://app.netlify.com/sites/landscape-js-demo/deploys) ![Build Status](https://github.com/pinussilvestrus/landscape-js/workflows/ci/badge.svg)


Create post-it brainstorming boards - built with [diagram-js](https://github.com/bpmn-io/diagram-js).

![Screencast](./docs/screencast.gif)

Checkout the [**Demo**](https://landscape-js-demo.netlify.app/) or the [**Experiments Page**](https://landscape-js-experiments.netlify.app/) to get some inspiration.

## Features

* Create resizable Post-its on the Canvas (squared and circled) via
  * Palette
  * Double Click (latest element type will be respected)
* Change the color of Post-its
* Create simple Text Boxes on the Canvas
* Create grouping frame elements on the Canvas
* Add external image resources on the Canvas

## Installation

Install the package to include it into your web application

```sh
$ npm install landscape-js-core --save
```

## Usage

To get started, create a [landscape-js](https://github.com/pinussilvestrus/landscape-js) instance
and render a post-it board into your web application

```javascript
import 'landscape-js-core/assets/landscape-js.css';

import landscapeModeler from 'landscape-js-core/lib/Modeler';

let xml; // my post-it xml 

const modeler = new landscapeModeler({
  container: '#canvas',
  keyboard: {
    bindTo: window,
  }
});

modeler.importXML(xml).then(function() {
  console.log('board rendered');
}).catch(function(error) {
  console.error('could not import landscape board', err);
});
```

For using `landscape-js` inside your web application you'll need a source code bundler, e.g. [webpack](https://webpack.js.org/). Checkout the [example](./example) for getting inspiration. 

### Development Setup

Spin up the application for development, all strings attached:

```sh
$ npm install
$ cd  example
$ npm install
$ npm run dev
```

## Extensions

Since [`diagram-js`](https://github.com/bpmn-io/diagram-js) and also this project is extendable by design, there exist a couple of great community maintained extensions

* [`drag-drop-images`](https://github.com/xanpj/landscape-js-extensions#drag-drop-images) - Drag and drop image files on the board
* [`selection-organizer`](https://github.com/xanpj/landscape-js-extensions#selection-organizer) - Organize and distribute groups of elements
* [`properties-panel`](https://github.com/xanpj/landscape-js-extensions#properties-panel) - Properties panel for post-it elements

## License

MIT

Contains parts of ([bpmn-io](https://github.com/bpmn-io)) released under the [bpmn.io license](http://bpmn.io/license).
