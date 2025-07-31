//? Define Global MDX Components | @next/mdx with App Router
import type { MDXComponents } from "mdx/types";

const components: MDXComponents = {
  //* Wrap the whole MDX content inside this container
  wrapper: ({ children }) => (
    <div className="max-w-3xl mx-auto px-4">
      {children}
    </div>
  ),
  h1: ({ children }) => (
    <h1 className="text-2xl font-semibold my-6">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="font-semibold mb-3">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3>{children}</h3>
  ),
  p: ({ children }) => (
    <p className="mb-3 leading-relaxed text-sm">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="my-4 leading-relaxed text-sm">{children}</ul>
  ),
  li: ({ children }) => (
    <li className="my-4 leading-relaxed text-sm">-{children}</li>
  ),
};

export function useMDXComponents(): MDXComponents {
  return components;
};
