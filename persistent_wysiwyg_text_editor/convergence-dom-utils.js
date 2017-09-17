/**!
© 2017 Convergence Labs, Inc.
@version 0.2.2
@license MIT
*/
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("Convergence"));
	else if(typeof define === 'function' && define.amd)
		define(["Convergence"], factory);
	else if(typeof exports === 'object')
		exports["ConvergenceDomUtils"] = factory(require("Convergence"));
	else
		root["ConvergenceDomUtils"] = factory(root["Convergence"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var DomConverter = (function () {
    function DomConverter() {
    }
    DomConverter.htmlToJson = function (html) {
        var element = document.createElement("div");
        element.innerHTML = html;
        return DomConverter.nodeToJson(element);
    };
    DomConverter.nodeToJson = function (node) {
        switch (node.nodeType) {
            case 1:
                return DomConverter._elementToJson(node);
            case 3:
                return DomConverter._textNodeToJson(node);
        }
    };
    DomConverter.jsonToNode = function (json) {
        switch (json.nodeType) {
            case 1:
                return DomConverter._jsonToElement(json);
            case 3:
                return DomConverter._jsonToTextNode(json);
        }
    };
    DomConverter._elementToJson = function (element) {
        var json = {
            nodeType: element.nodeType,
            tagName: element.tagName,
            attributes: {},
            childNodes: []
        };
        for (var i = 0; i < element.attributes.length; i++) {
            var attr = element.attributes.item(i);
            json.attributes[attr.name] = attr.value;
        }
        var children = element.childNodes;
        for (var i = 0; i < children.length; i++) {
            var child = children.item(i);
            json.childNodes.push(DomConverter.nodeToJson(child));
        }
        return json;
    };
    DomConverter._textNodeToJson = function (node) {
        return {
            nodeType: node.nodeType,
            nodeValue: node.nodeValue
        };
    };
    DomConverter._jsonToElement = function (json) {
        var element = document.createElement(json.tagName);
        Object.keys(json.attributes).forEach(function (attr) {
            element.setAttribute(attr, json.attributes[attr]);
        });
        json.childNodes.forEach(function (child) {
            element.appendChild(DomConverter.jsonToNode(child));
        });
        return element;
    };
    DomConverter._jsonToTextNode = function (json) {
        return document.createTextNode(json.nodeValue);
    };
    return DomConverter;
}());
exports.DomConverter = DomConverter;


/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var convergence_1 = __webpack_require__(1);
var DomConverter_1 = __webpack_require__(0);
var StringChangeDetector = __webpack_require__(3);
var MutationSummary = __webpack_require__(5);
var SelectionUtils_1 = __webpack_require__(4);
var CHILD_NODES = "childNodes";
var NODE_VALUE = "nodeValue";
var ATTRIBUTES = "attributes";
var NODE_TYPE = "nodeType";
/**
 * Binds a convergence RealTimeObject to a DOM Node. The content of the element
 * will be replaced by the DOM represented by the RealTimeObject.
 */
var DomBinder = (function () {
    function DomBinder(element, object, autoBind) {
        if (autoBind === void 0) { autoBind = true; }
        this._bind = function (domNode, realTimeElement) {
            domNode.__convergence_model = realTimeElement;
            switch (domNode.nodeType) {
                case 1:
                    this._bindElement(domNode, realTimeElement);
                    break;
                case 3:
                    this._bindTextNode(domNode, realTimeElement);
                    break;
            }
        };
        if (!element) {
            throw new Error("The 'element' parameter must be an instance of HTMLElement.");
        }
        if (object instanceof convergence_1.RealTimeModel) {
            object = object.root();
        }
        else if (!(object instanceof convergence_1.RealTimeObject)) {
            // we don't need to check this if we just got the object from a model.
            throw new Error("The 'object' parameter must be an instance of RealTimeObject.");
        }
        else if (object.isDetached()) {
            // we don't need to check this either if we just got the object from a model.
            throw new Error("Can not bind to a detached RealTimeObject.");
        }
        if (!object.hasKey(CHILD_NODES)) {
            throw new Error("The root RealTimeObject is missing the " + CHILD_NODES + " property.");
        }
        this._object = object;
        this._element = element;
        if (autoBind) {
            this.bind();
        }
    }
    DomBinder.prototype.bind = function () {
        var _this = this;
        if (this._bound) {
            throw new Error("Can not call bind() when the DomBinder is already bound.");
        }
        // Clear the node
        while (this._element.firstChild) {
            this._element.removeChild(this._element.firstChild);
        }
        var value = this._object.elementAt(CHILD_NODES).value();
        value.forEach(function (child) {
            _this._element.appendChild(DomConverter_1.DomConverter.jsonToNode(child));
        });
        this._bind(this._element, this._object);
        this._observer = new MutationSummary({
            rootNode: this._element,
            callback: this._handleChange.bind(this),
            queries: [{ all: true }]
        });
        this._bound = true;
    };
    DomBinder.prototype.isBound = function () {
        return this._bound;
    };
    DomBinder.prototype.unbind = function () {
        if (!this._bound) {
            throw new Error("Can not call unbind() when the DomBinder is not bound.");
        }
        this._observer.disconnect();
        this._unbind(this._object);
        this._bound = false;
    };
    DomBinder.prototype._handleChange = function (changes) {
        var _this = this;
        changes.forEach(function (summary) {
            _this._object.model().startBatch();
            summary.characterDataChanged.forEach(function (textNode) {
                textNode.__scd.processNewValue(textNode.nodeValue);
            });
            var removeNodes = summary.removed.slice(0);
            summary.reparented.forEach(function (node) { return removeNodes.push(node); }); // fixme when we handle move.
            // fixme sort by depth
            removeNodes.forEach(function (removed) {
                var rte = removed.__convergence_model;
                if (!rte.isDetached()) {
                    var path = rte.path();
                    var index = path[path.length - 1];
                    // TODO simplify this when we add the pacd ..rent() method.
                    var parentPath = rte.path();
                    parentPath.pop();
                    var parent_1 = rte.model().elementAt(parentPath);
                    parent_1.remove(index);
                }
            });
            var insertedByExistingParent = {};
            var addedNodes = summary.added.slice();
            summary.reparented.forEach(function (node) { return addedNodes.push(node); });
            // fixme sort by depth
            addedNodes.forEach(function (added) {
                var parentNode = added.parentNode;
                var parentModel = parentNode.__convergence_model;
                // TODO I am not sure why we need to check for detached.
                if (parentModel && !parentModel.isDetached()) {
                    var id = parentModel.id();
                    if (!insertedByExistingParent[id]) {
                        insertedByExistingParent[id] = [];
                    }
                    insertedByExistingParent[id].push({
                        node: added,
                        index: DomBinder._findIndexInParent(added),
                        parentModel: parentModel
                    });
                }
            });
            Object.keys(insertedByExistingParent).forEach(function (id) {
                var added = insertedByExistingParent[id];
                added.sort(function (x1, x2) { return x1.index - x2.index; });
                added.forEach(function (add) {
                    var childNodes = add.parentModel.get(CHILD_NODES);
                    var newJson = DomConverter_1.DomConverter.nodeToJson(add.node);
                    var rte = childNodes.insert(add.index, newJson);
                    _this._bind(add.node, rte);
                });
            });
        });
        if (this._object.model().batchSize() > 0) {
            this._object.model().completeBatch();
        }
        else {
            this._object.model().cancelBatch();
        }
    };
    DomBinder.prototype._bindElement = function (element, realTimeElement) {
        var _this = this;
        var attributes = realTimeElement.get(ATTRIBUTES);
        var childNodes = realTimeElement.get(CHILD_NODES);
        childNodes.on(convergence_1.RealTimeArray.Events.INSERT, function (e) {
            var beforeNode = element.childNodes.item(e.index);
            var newChild = DomConverter_1.DomConverter.jsonToNode(e.value.value());
            var originalSelection = SelectionUtils_1.SelectionUtils.getSelection(_this._element);
            _this._observer.disconnect();
            element.insertBefore(newChild, beforeNode);
            _this._bind(newChild, e.value);
            _this._observer.reconnect();
            if (originalSelection) {
                var insertedRange = SelectionUtils_1.SelectionUtils.getRelativeNodeRange(newChild, _this._element);
                var transformed = SelectionUtils_1.SelectionUtils.transformSelectionOnInsert(originalSelection, insertedRange);
                SelectionUtils_1.SelectionUtils.setSelection(transformed, _this._element);
            }
        });
        childNodes.on(convergence_1.RealTimeArray.Events.REMOVE, function (e) {
            var originalSelection = SelectionUtils_1.SelectionUtils.getSelection(_this._element);
            var removed = element.childNodes.item(e.index);
            var removedRange = SelectionUtils_1.SelectionUtils.getRelativeNodeRange(removed, _this._element);
            _this._observer.disconnect();
            element.removeChild(removed);
            _this._observer.reconnect();
            if (originalSelection) {
                var transformed = SelectionUtils_1.SelectionUtils.transformSelectionOnRemove(originalSelection, removedRange);
                SelectionUtils_1.SelectionUtils.setSelection(transformed, _this._element);
            }
        });
        attributes.on(convergence_1.RealTimeObject.Events.SET, function (e) {
            _this._observer.disconnect();
            element.attributes.element.setAttribute(e.key, e.value.value());
            _this._observer.reconnect();
        });
        attributes.on(convergence_1.RealTimeObject.Events.REMOVE, function (e) {
            _this._observer.disconnect();
            element.attributes.element.removeAttribute(e.key);
            _this._observer.reconnect();
        });
        element.childNodes.forEach(function (childNode, index) {
            var realTimeChild = childNodes.get(index);
            _this._bind(childNode, realTimeChild);
        });
    };
    DomBinder._findIndexInParent = function (child) {
        return Array.prototype.indexOf.call(child.parentNode.childNodes, child);
    };
    DomBinder.prototype._bindTextNode = function (textNode, realTimeElement) {
        var _this = this;
        var nodeValue = realTimeElement.get(NODE_VALUE);
        var scd = new StringChangeDetector({
            value: nodeValue.value(),
            onInsert: function (index, value) {
                nodeValue.insert(index, value);
            },
            onRemove: function (index, length) {
                nodeValue.remove(index, length);
            }
        });
        textNode.__scd = scd;
        var onRemoteInsert = function (event) {
            if (!event.local) {
                var originalSelection = SelectionUtils_1.SelectionUtils.getSelection(_this._element);
                scd.insertText(event.index, event.value);
                _this._observer.disconnect();
                textNode.nodeValue = scd.getValue();
                _this._observer.reconnect();
                if (originalSelection) {
                    var nodeRange = SelectionUtils_1.SelectionUtils.getRelativeNodeRange(textNode, _this._element);
                    var offset = nodeRange.start;
                    var insertedRange = { start: offset + event.index, end: offset + event.index + event.value.length };
                    var transformed = SelectionUtils_1.SelectionUtils.transformSelectionOnInsert(originalSelection, insertedRange);
                    SelectionUtils_1.SelectionUtils.setSelection(transformed, _this._element);
                }
            }
        };
        nodeValue.on(convergence_1.RealTimeString.Events.INSERT, onRemoteInsert);
        var onRemoteRemove = function (event) {
            if (!event.local) {
                var originalSelection = SelectionUtils_1.SelectionUtils.getSelection(_this._element);
                scd.removeText(event.index, event.value.length);
                _this._observer.disconnect();
                textNode.nodeValue = scd.getValue();
                _this._observer.reconnect();
                if (originalSelection) {
                    var nodeRange = SelectionUtils_1.SelectionUtils.getRelativeNodeRange(textNode, _this._element);
                    var offset = nodeRange.start;
                    var removedRange = { start: offset + event.index, end: offset + event.index + event.value.length };
                    var transformed = SelectionUtils_1.SelectionUtils.transformSelectionOnRemove(originalSelection, removedRange);
                    SelectionUtils_1.SelectionUtils.setSelection(transformed, _this._element);
                }
            }
        };
        nodeValue.on(convergence_1.RealTimeString.Events.REMOVE, onRemoteRemove);
    };
    DomBinder.prototype._unbind = function (realTimeElement) {
        var nodeType = realTimeElement.get(NODE_TYPE).value();
        switch (nodeType) {
            case 1:
                this._unbindElement(realTimeElement);
                break;
            case 3:
                this._unbindTextNode(realTimeElement);
                break;
        }
    };
    ;
    DomBinder.prototype._unbindTextNode = function (realTimeElement) {
        var nodeValue = realTimeElement.get(NODE_VALUE);
        // TODO later we should probably only remove listeners we add. We could put the listener
        // in some sort of map, by id later on.
        nodeValue.removeAllListenersForAllEvents();
    };
    DomBinder.prototype._unbindElement = function (realTimeElement) {
        var _this = this;
        // TODO later we should probably only remove listeners we add. We could put the listener
        // in some sort of map, by id later on.
        var attributes = realTimeElement.get(ATTRIBUTES);
        var childNodes = realTimeElement.get(CHILD_NODES);
        childNodes.removeAllListenersForAllEvents();
        attributes.removeAllListenersForAllEvents();
        childNodes.forEach(function (childNode, index) {
            _this._unbind(childNode);
        });
    };
    return DomBinder;
}());
exports.DomBinder = DomBinder;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

/**!
© 2017 Convergence Labs, Inc.
@version 0.1.7
@license MIT
*/
(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("StringChangeDetector", [], factory);
	else if(typeof exports === 'object')
		exports["StringChangeDetector"] = factory();
	else
		root["StringChangeDetector"] = factory();
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

	module.exports = __webpack_require__(1).StringChangeDetector;

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var StringChangeDetector = exports.StringChangeDetector = function () {
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

/***/ }
/******/ ])
});
;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var convergence_1 = __webpack_require__(1);
var SelectionUtils = (function () {
    function SelectionUtils() {
    }
    SelectionUtils.getRelativeNodeRange = function (node, container) {
        var preSelectionRange = document.createRange();
        preSelectionRange.selectNodeContents(container);
        preSelectionRange.setEnd(node, 0);
        var start = preSelectionRange.toString().length;
        var range = document.createRange();
        range.selectNode(node);
        return {
            start: start,
            end: start + range.toString().length
        };
    };
    SelectionUtils.getSelection = function (containerEl) {
        var selection = window.getSelection();
        if (selection.rangeCount > 0) {
            var range = window.getSelection().getRangeAt(0);
            var preSelectionRange = range.cloneRange();
            preSelectionRange.selectNodeContents(containerEl);
            preSelectionRange.setEnd(range.startContainer, range.startOffset);
            var start = preSelectionRange.toString().length;
            return {
                start: start,
                end: start + range.toString().length
            };
        }
        else {
            return;
        }
    };
    SelectionUtils.setSelection = function (savedSel, containerEl) {
        var charIndex = 0;
        var range = document.createRange();
        range.setStart(containerEl, 0);
        range.collapse(true);
        var nodeStack = [containerEl];
        var node;
        var foundStart = false;
        var stop = false;
        while (!stop && (node = nodeStack.pop())) {
            if (node.nodeType == 3) {
                var nextCharIndex = charIndex + node.length;
                if (!foundStart && savedSel.start >= charIndex && savedSel.start <= nextCharIndex) {
                    range.setStart(node, savedSel.start - charIndex);
                    foundStart = true;
                }
                if (foundStart && savedSel.end >= charIndex && savedSel.end <= nextCharIndex) {
                    range.setEnd(node, savedSel.end - charIndex);
                    stop = true;
                }
                charIndex = nextCharIndex;
            }
            else {
                var i = node.childNodes.length;
                while (i--) {
                    nodeStack.push(node.childNodes[i]);
                }
            }
        }
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    };
    SelectionUtils.transformSelection = function (selection, event) {
        return {
            start: SelectionUtils.transformIndex(selection.start, event),
            end: SelectionUtils.transformIndex(selection.end, event)
        };
    };
    SelectionUtils.transformSelectionOnInsert = function (selection, insertedRange) {
        return {
            start: SelectionUtils.transformIndexOnInsert(selection.start, insertedRange),
            end: SelectionUtils.transformIndexOnInsert(selection.end, insertedRange)
        };
    };
    SelectionUtils.transformIndexOnInsert = function (index, insertedRange) {
        if (insertedRange.start <= index) {
            return index + (insertedRange.end - insertedRange.start);
        }
        return index;
    };
    SelectionUtils.transformSelectionOnRemove = function (selection, removedRange) {
        return {
            start: SelectionUtils.transformIndexOnRemove(selection.start, removedRange),
            end: SelectionUtils.transformIndexOnRemove(selection.end, removedRange)
        };
    };
    SelectionUtils.transformIndexOnRemove = function (index, removedRange) {
        var removeIndex = removedRange.start;
        var length = removedRange.end - removedRange.start;
        if (index > removeIndex) {
            return index - Math.min(index - removeIndex, length);
        }
        return index;
    };
    SelectionUtils.transformIndex = function (index, event) {
        if (event instanceof convergence_1.StringInsertEvent) {
            if (event.index <= index) {
                return index + event.value.length;
            }
            return index;
        }
        else if (event instanceof convergence_1.StringRemoveEvent) {
            var removeIndex = event.index;
            var length_1 = event.value.length;
            if (index > removeIndex) {
                return index - Math.min(index - removeIndex, length_1);
            }
            return index;
        }
        throw new Error("Invalid operation type");
    };
    return SelectionUtils;
}());
exports.SelectionUtils = SelectionUtils;


/***/ }),
/* 5 */
/***/ (function(module, exports) {

// Copyright 2011 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var MutationObserverCtor;
if (typeof WebKitMutationObserver !== 'undefined')
    MutationObserverCtor = WebKitMutationObserver;
else
    MutationObserverCtor = MutationObserver;
if (MutationObserverCtor === undefined) {
    console.error('DOM Mutation Observers are required.');
    console.error('https://developer.mozilla.org/en-US/docs/DOM/MutationObserver');
    throw Error('DOM Mutation Observers are required');
}
var NodeMap = (function () {
    function NodeMap() {
        this.nodes = [];
        this.values = [];
    }
    NodeMap.prototype.isIndex = function (s) {
        return +s === s >>> 0;
    };
    NodeMap.prototype.nodeId = function (node) {
        var id = node[NodeMap.ID_PROP];
        if (!id)
            id = node[NodeMap.ID_PROP] = NodeMap.nextId_++;
        return id;
    };
    NodeMap.prototype.set = function (node, value) {
        var id = this.nodeId(node);
        this.nodes[id] = node;
        this.values[id] = value;
    };
    NodeMap.prototype.get = function (node) {
        var id = this.nodeId(node);
        return this.values[id];
    };
    NodeMap.prototype.has = function (node) {
        return this.nodeId(node) in this.nodes;
    };
    NodeMap.prototype.delete = function (node) {
        var id = this.nodeId(node);
        delete this.nodes[id];
        this.values[id] = undefined;
    };
    NodeMap.prototype.keys = function () {
        var nodes = [];
        for (var id in this.nodes) {
            if (!this.isIndex(id))
                continue;
            nodes.push(this.nodes[id]);
        }
        return nodes;
    };
    NodeMap.ID_PROP = '__mutation_summary_node_map_id__';
    NodeMap.nextId_ = 1;
    return NodeMap;
})();
/**
 *  var reachableMatchableProduct = [
 *  //  STAYED_OUT,  ENTERED,     STAYED_IN,   EXITED
 *    [ STAYED_OUT,  STAYED_OUT,  STAYED_OUT,  STAYED_OUT ], // STAYED_OUT
 *    [ STAYED_OUT,  ENTERED,     ENTERED,     STAYED_OUT ], // ENTERED
 *    [ STAYED_OUT,  ENTERED,     STAYED_IN,   EXITED     ], // STAYED_IN
 *    [ STAYED_OUT,  STAYED_OUT,  EXITED,      EXITED     ]  // EXITED
 *  ];
 */
var Movement;
(function (Movement) {
    Movement[Movement["STAYED_OUT"] = 0] = "STAYED_OUT";
    Movement[Movement["ENTERED"] = 1] = "ENTERED";
    Movement[Movement["STAYED_IN"] = 2] = "STAYED_IN";
    Movement[Movement["REPARENTED"] = 3] = "REPARENTED";
    Movement[Movement["REORDERED"] = 4] = "REORDERED";
    Movement[Movement["EXITED"] = 5] = "EXITED";
})(Movement || (Movement = {}));
function enteredOrExited(changeType) {
    return changeType === Movement.ENTERED || changeType === Movement.EXITED;
}
var NodeChange = (function () {
    function NodeChange(node, childList, attributes, characterData, oldParentNode, added, attributeOldValues, characterDataOldValue) {
        if (childList === void 0) { childList = false; }
        if (attributes === void 0) { attributes = false; }
        if (characterData === void 0) { characterData = false; }
        if (oldParentNode === void 0) { oldParentNode = null; }
        if (added === void 0) { added = false; }
        if (attributeOldValues === void 0) { attributeOldValues = null; }
        if (characterDataOldValue === void 0) { characterDataOldValue = null; }
        this.node = node;
        this.childList = childList;
        this.attributes = attributes;
        this.characterData = characterData;
        this.oldParentNode = oldParentNode;
        this.added = added;
        this.attributeOldValues = attributeOldValues;
        this.characterDataOldValue = characterDataOldValue;
        this.isCaseInsensitive =
            this.node.nodeType === Node.ELEMENT_NODE &&
                this.node instanceof HTMLElement &&
                this.node.ownerDocument instanceof HTMLDocument;
    }
    NodeChange.prototype.getAttributeOldValue = function (name) {
        if (!this.attributeOldValues)
            return undefined;
        if (this.isCaseInsensitive)
            name = name.toLowerCase();
        return this.attributeOldValues[name];
    };
    NodeChange.prototype.getAttributeNamesMutated = function () {
        var names = [];
        if (!this.attributeOldValues)
            return names;
        for (var name in this.attributeOldValues) {
            names.push(name);
        }
        return names;
    };
    NodeChange.prototype.attributeMutated = function (name, oldValue) {
        this.attributes = true;
        this.attributeOldValues = this.attributeOldValues || {};
        if (name in this.attributeOldValues)
            return;
        this.attributeOldValues[name] = oldValue;
    };
    NodeChange.prototype.characterDataMutated = function (oldValue) {
        if (this.characterData)
            return;
        this.characterData = true;
        this.characterDataOldValue = oldValue;
    };
    // Note: is it possible to receive a removal followed by a removal. This
    // can occur if the removed node is added to an non-observed node, that
    // node is added to the observed area, and then the node removed from
    // it.
    NodeChange.prototype.removedFromParent = function (parent) {
        this.childList = true;
        if (this.added || this.oldParentNode)
            this.added = false;
        else
            this.oldParentNode = parent;
    };
    NodeChange.prototype.insertedIntoParent = function () {
        this.childList = true;
        this.added = true;
    };
    // An node's oldParent is
    //   -its present parent, if its parentNode was not changed.
    //   -null if the first thing that happened to it was an add.
    //   -the node it was removed from if the first thing that happened to it
    //      was a remove.
    NodeChange.prototype.getOldParent = function () {
        if (this.childList) {
            if (this.oldParentNode)
                return this.oldParentNode;
            if (this.added)
                return null;
        }
        return this.node.parentNode;
    };
    return NodeChange;
})();
var ChildListChange = (function () {
    function ChildListChange() {
        this.added = new NodeMap();
        this.removed = new NodeMap();
        this.maybeMoved = new NodeMap();
        this.oldPrevious = new NodeMap();
        this.moved = undefined;
    }
    return ChildListChange;
})();
var TreeChanges = (function (_super) {
    __extends(TreeChanges, _super);
    function TreeChanges(rootNode, mutations) {
        _super.call(this);
        this.rootNode = rootNode;
        this.reachableCache = undefined;
        this.wasReachableCache = undefined;
        this.anyParentsChanged = false;
        this.anyAttributesChanged = false;
        this.anyCharacterDataChanged = false;
        for (var m = 0; m < mutations.length; m++) {
            var mutation = mutations[m];
            switch (mutation.type) {
                case 'childList':
                    this.anyParentsChanged = true;
                    for (var i = 0; i < mutation.removedNodes.length; i++) {
                        var node = mutation.removedNodes[i];
                        this.getChange(node).removedFromParent(mutation.target);
                    }
                    for (var i = 0; i < mutation.addedNodes.length; i++) {
                        var node = mutation.addedNodes[i];
                        this.getChange(node).insertedIntoParent();
                    }
                    break;
                case 'attributes':
                    this.anyAttributesChanged = true;
                    var change = this.getChange(mutation.target);
                    change.attributeMutated(mutation.attributeName, mutation.oldValue);
                    break;
                case 'characterData':
                    this.anyCharacterDataChanged = true;
                    var change = this.getChange(mutation.target);
                    change.characterDataMutated(mutation.oldValue);
                    break;
            }
        }
    }
    TreeChanges.prototype.getChange = function (node) {
        var change = this.get(node);
        if (!change) {
            change = new NodeChange(node);
            this.set(node, change);
        }
        return change;
    };
    TreeChanges.prototype.getOldParent = function (node) {
        var change = this.get(node);
        return change ? change.getOldParent() : node.parentNode;
    };
    TreeChanges.prototype.getIsReachable = function (node) {
        if (node === this.rootNode)
            return true;
        if (!node)
            return false;
        this.reachableCache = this.reachableCache || new NodeMap();
        var isReachable = this.reachableCache.get(node);
        if (isReachable === undefined) {
            isReachable = this.getIsReachable(node.parentNode);
            this.reachableCache.set(node, isReachable);
        }
        return isReachable;
    };
    // A node wasReachable if its oldParent wasReachable.
    TreeChanges.prototype.getWasReachable = function (node) {
        if (node === this.rootNode)
            return true;
        if (!node)
            return false;
        this.wasReachableCache = this.wasReachableCache || new NodeMap();
        var wasReachable = this.wasReachableCache.get(node);
        if (wasReachable === undefined) {
            wasReachable = this.getWasReachable(this.getOldParent(node));
            this.wasReachableCache.set(node, wasReachable);
        }
        return wasReachable;
    };
    TreeChanges.prototype.reachabilityChange = function (node) {
        if (this.getIsReachable(node)) {
            return this.getWasReachable(node) ?
                Movement.STAYED_IN : Movement.ENTERED;
        }
        return this.getWasReachable(node) ?
            Movement.EXITED : Movement.STAYED_OUT;
    };
    return TreeChanges;
})(NodeMap);
var MutationProjection = (function () {
    // TOOD(any)
    function MutationProjection(rootNode, mutations, selectors, calcReordered, calcOldPreviousSibling) {
        this.rootNode = rootNode;
        this.mutations = mutations;
        this.selectors = selectors;
        this.calcReordered = calcReordered;
        this.calcOldPreviousSibling = calcOldPreviousSibling;
        this.treeChanges = new TreeChanges(rootNode, mutations);
        this.entered = [];
        this.exited = [];
        this.stayedIn = new NodeMap();
        this.visited = new NodeMap();
        this.childListChangeMap = undefined;
        this.characterDataOnly = undefined;
        this.matchCache = undefined;
        this.processMutations();
    }
    MutationProjection.prototype.processMutations = function () {
        if (!this.treeChanges.anyParentsChanged &&
            !this.treeChanges.anyAttributesChanged)
            return;
        var changedNodes = this.treeChanges.keys();
        for (var i = 0; i < changedNodes.length; i++) {
            this.visitNode(changedNodes[i], undefined);
        }
    };
    MutationProjection.prototype.visitNode = function (node, parentReachable) {
        if (this.visited.has(node))
            return;
        this.visited.set(node, true);
        var change = this.treeChanges.get(node);
        var reachable = parentReachable;
        // node inherits its parent's reachability change unless
        // its parentNode was mutated.
        if ((change && change.childList) || reachable == undefined)
            reachable = this.treeChanges.reachabilityChange(node);
        if (reachable === Movement.STAYED_OUT)
            return;
        // Cache match results for sub-patterns.
        this.matchabilityChange(node);
        if (reachable === Movement.ENTERED) {
            this.entered.push(node);
        }
        else if (reachable === Movement.EXITED) {
            this.exited.push(node);
            this.ensureHasOldPreviousSiblingIfNeeded(node);
        }
        else if (reachable === Movement.STAYED_IN) {
            var movement = Movement.STAYED_IN;
            if (change && change.childList) {
                if (change.oldParentNode !== node.parentNode) {
                    movement = Movement.REPARENTED;
                    this.ensureHasOldPreviousSiblingIfNeeded(node);
                }
                else if (this.calcReordered && this.wasReordered(node)) {
                    movement = Movement.REORDERED;
                }
            }
            this.stayedIn.set(node, movement);
        }
        if (reachable === Movement.STAYED_IN)
            return;
        // reachable === ENTERED || reachable === EXITED.
        for (var child = node.firstChild; child; child = child.nextSibling) {
            this.visitNode(child, reachable);
        }
    };
    MutationProjection.prototype.ensureHasOldPreviousSiblingIfNeeded = function (node) {
        if (!this.calcOldPreviousSibling)
            return;
        this.processChildlistChanges();
        var parentNode = node.parentNode;
        var nodeChange = this.treeChanges.get(node);
        if (nodeChange && nodeChange.oldParentNode)
            parentNode = nodeChange.oldParentNode;
        var change = this.childListChangeMap.get(parentNode);
        if (!change) {
            change = new ChildListChange();
            this.childListChangeMap.set(parentNode, change);
        }
        if (!change.oldPrevious.has(node)) {
            change.oldPrevious.set(node, node.previousSibling);
        }
    };
    MutationProjection.prototype.getChanged = function (summary, selectors, characterDataOnly) {
        this.selectors = selectors;
        this.characterDataOnly = characterDataOnly;
        for (var i = 0; i < this.entered.length; i++) {
            var node = this.entered[i];
            var matchable = this.matchabilityChange(node);
            if (matchable === Movement.ENTERED || matchable === Movement.STAYED_IN)
                summary.added.push(node);
        }
        var stayedInNodes = this.stayedIn.keys();
        for (var i = 0; i < stayedInNodes.length; i++) {
            var node = stayedInNodes[i];
            var matchable = this.matchabilityChange(node);
            if (matchable === Movement.ENTERED) {
                summary.added.push(node);
            }
            else if (matchable === Movement.EXITED) {
                summary.removed.push(node);
            }
            else if (matchable === Movement.STAYED_IN && (summary.reparented || summary.reordered)) {
                var movement = this.stayedIn.get(node);
                if (summary.reparented && movement === Movement.REPARENTED)
                    summary.reparented.push(node);
                else if (summary.reordered && movement === Movement.REORDERED)
                    summary.reordered.push(node);
            }
        }
        for (var i = 0; i < this.exited.length; i++) {
            var node = this.exited[i];
            var matchable = this.matchabilityChange(node);
            if (matchable === Movement.EXITED || matchable === Movement.STAYED_IN)
                summary.removed.push(node);
        }
    };
    MutationProjection.prototype.getOldParentNode = function (node) {
        var change = this.treeChanges.get(node);
        if (change && change.childList)
            return change.oldParentNode ? change.oldParentNode : null;
        var reachabilityChange = this.treeChanges.reachabilityChange(node);
        if (reachabilityChange === Movement.STAYED_OUT || reachabilityChange === Movement.ENTERED)
            throw Error('getOldParentNode requested on invalid node.');
        return node.parentNode;
    };
    MutationProjection.prototype.getOldPreviousSibling = function (node) {
        var parentNode = node.parentNode;
        var nodeChange = this.treeChanges.get(node);
        if (nodeChange && nodeChange.oldParentNode)
            parentNode = nodeChange.oldParentNode;
        var change = this.childListChangeMap.get(parentNode);
        if (!change)
            throw Error('getOldPreviousSibling requested on invalid node.');
        return change.oldPrevious.get(node);
    };
    MutationProjection.prototype.getOldAttribute = function (element, attrName) {
        var change = this.treeChanges.get(element);
        if (!change || !change.attributes)
            throw Error('getOldAttribute requested on invalid node.');
        var value = change.getAttributeOldValue(attrName);
        if (value === undefined)
            throw Error('getOldAttribute requested for unchanged attribute name.');
        return value;
    };
    MutationProjection.prototype.attributeChangedNodes = function (includeAttributes) {
        if (!this.treeChanges.anyAttributesChanged)
            return {}; // No attributes mutations occurred.
        var attributeFilter;
        var caseInsensitiveFilter;
        if (includeAttributes) {
            attributeFilter = {};
            caseInsensitiveFilter = {};
            for (var i = 0; i < includeAttributes.length; i++) {
                var attrName = includeAttributes[i];
                attributeFilter[attrName] = true;
                caseInsensitiveFilter[attrName.toLowerCase()] = attrName;
            }
        }
        var result = {};
        var nodes = this.treeChanges.keys();
        for (var i = 0; i < nodes.length; i++) {
            var node = nodes[i];
            var change = this.treeChanges.get(node);
            if (!change.attributes)
                continue;
            if (Movement.STAYED_IN !== this.treeChanges.reachabilityChange(node) ||
                Movement.STAYED_IN !== this.matchabilityChange(node)) {
                continue;
            }
            var element = node;
            var changedAttrNames = change.getAttributeNamesMutated();
            for (var j = 0; j < changedAttrNames.length; j++) {
                var attrName = changedAttrNames[j];
                if (attributeFilter &&
                    !attributeFilter[attrName] &&
                    !(change.isCaseInsensitive && caseInsensitiveFilter[attrName])) {
                    continue;
                }
                var oldValue = change.getAttributeOldValue(attrName);
                if (oldValue === element.getAttribute(attrName))
                    continue;
                if (caseInsensitiveFilter && change.isCaseInsensitive)
                    attrName = caseInsensitiveFilter[attrName];
                result[attrName] = result[attrName] || [];
                result[attrName].push(element);
            }
        }
        return result;
    };
    MutationProjection.prototype.getOldCharacterData = function (node) {
        var change = this.treeChanges.get(node);
        if (!change || !change.characterData)
            throw Error('getOldCharacterData requested on invalid node.');
        return change.characterDataOldValue;
    };
    MutationProjection.prototype.getCharacterDataChanged = function () {
        if (!this.treeChanges.anyCharacterDataChanged)
            return []; // No characterData mutations occurred.
        var nodes = this.treeChanges.keys();
        var result = [];
        for (var i = 0; i < nodes.length; i++) {
            var target = nodes[i];
            if (Movement.STAYED_IN !== this.treeChanges.reachabilityChange(target))
                continue;
            var change = this.treeChanges.get(target);
            if (!change.characterData ||
                target.textContent == change.characterDataOldValue)
                continue;
            result.push(target);
        }
        return result;
    };
    MutationProjection.prototype.computeMatchabilityChange = function (selector, el) {
        if (!this.matchCache)
            this.matchCache = [];
        if (!this.matchCache[selector.uid])
            this.matchCache[selector.uid] = new NodeMap();
        var cache = this.matchCache[selector.uid];
        var result = cache.get(el);
        if (result === undefined) {
            result = selector.matchabilityChange(el, this.treeChanges.get(el));
            cache.set(el, result);
        }
        return result;
    };
    MutationProjection.prototype.matchabilityChange = function (node) {
        var _this = this;
        // TODO(rafaelw): Include PI, CDATA?
        // Only include text nodes.
        if (this.characterDataOnly) {
            switch (node.nodeType) {
                case Node.COMMENT_NODE:
                case Node.TEXT_NODE:
                    return Movement.STAYED_IN;
                default:
                    return Movement.STAYED_OUT;
            }
        }
        // No element filter. Include all nodes.
        if (!this.selectors)
            return Movement.STAYED_IN;
        // Element filter. Exclude non-elements.
        if (node.nodeType !== Node.ELEMENT_NODE)
            return Movement.STAYED_OUT;
        var el = node;
        var matchChanges = this.selectors.map(function (selector) {
            return _this.computeMatchabilityChange(selector, el);
        });
        var accum = Movement.STAYED_OUT;
        var i = 0;
        while (accum !== Movement.STAYED_IN && i < matchChanges.length) {
            switch (matchChanges[i]) {
                case Movement.STAYED_IN:
                    accum = Movement.STAYED_IN;
                    break;
                case Movement.ENTERED:
                    if (accum === Movement.EXITED)
                        accum = Movement.STAYED_IN;
                    else
                        accum = Movement.ENTERED;
                    break;
                case Movement.EXITED:
                    if (accum === Movement.ENTERED)
                        accum = Movement.STAYED_IN;
                    else
                        accum = Movement.EXITED;
                    break;
            }
            i++;
        }
        return accum;
    };
    MutationProjection.prototype.getChildlistChange = function (el) {
        var change = this.childListChangeMap.get(el);
        if (!change) {
            change = new ChildListChange();
            this.childListChangeMap.set(el, change);
        }
        return change;
    };
    MutationProjection.prototype.processChildlistChanges = function () {
        if (this.childListChangeMap)
            return;
        this.childListChangeMap = new NodeMap();
        for (var i = 0; i < this.mutations.length; i++) {
            var mutation = this.mutations[i];
            if (mutation.type != 'childList')
                continue;
            if (this.treeChanges.reachabilityChange(mutation.target) !== Movement.STAYED_IN &&
                !this.calcOldPreviousSibling)
                continue;
            var change = this.getChildlistChange(mutation.target);
            var oldPrevious = mutation.previousSibling;
            function recordOldPrevious(node, previous) {
                if (!node ||
                    change.oldPrevious.has(node) ||
                    change.added.has(node) ||
                    change.maybeMoved.has(node))
                    return;
                if (previous &&
                    (change.added.has(previous) ||
                        change.maybeMoved.has(previous)))
                    return;
                change.oldPrevious.set(node, previous);
            }
            for (var j = 0; j < mutation.removedNodes.length; j++) {
                var node = mutation.removedNodes[j];
                recordOldPrevious(node, oldPrevious);
                if (change.added.has(node)) {
                    change.added.delete(node);
                }
                else {
                    change.removed.set(node, true);
                    change.maybeMoved.delete(node);
                }
                oldPrevious = node;
            }
            recordOldPrevious(mutation.nextSibling, oldPrevious);
            for (var j = 0; j < mutation.addedNodes.length; j++) {
                var node = mutation.addedNodes[j];
                if (change.removed.has(node)) {
                    change.removed.delete(node);
                    change.maybeMoved.set(node, true);
                }
                else {
                    change.added.set(node, true);
                }
            }
        }
    };
    MutationProjection.prototype.wasReordered = function (node) {
        if (!this.treeChanges.anyParentsChanged)
            return false;
        this.processChildlistChanges();
        var parentNode = node.parentNode;
        var nodeChange = this.treeChanges.get(node);
        if (nodeChange && nodeChange.oldParentNode)
            parentNode = nodeChange.oldParentNode;
        var change = this.childListChangeMap.get(parentNode);
        if (!change)
            return false;
        if (change.moved)
            return change.moved.get(node);
        change.moved = new NodeMap();
        var pendingMoveDecision = new NodeMap();
        function isMoved(node) {
            if (!node)
                return false;
            if (!change.maybeMoved.has(node))
                return false;
            var didMove = change.moved.get(node);
            if (didMove !== undefined)
                return didMove;
            if (pendingMoveDecision.has(node)) {
                didMove = true;
            }
            else {
                pendingMoveDecision.set(node, true);
                didMove = getPrevious(node) !== getOldPrevious(node);
            }
            if (pendingMoveDecision.has(node)) {
                pendingMoveDecision.delete(node);
                change.moved.set(node, didMove);
            }
            else {
                didMove = change.moved.get(node);
            }
            return didMove;
        }
        var oldPreviousCache = new NodeMap();
        function getOldPrevious(node) {
            var oldPrevious = oldPreviousCache.get(node);
            if (oldPrevious !== undefined)
                return oldPrevious;
            oldPrevious = change.oldPrevious.get(node);
            while (oldPrevious &&
                (change.removed.has(oldPrevious) || isMoved(oldPrevious))) {
                oldPrevious = getOldPrevious(oldPrevious);
            }
            if (oldPrevious === undefined)
                oldPrevious = node.previousSibling;
            oldPreviousCache.set(node, oldPrevious);
            return oldPrevious;
        }
        var previousCache = new NodeMap();
        function getPrevious(node) {
            if (previousCache.has(node))
                return previousCache.get(node);
            var previous = node.previousSibling;
            while (previous && (change.added.has(previous) || isMoved(previous)))
                previous = previous.previousSibling;
            previousCache.set(node, previous);
            return previous;
        }
        change.maybeMoved.keys().forEach(isMoved);
        return change.moved.get(node);
    };
    return MutationProjection;
})();
var Summary = (function () {
    function Summary(projection, query) {
        var _this = this;
        this.projection = projection;
        this.added = [];
        this.removed = [];
        this.reparented = query.all || query.element || query.characterData ? [] : undefined;
        this.reordered = query.all ? [] : undefined;
        projection.getChanged(this, query.elementFilter, query.characterData);
        if (query.all || query.attribute || query.attributeList) {
            var filter = query.attribute ? [query.attribute] : query.attributeList;
            var attributeChanged = projection.attributeChangedNodes(filter);
            if (query.attribute) {
                this.valueChanged = attributeChanged[query.attribute] || [];
            }
            else {
                this.attributeChanged = attributeChanged;
                if (query.attributeList) {
                    query.attributeList.forEach(function (attrName) {
                        if (!_this.attributeChanged.hasOwnProperty(attrName))
                            _this.attributeChanged[attrName] = [];
                    });
                }
            }
        }
        if (query.all || query.characterData) {
            var characterDataChanged = projection.getCharacterDataChanged();
            if (query.characterData)
                this.valueChanged = characterDataChanged;
            else
                this.characterDataChanged = characterDataChanged;
        }
        if (this.reordered)
            this.getOldPreviousSibling = projection.getOldPreviousSibling.bind(projection);
    }
    Summary.prototype.getOldParentNode = function (node) {
        return this.projection.getOldParentNode(node);
    };
    Summary.prototype.getOldAttribute = function (node, name) {
        return this.projection.getOldAttribute(node, name);
    };
    Summary.prototype.getOldCharacterData = function (node) {
        return this.projection.getOldCharacterData(node);
    };
    Summary.prototype.getOldPreviousSibling = function (node) {
        return this.projection.getOldPreviousSibling(node);
    };
    return Summary;
})();
// TODO(rafaelw): Allow ':' and '.' as valid name characters.
var validNameInitialChar = /[a-zA-Z_]+/;
var validNameNonInitialChar = /[a-zA-Z0-9_\-]+/;
// TODO(rafaelw): Consider allowing backslash in the attrValue.
// TODO(rafaelw): There's got a to be way to represent this state machine
// more compactly???
function escapeQuotes(value) {
    return '"' + value.replace(/"/, '\\\"') + '"';
}
var Qualifier = (function () {
    function Qualifier() {
    }
    Qualifier.prototype.matches = function (oldValue) {
        if (oldValue === null)
            return false;
        if (this.attrValue === undefined)
            return true;
        if (!this.contains)
            return this.attrValue == oldValue;
        var tokens = oldValue.split(' ');
        for (var i = 0; i < tokens.length; i++) {
            if (this.attrValue === tokens[i])
                return true;
        }
        return false;
    };
    Qualifier.prototype.toString = function () {
        if (this.attrName === 'class' && this.contains)
            return '.' + this.attrValue;
        if (this.attrName === 'id' && !this.contains)
            return '#' + this.attrValue;
        if (this.contains)
            return '[' + this.attrName + '~=' + escapeQuotes(this.attrValue) + ']';
        if ('attrValue' in this)
            return '[' + this.attrName + '=' + escapeQuotes(this.attrValue) + ']';
        return '[' + this.attrName + ']';
    };
    return Qualifier;
})();
var Selector = (function () {
    function Selector() {
        this.uid = Selector.nextUid++;
        this.qualifiers = [];
    }
    Object.defineProperty(Selector.prototype, "caseInsensitiveTagName", {
        get: function () {
            return this.tagName.toUpperCase();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Selector.prototype, "selectorString", {
        get: function () {
            return this.tagName + this.qualifiers.join('');
        },
        enumerable: true,
        configurable: true
    });
    Selector.prototype.isMatching = function (el) {
        return el[Selector.matchesSelector](this.selectorString);
    };
    Selector.prototype.wasMatching = function (el, change, isMatching) {
        if (!change || !change.attributes)
            return isMatching;
        var tagName = change.isCaseInsensitive ? this.caseInsensitiveTagName : this.tagName;
        if (tagName !== '*' && tagName !== el.tagName)
            return false;
        var attributeOldValues = [];
        var anyChanged = false;
        for (var i = 0; i < this.qualifiers.length; i++) {
            var qualifier = this.qualifiers[i];
            var oldValue = change.getAttributeOldValue(qualifier.attrName);
            attributeOldValues.push(oldValue);
            anyChanged = anyChanged || (oldValue !== undefined);
        }
        if (!anyChanged)
            return isMatching;
        for (var i = 0; i < this.qualifiers.length; i++) {
            var qualifier = this.qualifiers[i];
            var oldValue = attributeOldValues[i];
            if (oldValue === undefined)
                oldValue = el.getAttribute(qualifier.attrName);
            if (!qualifier.matches(oldValue))
                return false;
        }
        return true;
    };
    Selector.prototype.matchabilityChange = function (el, change) {
        var isMatching = this.isMatching(el);
        if (isMatching)
            return this.wasMatching(el, change, isMatching) ? Movement.STAYED_IN : Movement.ENTERED;
        else
            return this.wasMatching(el, change, isMatching) ? Movement.EXITED : Movement.STAYED_OUT;
    };
    Selector.parseSelectors = function (input) {
        var selectors = [];
        var currentSelector;
        var currentQualifier;
        function newSelector() {
            if (currentSelector) {
                if (currentQualifier) {
                    currentSelector.qualifiers.push(currentQualifier);
                    currentQualifier = undefined;
                }
                selectors.push(currentSelector);
            }
            currentSelector = new Selector();
        }
        function newQualifier() {
            if (currentQualifier)
                currentSelector.qualifiers.push(currentQualifier);
            currentQualifier = new Qualifier();
        }
        var WHITESPACE = /\s/;
        var valueQuoteChar;
        var SYNTAX_ERROR = 'Invalid or unsupported selector syntax.';
        var SELECTOR = 1;
        var TAG_NAME = 2;
        var QUALIFIER = 3;
        var QUALIFIER_NAME_FIRST_CHAR = 4;
        var QUALIFIER_NAME = 5;
        var ATTR_NAME_FIRST_CHAR = 6;
        var ATTR_NAME = 7;
        var EQUIV_OR_ATTR_QUAL_END = 8;
        var EQUAL = 9;
        var ATTR_QUAL_END = 10;
        var VALUE_FIRST_CHAR = 11;
        var VALUE = 12;
        var QUOTED_VALUE = 13;
        var SELECTOR_SEPARATOR = 14;
        var state = SELECTOR;
        var i = 0;
        while (i < input.length) {
            var c = input[i++];
            switch (state) {
                case SELECTOR:
                    if (c.match(validNameInitialChar)) {
                        newSelector();
                        currentSelector.tagName = c;
                        state = TAG_NAME;
                        break;
                    }
                    if (c == '*') {
                        newSelector();
                        currentSelector.tagName = '*';
                        state = QUALIFIER;
                        break;
                    }
                    if (c == '.') {
                        newSelector();
                        newQualifier();
                        currentSelector.tagName = '*';
                        currentQualifier.attrName = 'class';
                        currentQualifier.contains = true;
                        state = QUALIFIER_NAME_FIRST_CHAR;
                        break;
                    }
                    if (c == '#') {
                        newSelector();
                        newQualifier();
                        currentSelector.tagName = '*';
                        currentQualifier.attrName = 'id';
                        state = QUALIFIER_NAME_FIRST_CHAR;
                        break;
                    }
                    if (c == '[') {
                        newSelector();
                        newQualifier();
                        currentSelector.tagName = '*';
                        currentQualifier.attrName = '';
                        state = ATTR_NAME_FIRST_CHAR;
                        break;
                    }
                    if (c.match(WHITESPACE))
                        break;
                    throw Error(SYNTAX_ERROR);
                case TAG_NAME:
                    if (c.match(validNameNonInitialChar)) {
                        currentSelector.tagName += c;
                        break;
                    }
                    if (c == '.') {
                        newQualifier();
                        currentQualifier.attrName = 'class';
                        currentQualifier.contains = true;
                        state = QUALIFIER_NAME_FIRST_CHAR;
                        break;
                    }
                    if (c == '#') {
                        newQualifier();
                        currentQualifier.attrName = 'id';
                        state = QUALIFIER_NAME_FIRST_CHAR;
                        break;
                    }
                    if (c == '[') {
                        newQualifier();
                        currentQualifier.attrName = '';
                        state = ATTR_NAME_FIRST_CHAR;
                        break;
                    }
                    if (c.match(WHITESPACE)) {
                        state = SELECTOR_SEPARATOR;
                        break;
                    }
                    if (c == ',') {
                        state = SELECTOR;
                        break;
                    }
                    throw Error(SYNTAX_ERROR);
                case QUALIFIER:
                    if (c == '.') {
                        newQualifier();
                        currentQualifier.attrName = 'class';
                        currentQualifier.contains = true;
                        state = QUALIFIER_NAME_FIRST_CHAR;
                        break;
                    }
                    if (c == '#') {
                        newQualifier();
                        currentQualifier.attrName = 'id';
                        state = QUALIFIER_NAME_FIRST_CHAR;
                        break;
                    }
                    if (c == '[') {
                        newQualifier();
                        currentQualifier.attrName = '';
                        state = ATTR_NAME_FIRST_CHAR;
                        break;
                    }
                    if (c.match(WHITESPACE)) {
                        state = SELECTOR_SEPARATOR;
                        break;
                    }
                    if (c == ',') {
                        state = SELECTOR;
                        break;
                    }
                    throw Error(SYNTAX_ERROR);
                case QUALIFIER_NAME_FIRST_CHAR:
                    if (c.match(validNameInitialChar)) {
                        currentQualifier.attrValue = c;
                        state = QUALIFIER_NAME;
                        break;
                    }
                    throw Error(SYNTAX_ERROR);
                case QUALIFIER_NAME:
                    if (c.match(validNameNonInitialChar)) {
                        currentQualifier.attrValue += c;
                        break;
                    }
                    if (c == '.') {
                        newQualifier();
                        currentQualifier.attrName = 'class';
                        currentQualifier.contains = true;
                        state = QUALIFIER_NAME_FIRST_CHAR;
                        break;
                    }
                    if (c == '#') {
                        newQualifier();
                        currentQualifier.attrName = 'id';
                        state = QUALIFIER_NAME_FIRST_CHAR;
                        break;
                    }
                    if (c == '[') {
                        newQualifier();
                        state = ATTR_NAME_FIRST_CHAR;
                        break;
                    }
                    if (c.match(WHITESPACE)) {
                        state = SELECTOR_SEPARATOR;
                        break;
                    }
                    if (c == ',') {
                        state = SELECTOR;
                        break;
                    }
                    throw Error(SYNTAX_ERROR);
                case ATTR_NAME_FIRST_CHAR:
                    if (c.match(validNameInitialChar)) {
                        currentQualifier.attrName = c;
                        state = ATTR_NAME;
                        break;
                    }
                    if (c.match(WHITESPACE))
                        break;
                    throw Error(SYNTAX_ERROR);
                case ATTR_NAME:
                    if (c.match(validNameNonInitialChar)) {
                        currentQualifier.attrName += c;
                        break;
                    }
                    if (c.match(WHITESPACE)) {
                        state = EQUIV_OR_ATTR_QUAL_END;
                        break;
                    }
                    if (c == '~') {
                        currentQualifier.contains = true;
                        state = EQUAL;
                        break;
                    }
                    if (c == '=') {
                        currentQualifier.attrValue = '';
                        state = VALUE_FIRST_CHAR;
                        break;
                    }
                    if (c == ']') {
                        state = QUALIFIER;
                        break;
                    }
                    throw Error(SYNTAX_ERROR);
                case EQUIV_OR_ATTR_QUAL_END:
                    if (c == '~') {
                        currentQualifier.contains = true;
                        state = EQUAL;
                        break;
                    }
                    if (c == '=') {
                        currentQualifier.attrValue = '';
                        state = VALUE_FIRST_CHAR;
                        break;
                    }
                    if (c == ']') {
                        state = QUALIFIER;
                        break;
                    }
                    if (c.match(WHITESPACE))
                        break;
                    throw Error(SYNTAX_ERROR);
                case EQUAL:
                    if (c == '=') {
                        currentQualifier.attrValue = '';
                        state = VALUE_FIRST_CHAR;
                        break;
                    }
                    throw Error(SYNTAX_ERROR);
                case ATTR_QUAL_END:
                    if (c == ']') {
                        state = QUALIFIER;
                        break;
                    }
                    if (c.match(WHITESPACE))
                        break;
                    throw Error(SYNTAX_ERROR);
                case VALUE_FIRST_CHAR:
                    if (c.match(WHITESPACE))
                        break;
                    if (c == '"' || c == "'") {
                        valueQuoteChar = c;
                        state = QUOTED_VALUE;
                        break;
                    }
                    currentQualifier.attrValue += c;
                    state = VALUE;
                    break;
                case VALUE:
                    if (c.match(WHITESPACE)) {
                        state = ATTR_QUAL_END;
                        break;
                    }
                    if (c == ']') {
                        state = QUALIFIER;
                        break;
                    }
                    if (c == "'" || c == '"')
                        throw Error(SYNTAX_ERROR);
                    currentQualifier.attrValue += c;
                    break;
                case QUOTED_VALUE:
                    if (c == valueQuoteChar) {
                        state = ATTR_QUAL_END;
                        break;
                    }
                    currentQualifier.attrValue += c;
                    break;
                case SELECTOR_SEPARATOR:
                    if (c.match(WHITESPACE))
                        break;
                    if (c == ',') {
                        state = SELECTOR;
                        break;
                    }
                    throw Error(SYNTAX_ERROR);
            }
        }
        switch (state) {
            case SELECTOR:
            case TAG_NAME:
            case QUALIFIER:
            case QUALIFIER_NAME:
            case SELECTOR_SEPARATOR:
                // Valid end states.
                newSelector();
                break;
            default:
                throw Error(SYNTAX_ERROR);
        }
        if (!selectors.length)
            throw Error(SYNTAX_ERROR);
        return selectors;
    };
    Selector.nextUid = 1;
    Selector.matchesSelector = (function () {
        var element = document.createElement('div');
        if (typeof element['webkitMatchesSelector'] === 'function')
            return 'webkitMatchesSelector';
        if (typeof element['mozMatchesSelector'] === 'function')
            return 'mozMatchesSelector';
        if (typeof element['msMatchesSelector'] === 'function')
            return 'msMatchesSelector';
        return 'matchesSelector';
    })();
    return Selector;
})();
var attributeFilterPattern = /^([a-zA-Z:_]+[a-zA-Z0-9_\-:\.]*)$/;
function validateAttribute(attribute) {
    if (typeof attribute != 'string')
        throw Error('Invalid request opion. attribute must be a non-zero length string.');
    attribute = attribute.trim();
    if (!attribute)
        throw Error('Invalid request opion. attribute must be a non-zero length string.');
    if (!attribute.match(attributeFilterPattern))
        throw Error('Invalid request option. invalid attribute name: ' + attribute);
    return attribute;
}
function validateElementAttributes(attribs) {
    if (!attribs.trim().length)
        throw Error('Invalid request option: elementAttributes must contain at least one attribute.');
    var lowerAttributes = {};
    var attributes = {};
    var tokens = attribs.split(/\s+/);
    for (var i = 0; i < tokens.length; i++) {
        var name = tokens[i];
        if (!name)
            continue;
        var name = validateAttribute(name);
        var nameLower = name.toLowerCase();
        if (lowerAttributes[nameLower])
            throw Error('Invalid request option: observing multiple case variations of the same attribute is not supported.');
        attributes[name] = true;
        lowerAttributes[nameLower] = true;
    }
    return Object.keys(attributes);
}
function elementFilterAttributes(selectors) {
    var attributes = {};
    selectors.forEach(function (selector) {
        selector.qualifiers.forEach(function (qualifier) {
            attributes[qualifier.attrName] = true;
        });
    });
    return Object.keys(attributes);
}
var MutationSummary = (function () {
    function MutationSummary(opts) {
        var _this = this;
        this.connected = false;
        this.options = MutationSummary.validateOptions(opts);
        this.observerOptions = MutationSummary.createObserverOptions(this.options.queries);
        this.root = this.options.rootNode;
        this.callback = this.options.callback;
        this.elementFilter = Array.prototype.concat.apply([], this.options.queries.map(function (query) {
            return query.elementFilter ? query.elementFilter : [];
        }));
        if (!this.elementFilter.length)
            this.elementFilter = undefined;
        this.calcReordered = this.options.queries.some(function (query) {
            return query.all;
        });
        this.queryValidators = []; // TODO(rafaelw): Shouldn't always define this.
        if (MutationSummary.createQueryValidator) {
            this.queryValidators = this.options.queries.map(function (query) {
                return MutationSummary.createQueryValidator(_this.root, query);
            });
        }
        this.observer = new MutationObserverCtor(function (mutations) {
            _this.observerCallback(mutations);
        });
        this.reconnect();
    }
    MutationSummary.createObserverOptions = function (queries) {
        var observerOptions = {
            childList: true,
            subtree: true
        };
        var attributeFilter;
        function observeAttributes(attributes) {
            if (observerOptions.attributes && !attributeFilter)
                return; // already observing all.
            observerOptions.attributes = true;
            observerOptions.attributeOldValue = true;
            if (!attributes) {
                // observe all.
                attributeFilter = undefined;
                return;
            }
            // add to observed.
            attributeFilter = attributeFilter || {};
            attributes.forEach(function (attribute) {
                attributeFilter[attribute] = true;
                attributeFilter[attribute.toLowerCase()] = true;
            });
        }
        queries.forEach(function (query) {
            if (query.characterData) {
                observerOptions.characterData = true;
                observerOptions.characterDataOldValue = true;
                return;
            }
            if (query.all) {
                observeAttributes();
                observerOptions.characterData = true;
                observerOptions.characterDataOldValue = true;
                return;
            }
            if (query.attribute) {
                observeAttributes([query.attribute.trim()]);
                return;
            }
            var attributes = elementFilterAttributes(query.elementFilter).concat(query.attributeList || []);
            if (attributes.length)
                observeAttributes(attributes);
        });
        if (attributeFilter)
            observerOptions.attributeFilter = Object.keys(attributeFilter);
        return observerOptions;
    };
    MutationSummary.validateOptions = function (options) {
        for (var prop in options) {
            if (!(prop in MutationSummary.optionKeys))
                throw Error('Invalid option: ' + prop);
        }
        if (typeof options.callback !== 'function')
            throw Error('Invalid options: callback is required and must be a function');
        if (!options.queries || !options.queries.length)
            throw Error('Invalid options: queries must contain at least one query request object.');
        var opts = {
            callback: options.callback,
            rootNode: options.rootNode || document,
            observeOwnChanges: !!options.observeOwnChanges,
            oldPreviousSibling: !!options.oldPreviousSibling,
            queries: []
        };
        for (var i = 0; i < options.queries.length; i++) {
            var request = options.queries[i];
            // all
            if (request.all) {
                if (Object.keys(request).length > 1)
                    throw Error('Invalid request option. all has no options.');
                opts.queries.push({ all: true });
                continue;
            }
            // attribute
            if ('attribute' in request) {
                var query = {
                    attribute: validateAttribute(request.attribute)
                };
                query.elementFilter = Selector.parseSelectors('*[' + query.attribute + ']');
                if (Object.keys(request).length > 1)
                    throw Error('Invalid request option. attribute has no options.');
                opts.queries.push(query);
                continue;
            }
            // element
            if ('element' in request) {
                var requestOptionCount = Object.keys(request).length;
                var query = {
                    element: request.element,
                    elementFilter: Selector.parseSelectors(request.element)
                };
                if (request.hasOwnProperty('elementAttributes')) {
                    query.attributeList = validateElementAttributes(request.elementAttributes);
                    requestOptionCount--;
                }
                if (requestOptionCount > 1)
                    throw Error('Invalid request option. element only allows elementAttributes option.');
                opts.queries.push(query);
                continue;
            }
            // characterData
            if (request.characterData) {
                if (Object.keys(request).length > 1)
                    throw Error('Invalid request option. characterData has no options.');
                opts.queries.push({ characterData: true });
                continue;
            }
            throw Error('Invalid request option. Unknown query request.');
        }
        return opts;
    };
    MutationSummary.prototype.createSummaries = function (mutations) {
        if (!mutations || !mutations.length)
            return [];
        var projection = new MutationProjection(this.root, mutations, this.elementFilter, this.calcReordered, this.options.oldPreviousSibling);
        var summaries = [];
        for (var i = 0; i < this.options.queries.length; i++) {
            summaries.push(new Summary(projection, this.options.queries[i]));
        }
        return summaries;
    };
    MutationSummary.prototype.checkpointQueryValidators = function () {
        this.queryValidators.forEach(function (validator) {
            if (validator)
                validator.recordPreviousState();
        });
    };
    MutationSummary.prototype.runQueryValidators = function (summaries) {
        this.queryValidators.forEach(function (validator, index) {
            if (validator)
                validator.validate(summaries[index]);
        });
    };
    MutationSummary.prototype.changesToReport = function (summaries) {
        return summaries.some(function (summary) {
            var summaryProps = ['added', 'removed', 'reordered', 'reparented',
                'valueChanged', 'characterDataChanged'];
            if (summaryProps.some(function (prop) { return summary[prop] && summary[prop].length; }))
                return true;
            if (summary.attributeChanged) {
                var attrNames = Object.keys(summary.attributeChanged);
                var attrsChanged = attrNames.some(function (attrName) {
                    return !!summary.attributeChanged[attrName].length;
                });
                if (attrsChanged)
                    return true;
            }
            return false;
        });
    };
    MutationSummary.prototype.observerCallback = function (mutations) {
        if (!this.options.observeOwnChanges)
            this.observer.disconnect();
        var summaries = this.createSummaries(mutations);
        this.runQueryValidators(summaries);
        if (this.options.observeOwnChanges)
            this.checkpointQueryValidators();
        if (this.changesToReport(summaries))
            this.callback(summaries);
        // disconnect() may have been called during the callback.
        if (!this.options.observeOwnChanges && this.connected) {
            this.checkpointQueryValidators();
            this.observer.observe(this.root, this.observerOptions);
        }
    };
    MutationSummary.prototype.reconnect = function () {
        if (this.connected)
            throw Error('Already connected');
        this.observer.observe(this.root, this.observerOptions);
        this.connected = true;
        this.checkpointQueryValidators();
    };
    MutationSummary.prototype.takeSummaries = function () {
        if (!this.connected)
            throw Error('Not connected');
        var summaries = this.createSummaries(this.observer.takeRecords());
        return this.changesToReport(summaries) ? summaries : undefined;
    };
    MutationSummary.prototype.disconnect = function () {
        var summaries = this.takeSummaries();
        this.observer.disconnect();
        this.connected = false;
        return summaries;
    };
    MutationSummary.NodeMap = NodeMap; // exposed for use in TreeMirror.
    MutationSummary.parseElementFilter = Selector.parseSelectors; // exposed for testing.
    MutationSummary.optionKeys = {
        'callback': true,
        'queries': true,
        'rootNode': true,
        'oldPreviousSibling': true,
        'observeOwnChanges': true
    };
    return MutationSummary;
})();

module.exports = MutationSummary


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(2));
__export(__webpack_require__(0));


/***/ })
/******/ ]);
});
//# sourceMappingURL=convergence-dom-utils.js.map