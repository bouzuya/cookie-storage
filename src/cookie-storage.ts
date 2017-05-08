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
    //getOwnPropertyDescriptor? (target: T, p: PropertyKey): PropertyDescriptor;
        //not necessary to emulate LocalStorage and SessionStorage - both of those methods basically ignore propertyDescritors when setting. However, it seems to be nice!
    getOwnPropertyDescriptor(target, p) {
        return Object.getOwnPropertyDescriptor(target, p);
    },
    //has? (target: T, p: PropertyKey): boolean;
    has(target, p) {
        return target.getItem(p.toString()) ? true : false;
    },
    //get? (target: T, p: PropertyKey, receiver: any): any;
    get(target, p) {
        if (p in target) {
            return target[p];
        }
        else {
            let result = target.getItem(p.toString())
            return result ? result : undefined;
        }
    },
    //set? (target: T, p: PropertyKey, value: any, receiver: any): boolean;
    set(target, p, value) {
        let isExtensible = Object.isExtensible(target);
        let alreadyExists = target.getItem(p.toString());
        if (!isExtensible && alreadyExists) {
            //"Attempting to add new properties to a non-extensible object will fail, either silently or by throwing a TypeError (most commonly, but not exclusively, when in strict mode)."
            //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/preventExtensions
            throw new TypeError("Can't add property " + p.toString() + ", object is not extensible");
        }
        else {
            target.setItem(p.toString(), value);
            return true;
        }
    },
    //deleteProperty? (target: T, p: PropertyKey): boolean;
    deleteProperty(target, p) {
        target.removeItem(p.toString());
        return true;
    },
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/defineProperty
    defineProperty(target, p, attributes) {
        let isExtensible = Object.isExtensible(target);
        let alreadyExists = target.getItem(p.toString());
        //If the following invariants are violated, the proxy will throw a TypeError:
        //--A property cannot be added, if the target object is not extensible."
        //--A property cannot be added as or modified to be non-configurable, if it does not exists as a non-configurable own property of the target object.
        //--A property may not be non-configurable, if a corresponding configurable property of the target object exists.
        //--If a property has a corresponding target object property then Object.defineProperty(target, prop, descriptor) will not throw an exception.
        //--In strict mode, a false return value from the defineProperty handler will throw a TypeError exception.
        if (!isExtensible && alreadyExists) {
            throw new TypeError("Can't add property " + p.toString() + ", object is not extensible");
        }
        else {
            Object.defineProperty(target, p, attributes);
            target.setItem(p.toString(), attributes.value);
            return true;
        }
    },
    //enumerate? (target: T): PropertyKey[];
        //obsolete: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/enumerate
    //ownKeys? (target: T): PropertyKey[];
    ownKeys(target) {
        //todo: this code is duplicated from the private _getCookie() method on the CookieStorage object. I need to find the right pattern so you don't have to duplicate this private method in the proxy object.
        //todo: I only added this line because I got a complier warning "target was declared but never used". Need to find a better way to remove this
        console.log(target);
        const parsed = parseCookies(document.cookie);
        return Object.keys(parsed);
    },
    //apply? (target: T, thisArg: any, argArray?: any): any;
        //not applicable to proxies for clasess, only proxies to functions
    //construct? (target: T, argArray: any, newTarget?: any): object;
        //overrides the new operator. Might not be necessary
};