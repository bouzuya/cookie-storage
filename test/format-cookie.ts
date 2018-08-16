import * as assert from 'power-assert';
import { Test, test } from 'beater';
import { formatCookie } from '../src/';

const tests1: Test[] = [
  test('format', () => {
    assert(formatCookie('', '', {}) === '=');
    assert(formatCookie('a', '1', {}) === 'a=1');
    assert(formatCookie('b', '2', { path: '/' }) === 'b=2;path=/');
    assert(formatCookie('c', '3', { domain: 'example.com' })
      === 'c=3;domain=example.com');
    assert(formatCookie('d', '4', { expires: new Date(1427005235068) })
      === 'd=4;expires=Sun, 22 Mar 2015 06:20:35 GMT');
    assert(formatCookie('e', '5', { secure: true })
      === 'e=5;secure');
    assert(formatCookie('e', '6', { sameSite: true })
      === 'e=6;SameSite=Strict');
    assert(formatCookie('e', '6', { sameSite: "Strict" })
      === 'e=6;SameSite=Strict');
    assert(formatCookie('e', '6', { sameSite: "Lax" })
      === 'e=6;SameSite=Lax');
    assert(formatCookie('e', '6', { sameSite: false })
      === 'e=6');
    assert(formatCookie('=', '=', {}) === '%3D=%3D');
  })
];

export { tests1 as tests };
