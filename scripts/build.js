#!/usr/bin/env node
/* dist/add-pinyin.js = vendor/pinyin-pro.min.js + src/annotate.js; docs/bookmarklet.txt = the javascript: URL. */
'use strict';
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const lib = fs.readFileSync(path.join(root, 'vendor', 'pinyin-pro.min.js'), 'utf8');
const code = fs.readFileSync(path.join(root, 'src', 'annotate.js'), 'utf8');
fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
fs.writeFileSync(path.join(root, 'dist', 'add-pinyin.js'),
  `/* add-pinyin-bookmarklet (MIT) with pinyin-pro (MIT, https://github.com/zh-lx/pinyin-pro) */\n${lib}\n;window.PinyinPro=window.PinyinPro||PinyinPro;\n${code}\n`);
const REPO = process.env.REPO || 'uranbekanarbaev/add-pinyin-bookmarklet';
const loader = `javascript:(function(){var s=document.createElement('script');s.src='https://cdn.jsdelivr.net/gh/${REPO}@main/dist/add-pinyin.js?'+Date.now();document.head.appendChild(s)})();`;
fs.writeFileSync(path.join(root, 'docs', 'bookmarklet.txt'), loader + '\n');
const demo = fs.readFileSync(path.join(root, 'docs', 'index.template.html'), 'utf8').replace('%%BOOKMARKLET%%', loader.replace(/&/g, '&amp;').replace(/"/g, '&quot;'));
fs.writeFileSync(path.join(root, 'docs', 'index.html'), demo);
console.log('dist/add-pinyin.js', (fs.statSync(path.join(root, 'dist', 'add-pinyin.js')).size / 1024).toFixed(0) + ' KB');
