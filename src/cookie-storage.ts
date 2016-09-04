import { Storage } from './storage';
import { CookieOptions } from './cookie-options';

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
    const parsed = this._parse(this._getCookie());
    const keys = Object.keys(parsed);
    return keys.length;
  }

  clear(): void {
    const parsed = this._parse(this._getCookie());
    const keys = Object.keys(parsed);
    keys.forEach(key => this.removeItem(key));
  }

  getItem(key: string): string | null {
    const parsed = this._parse(this._getCookie());
    return parsed.hasOwnProperty(key) ? parsed[key] : null;
  }

  key(index: number): string | null {
    const parsed = this._parse(this._getCookie());
    const sortedKeys = Object.keys(parsed).sort();
    return index < sortedKeys.length ? sortedKeys[index] : null;
  }

  removeItem(key: string): void {
    const data = '';
    const options = Object.assign({}, this._defaultOptions, {
      expires: new Date(0)
    });
    const formatted = this._format(key, data, options);
    this._setCookie(formatted);
  }

  setItem(key: string, data: string, options?: CookieOptions): void {
    options = Object.assign({}, this._defaultOptions, options);
    const formatted = this._format(key, data, options);
    this._setCookie(formatted);
  }

  private _format(k: string, d: string, o: CookieOptions): string {
    return [
      encodeURIComponent(k),
      '=',
      encodeURIComponent(d),
      this._formatOptions(o)
    ].join('');
  }

  private _formatOptions(o: CookieOptions): string {
    const { path, domain, expires, secure } = o;
    return [
      typeof path === 'undefined' || path === null
        ? '' : ';path=' + path,
      typeof domain === 'undefined' || domain === null
        ? '' : ';domain=' + domain,
      typeof expires === 'undefined' || expires === null
        ? '' : ';expires=' + expires.toUTCString(),
      typeof secure === 'undefined' || secure === null || secure === false
        ? '' : ';secure'
    ].join('');
  }

  private _getCookie(): string {
    return typeof document === 'undefined'
      ? '' : typeof document.cookie === 'undefined'
        ? '' : document.cookie;
  }

  private _parse(s: string): { [key: string]: string; } {
    if (s.length === 0) return {};
    const parsed: { [key: string]: string; } = {};
    const pattern = new RegExp('\\s*;\\s*');
    s.split(pattern).forEach((i) => {
      const [encodedKey, encodedValue] = i.split('=');
      const key = decodeURIComponent(encodedKey);
      const value = decodeURIComponent(encodedValue);
      parsed[key] = value;
    });
    return parsed;
  }

  private _setCookie(value: string): void {
    document.cookie = value;
  }
}
