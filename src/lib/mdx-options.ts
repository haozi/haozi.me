import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode, { type Options as PrettyCodeOptions } from "rehype-pretty-code";

const prettyCodeOptions: PrettyCodeOptions = {
  // Dual-theme — `data-theme` toggle on <html> picks which one shows.
  theme: {
    light: "github-light",
    dark: "github-dark-dimmed",
  },
  keepBackground: false,
  defaultLang: "plaintext",
};

export const mdxOptions = {
  // Cast as any because next-mdx-remote types are intentionally loose
  // and the array of plugins mixes with-options and without-options forms.
  remarkPlugins: [remarkGfm],
  rehypePlugins: [
    rehypeSlug,
    [
      rehypeAutolinkHeadings,
      {
        behavior: "wrap",
        properties: { className: ["heading-anchor"] },
      },
    ],
    [rehypePrettyCode, prettyCodeOptions],
  ],
} as const;
