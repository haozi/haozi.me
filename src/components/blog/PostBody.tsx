import { MDXRemote } from "next-mdx-remote/rsc";
import { mdxComponents } from "./MdxComponents";
import { mdxOptions } from "@/lib/mdx-options";

/**
 * Server-side MDX renderer. We compile per request at build time (SSG), so
 * this runs exactly once per post during `next build`.
 */
export function PostBody({ source }: { source: string }) {
  return (
    <MDXRemote
      source={source}
      components={mdxComponents}
      options={{
        // The next-mdx-remote types are loose; this matches its expected shape.
        mdxOptions: mdxOptions as unknown as Parameters<
          typeof MDXRemote
        >[0]["options"] extends infer O
          ? O extends { mdxOptions?: infer M }
            ? M
            : never
          : never,
      }}
    />
  );
}
