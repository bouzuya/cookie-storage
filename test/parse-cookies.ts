import assert from 'power-assert';
import { parseCookies } from '../src/';
import { Test, test } from './test-helpers';

const tests1: Test[] = [
  test('parse', () => {
    assert.deepEqual(parseCookies(''), {});
    assert.deepEqual(parseCookies('='), { '': '' });
    assert.deepEqual(parseCookies('a=1'), { a: '1' });
    assert.deepEqual(parseCookies('a=1;b=2'), { a: '1', b: '2' });
    assert.deepEqual(parseCookies('a=1;b=2;c=3'), { a: '1', b: '2', c: '3' });
    assert.deepEqual(parseCookies('%3D=%3D'), { '=': '=' });
  })
];

export { tests1 as tests };
