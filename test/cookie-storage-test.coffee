assert = require 'power-assert'
{CookieStorage} = require '../dist/cookie-storage'

describe 'CookieStorage', ->
  beforeEach ->
    @storage = new CookieStorage()
    global.document = {}

  afterEach ->
    delete global.document

  describe '#length', ->
    it 'should be 0', ->
      assert @storage.length is 0

  describe '#key', ->
    beforeEach ->
      document.cookie = 'a=1;b=2'

    it 'should be a function', ->
      assert typeof @storage.key is 'function'

    it 'works', ->
      assert @storage.key(0) is 'a'
      assert @storage.key(1) is 'b'

  describe '#getItem', ->
    beforeEach ->
      document.cookie = 'a=1;b=2'

    it 'should be a function', ->
      assert typeof @storage.getItem is 'function'

    it 'works', ->
      assert @storage.getItem('a') is '1'
      assert @storage.getItem('b') is '2'

  describe '#setItem', ->
    it 'should be a function', ->
      assert typeof @storage.setItem is 'function'

  describe '#removeItem', ->
    it 'should be a function', ->
      assert typeof @storage.removeItem is 'function'

  describe '#clear', ->
    it 'should be a function', ->
      assert typeof @storage.clear is 'function'
