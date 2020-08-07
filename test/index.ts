import { tests as cookieStorageTests } from "./cookie-storage";
import { tests as cookieStorageIndexerTests } from "./cookie-storage-indexer";
import { tests as formatCookieTests } from "./format-cookie";
import { tests as parseCookiesTests } from "./parse-cookies";
import { Test, group, run } from "./test-helpers";

const tests1: Test[] = group("", [
  ...cookieStorageIndexerTests,
  ...cookieStorageTests,
  ...formatCookieTests,
  ...parseCookiesTests,
]);

run(tests1).catch(() => process.exit(1));
