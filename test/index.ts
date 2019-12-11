import { tests as cookieStorageTests } from './cookie-storage';
import { tests as cookieStorageIndexerTests } from './cookie-storage-indexer';
import { tests as formatCookieTests } from './format-cookie';
import { tests as parseCookiesTests } from './parse-cookies';
import { Test, run } from './test-helpers';

const tests1: Test[] = ([] as Test[])
  .concat(cookieStorageIndexerTests)
  .concat(cookieStorageTests)
  .concat(formatCookieTests)
  .concat(parseCookiesTests);

run(tests1).catch(() => process.exit(1));
