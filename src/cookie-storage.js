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

  // TODO
  // [NameSetter] void setItem(in DOMString key, in DOMString data);
  setItem(key, data) {
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
