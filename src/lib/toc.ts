import GithubSlugger from "github-slugger";

export type TocItem = {
  depth: number;
  text: string;
  id: string;
};

/**
 * Parse markdown headings (## / ###) out of an MDX body. Cheap and
 * deterministic — it doesn't try to handle HTML headings or weird inline
 * markup, which is fine for the kind of content we author.
 */
export function buildToc(markdown: string): TocItem[] {
  const slugger = new GithubSlugger();
  const items: TocItem[] = [];
  const lines = markdown.split("\n");
  let inCodeBlock = false;
  for (const line of lines) {
    if (line.startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;
    const m = /^(#{2,4})\s+(.+?)\s*$/.exec(line);
    if (!m) continue;
    const depth = m[1].length;
    const text = m[2].replace(/`/g, "").trim();
    const id = slugger.slug(text);
    items.push({ depth, text, id });
  }
  return items;
}
