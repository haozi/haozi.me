/**
 * Locale-independent site metadata. Anything that varies per locale
 * (title, description, nav labels, taglines, ...) lives in
 * `src/lib/dict/*` and is fetched via `getDictionary(lang)`.
 */
export const siteCore = {
  shortName: "haozi",
  url: "https://haozi.me",
  author: {
    name: "耗子",
    handle: "haozi",
    url: "https://haozi.me",
  },
} as const;

/** Back-compat alias — older imports still use `site`. */
export const site = siteCore;

export type Site = typeof siteCore;
