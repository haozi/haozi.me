# TODO

Small, non-blocking items. Resolve when convenient.

- [ ] Drop a real BGM file at `public/audio/bgm.mp3`. Component already
      autoplays-on-click; until then the toggle is a silent button.
- [ ] Replace placeholder retro images (`public/retro/*`) with real pixel/gif
      assets. None of the components currently require them.
- [ ] Per-post Open Graph images (deferred; needs `next/og` or a precompiled
      generator script).
- [ ] Improve search ranking — current `Search` does plain substring scoring;
      consider minisearch or lunr if the index grows.
- [ ] View Transitions API for the / → /blog "豁然一变" moment. Browser
      support is good in Chromium but not yet universal; start as
      progressive enhancement only.
- [ ] Comments — leaning towards giscus (GitHub Discussions). Out of scope
      for now; needs a GH repo + giscus app install.
- [ ] Decide whether to ship the Mojibake "decode" easter egg button.
- [ ] Localize blog chrome strings if a non-zh visitor base ever materializes.
