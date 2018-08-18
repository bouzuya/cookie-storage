import { CookieOptions } from './cookie-options';

const formatOptions = (o: CookieOptions): string => {
  const { path, domain, expires, secure } = o;
  const sameSiteValue = getSameSiteValue(o);
  return [
    typeof path === 'undefined' || path === null
      ? '' : ';path=' + path,
    typeof domain === 'undefined' || domain === null
      ? '' : ';domain=' + domain,
    typeof expires === 'undefined' || expires === null
      ? '' : ';expires=' + expires.toUTCString(),
    typeof secure === 'undefined' || secure === false
      ? '' : ';secure',
    sameSiteValue === null
      ? '' : ';SameSite=' + sameSiteValue
  ].join('');
};

const getSameSiteValue = (o: CookieOptions): string | null => {
  const { sameSite } = o;
  if (typeof sameSite === 'undefined') return null;
  if (['lax', 'strict'].indexOf(sameSite.toLowerCase()) >= 0) return sameSite;
  return null;
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
