import * as assert from 'power-assert';
import beater from 'beater';
import { CookieStorage } from '../src/cookie-storage';

const { test, fixture } = beater();

const dummyDocument = {
  before: () => {
    (<any>global).document = {};
  },
  after: () => {
    delete (<any>global).document;
  }
};
const category = 'CookieStorage > ';

test(category + 'constructor', fixture(dummyDocument, () => {
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
}));

test(category + 'length', fixture(dummyDocument, () => {
  const storage = new CookieStorage();
  assert(storage.length === 0);
  document.cookie = 'a=1';
  assert(storage.length === 1);
  document.cookie = 'a=1;b=2';
  assert(storage.length === 2);
}));

test(category + 'key', fixture(dummyDocument, () => {
  document.cookie = 'a=1;b=2';
  const storage = new CookieStorage();
  assert(storage.key(0) === 'a');
  assert(storage.key(1) === 'b');
}));

test(category + 'getItem', fixture(dummyDocument, () => {
  document.cookie = 'a=1;b=2';
  const storage = new CookieStorage();
  assert(storage.getItem('a') === '1');
  assert(storage.getItem('b') === '2');
}));

test(category + 'setItem', fixture(dummyDocument, () => {
  document.cookie = 'a=1;b=2';
  const storage = new CookieStorage();
  storage.setItem('a', '1');
  assert(document.cookie === 'a=1');
  storage.setItem('b', '2', { path: '/' });
  assert(document.cookie === 'b=2;path=/');
  storage.setItem('c', '3', { domain: 'example.com' });
  assert(document.cookie === 'c=3;domain=example.com');
  storage.setItem('d', '4', { expires: new Date(1427005235068) });
  assert(document.cookie === 'd=4;expires=Sun, 22 Mar 2015 06:20:35 GMT');
  storage.setItem('e', '5', { secure: true });
  assert(document.cookie === 'e=5;secure');
}));

test(category + 'removeItem', fixture(dummyDocument, () => {
  const storage = new CookieStorage();
  storage.removeItem('a');
  assert(document.cookie === 'a=;expires=Thu, 01 Jan 1970 00:00:00 GMT');
}));

test(category + 'clear', fixture(dummyDocument, () => {
  document.cookie = 'a=1';
  const storage = new CookieStorage();
  storage.clear();
  assert(document.cookie === 'a=;expires=Thu, 01 Jan 1970 00:00:00 GMT');
}));
