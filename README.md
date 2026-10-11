# Chinese and pinyin on any web page: add pinyin to Chinese text with a bookmarklet

A one-click **bookmarklet that adds pinyin above Chinese characters** on any web page, so you read **Chinese and pinyin** together. It uses standard HTML `<ruby>` text, reads whole words (so 行 is `háng` in 银行 and `xíng` in 行走), and removes the pinyin when you click it again.

**[Open the install page](docs/index.html)**: drag the "Add pinyin" button to your bookmarks bar. Need it on every page, with English meanings on hover? Use the [Chinese to Pinyin extension](https://chromewebstore.google.com/detail/chinese-to-pinyin/ljjmbedihaoacgeedgbkmakoibkekimn) or the [online converter](https://pinyin.hsk-tutor.com/).

## Install

1. Create a new bookmark and paste the one-line URL from [`docs/bookmarklet.txt`](docs/bookmarklet.txt) as its address.
2. Open a page with Chinese text and click the bookmark. Pinyin appears above the characters.
3. Click it again to remove the pinyin.

The bookmark loads `dist/add-pinyin.js` (459 KB, includes [pinyin-pro](https://github.com/zh-lx/pinyin-pro)) from jsDelivr. To host it yourself, run `REPO=<you>/<repo> npm run build` and change the URL.

## How it works

- Finds text nodes with Chinese characters and wraps each character in `<ruby>` with the reading in `<rt>`.
- Skips `script`, `style`, form fields, code blocks, editable regions and existing ruby.
- Handles up to 5,000 text nodes per click so that huge pages do not freeze.

## Limits

- Some sites block external scripts with a Content Security Policy, and the bookmarklet cannot run there.
- Pages that draw text inside images or canvas are not supported.
- Readings are automatic: names and rare words can get an unexpected reading.

## FAQ

**How do I add pinyin to Chinese text on a web page?** Click the bookmarklet; pinyin is added above every Chinese character.

**How do I remove the pinyin?** Click the bookmark again.

**Does it work for traditional characters?** Yes.

**Why does nothing happen on some sites?** The site's Content Security Policy may block loading the script. The browser extension does not have this limitation.

**Is there a version with English meanings?** Yes, the [Chinese to Pinyin extension](https://chromewebstore.google.com/detail/chinese-to-pinyin/ljjmbedihaoacgeedgbkmakoibkekimn) shows an English meaning on hover.

## Develop

```bash
npm install
npm run build
npm test
```

## License

MIT. See [NOTICE.md](NOTICE.md).
