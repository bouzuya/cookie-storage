import * as assert from 'power-assert';
import beater from 'beater';
import { formatCookie } from '../src/';

const { test } = beater();

test('format', () => {
  assert(formatCookie('', '', {}) === '');
  assert(formatCookie('a', '1', {}) === 'a=1');
  assert(formatCookie('b', '2', { path: '/' }) === 'b=2;path=/');
  assert(formatCookie('c', '3', { domain: 'example.com' })
    === 'c=3;domain=example.com');
  assert(formatCookie('d', '4', { expires: new Date(1427005235068) })
    === 'd=4;expires=Sun, 22 Mar 2015 06:20:35 GMT');
  assert(formatCookie('e', '5', { secure: true })
    === 'e=5;secure');
  assert(formatCookie('=', '=', {}) === '%3D=%3D');
});
