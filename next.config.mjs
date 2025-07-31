//? NEXT MDX | Built-in MDX Support
import createMDX from "@next/mdx";
//? REMARK PLUGINS
import remarkGfm from "remark-gfm";
import remarkFrontmatter from "remark-frontmatter";
import remarkMDXFrontmatter from "remark-mdx-frontmatter";
//? REHYPE PLUGINS
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

/** @type {import('next').NextConfig} */
const nextConfig = {
  //? Configure `pageExtensions` to include markdown and MDX files
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  //? Optionally, add any other Next.js config below
};

const withMDX = createMDX({
  //? Add markdown plugins here, as desired
  options: {
    //? Use remark-gfm plugin for Markdown processing
    remarkPlugins: [remarkGfm, remarkFrontmatter, remarkMDXFrontmatter],
    rehypePlugins: [
      //? Use rehype-slug to generate anchor links
      rehypeSlug,
      [
        rehypePrettyCode,
        {
          //? Specify the code highlighting theme
          theme: 'min-dark',
          onVisitLine(node) {
            /**
             * Prevent lines from collapsing in `display: grid` mode,
             * & allow empty lines to be copy/pasted
             */
            if (node.children.length === 0) {
              node.children = [{ type: 'text', value: ' ' }];
            }
          },
          onVisitHighlightedLine(node) {
            //? Add a class to highlighted lines
            // node.properties.className.push('line--highlighted');
          },
          onVisitHighlightedWord(node) {
            //? Add a class to highlighted words
            // node.properties.className = ['word--highlighted'];
          },
        },
      ],
      [
        rehypeAutolinkHeadings,
        {
          properties: {
            //? Add a class to auto-linked headings
            className: ['anchor'],
          },
        },
      ],
    ],
  },
});

//? Merge MDX config with Next.js config
export default withMDX(nextConfig);
