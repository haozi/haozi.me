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
const WORKBOX = '/js/workbox-v4.3.1/'
importScripts(`${WORKBOX}workbox-sw.js`);
workbox.setConfig({
  modulePathPrefix: WORKBOX
});
// html的缓存策略
workbox.routing.registerRoute(
  /.*\.html$/,
  workbox.strategies.networkFirst()
);

workbox.routing.registerRoute(
  /.*\.(?:js|css)$/,
  workbox.strategies.cacheFirst()
);

// workbox.routing.registerRoute(
//   new RegExp('https://your\.cdn\.com/'),
//   workbox.strategies.staleWhileRevalidate()
// );

// workbox.routing.registerRoute(
//   new RegExp('https://your\.img\.cdn\.com/'),
//   workbox.strategies.cacheFirst({
//     cacheName: 'example:img'
//   })
// );
/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
// self.__precacheManifest = [
//   {
//     "url": "404.html",
//     "revision": "62933f47e86a1d9a45deb60a409753ee"
//   },
//   {
//     "url": "assets/css/0.styles.b3ba9d8e.css",
//     "revision": "006b4bc1d370d8ab4d877ba2a258625a"
//   },
//   {
//     "url": "assets/img/404.9ed13bbe.svg",
//     "revision": "9ed13bbe02debb8e23db19a4e6603c2e"
//   },
//   {
//     "url": "assets/img/search.31b3b01d.svg",
//     "revision": "31b3b01dc8c29f5bc57b98a8256c9951"
//   },
//   {
//     "url": "assets/js/10.e7483741.js",
//     "revision": "54beb885d46f8fdf66db639284108c6d"
//   },
//   {
//     "url": "assets/js/11.d82ae566.js",
//     "revision": "609aae49317a98702a47b7f226b2cd8b"
//   },
//   {
//     "url": "assets/js/12.ef2fa42d.js",
//     "revision": "f7465f2184a6368e8f6f7b0829ad1d77"
//   },
//   {
//     "url": "assets/js/13.0a74a187.js",
//     "revision": "ddb50e116da28fa1c9942ca5b6e8f5af"
//   },
//   {
//     "url": "assets/js/14.b90d61b8.js",
//     "revision": "851347acb17a5a39efd4108a7beda74a"
//   },
//   {
//     "url": "assets/js/15.7982e52a.js",
//     "revision": "804f5f45ffc357893a24e79d06c36ba9"
//   },
//   {
//     "url": "assets/js/16.8e746cad.js",
//     "revision": "ebc3a5de2108b4bda8900bd5831c20c9"
//   },
//   {
//     "url": "assets/js/17.8051e744.js",
//     "revision": "81dddbdeaa53ef0f12d60e9a3665bb3e"
//   },
//   {
//     "url": "assets/js/18.99b91ae1.js",
//     "revision": "4738b0cccfc73f9529906ca4c44f72ce"
//   },
//   {
//     "url": "assets/js/19.b46591b2.js",
//     "revision": "27f02c1aa39e39f879480bb436840a0b"
//   },
//   {
//     "url": "assets/js/20.5210e9e1.js",
//     "revision": "7995a45cadabc4dfb50df91eebcbf328"
//   },
//   {
//     "url": "assets/js/21.9534260a.js",
//     "revision": "46f94c8d397aedb297fefe9d85593043"
//   },
//   {
//     "url": "assets/js/22.078e2fec.js",
//     "revision": "c92d452feafb88a2f0a6ce72734a1ba1"
//   },
//   {
//     "url": "assets/js/23.1c0746e9.js",
//     "revision": "973a79a05583712e7bea8604fbc1263b"
//   },
//   {
//     "url": "assets/js/24.748df06a.js",
//     "revision": "0b91b87f2402723e62bd2be9b6eeb18b"
//   },
//   {
//     "url": "assets/js/25.5114d94b.js",
//     "revision": "912b30894021e512b550acabf2662066"
//   },
//   {
//     "url": "assets/js/26.03edd283.js",
//     "revision": "b32fd0567860e094c8b82ef1b6a1774e"
//   },
//   {
//     "url": "assets/js/27.deeab2c6.js",
//     "revision": "74c4d0041d95e802029959f2e5d1e8bf"
//   },
//   {
//     "url": "assets/js/28.68d57837.js",
//     "revision": "e19358727c8a8230dc7319d84df75da1"
//   },
//   {
//     "url": "assets/js/29.79035ff7.js",
//     "revision": "9474554134313f19346a51e33fe92f68"
//   },
//   {
//     "url": "assets/js/3.4077e510.js",
//     "revision": "dafa7fb5de632aecb97943a3668725f5"
//   },
//   {
//     "url": "assets/js/30.8f95f67a.js",
//     "revision": "b1f14c5859d46c7a8f369e88be9fc19e"
//   },
//   {
//     "url": "assets/js/31.2cbcd453.js",
//     "revision": "5508af7a464013f2a31a08f5937acfb8"
//   },
//   {
//     "url": "assets/js/4.7fef37d6.js",
//     "revision": "7c3955fd0a89ae4064fce62c8fb28682"
//   },
//   {
//     "url": "assets/js/5.a5124867.js",
//     "revision": "d630468b37cca8900f550b7d23cc4ae8"
//   },
//   {
//     "url": "assets/js/6.f42cdebf.js",
//     "revision": "8188251da8d957671fd06e0093836f3a"
//   },
//   {
//     "url": "assets/js/7.233bf77b.js",
//     "revision": "31f5b9fe281a560ccdd07fec4c692c66"
//   },
//   {
//     "url": "assets/js/8.21cef7b1.js",
//     "revision": "e14dc576d62ce856ccf246dc931be419"
//   },
//   {
//     "url": "assets/js/9.633efdf1.js",
//     "revision": "d4feb234a78f94af8333366e2b964d0f"
//   },
//   {
//     "url": "assets/js/app.0a3762d6.js",
//     "revision": "f1e105c0f27fbedbba4e169210828a34"
//   },
//   {
//     "url": "assets/js/vendors~flowchart.4e2e93ef.js",
//     "revision": "5c9f0fb5ada377a6f0eb468b423e3e37"
//   },
//   {
//     "url": "category/index.html",
//     "revision": "8283a814f0d87f2fb291429ebd2eb925"
//   },
//   {
//     "url": "img/avatar.png",
//     "revision": "e63c65faf873519b45dcc4df4a8872dc"
//   },
//   {
//     "url": "index.html",
//     "revision": "131cc37b8ebcd966b76dbb35fb924cd2"
//   },
//   {
//     "url": "js/workbox-v4.3.1/workbox-background-sync.dev.js",
//     "revision": "5446355eef3aa184b5b6eebfcd81f8d9"
//   },
//   {
//     "url": "js/workbox-v4.3.1/workbox-background-sync.prod.js",
//     "revision": "1ffcc362312a9e8ef4e28280ace2a1bd"
//   },
//   {
//     "url": "js/workbox-v4.3.1/workbox-broadcast-update.dev.js",
//     "revision": "0508d13784c9b0549663f40e3fe55d37"
//   },
//   {
//     "url": "js/workbox-v4.3.1/workbox-broadcast-update.prod.js",
//     "revision": "ee27c0fdc836f6a2dc656b25a680f9e4"
//   },
//   {
//     "url": "js/workbox-v4.3.1/workbox-cacheable-response.dev.js",
//     "revision": "ecba3679d285394f1c9e219681662721"
//   },
//   {
//     "url": "js/workbox-v4.3.1/workbox-cacheable-response.prod.js",
//     "revision": "a38e8afa80070ec9dff5dc2fb116f1c2"
//   },
//   {
//     "url": "js/workbox-v4.3.1/workbox-core.dev.js",
//     "revision": "2912182ccc99b017a8c36802cf9d983f"
//   },
//   {
//     "url": "js/workbox-v4.3.1/workbox-core.prod.js",
//     "revision": "5d14d8267f65030735589e4b664ee3bf"
//   },
//   {
//     "url": "js/workbox-v4.3.1/workbox-expiration.dev.js",
//     "revision": "43c236fe62480f042c35e8b898ca3367"
//   },
//   {
//     "url": "js/workbox-v4.3.1/workbox-expiration.prod.js",
//     "revision": "a767f3bbd2773a0bea34ff841b51ab64"
//   },
//   {
//     "url": "js/workbox-v4.3.1/workbox-navigation-preload.dev.js",
//     "revision": "a8f30e409f7037906053acec7d709beb"
//   },
//   {
//     "url": "js/workbox-v4.3.1/workbox-navigation-preload.prod.js",
//     "revision": "e2b19a3eda50f48ce7fc48640a523353"
//   },
//   {
//     "url": "js/workbox-v4.3.1/workbox-offline-ga.dev.js",
//     "revision": "3fba0947d12d42834b81499fafc76e82"
//   },
//   {
//     "url": "js/workbox-v4.3.1/workbox-offline-ga.prod.js",
//     "revision": "6af4fb51a5249c4e0ed7bc61ed59836d"
//   },
//   {
//     "url": "js/workbox-v4.3.1/workbox-precaching.dev.js",
//     "revision": "8fbbefcd70c998a3cd35f02e6a8ac4e7"
//   },
//   {
//     "url": "js/workbox-v4.3.1/workbox-precaching.prod.js",
//     "revision": "e8f5c57430ec7c448d30015ff4bd5896"
//   },
//   {
//     "url": "js/workbox-v4.3.1/workbox-range-requests.dev.js",
//     "revision": "0f15c57cf5c75cc72b6f23ad28a941d1"
//   },
//   {
//     "url": "js/workbox-v4.3.1/workbox-range-requests.prod.js",
//     "revision": "97c430406d13f4b91c805594ef351261"
//   },
//   {
//     "url": "js/workbox-v4.3.1/workbox-routing.dev.js",
//     "revision": "471b8e0f45e6e5e679d04f60c6466e7f"
//   },
//   {
//     "url": "js/workbox-v4.3.1/workbox-routing.prod.js",
//     "revision": "d3fa76a1c38649d596b1d2ffaf398128"
//   },
//   {
//     "url": "js/workbox-v4.3.1/workbox-strategies.dev.js",
//     "revision": "d1c19737e82e2f6bd567aaf384683174"
//   },
//   {
//     "url": "js/workbox-v4.3.1/workbox-strategies.prod.js",
//     "revision": "6033181992f0bc562ab1ef5f9ba34697"
//   },
//   {
//     "url": "js/workbox-v4.3.1/workbox-streams.dev.js",
//     "revision": "eed9eb6f7b0672c45db5408d05efe9b9"
//   },
//   {
//     "url": "js/workbox-v4.3.1/workbox-streams.prod.js",
//     "revision": "4407a13523f1fa1064f616e9047b6148"
//   },
//   {
//     "url": "js/workbox-v4.3.1/workbox-sw.js",
//     "revision": "6e1e47d706556eac8524f396e785d4bb"
//   },
//   {
//     "url": "js/workbox-v4.3.1/workbox-window.dev.umd.js",
//     "revision": "c17834573a1b48bb8cf33b12128bdae9"
//   },
//   {
//     "url": "js/workbox-v4.3.1/workbox-window.prod.umd.js",
//     "revision": "c65238721ed1187cf832e51a9e34724a"
//   },
//   {
//     "url": "life/about.html",
//     "revision": "07fed7003b8b982b5198341556d8e0e7"
//   },
//   {
//     "url": "tag/index.html",
//     "revision": "ae1818e1f0f666ddf3c0fa55b8ef2183"
//   },
//   {
//     "url": "tag/js.html",
//     "revision": "dc80bf9392baa378aca0fa7b71b1d918"
//   },
//   {
//     "url": "tag/react.html",
//     "revision": "567264840835cd6c431ff394fbd853e8"
//   },
//   {
//     "url": "tag/security.html",
//     "revision": "a191a8e97ba935282065f9f22c4d28c2"
//   },
//   {
//     "url": "technology/Service-Worker-Attack.html",
//     "revision": "fbdc7370da12d00486dbdfff32e9401e"
//   },
//   {
//     "url": "technology/缓存策略.html",
//     "revision": "8f1d13ae45ca90cfafb68995fda4f034"
//   }
// ].concat(self.__precacheManifest || []);
// workbox.precaching.suppressWarnings();
// workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
// addEventListener('message', event => {
//   const replyPort = event.ports[0]
//   const message = event.data
//   if (replyPort && message && message.type === 'skip-waiting') {
//     event.waitUntil(
//       self.skipWaiting().then(
//         () => replyPort.postMessage({ error: null }),
//         error => replyPort.postMessage({ error })
//       )
//     )
//   }
// })
