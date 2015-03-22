// interface Storage {
//   readonly attribute unsigned long length;
//   [IndexGetter] DOMString key(in unsigned long index);
//   [NameGetter] DOMString getItem(in DOMString key);
//   [NameSetter] void setItem(in DOMString key, in DOMString data);
//   [NameDeleter] void removeItem(in DOMString key);
//   void clear();
// };
class CookieStorage {
  // TODO
  constructor() {
    this._defaultOptions = {
      path: null,
      domain: null,
      expires: null,
      secure: false
    };
    // readonly attribute unsigned long length;
    this.length = 0;
  }

  // TODO
  // void clear();
  clear() {
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

  // TODO
  // [NameDeleter] void removeItem(in DOMString key);
  removeItem(key) {
  }

  // [NameSetter] void setItem(in DOMString key, in DOMString data);
  setItem(key, data) {
    var options = this._clone(this._defaultOptions);
    var formatted = this._format(key, data, options);
    document.cookie = formatted;
  }

  _clone(o) {
    var cloned = {};
    Object.keys(o).forEach(i => cloned[i] = o[i]);
    return cloned;
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

export { CookieStorage };
