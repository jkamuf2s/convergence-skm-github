/**!
© 2016 Convergence Labs, Inc.
@version 0.1.0
@license MIT
*/
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("ColorAssigner", [], factory);
	else if(typeof exports === 'object')
		exports["ColorAssigner"] = factory();
	else
		root["ColorAssigner"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _ColorAssigner = __webpack_require__(1);

	var _ColorAssigner2 = _interopRequireDefault(_ColorAssigner);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _ColorAssigner2.default;
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _ColorGenerator = __webpack_require__(2);

	var _ColorGenerator2 = _interopRequireDefault(_ColorGenerator);

	var _Palettes = __webpack_require__(3);

	var _Palettes2 = _interopRequireDefault(_Palettes);

	var _csscolorparser = __webpack_require__(4);

	var _csscolorparser2 = _interopRequireDefault(_csscolorparser);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * The ColorAssigner manages the assignment of colors to unique resources.  A
	 * color will uniquely mapped to each resource.  Resources are identified by
	 * a unique string id.  The consumer can provide an array of preferred colors
	 * that will be used, if they are available. After all preferred colors are
	 * assigned, random colors will be assigned.
	 */
	var ColorAssigner = function () {
	  _createClass(ColorAssigner, null, [{
	    key: 'Palettes',
	    get: function get() {
	      return _Palettes2.default;
	    }

	    /**
	     * Creates a new ColorAssigner using the supplied preferred colors.
	     *
	     * @param palette {Array} An array of preferred colors to use.  These colors
	     * will be used as long as they are available.
	     *
	     * @constructor
	     */

	  }]);

	  function ColorAssigner(palette) {
	    _classCallCheck(this, ColorAssigner);

	    if (palette === undefined) {
	      this._palette = ColorAssigner.Palettes.DEFAULT.slice(0);
	    } else {
	      this._palette = palette.slice(0);
	    }
	    Object.freeze(this._palette);

	    this._preferredColors = this._palette.map(function (color) {
	      return _csscolorparser2.default.parseCSSColor(color);
	    });
	    Object.freeze(this._preferredColors);

	    this._availableColors = this._preferredColors.slice(0);
	    this._assignedColorsById = {};
	    this._assignedColors = [];
	  }

	  /**
	   * Gets the current palette in use.
	   *
	   * @returns {Array} The palette of preferred colors.
	   */


	  _createClass(ColorAssigner, [{
	    key: 'palette',
	    value: function palette() {
	      return this._palette;
	    }

	    /**
	     * Gets a color for a specified unique id.  If a color has previously been
	     * assigned to this id, it will be returned.  Otherwise a new color will
	     * be assigned.  A preferred color will be assigned if one is available,
	     * otherwise a random color will be assigned and returned.
	     *
	     * Colors take the form of:
	     *
	     * {
	     *   r: [0-255],
	     *   g: [0-255],
	     *   b: [0-255],
	     *   a: [0-255]
	     * }
	     *
	     * @param {string} id The unique id to get a color for.
	     * @returns {Object} A hex representation of the color.
	     */

	  }, {
	    key: 'getColor',
	    value: function getColor(id) {
	      if (typeof id !== 'string' && typeof id !== 'number') {
	        throw new Error('id must be a string or a number: ' + id);
	      }

	      var color = this._assignedColorsById[id];

	      if (color === undefined) {
	        color = this._acquireColor();
	        this._assignedColorsById[id] = color;
	        this._assignedColors.push(color);
	      }

	      return {
	        r: color[0],
	        g: color[1],
	        b: color[2],
	        a: color[3]
	      };
	    }

	    /**
	     * Gets a color for the specified resource as an rgba string.
	     * 'rgba(200, 120, 56, 255)'
	     *
	     * @param id The id of the resource to get the color for.
	     * @returns {string} The color as an rgba string.
	     */

	  }, {
	    key: 'getColorAsRgba',
	    value: function getColorAsRgba(id) {
	      var color = this.getColor(id);

	      return 'rgba(' + color.r + ', ' + color.g + ', ' + color.b + ', ' + color.a + ')';
	    }

	    /**
	     * Gets a color for the specified resource as a hex string.
	     * '#ff23b5'
	     *
	     * @param id The id of the resource to get the color for.
	     * @returns {string} The color as a hex string.
	     */

	  }, {
	    key: 'getColorAsHex',
	    value: function getColorAsHex(id) {
	      var color = this.getColor(id);

	      function pad(str) {
	        while (str.length < 2) {
	          str = '0' + str;
	        }
	        return str;
	      }

	      return '#' + pad(color.r.toString(16)) + pad(color.g.toString(16)) + pad(color.b.toString(16));
	    }

	    /**
	     * Releases a color currently assigned to the unique id.  If the color being
	     * released is a preferred color, it will be returned to the set of available
	     * colors.
	     *
	     * @param {string} id The id of the color to release.
	     */

	  }, {
	    key: 'releaseColor',
	    value: function releaseColor(id) {
	      if (typeof id !== 'string' && typeof id !== 'number') {
	        throw new Error('id must be a string or a number: ' + id);
	      }

	      var color = this._assignedColorsById[id];

	      if (color === undefined) {
	        throw new Error('No color assigned for id: ' + id);
	      }

	      var index = this._assignedColors.indexOf(color);

	      this._assignedColors.splice(index, 1);
	      delete this._assignedColorsById[id];

	      // If this was a preferred color put it back on the list.
	      if (this._preferredColors.indexOf(color) >= 0) {
	        this._availableColors.push(color);
	      }
	    }

	    /**
	     * Acquires an unused color. This method will attempt to return a preferred
	     * color first, and then generate a random color if a preferred color is not
	     * available.
	     *
	     * @returns {string} A hex representation of the color.
	     * @private
	     */

	  }, {
	    key: '_acquireColor',
	    value: function _acquireColor() {
	      var color = null;

	      if (this._availableColors.length > 0) {
	        color = this._availableColors[0];
	        this._availableColors.splice(0, 1);
	      } else {
	        color = _ColorGenerator2.default.generateRandomColor(this._assignedColors);
	      }

	      return color;
	    }
	  }]);

	  return ColorAssigner;
	}();

	exports.default = ColorAssigner;
	module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ColorGenerator = function () {
	  function ColorGenerator() {
	    _classCallCheck(this, ColorGenerator);
	  }

	  _createClass(ColorGenerator, null, [{
	    key: "generateRandomColor",
	    value: function generateRandomColor(currentColors) {
	      // todo do something smarter.

	      var r = Math.round(255 * Math.random());
	      var g = Math.round(255 * Math.random());
	      var b = Math.round(255 * Math.random());

	      return [r, g, b, 255];
	    }
	  }]);

	  return ColorGenerator;
	}();

	exports.default = ColorGenerator;
	module.exports = exports["default"];

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var DEFAULT = ['#F44336', // red
	'#388E3C', // green
	'#3F51B5', // indigo
	'#FF9800', // orange
	'#FFEB3B', // yellow
	'#9C27B0', // purple
	'#795548', // brown
	'#F8BBD0', // pink (light)
	'#4df0d5', // teal
	'#bccea7', // beige
	'#03A9F4', // light blue
	'#D1C4E9', // light purple
	'#627a86', // blue grey
	'#620E00', // maroon
	'#15fa68', // bright green
	'#f05fae', // bright purple
	'#b49666', // light brown
	'#257275', // blue green
	'#7f5075', // medium purple
	'#79c1a1', // sea green
	'#c3bb59', // gold
	'#2a7287', // slate blue
	'#F08080', // light coral,
	'#5973d6' // royal blue
	];

	var DARK_12 = ['#e31a1c', // red
	'#1f78b4', // dark blue
	'#33a02c', // dark green
	'#6a3d9a', // dark purple
	'#fdbf6f', // light orange
	'#a6cee3', // light blue
	'#b2df8a', // light green
	'#fb9a99', // pink
	'#ffff99', // yellow
	'#778899', // slate gray
	'#cab2d6', // light purple
	'#b15928' // brown
	];

	var LIGHT_12 = ['#fb8072', // red
	'#80b1d3', // light blue
	'#b3de69', // green
	'#fdb462', // orange
	'#fccde5', // light purple
	'#8dd3c7', // Aqua
	'#ffffb3', // light yellow
	'#bebada', // purple
	'#ccebc5', // light green
	'#ffed6f', // dark yellow
	'#778899', // gray
	'#bc80bd' // dark purple
	];

	var palettes = {
	  DEFAULT: DEFAULT,
	  LIGHT_12: LIGHT_12,
	  DARK_12: DARK_12
	};

	Object.freeze(LIGHT_12);
	Object.freeze(DARK_12);
	Object.freeze(DEFAULT);
	Object.freeze(palettes);

	exports.default = palettes;
	module.exports = exports['default'];

/***/ },
/* 4 */
/***/ function(module, exports) {

	// (c) Dean McNamee <dean@gmail.com>, 2012.
	//
	// https://github.com/deanm/css-color-parser-js
	//
	// Permission is hereby granted, free of charge, to any person obtaining a copy
	// of this software and associated documentation files (the "Software"), to
	// deal in the Software without restriction, including without limitation the
	// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
	// sell copies of the Software, and to permit persons to whom the Software is
	// furnished to do so, subject to the following conditions:
	//
	// The above copyright notice and this permission notice shall be included in
	// all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
	// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
	// IN THE SOFTWARE.

	// http://www.w3.org/TR/css3-color/
	var kCSSColorTable = {
	  "transparent": [0,0,0,0], "aliceblue": [240,248,255,1],
	  "antiquewhite": [250,235,215,1], "aqua": [0,255,255,1],
	  "aquamarine": [127,255,212,1], "azure": [240,255,255,1],
	  "beige": [245,245,220,1], "bisque": [255,228,196,1],
	  "black": [0,0,0,1], "blanchedalmond": [255,235,205,1],
	  "blue": [0,0,255,1], "blueviolet": [138,43,226,1],
	  "brown": [165,42,42,1], "burlywood": [222,184,135,1],
	  "cadetblue": [95,158,160,1], "chartreuse": [127,255,0,1],
	  "chocolate": [210,105,30,1], "coral": [255,127,80,1],
	  "cornflowerblue": [100,149,237,1], "cornsilk": [255,248,220,1],
	  "crimson": [220,20,60,1], "cyan": [0,255,255,1],
	  "darkblue": [0,0,139,1], "darkcyan": [0,139,139,1],
	  "darkgoldenrod": [184,134,11,1], "darkgray": [169,169,169,1],
	  "darkgreen": [0,100,0,1], "darkgrey": [169,169,169,1],
	  "darkkhaki": [189,183,107,1], "darkmagenta": [139,0,139,1],
	  "darkolivegreen": [85,107,47,1], "darkorange": [255,140,0,1],
	  "darkorchid": [153,50,204,1], "darkred": [139,0,0,1],
	  "darksalmon": [233,150,122,1], "darkseagreen": [143,188,143,1],
	  "darkslateblue": [72,61,139,1], "darkslategray": [47,79,79,1],
	  "darkslategrey": [47,79,79,1], "darkturquoise": [0,206,209,1],
	  "darkviolet": [148,0,211,1], "deeppink": [255,20,147,1],
	  "deepskyblue": [0,191,255,1], "dimgray": [105,105,105,1],
	  "dimgrey": [105,105,105,1], "dodgerblue": [30,144,255,1],
	  "firebrick": [178,34,34,1], "floralwhite": [255,250,240,1],
	  "forestgreen": [34,139,34,1], "fuchsia": [255,0,255,1],
	  "gainsboro": [220,220,220,1], "ghostwhite": [248,248,255,1],
	  "gold": [255,215,0,1], "goldenrod": [218,165,32,1],
	  "gray": [128,128,128,1], "green": [0,128,0,1],
	  "greenyellow": [173,255,47,1], "grey": [128,128,128,1],
	  "honeydew": [240,255,240,1], "hotpink": [255,105,180,1],
	  "indianred": [205,92,92,1], "indigo": [75,0,130,1],
	  "ivory": [255,255,240,1], "khaki": [240,230,140,1],
	  "lavender": [230,230,250,1], "lavenderblush": [255,240,245,1],
	  "lawngreen": [124,252,0,1], "lemonchiffon": [255,250,205,1],
	  "lightblue": [173,216,230,1], "lightcoral": [240,128,128,1],
	  "lightcyan": [224,255,255,1], "lightgoldenrodyellow": [250,250,210,1],
	  "lightgray": [211,211,211,1], "lightgreen": [144,238,144,1],
	  "lightgrey": [211,211,211,1], "lightpink": [255,182,193,1],
	  "lightsalmon": [255,160,122,1], "lightseagreen": [32,178,170,1],
	  "lightskyblue": [135,206,250,1], "lightslategray": [119,136,153,1],
	  "lightslategrey": [119,136,153,1], "lightsteelblue": [176,196,222,1],
	  "lightyellow": [255,255,224,1], "lime": [0,255,0,1],
	  "limegreen": [50,205,50,1], "linen": [250,240,230,1],
	  "magenta": [255,0,255,1], "maroon": [128,0,0,1],
	  "mediumaquamarine": [102,205,170,1], "mediumblue": [0,0,205,1],
	  "mediumorchid": [186,85,211,1], "mediumpurple": [147,112,219,1],
	  "mediumseagreen": [60,179,113,1], "mediumslateblue": [123,104,238,1],
	  "mediumspringgreen": [0,250,154,1], "mediumturquoise": [72,209,204,1],
	  "mediumvioletred": [199,21,133,1], "midnightblue": [25,25,112,1],
	  "mintcream": [245,255,250,1], "mistyrose": [255,228,225,1],
	  "moccasin": [255,228,181,1], "navajowhite": [255,222,173,1],
	  "navy": [0,0,128,1], "oldlace": [253,245,230,1],
	  "olive": [128,128,0,1], "olivedrab": [107,142,35,1],
	  "orange": [255,165,0,1], "orangered": [255,69,0,1],
	  "orchid": [218,112,214,1], "palegoldenrod": [238,232,170,1],
	  "palegreen": [152,251,152,1], "paleturquoise": [175,238,238,1],
	  "palevioletred": [219,112,147,1], "papayawhip": [255,239,213,1],
	  "peachpuff": [255,218,185,1], "peru": [205,133,63,1],
	  "pink": [255,192,203,1], "plum": [221,160,221,1],
	  "powderblue": [176,224,230,1], "purple": [128,0,128,1],
	  "rebeccapurple": [102,51,153,1],
	  "red": [255,0,0,1], "rosybrown": [188,143,143,1],
	  "royalblue": [65,105,225,1], "saddlebrown": [139,69,19,1],
	  "salmon": [250,128,114,1], "sandybrown": [244,164,96,1],
	  "seagreen": [46,139,87,1], "seashell": [255,245,238,1],
	  "sienna": [160,82,45,1], "silver": [192,192,192,1],
	  "skyblue": [135,206,235,1], "slateblue": [106,90,205,1],
	  "slategray": [112,128,144,1], "slategrey": [112,128,144,1],
	  "snow": [255,250,250,1], "springgreen": [0,255,127,1],
	  "steelblue": [70,130,180,1], "tan": [210,180,140,1],
	  "teal": [0,128,128,1], "thistle": [216,191,216,1],
	  "tomato": [255,99,71,1], "turquoise": [64,224,208,1],
	  "violet": [238,130,238,1], "wheat": [245,222,179,1],
	  "white": [255,255,255,1], "whitesmoke": [245,245,245,1],
	  "yellow": [255,255,0,1], "yellowgreen": [154,205,50,1]}

	function clamp_css_byte(i) {  // Clamp to integer 0 .. 255.
	  i = Math.round(i);  // Seems to be what Chrome does (vs truncation).
	  return i < 0 ? 0 : i > 255 ? 255 : i;
	}

	function clamp_css_float(f) {  // Clamp to float 0.0 .. 1.0.
	  return f < 0 ? 0 : f > 1 ? 1 : f;
	}

	function parse_css_int(str) {  // int or percentage.
	  if (str[str.length - 1] === '%')
	    return clamp_css_byte(parseFloat(str) / 100 * 255);
	  return clamp_css_byte(parseInt(str));
	}

	function parse_css_float(str) {  // float or percentage.
	  if (str[str.length - 1] === '%')
	    return clamp_css_float(parseFloat(str) / 100);
	  return clamp_css_float(parseFloat(str));
	}

	function css_hue_to_rgb(m1, m2, h) {
	  if (h < 0) h += 1;
	  else if (h > 1) h -= 1;

	  if (h * 6 < 1) return m1 + (m2 - m1) * h * 6;
	  if (h * 2 < 1) return m2;
	  if (h * 3 < 2) return m1 + (m2 - m1) * (2/3 - h) * 6;
	  return m1;
	}

	function parseCSSColor(css_str) {
	  // Remove all whitespace, not compliant, but should just be more accepting.
	  var str = css_str.replace(/ /g, '').toLowerCase();

	  // Color keywords (and transparent) lookup.
	  if (str in kCSSColorTable) return kCSSColorTable[str].slice();  // dup.

	  // #abc and #abc123 syntax.
	  if (str[0] === '#') {
	    if (str.length === 4) {
	      var iv = parseInt(str.substr(1), 16);  // TODO(deanm): Stricter parsing.
	      if (!(iv >= 0 && iv <= 0xfff)) return null;  // Covers NaN.
	      return [((iv & 0xf00) >> 4) | ((iv & 0xf00) >> 8),
	              (iv & 0xf0) | ((iv & 0xf0) >> 4),
	              (iv & 0xf) | ((iv & 0xf) << 4),
	              1];
	    } else if (str.length === 7) {
	      var iv = parseInt(str.substr(1), 16);  // TODO(deanm): Stricter parsing.
	      if (!(iv >= 0 && iv <= 0xffffff)) return null;  // Covers NaN.
	      return [(iv & 0xff0000) >> 16,
	              (iv & 0xff00) >> 8,
	              iv & 0xff,
	              1];
	    }

	    return null;
	  }

	  var op = str.indexOf('('), ep = str.indexOf(')');
	  if (op !== -1 && ep + 1 === str.length) {
	    var fname = str.substr(0, op);
	    var params = str.substr(op+1, ep-(op+1)).split(',');
	    var alpha = 1;  // To allow case fallthrough.
	    switch (fname) {
	      case 'rgba':
	        if (params.length !== 4) return null;
	        alpha = parse_css_float(params.pop());
	        // Fall through.
	      case 'rgb':
	        if (params.length !== 3) return null;
	        return [parse_css_int(params[0]),
	                parse_css_int(params[1]),
	                parse_css_int(params[2]),
	                alpha];
	      case 'hsla':
	        if (params.length !== 4) return null;
	        alpha = parse_css_float(params.pop());
	        // Fall through.
	      case 'hsl':
	        if (params.length !== 3) return null;
	        var h = (((parseFloat(params[0]) % 360) + 360) % 360) / 360;  // 0 .. 1
	        // NOTE(deanm): According to the CSS spec s/l should only be
	        // percentages, but we don't bother and let float or percentage.
	        var s = parse_css_float(params[1]);
	        var l = parse_css_float(params[2]);
	        var m2 = l <= 0.5 ? l * (s + 1) : l + s - l * s;
	        var m1 = l * 2 - m2;
	        return [clamp_css_byte(css_hue_to_rgb(m1, m2, h+1/3) * 255),
	                clamp_css_byte(css_hue_to_rgb(m1, m2, h) * 255),
	                clamp_css_byte(css_hue_to_rgb(m1, m2, h-1/3) * 255),
	                alpha];
	      default:
	        return null;
	    }
	  }

	  return null;
	}

	try { exports.parseCSSColor = parseCSSColor } catch(e) { }


/***/ }
/******/ ])
});
;