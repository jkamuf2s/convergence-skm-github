/**!
© 2016 Convergence Labs, Inc.
@version 0.1.0
@license MIT
*/
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
//# sourceMappingURL=ColorGenerator.js.map
