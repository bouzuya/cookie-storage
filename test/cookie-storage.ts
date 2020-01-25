import assert from 'power-assert';
import { CookieStorage } from '../src/cookie-storage';
import { Test, fixture, group, test } from './test-helpers';

const dummyDocument = {
  after: (): void => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (global as any).document;
  },
  before: (): void => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).document = {};
  }
};
const tests1: Test[] = group('CookieStorage > ', [
  test(
    'constructor',
    fixture(dummyDocument, () => {
      const storage0 = new CookieStorage();
      storage0.setItem('a', '1');
      assert(document.cookie === 'a=1');
      const storage1 = new CookieStorage({ path: '/' });
      storage1.setItem('b', '2');
      assert(document.cookie === 'b=2;path=/');
      const storage2 = new CookieStorage({ domain: 'example.com' });
      storage2.setItem('c', '3');
      assert(document.cookie === 'c=3;domain=example.com');
      const storage3 = new CookieStorage({ expires: new Date(1427005235068) });
      storage3.setItem('d', '4');
      assert(document.cookie === 'd=4;expires=Sun, 22 Mar 2015 06:20:35 GMT');
      const storage4 = new CookieStorage({ secure: true });
      storage4.setItem('e', '5');
      assert(document.cookie === 'e=5;secure');
      const storage7 = new CookieStorage({ sameSite: 'Lax' });
      storage7.setItem('e', '6');
      assert(document.cookie === 'e=6;SameSite=Lax');
      const storage8 = new CookieStorage({ sameSite: 'Strict' });
      storage8.setItem('e', '7');
      assert(document.cookie === 'e=7;SameSite=Strict');
    })
  ),

  test(
    'length',
    fixture(dummyDocument, () => {
      const storage = new CookieStorage();
      assert(storage.length === 0);
      document.cookie = 'a=1';
      assert(storage.length === 1);
      document.cookie = 'a=1;b=2';
      assert(storage.length === 2);
    })
  ),

  test(
    'key',
    fixture(dummyDocument, () => {
      document.cookie = 'a=1;b=2';
      const storage = new CookieStorage();
      assert(storage.key(0) === 'a');
      assert(storage.key(1) === 'b');
    })
  ),

  test(
    'getItem',
    fixture(dummyDocument, () => {
      document.cookie = 'a=1;b=2';
      const storage = new CookieStorage();
      assert(storage.getItem('a') === '1');
      assert(storage.getItem('b') === '2');
    })
  ),

  test(
    'setItem',
    fixture(dummyDocument, () => {
      document.cookie = 'a=1;b=2';
      // const storage = new CookieStorage();
      // storage.setItem('a', '1');
      // assert(document.cookie === 'a=1');
      // storage.setItem('b', '2', { path: '/' });
      // assert(document.cookie === 'b=2;path=/');
      // storage.setItem('c', '3', { domain: 'example.com' });
      // assert(document.cookie === 'c=3;domain=example.com');
      // storage.setItem('d', '4', { expires: new Date(1427005235068) });
      // assert(document.cookie === 'd=4;expires=Sun, 22 Mar 2015 06:20:35 GMT');
      // storage.setItem('e', '5', { secure: true });
      // assert(document.cookie === 'e=5;secure');
      // storage.setItem('e', '6', { sameSite: 'Strict' });
      // assert(document.cookie === 'e=7;SameSite=Strict');
      // storage.setItem('e', '7', { sameSite: 'Lax' });
      // assert(document.cookie === 'e=8;SameSite=Lax');
    })
  ),

  test(
    'removeItem',
    fixture(dummyDocument, () => {
      const storage = new CookieStorage();
      storage.removeItem('a');

      assert(document.cookie === 'a=;expires=Thu, 01 Jan 1970 00:00:00 GMT');

      storage.removeItem('b', { domain: 'example.com', path: '/' });

      assert(
        document.cookie ===
          'b=;path=/;domain=example.com;expires=Thu, 01 Jan 1970 00:00:00 GMT'
      );
    })
  ),

  test(
    'clear',
    fixture(dummyDocument, () => {
      document.cookie = 'a=1';
      const storage = new CookieStorage();
      storage.clear();
      assert(document.cookie === 'a=;expires=Thu, 01 Jan 1970 00:00:00 GMT');
    })
  )
]);

export { tests1 as tests };
