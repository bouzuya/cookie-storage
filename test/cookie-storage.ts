import * as assert from 'power-assert';
import beater from 'beater';
import { CookieStorage, ProxyIsSupported } from '../src/cookie-storage';

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

//Test index-related features. These features require that the runtime support the 'Proxy' object and won't be present if the runtime does not
if (ProxyIsSupported()) {

  //proxy 'get' tests
  //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/get

  test(category + 'getByIndexNumber', fixture(dummyDocument, () => {
    document.cookie = '1=a;2=b';
    const storage = new CookieStorage();
    assert(storage[1] === 'a');
    assert(storage[2] === 'b');
  }));

  test(category + 'getByIndex', fixture(dummyDocument, () => {
    document.cookie = 'a=1;b=2';
    const storage = new CookieStorage();
    assert(storage['a'] === '1');
    assert(storage['b'] === '2');
  }));

  test(category + 'getInherited', fixture(dummyDocument, () => {
    document.cookie = 'a=1;b=2';
    const storage = new CookieStorage();
    assert(Object.create(storage)['a'] === '1');
    assert(Object.create(storage)['b'] === '2');
  }));

  test(category + 'getReflect', fixture(dummyDocument, () => {
    document.cookie = 'a=1;b=2';
    const storage = new CookieStorage();
    assert(Reflect.get(storage, 'a') === '1');
    assert(Reflect.get(storage, 'b') === '2');
  }));

  //proxy 'set' tests
  //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/set

  test(category + 'setByIndex', fixture(dummyDocument, () => {
    document.cookie = '';
    const storage = new CookieStorage();
    storage['a'] = '1';
    assert(document.cookie === 'a=1');
  }));

  test(category + 'setByIndexNumber', fixture(dummyDocument, () => {
    document.cookie = '';
    const storage = new CookieStorage();
    storage[1] = 'a';
    assert(document.cookie === '1=a');
  }));

  test(category + 'setInherited', fixture(dummyDocument, () => {
    document.cookie = '';
    const storage = new CookieStorage();
    Object.create(storage)['a'] = '1';
    assert(document.cookie === 'a=1');
  }));

  test(category + 'setReflect', fixture(dummyDocument, () => {
    document.cookie = '';
    const storage = new CookieStorage();
    Reflect.set(storage, 'a', '1');
    assert(document.cookie === 'a=1');
  }));

  //proxy 'has' tests
  //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/has

  test(category + 'inOperator', fixture(dummyDocument, () => {
    document.cookie = 'a=1';
    const storage = new CookieStorage();
    assert('a' in storage === true);
  }));

  test(category + 'inOperatorWithBuiltinFunction', fixture(dummyDocument, () => {
    const storage = new CookieStorage();
    assert('getItem' in storage === true);
  }));

  test(category + 'inOperatorInherited', fixture(dummyDocument, () => {
    document.cookie = 'a=1';
    const storage = new CookieStorage();
    assert('a' in Object.create(storage) === true);
  }));

  test(category + 'reflectHas', fixture(dummyDocument, () => {
    document.cookie = 'a=1';
    const storage = new CookieStorage();
    assert(Reflect.has(storage, 'a') === true);
  }));

  //proxy 'delete' tests
  //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/deleteProperty

  test(category + 'deleteOperator', fixture(dummyDocument, () => {
    const storage = new CookieStorage();
    delete storage['a'];
    assert(storage['a'] === undefined);
    assert(document.cookie === 'a=;expires=Thu, 01 Jan 1970 00:00:00 GMT');
  }));

  test(category + 'deleteReflect', fixture(dummyDocument, () => {
    const storage = new CookieStorage();
    Reflect.deleteProperty(storage, 'a');
    assert(storage['a'] === undefined);
    assert(document.cookie === 'a=;expires=Thu, 01 Jan 1970 00:00:00 GMT');
  }));

  //proxy 'defineProperty' tests
  //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/defineProperty

  test(category + 'defineProperty', fixture(dummyDocument, () => {
    document.cookie = '';
    const storage = new CookieStorage();
    Object.defineProperty(storage, 'a', { value: '1' });
    assert(document.cookie === 'a=1');
  }));

  test(category + 'definePropertyReflect', fixture(dummyDocument, () => {
    document.cookie = '';
    const storage = new CookieStorage();
    Reflect.defineProperty(storage, 'a', { value: '1' });
    assert(document.cookie === 'a=1');
  }));

  //proxy 'ownKeys' tests
  //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/ownKeys

  test(category + 'getOwnPropertyNames', fixture(dummyDocument, () => {
    document.cookie = 'a=1;b=2';
    const storage = new CookieStorage();
    const propertyNames = Object.getOwnPropertyNames(storage);
    assert(propertyNames.length === 2);
    assert(propertyNames[0] === 'a');
    assert(propertyNames[1] === 'b');
  }));

  test(category + 'objectKeys', fixture(dummyDocument, () => {
    document.cookie = 'a=1;b=2';
    const storage = new CookieStorage();
    const keys = Object.keys(storage);
    assert(keys.length === 2);
    assert(keys[0] === 'a');
    assert(keys[1] === 'b');
  }));

  test(category + 'reflectOwnKeys', fixture(dummyDocument, () => {
    document.cookie = 'a=1;b=2';
    const storage = new CookieStorage();
    const keys = Reflect.ownKeys(storage);
    assert(keys.length === 2);
    assert(keys[0] === 'a');
    assert(keys[1] === 'b');
  }));

  //proxy 'getOwnPropertyDescriptor' tests
  //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/getOwnPropertyDescriptor

  test(category + 'getOwnPropertyDescriptorOnProperty', fixture(dummyDocument, () => {
    document.cookie = 'a=1';
    const storage = new CookieStorage();
    const descriptor = Object.getOwnPropertyDescriptor(storage, 'a');
    assert(descriptor.value === '1');
    assert(descriptor.writable === true);
    assert(descriptor.enumerable === true);
    assert(descriptor.configurable === true);
  }));

  test(category + 'getOwnPropertyDescriptorOnFunction', fixture(dummyDocument, () => {
    const storage = new CookieStorage();
    const descriptor = Object.getOwnPropertyDescriptor(storage, 'getItem');
    assert(descriptor === undefined);
  }));

  test(category + 'getOwnPropertyDescriptorReflect', fixture(dummyDocument, () => {
    document.cookie = 'a=1';
    const storage = new CookieStorage();
    const descriptor = Reflect.getOwnPropertyDescriptor(storage, 'a');
    assert(descriptor.value === '1');
    assert(descriptor.writable === true);
    assert(descriptor.enumerable === true);
    assert(descriptor.configurable === true);
  }));

  //proxy 'preventExtensions' tests
  //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/preventExtensions

  test(category + 'preventExtensions', fixture(dummyDocument, () => {
    const storage = new CookieStorage();
    Object.preventExtensions(storage);
    assert(Object.isExtensible(storage) === false);
  }));

  test(category + 'preventExtensionsDoesntBlockIndexSetting', fixture(dummyDocument, () => {
    document.cookie = '';
    const storage = new CookieStorage();
    Object.preventExtensions(storage);
    storage['a'] = '1';
    assert(document.cookie === 'a=1');
  }));

  test(category + 'preventExtensionsBlocksDefineProperty', fixture(dummyDocument, () => {
    const storage = new CookieStorage();
    Object.preventExtensions(storage);
    let expectedError = new Error();
    try {
      Object.defineProperty(storage, 'a', { value: '1' });
    }
    catch (e) {
      expectedError = e;
    }
    assert(expectedError.name === 'TypeError');
    assert(expectedError.message === 'Can\'t add property a, object is not extensible');
  }));

  //proxy enumeration test

  test(category + 'getOwnPropertyNames', fixture(dummyDocument, () => {
    document.cookie = 'a=1;b=2';
    const testnames = ['a', 'b'];
    const storage = new CookieStorage();
    for (var name in storage) {
      assert(testnames.indexOf(name) > -1);
    }
  }));

}
