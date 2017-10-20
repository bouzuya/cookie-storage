import { Test, run } from 'beater';

import { tests as cookieStorageIndexerTests } from './cookie-storage-indexer';
import { tests as cookieStorageTests } from './cookie-storage';
import { tests as formatCookieTests } from './format-cookie';
import { tests as parseCookiesTests } from './parse-cookies';

const tests1: Test[] = ([] as Test[])
  .concat(cookieStorageIndexerTests)
  .concat(cookieStorageTests)
  .concat(formatCookieTests)
  .concat(parseCookiesTests);

run(tests1).catch(() => process.exit(1));
