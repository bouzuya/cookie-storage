import { Storage } from './storage';
import { CookieOptions } from './cookie-options';
import { formatCookie } from './format-cookie';
import { parseCookies } from './parse-cookies';

export class CookieStorage implements Storage {
  private _defaultOptions: CookieOptions;

  constructor(defaultOptions?: CookieOptions) {
    this._defaultOptions = Object.assign({
      path: null,
      domain: null,
      expires: null,
      secure: false
    }, defaultOptions);
    return new Proxy(this, CookieStorageHandler);
  }

  get length(): number {
    const parsed = parseCookies(this._getCookie());
    const keys = Object.keys(parsed);
    return keys.length;
  }

  clear(): void {
    const parsed = parseCookies(this._getCookie());
    const keys = Object.keys(parsed);
    keys.forEach(key => this.removeItem(key));
  }

  getItem(key: string): string | null {
    const parsed = parseCookies(this._getCookie());
    return parsed.hasOwnProperty(key) ? parsed[key] : null;
  }

  key(index: number): string | null {
    const parsed = parseCookies(this._getCookie());
    const sortedKeys = Object.keys(parsed).sort();
    return index < sortedKeys.length ? sortedKeys[index] : null;
  }

  removeItem(key: string): void {
    const data = '';
    const options = Object.assign({}, this._defaultOptions, {
      expires: new Date(0)
    });
    const formatted = formatCookie(key, data, options);
    this._setCookie(formatted);
  }

  setItem(key: string, data: string, options?: CookieOptions): void {
    const _options: CookieOptions = Object.assign({}, this._defaultOptions, options);
    const formatted = formatCookie(key, data, _options);
    this._setCookie(formatted);
  }

  private _getCookie(): string {
    return typeof document === 'undefined'
      ? '' : typeof document.cookie === 'undefined'
        ? '' : document.cookie;
  }

  private _setCookie(value: string): void {
    document.cookie = value;
  }

  [key: string]: any;
  [index: number]: string;
}

var CookieStorageHandler: ProxyHandler<CookieStorage> = {
    //getPrototypeOf? (target: T): object | null;
        //Need to investigate
    //setPrototypeOf? (target: T, v: any): boolean;
        //Need to investigate
    //isExtensible? (target: T): boolean;
        //not necessary to implement. Calling Object.isExtensible(p); works correctly with no modifications on the proxy object.
    //preventExtensions? (target: T): boolean;
        //not necessary to implement. Calling Object.preventExtensions(p); works correctly with no modifications on the proxy object.
    
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/getOwnPropertyDescriptor
    //This might not necessary to emulate LocalStorage and SessionStorage - both of those methods basically ignore propertyDescritors when setting. However, it seems to be nice!
    getOwnPropertyDescriptor(target, p) {
        return Object.getOwnPropertyDescriptor(target, p);
    },
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/has
    has(target, p) {
        return target.getItem(p.toString()) ? true : false;
    },
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/get
    get(target, p) {
        //if the user makes calls to setItem(), length(), etc. pass them through
        if (p in target) {
            return target[p];
        }
        //otherwise, save the property as a cookie
        else {
            let result = target.getItem(p.toString())
            return result ? result : undefined;
        }
    },
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/set
    set(target, p, value) {
        //localStorage and sessionStorage don't do any isExtensible checks before allowing you to create new properties via indexes (e.g. Object.preventExtensions(localStorage); localStorage["a"] = 1; will work)
        target.setItem(p.toString(), value);
        return true;
    },
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/deleteProperty
    deleteProperty(target, p) {
        target.removeItem(p.toString());
        return true;
    },
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/defineProperty
    defineProperty(target, p, attributes) {
        let isExtensible = Object.isExtensible(target);
        let alreadyExists = target.getItem(p.toString());
        if (!isExtensible && !alreadyExists) {
            throw new TypeError("Can't add property " + p.toString() + ", object is not extensible");
        }
        else {
            //Todo: maybe don't actually define a property? This is the only way to get "attributes" to be perserved, but localStorage doesn't do this.
            Object.defineProperty(target, p, attributes);
            target.setItem(p.toString(), attributes.value);
            return true;
        }
    },
    //enumerate? (target: T): PropertyKey[];
        //obsolete: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/enumerate
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/ownKeys
    ownKeys(target) {
        //todo: this code is duplicated from the private _getCookie() method on the CookieStorage object. I need to find the right pattern so you don't have to duplicate this private method in the proxy object.
        //todo: I only added this line because I got a complier warning "target was declared but never used". Need to find a better way to remove this
        console.log(target);
        //const parsed = parseCookies(document.cookie);
        //return Object.keys(parsed);
        return ["a", "b"];
    },
    //apply? (target: T, thisArg: any, argArray?: any): any;
        //not applicable to proxies for clasess, only proxies to functions
    //construct? (target: T, argArray: any, newTarget?: any): object;
        //overrides the new operator. Might not be necessary
};