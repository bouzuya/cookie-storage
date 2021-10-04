export interface CookieDriver {
  setCookies(cookies: string): void;
  getCookies(): string;
}
