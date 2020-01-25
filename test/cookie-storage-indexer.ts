import assert from 'power-assert';
import { CookieStorage } from '../src/cookie-storage';
import { Test, fixture, group, test as originalTest } from './test-helpers';

// Test index-related features. These features require that the runtime support
// the 'Proxy' object and won't be present if the runtime does not
const test =
  typeof Proxy === 'undefined'
    ? (_n: string, _f: Test): Test => originalTest('', () => void 0)
    : originalTest;

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

const tests1: Test[] = group('CookieStorage (indexer) > ', [
  // proxy 'get' tests
  // tslint:disable
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/get
  // tslint:enable

  test(
    'getByIndexNumber',
    fixture(dummyDocument, () => {
      document.cookie = '1=a;2=b';
      const storage = new CookieStorage();
      assert(storage[1] === 'a'); // The index is the key in Storage#getItem(), is not the index in Storage#key(index).
      assert(storage[2] === 'b');
      assert(storage[3] === undefined); // return value is *not* null
    })
  ),

  test(
    'getByIndex',
    fixture(dummyDocument, () => {
      document.cookie = 'a=1;b=2';
      const storage = new CookieStorage();
      assert(storage['a'] === '1');
      assert(storage['b'] === '2');
      assert(storage['c'] === undefined);
    })
  ),

  test(
    'getInherited',
    fixture(dummyDocument, () => {
      document.cookie = 'a=1;b=2';
      const storage = new CookieStorage();
      assert(Object.create(storage)['a'] === '1');
      assert(Object.create(storage)['b'] === '2');
      assert(Object.create(storage)['c'] === undefined);
    })
  ),

  test(
    'getReflect',
    fixture(dummyDocument, () => {
      document.cookie = 'a=1;b=2';
      const storage = new CookieStorage();
      assert(Reflect.get(storage, 'a') === '1');
      assert(Reflect.get(storage, 'b') === '2');
      assert(Reflect.get(storage, 'c') === undefined);
    })
  ),

  // proxy 'set' tests
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/set

  test(
    'setByIndex',
    fixture(dummyDocument, () => {
      document.cookie = '';
      const storage = new CookieStorage();
      storage['a'] = '1';
      assert(document.cookie === 'a=1');
    })
  ),

  test(
    'setByIndexNumber',
    fixture(dummyDocument, () => {
      document.cookie = '';
      const storage = new CookieStorage();
      storage[1] = 'a';
      assert(document.cookie === '1=a');
    })
  ),

  test(
    'setInherited',
    fixture(dummyDocument, () => {
      document.cookie = '';
      const storage = new CookieStorage();
      Object.create(storage)['a'] = '1';
      assert(document.cookie === 'a=1');
    })
  ),

  test(
    'setReflect',
    fixture(dummyDocument, () => {
      document.cookie = '';
      const storage = new CookieStorage();
      Reflect.set(storage, 'a', '1');
      assert(document.cookie === 'a=1');
    })
  ),

  // proxy 'has' tests
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/has

  test(
    'inOperator',
    fixture(dummyDocument, () => {
      document.cookie = 'a=1';
      const storage = new CookieStorage();
      assert('a' in storage === true);
    })
  ),

  test(
    'inOperatorWithBuiltinFunction',
    fixture(dummyDocument, () => {
      const storage = new CookieStorage();
      assert('getItem' in storage === true);
    })
  ),

  test(
    'inOperatorInherited',
    fixture(dummyDocument, () => {
      document.cookie = 'a=1';
      const storage = new CookieStorage();
      assert('a' in Object.create(storage) === true);
    })
  ),

  test(
    'reflectHas',
    fixture(dummyDocument, () => {
      document.cookie = 'a=1';
      const storage = new CookieStorage();
      assert(Reflect.has(storage, 'a') === true);
    })
  ),

  // proxy 'delete' tests
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/deleteProperty

  test(
    'deleteOperator',
    fixture(dummyDocument, () => {
      const storage = new CookieStorage();
      delete storage['a'];
      assert(document.cookie === 'a=;expires=Thu, 01 Jan 1970 00:00:00 GMT');
    })
  ),

  test(
    'deleteReflect',
    fixture(dummyDocument, () => {
      const storage = new CookieStorage();
      Reflect.deleteProperty(storage, 'a');
      assert(document.cookie === 'a=;expires=Thu, 01 Jan 1970 00:00:00 GMT');
    })
  ),

  // proxy 'defineProperty' tests
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/defineProperty

  test(
    'defineProperty',
    fixture(dummyDocument, () => {
      document.cookie = '';
      const storage = new CookieStorage();
      Object.defineProperty(storage, 'a', { value: '1' });
      assert(document.cookie === 'a=1');
    })
  ),

  test(
    'definePropertyReflect',
    fixture(dummyDocument, () => {
      document.cookie = '';
      const storage = new CookieStorage();
      Reflect.defineProperty(storage, 'a', { value: '1' });
      assert(document.cookie === 'a=1');
    })
  ),

  // proxy 'ownKeys' tests
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/ownKeys

  test(
    'getOwnPropertyNames',
    fixture(dummyDocument, () => {
      document.cookie = 'a=1;b=2';
      const storage = new CookieStorage();
      const propertyNames = Object.getOwnPropertyNames(storage);
      assert(propertyNames.length === 2);
      assert(propertyNames[0] === 'a');
      assert(propertyNames[1] === 'b');
    })
  ),

  test(
    'objectKeys',
    fixture(dummyDocument, () => {
      document.cookie = 'a=1;b=2';
      const storage = new CookieStorage();
      const keys = Object.keys(storage);
      assert(keys.length === 2);
      assert(keys[0] === 'a');
      assert(keys[1] === 'b');
    })
  ),

  test(
    'reflectOwnKeys',
    fixture(dummyDocument, () => {
      document.cookie = 'a=1;b=2';
      const storage = new CookieStorage();
      const keys = Reflect.ownKeys(storage);
      assert(keys.length === 2);
      assert(keys[0] === 'a');
      assert(keys[1] === 'b');
    })
  ),

  // proxy 'getOwnPropertyDescriptor' tests
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/getOwnPropertyDescriptor

  test(
    'getOwnPropertyDescriptorOnProperty',
    fixture(dummyDocument, () => {
      document.cookie = 'a=1';
      const storage = new CookieStorage();
      const descriptor = Object.getOwnPropertyDescriptor(storage, 'a');
      if (typeof descriptor === 'undefined') throw new Error();
      assert(descriptor.value === '1');
      assert(descriptor.writable === true);
      assert(descriptor.enumerable === true);
      assert(descriptor.configurable === true);
    })
  ),

  test(
    'getOwnPropertyDescriptorOnFunction',
    fixture(dummyDocument, () => {
      const storage = new CookieStorage();
      const descriptor = Object.getOwnPropertyDescriptor(storage, 'getItem');
      assert(descriptor === undefined);
    })
  ),

  test(
    'getOwnPropertyDescriptorReflect',
    fixture(dummyDocument, () => {
      document.cookie = 'a=1';
      const storage = new CookieStorage();
      const descriptor = Reflect.getOwnPropertyDescriptor(storage, 'a');
      if (typeof descriptor === 'undefined') throw new Error();
      assert(descriptor.value === '1');
      assert(descriptor.writable === true);
      assert(descriptor.enumerable === true);
      assert(descriptor.configurable === true);
    })
  ),

  // proxy 'preventExtensions' tests
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/preventExtensions

  test(
    'preventExtensions',
    fixture(dummyDocument, () => {
      const storage = new CookieStorage();
      assert.deepStrictEqual(Object.isExtensible(storage), true);
      assert.throws(
        () => Object.preventExtensions(storage),
        /^TypeError: can't prevent extensions on this proxy object$/
      );
      assert.deepStrictEqual(Object.isExtensible(storage), true);
    })
  ),

  test(
    'preventExtensionsDoesntBlockIndexSetting',
    fixture(dummyDocument, () => {
      document.cookie = '';
      const storage = new CookieStorage();
      assert.throws(
        () => Object.preventExtensions(storage),
        /^TypeError: can't prevent extensions on this proxy object$/
      );
      storage['a'] = '1';
      assert(document.cookie === 'a=1');
    })
  ),

  test(
    'preventExtensionsBlocksDefineProperty',
    fixture(dummyDocument, () => {
      const storage = new CookieStorage();
      assert.throws(
        () => Object.preventExtensions(storage),
        /^TypeError: can't prevent extensions on this proxy object$/
      );
      Object.defineProperty(storage, 'a', { value: '1' });
      assert(storage['a'] === '1');
    })
  ),

  // proxy enumeration test

  test(
    'getOwnPropertyNames',
    fixture(dummyDocument, () => {
      document.cookie = 'a=1;b=2';
      const testnames = ['a', 'b'];
      const storage = new CookieStorage();
      for (const name in storage) assert(testnames.indexOf(name) > -1);
    })
  )
]);

export { tests1 as tests };
