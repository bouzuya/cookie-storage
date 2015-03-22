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

  // TODO
  // [NameGetter] DOMString getItem(in DOMString key);
  getItem(key) {
  }

  // TODO
  // [IndexGetter] DOMString key(in unsigned long index);
  key(index) {
  }

  // TODO
  // [NameDeleter] void removeItem(in DOMString key);
  removeItem(key) {
  }

  // TODO
  // [NameSetter] void setItem(in DOMString key, in DOMString data);
  setItem(key, data) {
  }
}

export { CookieStorage };
