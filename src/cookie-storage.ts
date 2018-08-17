import { CookieOptions } from './cookie-options';
import { formatCookie } from './format-cookie';
import { parseCookies } from './parse-cookies';
import { Storage } from './storage';

export class CookieStorage implements Storage {
  private _defaultOptions: CookieOptions;

  constructor(defaultOptions?: CookieOptions) {
    this._defaultOptions = Object.assign({
      path: null,
      domain: null,
      expires: null,
      secure: false
    }, defaultOptions);
    if (typeof Proxy !== 'undefined')
      return new Proxy(this, CookieStorageHandler);
  }

  get length(): number {
    const parsed = parseCookies(this._getCookie());
    const keys = Object.keys(parsed);
    return keys.length;
  }

  public clear(): void {
    const parsed = parseCookies(this._getCookie());
    const keys = Object.keys(parsed);
    keys.forEach(key => this.removeItem(key));
  }

  public getItem(key: string): string | null {
    const parsed = parseCookies(this._getCookie());
    return parsed.hasOwnProperty(key) ? parsed[key] : null;
  }

  public key(index: number): string | null {
    const parsed = parseCookies(this._getCookie());
    const sortedKeys = Object.keys(parsed).sort();
    return index < sortedKeys.length ? sortedKeys[index] : null;
  }

  public removeItem(key: string, cookieOptions?: CookieOptions): void {
    const data = '';
    const options = Object.assign({}, this._defaultOptions, cookieOptions, {
      expires: new Date(0)
    });
    const formatted = formatCookie(key, data, options);
    this._setCookie(formatted);
  }

  public setItem(key: string, data: string, options?: CookieOptions): void {
    const opts = Object.assign({}, this._defaultOptions, options);
    const formatted = formatCookie(key, data, opts);
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

const CookieStorageHandler: ProxyHandler<CookieStorage> = {
  get(target, p) {
    // if the user makes calls to setItem(), length(), etc. pass them through
    if (typeof p === 'string' && p in target)
      return target[p];
    // otherwise, save the property as a cookie
    else {
      const result = target.getItem(p.toString());
      return result ? result : undefined;
    }
  },
  set(target, p, value) {
    // localStorage and sessionStorage don't do any isExtensible checks before allowing you to create new properties via indexes (e.g. Object.preventExtensions(localStorage); localStorage['a'] = 1; will work). Docume
    target.setItem(p.toString(), value);
    return true;
  },
  has(target, p) {
    // if the user is checking for the existance of a builtin method like 'getItem' or 'lenth' this should return true, just like it does for localStorage.
    if (p in target)
      return true;
    // otherwise, check whether the cookie exists
    else
      return target.getItem(p.toString()) ? true : false;
  },
  deleteProperty(target, p) {
    target.removeItem(p.toString());
    return true;
  },
  defineProperty(target, p, attributes) {
    const isExtensible = Object.isExtensible(target);
    const alreadyExists = target.getItem(p.toString());
    if (!isExtensible && !alreadyExists)
      throw new TypeError(`Can't add property ${p.toString()}, object is not extensible`);
    else {
      target.setItem(p.toString(), attributes.value);
      return true;
    }
  },
  ownKeys(target) {
    const keys: PropertyKey[] = [];
    for (let i = 0; i < target.length; i++)
      if (target.key(i) == null)
        continue;
      else
        keys.push(target.key(i) as PropertyKey);
    return keys;
  },

  // This emulates the behavior of localStorage, and ensures that Object.keys(CookieStorage) will always return the full array of keys (since Object.keys will only return 'enumerable' keys).
  // 'any' is necessary as the return signature because of glitch in typescript lib definitions, which is being fixed. See https:// github.com/Microsoft/TypeScript/pull/15694
  getOwnPropertyDescriptor(target, p): any {
    if (p in target)
      return undefined;
    else
      return {
        value: target.getItem(p.toString()),
        writable: true,
        enumerable: true,
        configurable: true
      };
  }
};
