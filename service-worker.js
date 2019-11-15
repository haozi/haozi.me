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

importScripts("workbox-v4.3.1/workbox-sw.js");
workbox.setConfig({modulePathPrefix: "workbox-v4.3.1"});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "404.html",
    "revision": "556c152b13e8f94da35928b624b8647b"
  },
  {
    "url": "assets/css/0.styles.9d6563a9.css",
    "revision": "11293a095fc128c935d3a69c19c22589"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/js/2.f7cfb2d6.js",
    "revision": "76112eaa0581945778c10d1dab992001"
  },
  {
    "url": "assets/js/3.df36006a.js",
    "revision": "3f0c57f5b2294f918e2a7e6a15af040a"
  },
  {
    "url": "assets/js/4.f9d989de.js",
    "revision": "961c72e2cae76a9ca76a83e4477fb7db"
  },
  {
    "url": "assets/js/5.c46c7f9b.js",
    "revision": "ed5713210faf457bcc30bdc8becdf089"
  },
  {
    "url": "assets/js/6.edd46fe5.js",
    "revision": "221b702cb0240640c001c46f5e656b05"
  },
  {
    "url": "assets/js/7.5256c68a.js",
    "revision": "5e2c3cfc8909c0295828ffe1e057ed0f"
  },
  {
    "url": "assets/js/8.016d715e.js",
    "revision": "4f999d7a31c1050b63ff7acd41a132f1"
  },
  {
    "url": "assets/js/9.13e1c2a1.js",
    "revision": "a6e2147d849f7e06de56b7a585933462"
  },
  {
    "url": "assets/js/app.856055ff.js",
    "revision": "14a5629ba9e40bdf2f6a03aeba85ede2"
  },
  {
    "url": "img/avatar.png",
    "revision": "e63c65faf873519b45dcc4df4a8872dc"
  },
  {
    "url": "index.html",
    "revision": "fc1fb0a847b78bb9197392b2e29bd2b5"
  },
  {
    "url": "life/about.html",
    "revision": "1539732f33818e56272d72e1f1f74c35"
  },
  {
    "url": "machine-leaning/outline.html",
    "revision": "96ffac30a4b754ece3fbb7143b461694"
  }
].concat(self.__precacheManifest || []);
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
