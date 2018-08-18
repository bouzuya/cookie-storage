import { CookieOptions } from './cookie-options';
import { formatCookie } from './format-cookie';
import { parseCookies } from './parse-cookies';
import { Storage } from './storage';

export class CookieStorage implements Storage {
  private _defaultOptions: CookieOptions;

  constructor(defaultOptions?: CookieOptions) {
    this._defaultOptions = Object.assign({
      domain: null,
      expires: null,
      path: null,
      secure: false
    }, defaultOptions);
    if (typeof Proxy !== 'undefined')
      return new Proxy(this, cookieStorageHandler);
  }

  get length(): number {
    const parsed = parseCookies(this._getCookie());
    const keys = Object.keys(parsed);
    return keys.length;
  }

  public clear(): void {
    const parsed = parseCookies(this._getCookie());
    const keys = Object.keys(parsed);
    keys.forEach((key) => this.removeItem(key));
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

const cookieStorageHandler: ProxyHandler<CookieStorage> = {
  get(target: CookieStorage, p: PropertyKey, _receiver: any): any {
    // if the user makes calls to setItem(), length(), etc. pass them through
    if (typeof p === 'string' && p in target) return target[p];
    const result = target.getItem(p.toString());
    return result !== null ? result : undefined;
  },
  set(target: CookieStorage, p: PropertyKey, value: any, _: any): boolean {
    // localStorage and sessionStorage don't do any isExtensible checks before
    // allowing you to create new properties via indexes (e.g.
    // Object.preventExtensions(localStorage); localStorage['a'] = 1; will work)
    target.setItem(p.toString(), String(value));
    return true;
  },
  has(target: CookieStorage, p: PropertyKey): boolean {
    if (typeof p === 'string' && p in target) return true;
    return target.getItem(p.toString()) !== null;
  },
  deleteProperty(target: CookieStorage, p: PropertyKey): boolean {
    target.removeItem(p.toString());
    return true;
  },
  defineProperty(target, p, attributes) {
    const isExtensible = Object.isExtensible(target);
    const alreadyExists = target.getItem(p.toString());
    if (!isExtensible && !alreadyExists) {
      const s = `Can't add property ${p.toString()}, object is not extensible`;
      throw new TypeError(s);
    } else {
      target.setItem(p.toString(), attributes.value);
      return true;
    }
  },
  ownKeys(target: CookieStorage): PropertyKey[] {
    const keys: PropertyKey[] = [];
    for (let i = 0; i < target.length; i++) {
      const key = target.key(i);
      if (key !== null)
        keys.push(key);
    }
    return keys;
  },
  // This emulates the behavior of localStorage, and ensures that
  // Object.keys(CookieStorage) will always return the full array of keys (since
  // Object.keys will only return 'enumerable' keys).
  // 'any' is necessary as the return signature because of glitch in typescript
  // lib definitions, which is being fixed.
  // See https://github.com/Microsoft/TypeScript/pull/15694
  getOwnPropertyDescriptor(target, p): any {
    if (p in target)
      return undefined;
    else
      return {
        configurable: true,
        enumerable: true,
        value: target.getItem(p.toString()),
        writable: true
      };
  }
};
