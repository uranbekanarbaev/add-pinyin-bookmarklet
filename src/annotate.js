/* Add pinyin above Chinese characters on the current page, using <ruby>.
 * Run it again to remove the pinyin. Needs a global PinyinPro (pinyin-pro) in front of it. */
(function () {
  'use strict';
  var FLAG = '__addPinyinBookmarklet';
  var MARK = 'data-add-pinyin';
  var HANZI = /[㐀-鿿豈-﫿]+/g;
  var SKIP = /^(SCRIPT|STYLE|NOSCRIPT|TEXTAREA|INPUT|SELECT|OPTION|CODE|PRE|RUBY|RT|RP|SVG|MATH|IFRAME)$/;
  var MAX_NODES = 5000;

  // second run: take the pinyin off again
  var existing = document.querySelectorAll('ruby[' + MARK + ']');
  if (window[FLAG] && existing.length) {
    existing.forEach(function (ruby) {
      var text = ruby.getAttribute(MARK);
      ruby.replaceWith(document.createTextNode(text));
    });
    document.body.normalize();
    window[FLAG] = false;
    return;
  }
  if (!window.PinyinPro || typeof window.PinyinPro.pinyin !== 'function') {
    alert('Add pinyin: the pinyin library did not load (this page may block external scripts).');
    return;
  }

  var pinyin = window.PinyinPro.pinyin;
  var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode: function (node) {
      if (!HANZI.test(node.nodeValue)) { HANZI.lastIndex = 0; return NodeFilter.FILTER_REJECT; }
      HANZI.lastIndex = 0;
      for (var p = node.parentNode; p && p !== document.body; p = p.parentNode) {
        if (p.nodeType === 1 && (SKIP.test(p.nodeName.toUpperCase()) || p.isContentEditable || p.hasAttribute(MARK))) return NodeFilter.FILTER_REJECT;
      }
      return NodeFilter.FILTER_ACCEPT;
    }
  });
  var nodes = [];
  while (walker.nextNode() && nodes.length < MAX_NODES) nodes.push(walker.currentNode);

  nodes.forEach(function (node) {
    var text = node.nodeValue;
    var fragment = document.createDocumentFragment();
    var last = 0;
    var match;
    HANZI.lastIndex = 0;
    while ((match = HANZI.exec(text))) {
      if (match.index > last) fragment.appendChild(document.createTextNode(text.slice(last, match.index)));
      var run = match[0];
      var readings = pinyin(run, { type: 'array' });   // read over the whole run: 行 gets its reading from the word
      var chars = Array.from(run);
      chars.forEach(function (ch, i) {
        var ruby = document.createElement('ruby');
        ruby.setAttribute(MARK, ch);
        ruby.appendChild(document.createTextNode(ch));
        var rt = document.createElement('rt');
        rt.textContent = readings[i] || '';
        rt.style.cssText = 'font-size:.55em;color:#0f7b6c;font-weight:600;';
        ruby.appendChild(rt);
        fragment.appendChild(ruby);
      });
      last = match.index + run.length;
    }
    if (last < text.length) fragment.appendChild(document.createTextNode(text.slice(last)));
    node.parentNode.replaceChild(fragment, node);
  });
  window[FLAG] = true;
})();
