import * as React from "react";
import Link from "next/link";

/**
 * MDX element overrides for the modern blog reading experience.
 * These are applied via <MDXRemote components={mdxComponents} />.
 *
 * We keep things minimal — the `prose` typography styles in globals.css
 * carry most of the look. These overrides exist to (a) route internal
 * links through next/link and (b) annotate the figure/code block shells
 * so we can style them without owning the entire MDX tree.
 */
export const mdxComponents = {
  a: ({ href = "", ...rest }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const isInternal = href.startsWith("/") || href.startsWith("#");
    if (isInternal && href.startsWith("/")) {
      return (
        <Link
          href={href}
          {...(rest as Omit<React.ComponentProps<typeof Link>, "href">)}
        />
      );
    }
    return <a href={href} target="_blank" rel="noopener noreferrer" {...rest} />;
  },
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
    <pre {...props} className={["not-prose", props.className].filter(Boolean).join(" ")} />
  ),
};
