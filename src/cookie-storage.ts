import { Storage } from './storage';

export class CookieStorage implements Storage {
  private _defaultOptions: any;

  constructor(options?: any) {
    this._defaultOptions = Object.assign({
      path: null,
      domain: null,
      expires: null,
      secure: false
    }, options);
  }

  get length(): number {
    const parsed = this._parse(document.cookie);
    return Object.keys(parsed).length;
  }

  clear(): void {
    const parsed = this._parse(document.cookie);
    Object.keys(parsed).forEach(key => this.removeItem(key));
  }

  getItem(key: string): string | null {
    const parsed = this._parse(document.cookie);
    return parsed[key];
  }

  key(index: number): string | null {
    const parsed = this._parse(document.cookie);
    return Object.keys(parsed).sort()[index];
  }

  removeItem(key: string): void {
    const data = '';
    const options = Object.assign({}, this._defaultOptions);
    options.expires = new Date(0);
    const formatted = this._format(key, data, options);
    document.cookie = formatted;
  }

  setItem(key: string, data: string, options?: any): void {
    options = Object.assign({}, this._defaultOptions, options);
    const formatted = this._format(key, data, options);
    document.cookie = formatted;
  }

  _format(k: string, d: string, o: any): string {
    return [
      encodeURIComponent(k),
      '=',
      encodeURIComponent(d),
      this._formatOptions(o)
    ].join('');
  }

  _formatOptions(o: any): string {
    return [
      this._isDefined(o.path) ? ';path=' + o.path : '',
      this._isDefined(o.domain) ? ';domain=' + o.domain : '',
      this._isDefined(o.expires) ? ';expires=' + o.expires.toUTCString() : '',
      this._isDefined(o.secure) && o.secure ? ';secure' : ''
    ].join('');
  }

  _isDefined(o: any): boolean {
    return typeof o !== 'undefined' && o !== null;
  }

  _parse(s: string): any {
    if (!this._isDefined(s) || s.length === 0) return {};
    const parsed = {};
    const pattern = new RegExp('\\s*;\\s*');
    s.split(pattern).forEach((i) => {
      const [encodedKey, encodedValue] = i.split('=');
      const key = decodeURIComponent(encodedKey);
      const value = decodeURIComponent(encodedValue);
      parsed[key] = value;
    });
    return parsed;
  }
}
