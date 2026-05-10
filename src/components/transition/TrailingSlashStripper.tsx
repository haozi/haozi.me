/**
 * Inline pre-paint script that rewrites the address bar to drop a single
 * trailing `/` from the pathname — for *every* URL mutation, not just the
 * initial paint.
 *
 * Why this exists
 * ---------------
 * `next.config.ts` has `trailingSlash: false`, so every internal `<Link>`
 * carries a slash-less href. Two distinct things still re-introduce a
 * trailing slash:
 *
 *   1. Hard loads on a dumb static server (Python `http.server`, GitHub
 *      Pages, …) get 301'd from `/blog/foo` to `/blog/foo/` because the
 *      sibling directory (the postbuild mirror) exists. We can't change
 *      the 301, so we strip the slash client-side.
 *
 *   2. Soft navigation through Next 16's App Router: when the user clicks
 *      a `<Link href="/blog/foo">`, Next prefetches the RSC payload and
 *      then calls `history.pushState` (or `replaceState`) to update the
 *      address bar. Depending on prefetch outcome / route normalization /
 *      caching, the URL Next pushes can end up with a trailing slash,
 *      even though the original `href` did not.
 *
 * Strategy
 * --------
 *   - Run synchronously as the first child of `<body>` so the address bar
 *     is correct *before* hydration paints.
 *   - Strip the trailing slash on the *current* URL one shot.
 *   - Monkey-patch `history.pushState` and `history.replaceState` so any
 *     subsequent URL change (Next router, third-party scripts) flows
 *     through a normalizer that strips the slash before the browser sees
 *     it. The `popstate` event doesn't need handling — it reads the
 *     existing entry, doesn't push a new one.
 *
 * Skips:
 *   - The root URL `/` (stripping it would yield "" which the browser
 *     normalizes back to "/" — harmless, but causes a no-op loop).
 *   - URLs whose `pathname` already lacks a trailing slash.
 *   - Cross-origin URLs (we never want to rewrite an external href).
 *
 * Because this is a Server Component returning a `<script>` tag, the
 * markup is identical across SSR / RSC payload and the client, so React
 * never warns about hydration mismatch. The patched history methods
 * persist across React renders because they live on the global `history`
 * object, not in component state.
 */
export function TrailingSlashStripper() {
  const code = `
(function () {
  try {
    // -- normalizer: take a URL-ish input, return a string with no
    //    trailing slash on the pathname (root excluded). Accepts the same
    //    shapes that history.pushState/replaceState accept for their url
    //    argument: string | URL | null | undefined.
    function strip(input) {
      if (input == null) return input;
      var s = typeof input === "string" ? input : String(input);
      // Resolve against current location so relative URLs work the same
      // way the browser would, then operate on the URL object.
      var base = window.location.href;
      var u;
      try { u = new URL(s, base); } catch (e) { return s; }
      // Only touch same-origin URLs.
      if (u.origin !== window.location.origin) return s;
      var p = u.pathname;
      if (p.length > 1 && p.charAt(p.length - 1) === "/") {
        u.pathname = p.replace(/\\/+$/, "") || "/";
        // Preserve the original input style: if the caller passed a path
        // (no protocol), return a path; otherwise return the full URL.
        if (typeof input === "string" && !/^[a-z][a-z0-9+.-]*:/i.test(s) && !s.startsWith("//")) {
          return u.pathname + u.search + u.hash;
        }
        return u.toString();
      }
      return s;
    }

    // -- one-shot strip on initial paint (covers hard-load 301 case).
    var p0 = window.location.pathname;
    if (p0.length > 1 && p0.charAt(p0.length - 1) === "/") {
      var stripped0 = p0.replace(/\\/+$/, "") || "/";
      if (stripped0 !== p0) {
        window.history.replaceState(
          window.history.state,
          "",
          stripped0 + window.location.search + window.location.hash
        );
      }
    }

    // -- patch pushState/replaceState so SPA navigation can never re-add
    //    a trailing slash. Idempotent: a second mount is a no-op.
    if (!window.__haoziTrailingSlashPatched) {
      window.__haoziTrailingSlashPatched = true;
      var origPush = window.history.pushState;
      var origReplace = window.history.replaceState;
      window.history.pushState = function (state, title, url) {
        return origPush.call(this, state, title, strip(url));
      };
      window.history.replaceState = function (state, title, url) {
        return origReplace.call(this, state, title, strip(url));
      };
    }
  } catch (e) {}
})();
`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
