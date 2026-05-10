/**
 * Dictionary registry — synchronous lookup keyed by Locale.
 *
 * Synchronous (not the doc-suggested dynamic-import variant) because:
 *   1. We're targeting `output: 'export'` — every page is rendered at
 *      build time, no per-request locale split needed.
 *   2. The dictionary lives in a Server Component closure that reads it
 *      directly; bundling all three doesn't bloat the client because RSC
 *      output ships only the resolved strings.
 *   3. The "client" components that need translations (Search,
 *      LanguageSwitcher) take strings as props from their server parent.
 */

import type { Dictionary } from "./types";
import { en } from "./en";
import { zhHans } from "./zh-Hans";
import { zhHant } from "./zh-Hant";
import type { Locale } from "@/lib/i18n";

const dictionaries: Record<Locale, Dictionary> = {
  en,
  "zh-Hans": zhHans,
  "zh-Hant": zhHant,
};

export function getDictionary(lang: Locale): Dictionary {
  return dictionaries[lang];
}

export type { Dictionary } from "./types";
