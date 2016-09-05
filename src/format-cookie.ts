import { CookieOptions } from './cookie-options';

const formatOptions = (o: CookieOptions): string => {
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
};

const formatCookie = (k: string, d: string, o: CookieOptions): string => {
  return [
    encodeURIComponent(k),
    '=',
    encodeURIComponent(d),
    formatOptions(o)
  ].join('');
};

export { formatCookie };
