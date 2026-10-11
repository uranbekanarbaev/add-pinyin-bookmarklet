'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const script = fs.readFileSync(path.join(__dirname, '..', 'dist', 'add-pinyin.js'), 'utf8');

function page(html) {
  const dom = new JSDOM(`<!doctype html><body>${html}</body>`, { runScripts: 'outside-only' });
  return dom;
}
const run = dom => dom.window.eval(script);

test('adds ruby pinyin above Chinese characters', () => {
  const dom = page('<p id="a">你好，world</p>');
  run(dom);
  const rubies = [...dom.window.document.querySelectorAll('ruby')];
  assert.equal(rubies.length, 2);
  assert.deepEqual(rubies.map(r => r.querySelector('rt').textContent), ['nǐ', 'hǎo']);
  assert.match(dom.window.document.getElementById('a').textContent, /，world$/);
});

test('reads polyphonic characters by word', () => {
  const dom = page('<p>银行</p><p>行走</p>');
  run(dom);
  const reads = [...dom.window.document.querySelectorAll('ruby rt')].map(r => r.textContent);
  assert.deepEqual(reads, ['yín', 'háng', 'xíng', 'zǒu']);
});

test('second run removes the pinyin and restores the text', () => {
  const dom = page('<p id="a">你好</p>');
  run(dom);
  run(dom);
  assert.equal(dom.window.document.querySelectorAll('ruby').length, 0);
  assert.equal(dom.window.document.getElementById('a').textContent, '你好');
});

test('leaves scripts, styles and form fields alone', () => {
  const dom = page('<textarea>你好</textarea><code>你好</code><p>好</p>');
  run(dom);
  assert.equal(dom.window.document.querySelectorAll('ruby').length, 1);
});
