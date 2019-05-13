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
    "revision": "af3599d8134c8ba83900c55b79814031"
  },
  {
    "url": "assets/css/0.styles.1fb3dfe9.css",
    "revision": "39bf92ff6d2438d6afb403bbc80ab8b9"
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
    "url": "assets/js/12.290a6d42.js",
    "revision": "559bd765a27aa6cace7b00fd3e822a73"
  },
  {
    "url": "assets/js/13.ae6aab21.js",
    "revision": "7a6e7b191ea8364c191cfc3267501eee"
  },
  {
    "url": "assets/js/14.b90d61b8.js",
    "revision": "851347acb17a5a39efd4108a7beda74a"
  },
  {
    "url": "assets/js/15.007d55fc.js",
    "revision": "cef60dce8bcee5b3e998c535784a0c9e"
  },
  {
    "url": "assets/js/16.b0f0c15d.js",
    "revision": "856fab86458a8deef9fdca3a55d6ceb3"
  },
  {
    "url": "assets/js/17.31d8cb11.js",
    "revision": "e1e4bc5e6755f3f4b13680243d7b28c5"
  },
  {
    "url": "assets/js/18.849ccb88.js",
    "revision": "fd1d867b39f82b46f4cf8a1c58af2674"
  },
  {
    "url": "assets/js/19.b46591b2.js",
    "revision": "27f02c1aa39e39f879480bb436840a0b"
  },
  {
    "url": "assets/js/20.dcc5f94f.js",
    "revision": "86f54b5d04b5ea378a94a1b5301a9264"
  },
  {
    "url": "assets/js/21.71ee82bf.js",
    "revision": "258aa97f8a99ba0d9db009ace641358e"
  },
  {
    "url": "assets/js/22.8ec796e9.js",
    "revision": "7b4c23057fff396974198ad897d90ede"
  },
  {
    "url": "assets/js/23.a5be2b67.js",
    "revision": "90906fc8010668b9dda39dbe6058fac9"
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
    "url": "assets/js/26.d7520d48.js",
    "revision": "2f63a058f4ed2a18571a69651ee882df"
  },
  {
    "url": "assets/js/27.fcbe9940.js",
    "revision": "3ed32aa876e625ca42652e91e015fc9b"
  },
  {
    "url": "assets/js/28.7dd0c280.js",
    "revision": "6b29678af24b388ab470507e956e749e"
  },
  {
    "url": "assets/js/29.563a7da0.js",
    "revision": "bc7244beb028f14f5bde07b22fbb4f20"
  },
  {
    "url": "assets/js/3.d32d5fd0.js",
    "revision": "d1aa33655d369aae38534c148f02238c"
  },
  {
    "url": "assets/js/30.95a5d43c.js",
    "revision": "1c40c194d652cc45d73ef0f93bd201cb"
  },
  {
    "url": "assets/js/4.ea2adfd5.js",
    "revision": "a8c3bd92f58e9c707f0c440540175d18"
  },
  {
    "url": "assets/js/5.33a0817b.js",
    "revision": "1080c7e57bc366aa07184cf7ea24e81e"
  },
  {
    "url": "assets/js/6.adbcc1b4.js",
    "revision": "248a7621b7932fb5549eda5a5f9d6a51"
  },
  {
    "url": "assets/js/7.008020a5.js",
    "revision": "971d832fd27ff488c9184c9fac449cd9"
  },
  {
    "url": "assets/js/8.06e7662e.js",
    "revision": "68817de545caa263d965fdb24981df6e"
  },
  {
    "url": "assets/js/9.c65e027c.js",
    "revision": "e1b698fd578602502256cbfb7ba1f5de"
  },
  {
    "url": "assets/js/app.11fce459.js",
    "revision": "88cdd4ae89c9a4069bb22a11784269f4"
  },
  {
    "url": "assets/js/vendors~flowchart.4e2e93ef.js",
    "revision": "5c9f0fb5ada377a6f0eb468b423e3e37"
  },
  {
    "url": "category/index.html",
    "revision": "d8944ec63f393df797be75bc5d2cc3d4"
  },
  {
    "url": "img/avatar.png",
    "revision": "e63c65faf873519b45dcc4df4a8872dc"
  },
  {
    "url": "index.html",
    "revision": "c30c60d8282c7659304dfa53d7fcd99e"
  },
  {
    "url": "life/about.html",
    "revision": "4cbc48b8e7bb1b5bfb7a2631ce960fa8"
  },
  {
    "url": "post/life/about.html",
    "revision": "4cbc48b8e7bb1b5bfb7a2631ce960fa8"
  },
  {
    "url": "tag/index.html",
    "revision": "aaa365b8937280704ea094496adb5f9e"
  },
  {
    "url": "tag/js.html",
    "revision": "53e3bc106e74177dba3c2ac0379c606b"
  },
  {
    "url": "tag/react.html",
    "revision": "d37081b917fdc4759381d17674ffa499"
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
