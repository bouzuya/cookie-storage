import { CookieDriver } from "./cookie-driver";

export class BrowserCookieDriver implements CookieDriver {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  setCookies(cookies: string) {
    document.cookie = cookies;
  }
  getCookies(): string {
    return typeof document === "undefined"
      ? ""
      : typeof document.cookie === "undefined"
      ? ""
      : document.cookie;
  }
}
