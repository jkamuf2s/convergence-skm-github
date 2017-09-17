/**!
© 2017 Convergence Labs, Inc.
@version 0.2.1
@license MIT
*/
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("Convergence"));
	else if(typeof define === 'function' && define.amd)
		define("ConvergenceInputElementBinder", ["Convergence"], factory);
	else if(typeof exports === 'object')
		exports["ConvergenceInputElementBinder"] = factory(require("Convergence"));
	else
		root["ConvergenceInputElementBinder"] = factory(root["Convergence"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_6__) {
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

	var _TextInputProcessor = __webpack_require__(1);

	Object.keys(_TextInputProcessor).forEach(function (key) {
	  if (key === "default" || key === "__esModule") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _TextInputProcessor[key];
	    }
	  });
	});

	var _ConvergenceInputElementBinder = __webpack_require__(5);

	Object.keys(_ConvergenceInputElementBinder).forEach(function (key) {
	  if (key === "default" || key === "__esModule") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _ConvergenceInputElementBinder[key];
	    }
	  });
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.TextInputProcessor = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _ElementUtils = __webpack_require__(2);

	var _stringChangeDetector = __webpack_require__(3);

	var _stringChangeDetector2 = _interopRequireDefault(_stringChangeDetector);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * A helper class designed to enable processing of local and remote to an a HTMLInputElement
	 * or a HTMLTextAreaElement.
	 *
	 * @param options {{
	 *   element: string | HTMLInputElement | HTMLTextAreaElement
	 *   input: string
	 *   onInsert: Function
	 *   onRemove: Function
	 * }}
	 */
	var TextInputProcessor = exports.TextInputProcessor = function () {
	  function TextInputProcessor(options) {
	    _classCallCheck(this, TextInputProcessor);

	    var element = (0, _ElementUtils.resolveElement)(options.element);

	    if (element instanceof HTMLInputElement) {
	      if (element.type !== "text" && element.type !== "url" && element.type !== "tel" && element.type !== "search" && element.type !== "password") {
	        throw new Error("HTMLInputElement must of of type 'text', 'url', 'tel', or 'search': " + element.type);
	      }
	    } else if (!(element instanceof HTMLTextAreaElement)) {
	      throw new Error("Input element must either an HTMLTextInput or a HTMLTextArea.");
	    }

	    this._input = element;
	    this._event = options.event || "input";

	    this._detector = new _stringChangeDetector2.default({
	      value: this._input.value,
	      onInsert: options.onInsert,
	      onRemove: options.onRemove
	    });
	    this._listener = this._onEvent.bind(this);

	    this.bind();
	  }

	  _createClass(TextInputProcessor, [{
	    key: "bind",
	    value: function bind() {
	      this._input.addEventListener(this._event, this._listener);
	    }
	  }, {
	    key: "unbind",
	    value: function unbind() {
	      this._input.removeEventListener(this._event, this._listener);
	    }
	  }, {
	    key: "insertText",
	    value: function insertText(index, value) {
	      this._detector.insertText(index, value);
	      this._input.value = this._detector.getValue();
	    }
	  }, {
	    key: "removeText",
	    value: function removeText(index, length) {
	      this._detector.removeText(index, length);
	      this._input.value = this._detector.getValue();
	    }
	  }, {
	    key: "setValue",
	    value: function setValue(value) {
	      this._input.value = value;
	      this._detector.setValue(value);
	    }
	  }, {
	    key: "_onEvent",
	    value: function _onEvent() {
	      this._detector.processNewValue(this._input.value);
	    }
	  }]);

	  return TextInputProcessor;
	}();

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.resolveElement = resolveElement;
	/**
	 * @param element {HTMLElement | string}
	 * @returns {HTMLElement}
	 */
	function resolveElement(element) {
	  if (element instanceof HTMLElement) {
	    return element;
	  }

	  if (typeof element === "string") {
	    var candidate = document.getElementById(element);

	    if (candidate === undefined) {
	      throw new ReferenceError("An element with id '" + element + "' could not be found.");
	    }
	    return candidate;
	  }

	  throw new Error("The supplied argument must be an HTMLElement or a string representing an element id.");
	}

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/**!
	© 2017 Convergence Labs, Inc.
	@version 0.1.1
	@license MIT
	*/
	'use strict';

	module.exports = __webpack_require__(4);
	//# sourceMappingURL=index.js.map


/***/ },
/* 4 */
/***/ function(module, exports) {

	/**!
	© 2017 Convergence Labs, Inc.
	@version 0.1.1
	@license MIT
	*/
	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var StringChangeDetector = function () {
	  function StringChangeDetector(options) {
	    _classCallCheck(this, StringChangeDetector);

	    if (!options) {
	      throw new Error("options must be defined");
	    }

	    if (typeof options.onInsert !== "function") {
	      throw new Error("options.onInsert must be a function");
	    }

	    if (typeof options.onRemove !== "function") {
	      throw new Error("options.onRemove must be a function");
	    }

	    if (typeof options.value !== "string") {
	      throw new Error("options.value must be a string");
	    }

	    this._onInsert = options.onInsert;
	    this._onRemove = options.onRemove;
	    this._value = options.value;
	  }

	  /**
	   * Inserts a string into the current value at the specified index.
	   *
	   * @param index {number}
	   *    The index in the string to insert into.
	   * @param value {string}
	   *   The value to insert into the string.
	   */


	  _createClass(StringChangeDetector, [{
	    key: "insertText",
	    value: function insertText(index, value) {
	      var oldVal = this._value;
	      var newVal = oldVal.substring(0, index) + value + oldVal.substring(index, oldVal.length);
	      this.setValue(newVal);
	    }

	    /**
	     * Removes a specified number of characters from the current string at
	     * a specific location.
	     *
	     * @param index {number}
	     *    The index in the string to remove characters.
	     * @param length {number}
	     *   The number of characters to remove.
	     */

	  }, {
	    key: "removeText",
	    value: function removeText(index, length) {
	      var oldVal = this._value;
	      var newVal = oldVal.substring(0, index) + oldVal.substring(index + length, oldVal.length);
	      this.setValue(newVal);
	    }

	    /**
	     * Sets the current value of the string.
	     *
	     * @param value {string}
	     *   The new value of the string.
	     */

	  }, {
	    key: "setValue",
	    value: function setValue(value) {
	      this._value = value;
	    }

	    /**
	     * Gets the current value of the string.
	     *
	     * @returns {string}
	     */

	  }, {
	    key: "getValue",
	    value: function getValue() {
	      return this._value;
	    }

	    /**
	     * Process the new value of the string after a single edit.
	     *
	     * @param newValue {string}
	     *   The new value to process.
	     */

	  }, {
	    key: "processNewValue",
	    value: function processNewValue(newValue) {
	      var commonEnd = 0;
	      var commonStart = 0;

	      if (this._value === newValue) {
	        return;
	      }

	      while (this._value.charAt(commonStart) === newValue.charAt(commonStart)) {
	        commonStart++;
	      }

	      while (this._value.charAt(this._value.length - 1 - commonEnd) === newValue.charAt(newValue.length - 1 - commonEnd) && commonEnd + commonStart < this._value.length && commonEnd + commonStart < newValue.length) {
	        commonEnd++;
	      }

	      // Characters were removed.
	      if (this._value.length !== commonStart + commonEnd) {
	        if (this._onRemove) {
	          this._onRemove(commonStart, this._value.length - commonStart - commonEnd);
	        }
	      }

	      // Characters were added
	      if (newValue.length !== commonStart + commonEnd) {
	        if (this._onInsert) {
	          this._onInsert(commonStart, newValue.slice(commonStart, newValue.length - commonEnd));
	        }
	      }

	      this._value = newValue;
	    }
	  }]);

	  return StringChangeDetector;
	}();

	exports.default = StringChangeDetector;
	module.exports = exports["default"];
	//# sourceMappingURL=StringChangeDetector.js.map


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.bindTextInput = bindTextInput;
	exports.bindNumberInput = bindNumberInput;
	exports.bindCheckboxInput = bindCheckboxInput;
	exports.bindRangeInput = bindRangeInput;
	exports.bindColorInput = bindColorInput;
	exports.bindSingleSelect = bindSingleSelect;
	exports.bindMultiSelect = bindMultiSelect;
	exports.bindRadioInputs = bindRadioInputs;

	var _ElementUtils = __webpack_require__(2);

	var _TextInputProcessor = __webpack_require__(1);

	var _convergence = __webpack_require__(6);

	var _TextInputUtils = __webpack_require__(7);

	/**
	 * Binds a <input> element or a <textarea> element to a RealTimeString.
	 *
	 * @param textInput {HTMLInputElement | HTMLTextAreaElement}
	 *   The text input element to bind to the model.
	 * @param stringElement {RealTimeString}
	 *   The RealTimeString element to bind to the input element
	 * @returns {{unbind: (function())}}
	 *   An object containing an "unbind()" method that will unbid the input from the model.
	 */
	function bindTextInput(textInput, stringElement) {
	  var element = (0, _ElementUtils.resolveElement)(textInput);

	  element.value = stringElement.value();

	  var processor = new _TextInputProcessor.TextInputProcessor({
	    element: element,
	    event: "input",
	    onInsert: function onInsert(index, value) {
	      return stringElement.insert(index, value);
	    },
	    onRemove: function onRemove(index, length) {
	      return stringElement.remove(index, length);
	    }
	  });

	  var onRemoteInsert = function onRemoteInsert(event) {
	    if (!event.local) {
	      var originalSelection = _TextInputUtils.TextInputUtils.getTextSelection(element);
	      processor.insertText(event.index, event.value);
	      var xFormedSelection = _TextInputUtils.TextInputUtils.transformSelection(originalSelection, event);
	      _TextInputUtils.TextInputUtils.setTextSelection(xFormedSelection, element);
	    }
	  };

	  stringElement.on(_convergence.RealTimeString.Events.INSERT, onRemoteInsert);

	  var onRemoteRemove = function onRemoteRemove(event) {
	    if (!event.local) {
	      var originalSelection = _TextInputUtils.TextInputUtils.getTextSelection(element);
	      processor.removeText(event.index, event.value.length);
	      var xFormedSelection = _TextInputUtils.TextInputUtils.transformSelection(originalSelection, event);
	      _TextInputUtils.TextInputUtils.setTextSelection(xFormedSelection, element);
	    }
	  };

	  stringElement.on(_convergence.RealTimeString.Events.REMOVE, onRemoteRemove);

	  var onRemoteValue = function onRemoteValue(event) {
	    if (!event.local) processor.setValue(event.value);
	  };

	  stringElement.on(_convergence.RealTimeString.Events.VALUE, onRemoteValue);

	  var unbind = function unbind() {
	    processor.unbind();
	    stringElement.off(_convergence.RealTimeString.Events.INSERT, onRemoteInsert);
	    stringElement.off(_convergence.RealTimeString.Events.REMOVE, onRemoteRemove);
	    stringElement.off(_convergence.RealTimeString.Events.VALUE, onRemoteValue);
	  };

	  stringElement.on(_convergence.RealTimeString.Events.DETACHED, unbind);

	  return {
	    unbind: unbind
	  };
	}

	/**
	 * Binds an <input type="number"> element to a RealTimeNumber.
	 *
	 * @param numberInput {HTMLInputElement}
	 *   The input element to bind to the model.
	 * @param numberElement {RealTimeNumber}
	 *   The RealTimeNumber to bind to the input element.
	 * @returns {{unbind: (function())}}
	 *   An object containing an "unbind()" method that will unbid the input from the model.
	 */
	function bindNumberInput(numberInput, numberElement) {
	  var element = (0, _ElementUtils.resolveElement)(numberInput);

	  element.value = numberElement.value();
	  var onChange = function onChange(event) {
	    return numberElement.value(Number(numberInput.value));
	  };
	  element.addEventListener("input", onChange, false);

	  var onRemoteValue = function onRemoteValue(event) {
	    if (!event.local) numberInput.value = event.element.value();
	  };
	  numberElement.on(_convergence.RealTimeNumber.Events.VALUE, onRemoteValue);

	  var onRemoteDelta = function onRemoteDelta(event) {
	    if (!event.local) numberInput.value = Number(numberInput.value) + event.value;
	  };
	  numberElement.on(_convergence.RealTimeNumber.Events.DELTA, onRemoteDelta);

	  var unbind = function unbind() {
	    element.removeEventListener("input", onChange);
	    numberElement.off(_convergence.RealTimeNumber.Events.VALUE, onRemoteValue);
	    numberElement.off(_convergence.RealTimeNumber.Events.DELTA, onRemoteDelta);
	  };

	  numberElement.on(_convergence.RealTimeNumber.Events.DETACHED, unbind);

	  return {
	    unbind: unbind
	  };
	}

	/**
	 * Binds an <input type="checkbox"> element to a RealTimeBoolean.
	 *
	 * @param checkboxInput {HTMLInputElement}
	 *   The input element to bind to the model.
	 * @param booleanElement {RealTimeBoolean}
	 *   The RealTimeBoolean to bind to the input element.
	 * @returns {{unbind: (function())}}
	 *   An object containing an "unbind()" method that will unbid the input from the model.
	 */
	function bindCheckboxInput(checkboxInput, booleanElement) {
	  var element = (0, _ElementUtils.resolveElement)(checkboxInput);

	  element.checked = booleanElement.value();
	  var onChange = function onChange(event) {
	    return booleanElement.value(element.checked);
	  };
	  checkboxInput.addEventListener("change", onChange, false);

	  var onRemoteValue = function onRemoteValue(event) {
	    if (!event.local) checkboxInput.checked = event.element.value();
	  };
	  booleanElement.on(_convergence.RealTimeBoolean.Events.VALUE, onRemoteValue);

	  var unbind = function unbind() {
	    checkboxInput.removeEventListener("change", onChange);
	    booleanElement.off(_convergence.RealTimeBoolean.Events.VALUE, onRemoteValue);
	  };

	  booleanElement.on(_convergence.RealTimeNumber.Events.DETACHED, unbind);

	  return {
	    unbind: unbind
	  };
	}

	/**
	 * Binds an <input type="range"> element to a RealTimeNumber.
	 *
	 * @param rangeInput {HTMLInputElement}
	 *   The input element to bind to the model.
	 * @param numberElement {RealTimeNumber}
	 *   The RealTimeNumber to bind to the input element.
	 * @returns {{unbind: (function())}}
	 *   An object containing an "unbind()" method that will unbid the input from the model.
	 */
	function bindRangeInput(rangeInput, numberElement) {
	  return bindNumberInput(rangeInput, numberElement);
	}

	/**
	 * Binds an <input type="color"> element to a RealTimeString.
	 *
	 * @param colorInput {HTMLInputElement}
	 *   The input element to bind to the model.
	 * @param stringElement {RealTimeString}
	 *   The RealTimeString to bind to the input element.
	 * @returns {{unbind: (function())}}
	 *   An object containing an "unbind()" method that will unbid the input from the model.
	 */
	function bindColorInput(colorInput, stringElement) {
	  var element = (0, _ElementUtils.resolveElement)(colorInput);

	  element.value = stringElement.value();

	  var onChange = function onChange(event) {
	    return stringElement.value(colorInput.value);
	  };
	  element.addEventListener("input", onChange, false);

	  var onRemoteValue = function onRemoteValue(event) {
	    if (!event.local) colorInput.value = event.element.value();
	  };
	  stringElement.on(_convergence.RealTimeNumber.Events.VALUE, onRemoteValue);

	  var unbind = function unbind() {
	    element.removeEventListener("input", onChange);
	    stringElement.off(_convergence.RealTimeNumber.Events.VALUE, onRemoteValue);
	  };

	  stringElement.on(_convergence.RealTimeNumber.Events.DETACHED, unbind);

	  return {
	    unbind: unbind
	  };
	}

	/**
	 * Binds an <select> element to a RealTimeString.
	 *
	 * @param selectInput {HTMLSelectElement}
	 *   The select element to bind to the model.
	 * @param stringElement {RealTimeString}
	 *   The RealTimeString to bind to the input element.
	 * @returns {{unbind: (function())}}
	 *   An object containing an "unbind()" method that will unbid the input from the model.
	 */
	function bindSingleSelect(selectInput, stringElement) {
	  var element = (0, _ElementUtils.resolveElement)(selectInput);

	  element.value = stringElement.value();

	  var onChange = function onChange(event) {
	    return stringElement.value(selectInput.value);
	  };
	  element.addEventListener("input", onChange, false);

	  var onRemoteValue = function onRemoteValue(event) {
	    if (!event.local) selectInput.value = event.element.value();
	  };
	  stringElement.on(_convergence.RealTimeNumber.Events.VALUE, onRemoteValue);

	  var unbind = function unbind() {
	    element.removeEventListener("input", onChange);
	    stringElement.off(_convergence.RealTimeNumber.Events.VALUE, onRemoteValue);
	  };

	  stringElement.on(_convergence.RealTimeNumber.Events.DETACHED, unbind);

	  return {
	    unbind: unbind
	  };
	}

	/**
	 * Binds an <select multiple> element to a RealTimeArray.
	 *
	 * @param selectInput {HTMLSelectElement}
	 *   The select element to bind to the model.
	 * @param arrayElement {RealTimeArray}
	 *   The RealTimeString to bind to the input element.
	 * @returns {{unbind: (function())}}
	 *   An object containing an "unbind()" method that will unbid the input from the model.
	 */
	function bindMultiSelect(selectInput, arrayElement) {
	  var element = (0, _ElementUtils.resolveElement)(selectInput);

	  var selectItems = function selectItems() {
	    var selected = arrayElement.value();
	    for (var i = 0; i < selectInput.options.length; i++) {
	      var option = selectInput.options[i];
	      option.selected = selected.indexOf(option.value) >= 0;
	    }
	  };

	  selectItems();

	  var onChange = function onChange(event) {
	    var selected = [];
	    for (var i = 0; i < selectInput.options.length; i++) {
	      var option = selectInput.options[i];
	      if (option.selected) {
	        selected.push(option.value);
	      }
	    }
	    arrayElement.value(selected);
	  };
	  element.addEventListener("input", onChange, false);

	  var onRemoteValue = function onRemoteValue(event) {
	    if (!event.local) selectItems();
	  };
	  arrayElement.on(_convergence.RealTimeNumber.Events.VALUE, onRemoteValue);

	  var unbind = function unbind() {
	    element.removeEventListener("input", onChange);
	    arrayElement.off(_convergence.RealTimeNumber.Events.VALUE, onRemoteValue);
	  };

	  arrayElement.on(_convergence.RealTimeNumber.Events.DETACHED, unbind);

	  return {
	    unbind: unbind
	  };
	}

	/**
	 * Binds a set of <input type="radio"> elements to a RealTimeString.
	 *
	 * @param radioInputs {HTMLInputElement[]}
	 *   The input elements to bind to the model.
	 * @param stringElement {RealTimeString}
	 *   The RealTimeString to bind to the input elements.
	 * @returns {{unbind: (function())}}
	 *   An object containing an "unbind()" method that will unbid the input from the model.
	 */
	function bindRadioInputs(radioInputs, stringElement) {
	  var elements = radioInputs.map(function (input) {
	    return (0, _ElementUtils.resolveElement)(input);
	  });

	  var selectItems = function selectItems() {
	    var selected = stringElement.value();
	    radioInputs.forEach(function (input) {
	      return input.checked = input.value === selected;
	    });
	  };

	  selectItems();

	  var onChange = function onChange(event) {
	    var set = false;
	    radioInputs.forEach(function (input) {
	      if (input.checked) {
	        stringElement.value(input.value);
	        set = true;
	      }
	    });
	    if (!set) {
	      stringElement.value("");
	    }
	  };

	  elements.forEach(function (element) {
	    return element.addEventListener("change", onChange, false);
	  });

	  var onRemoteValue = function onRemoteValue(event) {
	    if (!event.local) selectItems();
	  };
	  stringElement.on(_convergence.RealTimeNumber.Events.VALUE, onRemoteValue);

	  var unbind = function unbind() {
	    elements.forEach(function (element) {
	      return element.removeEventListener("change", onChange, false);
	    });
	    stringElement.off(_convergence.RealTimeNumber.Events.VALUE, onRemoteValue);
	  };

	  stringElement.on(_convergence.RealTimeNumber.Events.DETACHED, unbind);

	  return {
	    unbind: unbind
	  };
	}

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_6__;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.TextInputUtils = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _convergence = __webpack_require__(6);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var TextInputUtils = exports.TextInputUtils = function () {
	  function TextInputUtils() {
	    _classCallCheck(this, TextInputUtils);
	  }

	  _createClass(TextInputUtils, null, [{
	    key: 'getTextSelection',
	    value: function getTextSelection(element) {
	      if (document.selection) {
	        // IE < 9 Support
	        var range = document.selection.createRange();
	        var rangeLen = range.text.length;
	        range.moveStart('character', -element.value.length);
	        var start = range.text.length - rangeLen;
	        return { 'start': start, 'end': start + rangeLen };
	      }

	      if (element.selectionStart || Number(element.selectionStart) === 0) {
	        // IE >=9 and other browsers
	        return { 'start': element.selectionStart, 'end': element.selectionEnd };
	      }

	      return { 'start': 0, 'end': 0 };
	    }
	  }, {
	    key: 'setTextSelection',
	    value: function setTextSelection(selection, element) {
	      var start = selection.start;
	      var end = selection.end;

	      if (element.setSelectionRange) {
	        // IE >= 9 and other browsers
	        element.focus();
	        element.setSelectionRange(start, end);
	      } else if (element.createTextRange) {
	        // IE < 9
	        var range = element.createTextRange();
	        range.collapse(true);
	        range.moveEnd('character', end);
	        range.moveStart('character', start);
	        range.select();
	      }
	    }
	  }, {
	    key: 'transformSelection',
	    value: function transformSelection(selection, event) {
	      return {
	        start: TextInputUtils.transformIndex(selection.start, event),
	        end: TextInputUtils.transformIndex(selection.end, event)
	      };
	    }
	  }, {
	    key: 'transformIndex',
	    value: function transformIndex(index, event) {
	      if (event instanceof _convergence.StringInsertEvent) {
	        if (event.index <= index) {
	          return index + event.value.length;
	        }
	        return index;
	      } else if (event instanceof _convergence.StringRemoveEvent) {
	        var removeIndex = event.index;
	        var length = event.value.length;
	        if (index > removeIndex) {
	          return index - Math.min(index - removeIndex, length);
	        }
	        return index;
	      }
	      throw new Error("Invalid operation type");
	    }
	  }]);

	  return TextInputUtils;
	}();

/***/ }
/******/ ])
});
;