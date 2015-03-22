(function (factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  }
})(function (exports) {
  "use strict";

  var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) { _arr.push(_step.value); if (i && _arr.length === i) break; } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } };

  var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var CookieStorage = (function () {
    function CookieStorage(options) {
      var _this = this;

      _classCallCheck(this, CookieStorage);

      options = options || {};
      this._defaultOptions = this._extends({
        path: null,
        domain: null,
        expires: null,
        secure: false
      }, options);

      Object.defineProperty(this, "length", {
        get: function () {
          var parsed = _this._parse(document.cookie);
          return Object.keys(parsed).length;
        }
      });
    }

    _createClass(CookieStorage, {
      clear: {
        value: function clear() {
          var _this = this;

          var parsed = this._parse(document.cookie);
          Object.keys(parsed).forEach(function (key) {
            return _this.removeItem(key);
          });
        }
      },
      getItem: {
        value: function getItem(key) {
          var parsed = this._parse(document.cookie);
          return parsed[key];
        }
      },
      key: {
        value: function key(index) {
          var parsed = this._parse(document.cookie);
          return Object.keys(parsed).sort()[index];
        }
      },
      removeItem: {
        value: function removeItem(key) {
          var data = "";
          var options = this._clone(this._defaultOptions);
          options.expires = new Date(0);
          var formatted = this._format(key, data, options);
          document.cookie = formatted;
        }
      },
      setItem: {
        value: function setItem(key, data, options) {
          options = options || {};
          options = this._extends(this._clone(this._defaultOptions), options);
          var formatted = this._format(key, data, options);
          document.cookie = formatted;
        }
      },
      _clone: {
        value: function _clone(o) {
          var cloned = {};
          Object.keys(o).forEach(function (i) {
            return cloned[i] = o[i];
          });
          return cloned;
        }
      },
      _extends: {
        value: function _extends(o1, o2) {
          Object.keys(o2).forEach(function (i) {
            return o1[i] = o2[i];
          });
          return o1;
        }
      },
      _format: {
        value: function _format(k, d, o) {
          return [encodeURIComponent(k), "=", encodeURIComponent(d), this._formatOptions(o)].join("");
        }
      },
      _formatOptions: {
        value: function _formatOptions(o) {
          return [this._isDefined(o.path) ? ";path=" + o.path : "", this._isDefined(o.domain) ? ";domain=" + o.domain : "", this._isDefined(o.expires) ? ";expires=" + o.expires.toUTCString() : "", this._isDefined(o.secure) && o.secure ? ";secure" : ""].join("");
        }
      },
      _isDefined: {
        value: function _isDefined(o) {
          return typeof o !== "undefined" && o !== null;
        }
      },
      _parse: {
        value: function _parse(s) {
          if (!this._isDefined(s) || s.length === 0) {
            return {};
          }var parsed = {};
          var pattern = new RegExp("\\s*;\\s*");
          s.split(pattern).forEach(function (i) {
            var _i$split = i.split("=");

            var _i$split2 = _slicedToArray(_i$split, 2);

            var encodedKey = _i$split2[0];
            var encodedValue = _i$split2[1];

            var key = decodeURIComponent(encodedKey);
            var value = decodeURIComponent(encodedValue);
            parsed[key] = value;
          });
          return parsed;
        }
      }
    });

    return CookieStorage;
  })();

  exports.CookieStorage = CookieStorage;
});