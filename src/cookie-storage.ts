import { CookieOptions } from './cookie-options';
import { formatCookie } from './format-cookie';
import { parseCookies } from './parse-cookies';
import { Storage } from './storage';

export class CookieStorage implements Storage {
  private _defaultOptions: CookieOptions;

  constructor(defaultOptions?: CookieOptions) {
    this._defaultOptions = {
      domain: null,
      expires: null,
      path: null,
      secure: false,
      ...defaultOptions
    };
    if (typeof Proxy !== 'undefined')
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
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
    return Object.prototype.hasOwnProperty.call(parsed, key)
      ? parsed[key]
      : null;
  }

  public key(index: number): string | null {
    const parsed = parseCookies(this._getCookie());
    const sortedKeys = Object.keys(parsed).sort();
    return index < sortedKeys.length ? sortedKeys[index] : null;
  }

  public removeItem(key: string, cookieOptions?: CookieOptions): void {
    const data = '';
    const options = {
      ...this._defaultOptions,
      ...cookieOptions,
      ...{ expires: new Date(0) }
    };
    const formatted = formatCookie(key, data, options);
    this._setCookie(formatted);
  }

  public setItem(key: string, data: string, options?: CookieOptions): void {
    const opts = { ...this._defaultOptions, ...options };
    const formatted = formatCookie(key, data, opts);
    this._setCookie(formatted);
  }

  private _getCookie(): string {
    return typeof document === 'undefined'
      ? ''
      : typeof document.cookie === 'undefined'
      ? ''
      : document.cookie;
  }

  private _setCookie(value: string): void {
    document.cookie = value;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
  [index: number]: string;
}

const cookieStorageHandler: ProxyHandler<CookieStorage> = {
  defineProperty(
    target: CookieStorage,
    p: PropertyKey,
    attributes: PropertyDescriptor
  ): boolean {
    target.setItem(p.toString(), String(attributes.value));
    return true;
  },
  deleteProperty(target: CookieStorage, p: PropertyKey): boolean {
    target.removeItem(p.toString());
    return true;
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get(target: CookieStorage, p: PropertyKey, _receiver: any): any {
    // if the user makes calls to setItem(), length(), etc. pass them through
    if (typeof p === 'string' && p in target) return target[p];
    const result = target.getItem(p.toString());
    return result !== null ? result : undefined;
  },
  // This emulates the behavior of localStorage, and ensures that
  // Object.keys(CookieStorage) will always return the full array of keys (since
  // Object.keys will only return 'enumerable' keys).
  // 'any' is necessary as the return signature because of glitch in typescript
  // lib definitions, which is being fixed.
  // See https://github.com/Microsoft/TypeScript/pull/15694
  getOwnPropertyDescriptor(
    target: CookieStorage,
    p: PropertyKey
  ): PropertyDescriptor | undefined {
    if (p in target) return undefined;
    return {
      configurable: true,
      enumerable: true,
      value: target.getItem(p.toString()),
      writable: true
    };
  },
  has(target: CookieStorage, p: PropertyKey): boolean {
    if (typeof p === 'string' && p in target) return true;
    return target.getItem(p.toString()) !== null;
  },
  ownKeys(target: CookieStorage): PropertyKey[] {
    const keys: PropertyKey[] = [];
    for (let i = 0; i < target.length; i++) {
      const key = target.key(i);
      if (key !== null) keys.push(key);
    }
    return keys;
  },
  preventExtensions(_: CookieStorage): boolean {
    throw new TypeError("can't prevent extensions on this proxy object");
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  set(target: CookieStorage, p: PropertyKey, value: any, _: any): boolean {
    // CookieStorage is always extensible (can't prevent extensions).
    target.setItem(p.toString(), String(value));
    return true;
  }
};
