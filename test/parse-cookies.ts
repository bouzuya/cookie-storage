import * as assert from 'power-assert';
import beater from 'beater';
import { parseCookies } from '../src/';

const { test } = beater();

test('parse', () => {
  assert.deepEqual(parseCookies(''), {});
  assert.deepEqual(parseCookies('a=1'), { a: '1' });
  assert.deepEqual(parseCookies('a=1;b=2'), { a: '1', b: '2' });
  assert.deepEqual(parseCookies('a=1;b=2;c=3'), { a: '1', b: '2', c: '3' });
  assert.deepEqual(parseCookies('%3D=%3D'), { '=': '=' });
});
