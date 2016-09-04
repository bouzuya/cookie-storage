// interface Storage {
//   readonly attribute unsigned long length;
//   [IndexGetter] DOMString key(in unsigned long index);
//   [NameGetter] DOMString getItem(in DOMString key);
//   [NameSetter] void setItem(in DOMString key, in DOMString data);
//   [NameDeleter] void removeItem(in DOMString key);
//   void clear();
// };
export class CookieStorage {
  constructor(options) {
    options = options || {};
    this._defaultOptions = this._extends({
      path: null,
      domain: null,
      expires: null,
      secure: false
    }, options);
    // readonly attribute unsigned long length;
    Object.defineProperty(this, 'length', {
      get: () => {
        var parsed = this._parse(document.cookie);
        return Object.keys(parsed).length;
      }
    });
  }

  // void clear();
  clear() {
    var parsed = this._parse(document.cookie);
    Object.keys(parsed).forEach(key => this.removeItem(key));
  }

  // [NameGetter] DOMString getItem(in DOMString key);
  getItem(key) {
    var parsed = this._parse(document.cookie);
    return parsed[key];
  }

  // [IndexGetter] DOMString key(in unsigned long index);
  key(index) {
    var parsed = this._parse(document.cookie);
    return Object.keys(parsed).sort()[index];
  }

  // [NameDeleter] void removeItem(in DOMString key);
  removeItem(key) {
    var data = '';
    var options = this._clone(this._defaultOptions);
    options.expires = new Date(0);
    var formatted = this._format(key, data, options);
    document.cookie = formatted;
  }

  // [NameSetter] void setItem(in DOMString key, in DOMString data);
  setItem(key, data, options) {
    options = options || {};
    options = this._extends(this._clone(this._defaultOptions), options);
    var formatted = this._format(key, data, options);
    document.cookie = formatted;
  }

  _clone(o) {
    var cloned = {};
    Object.keys(o).forEach(i => cloned[i] = o[i]);
    return cloned;
  }

  _extends(o1, o2) {
    Object.keys(o2).forEach(i => o1[i] = o2[i]);
    return o1;
  }

  _format(k, d, o) {
    return [
      encodeURIComponent(k),
      '=',
      encodeURIComponent(d),
      this._formatOptions(o)
    ].join('');
  }

  _formatOptions(o) {
    return [
      this._isDefined(o.path) ? ';path=' + o.path : '',
      this._isDefined(o.domain) ? ';domain=' + o.domain : '',
      this._isDefined(o.expires) ? ';expires=' + o.expires.toUTCString() : '',
      this._isDefined(o.secure) && o.secure ? ';secure' : ''
    ].join('');
  }

  _isDefined(o) {
    return typeof o !== 'undefined' && o !== null;
  }

  _parse(s) {
    if (!this._isDefined(s) || s.length === 0) return {};
    var parsed = {};
    var pattern = new RegExp('\\s*;\\s*');
    s.split(pattern).forEach((i) => {
      var [encodedKey, encodedValue] = i.split('=');
      var key = decodeURIComponent(encodedKey);
      var value = decodeURIComponent(encodedValue);
      parsed[key] = value;
    });
    return parsed;
  }
}
