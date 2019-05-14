/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js");

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "404.html",
    "revision": "748e54359bb3955e4129f3f28223747d"
  },
  {
    "url": "assets/css/0.styles.3abe3ea5.css",
    "revision": "1362fe2d8d761a9135ef9140313aba07"
  },
  {
    "url": "assets/img/404.9ed13bbe.svg",
    "revision": "9ed13bbe02debb8e23db19a4e6603c2e"
  },
  {
    "url": "assets/img/search.31b3b01d.svg",
    "revision": "31b3b01dc8c29f5bc57b98a8256c9951"
  },
  {
    "url": "assets/js/10.cf26e567.js",
    "revision": "3c8b7d4e01cea9e7970c24b383746967"
  },
  {
    "url": "assets/js/11.81a057cf.js",
    "revision": "e985d7766596973b3cfee940b03b533b"
  },
  {
    "url": "assets/js/12.234883c5.js",
    "revision": "7f78dba3246bd5d69ef8b8163b4e5c5a"
  },
  {
    "url": "assets/js/13.4f3209c2.js",
    "revision": "de849ddbb25996b71b85b24eb275dafa"
  },
  {
    "url": "assets/js/14.b90d61b8.js",
    "revision": "851347acb17a5a39efd4108a7beda74a"
  },
  {
    "url": "assets/js/15.538b2a3f.js",
    "revision": "dd57ded82e436873489f828b2c029b81"
  },
  {
    "url": "assets/js/16.252c9d07.js",
    "revision": "dee090e8b7ff9f5c92d8689f5e95cf4f"
  },
  {
    "url": "assets/js/17.8051e744.js",
    "revision": "81dddbdeaa53ef0f12d60e9a3665bb3e"
  },
  {
    "url": "assets/js/18.49242d64.js",
    "revision": "d179087c746872f5962d12810fca9c93"
  },
  {
    "url": "assets/js/19.407e80fc.js",
    "revision": "3878d579516e5e14578eca7b8e5b3f98"
  },
  {
    "url": "assets/js/20.ea8b288d.js",
    "revision": "7caf793f0ac621fae3a8b2a4999bc033"
  },
  {
    "url": "assets/js/21.658aa68b.js",
    "revision": "753c270906bdc5eecdb073e24a947031"
  },
  {
    "url": "assets/js/22.c1eb96c4.js",
    "revision": "34155ea2945e285c2755ef8be6cf68fa"
  },
  {
    "url": "assets/js/23.bbc9701b.js",
    "revision": "0f521825fa212a12cbff32a9e34c3445"
  },
  {
    "url": "assets/js/24.036bd536.js",
    "revision": "c956f96c1069f0e04f0a611ea2dd6c0c"
  },
  {
    "url": "assets/js/25.5114d94b.js",
    "revision": "912b30894021e512b550acabf2662066"
  },
  {
    "url": "assets/js/26.94696855.js",
    "revision": "b8f803e1fdfe35e15313452cfa1339e6"
  },
  {
    "url": "assets/js/27.36773fdc.js",
    "revision": "32e820d9884006afcbc687222331ae09"
  },
  {
    "url": "assets/js/28.1d09d94f.js",
    "revision": "14c60fc3922d6ae001ff36762eb606a3"
  },
  {
    "url": "assets/js/29.abca75f2.js",
    "revision": "3b7fa6bb7cd047cde3ed2ff6f6ceb28f"
  },
  {
    "url": "assets/js/3.88c688c5.js",
    "revision": "ba5ea789ed483977de9eadfae0017740"
  },
  {
    "url": "assets/js/4.f5cf8a95.js",
    "revision": "d45f5d4ddb2aae6a31f2ee3ed1a3d96a"
  },
  {
    "url": "assets/js/5.ee3e54b7.js",
    "revision": "805ce73ef16d1fd920b7b2646979d0ee"
  },
  {
    "url": "assets/js/6.2bde1776.js",
    "revision": "ef02966d1cc13c6c7646a56d86d42e46"
  },
  {
    "url": "assets/js/7.dcf80be0.js",
    "revision": "17412e75a7d373ae97f1ff3126a65d67"
  },
  {
    "url": "assets/js/8.71bf112f.js",
    "revision": "3d09f4ea7fe629db08cfc34dd9132794"
  },
  {
    "url": "assets/js/9.6b415287.js",
    "revision": "162c1ab17bb094d52ca4fac40cc58d1d"
  },
  {
    "url": "assets/js/app.e1509a58.js",
    "revision": "cd8c7d2af428ee97745a94f50066864b"
  },
  {
    "url": "assets/js/vendors~flowchart.4e2e93ef.js",
    "revision": "5c9f0fb5ada377a6f0eb468b423e3e37"
  },
  {
    "url": "category/index.html",
    "revision": "f539c7244f3c19ccb8f83c314f67c970"
  },
  {
    "url": "img/avatar.png",
    "revision": "e63c65faf873519b45dcc4df4a8872dc"
  },
  {
    "url": "index.html",
    "revision": "c657e95d79f2d1122e628d37adb7a19c"
  },
  {
    "url": "life/about.html",
    "revision": "ddb165f2edab910835fce6fd91c3d509"
  },
  {
    "url": "tag/index.html",
    "revision": "65b372ed66da3a37b9ed84fc713e68e5"
  },
  {
    "url": "tag/js.html",
    "revision": "382777282fd537f439aa75430b8d768f"
  },
  {
    "url": "tag/react.html",
    "revision": "77c903f82ff168b6b25b977b94988c74"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
addEventListener('message', event => {
  const replyPort = event.ports[0]
  const message = event.data
  if (replyPort && message && message.type === 'skip-waiting') {
    event.waitUntil(
      self.skipWaiting().then(
        () => replyPort.postMessage({ error: null }),
        error => replyPort.postMessage({ error })
      )
    )
  }
})
