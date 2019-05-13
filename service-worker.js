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
    "revision": "acddefd5cb545859402aaa340d18971e"
  },
  {
    "url": "assets/css/0.styles.ba89a4ff.css",
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
    "url": "assets/js/15.217e120d.js",
    "revision": "3256701996858e482bbd80d8126d8a36"
  },
  {
    "url": "assets/js/16.584afd8b.js",
    "revision": "f0b3046a4bece3ad3ae15c9e3a742cb7"
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
    "url": "assets/js/19.ded70ae3.js",
    "revision": "e2e2f2ea2a0be6c66ea0f8f5d454d270"
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
    "url": "assets/js/29.abca75f2.js",
    "revision": "3b7fa6bb7cd047cde3ed2ff6f6ceb28f"
  },
  {
    "url": "assets/js/3.0340d429.js",
    "revision": "ca4f247e4d79afc6b06a6ab61879dd3f"
  },
  {
    "url": "assets/js/4.f23d88c7.js",
    "revision": "11f1a190e66b5fade9be38ceab3e2ddd"
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
    "url": "assets/js/app.9a390dca.js",
    "revision": "2d57bcca457e9854b67659e24f4b0381"
  },
  {
    "url": "assets/js/vendors~flowchart.4e2e93ef.js",
    "revision": "5c9f0fb5ada377a6f0eb468b423e3e37"
  },
  {
    "url": "category/index.html",
    "revision": "d000f05d83bb5b57a44fc16bfc0c342b"
  },
  {
    "url": "img/avatar.png",
    "revision": "e63c65faf873519b45dcc4df4a8872dc"
  },
  {
    "url": "index.html",
    "revision": "72c25727971a43ddf371c31f3108ee4a"
  },
  {
    "url": "life/about.html",
    "revision": "636790d3ac72848142606b9f4f9df9a6"
  },
  {
    "url": "tag/index.html",
    "revision": "d5a8be1b78f3412090e8a60f1e6eb361"
  },
  {
    "url": "tag/js.html",
    "revision": "754ef984f41fa578feb26b133e31dece"
  },
  {
    "url": "tag/react.html",
    "revision": "71a2ebc77ff68a625614f23ab1ca50cf"
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
