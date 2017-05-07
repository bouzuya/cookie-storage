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
