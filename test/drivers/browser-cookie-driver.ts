import assert from "power-assert";
import { Test, fixture, group, test } from "../test-helpers";
import { BrowserCookieDriver } from "../../src/drivers/browser-cookie-driver";

const dummyDocument = {
  after: (): void => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (global as any).document;
  },
  before: (): void => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).document = {};
  },
};

const tests1: Test[] = group("BrowserCookieDriver > ", [
  test(
    "getCookies",
    fixture(dummyDocument, () => {
      document.cookie = "a=1;b=2";
      const storage = new BrowserCookieDriver();
      assert(document.cookie === storage.getCookies());
    })
  ),
  test(
    "setCookies",
    fixture(dummyDocument, () => {
      const cookies = "a=1;b=2";
      const storage = new BrowserCookieDriver();
      storage.setCookies(cookies);
      assert(document.cookie === storage.getCookies());
      assert(document.cookie === cookies);
    })
  ),
]);

export { tests1 as tests };
