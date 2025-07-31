//? REACT
import React, { JSX } from "react";
//? NEXT
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
//? DATE FNS
import { format } from "date-fns";
//? ICONS
import { VscCalendar } from "react-icons/vsc";
//? LIB
import { getAllPosts } from "@/lib/post";
//? UI
import Breadcrumbs from "@/app/(ui)/breadcrumbs";

//? METADATA TAGS | [S.E.O]
export const metadata: Metadata = {
  title: "Blogs",
  description: "Featured articulations on interested topics.",
};

//? TS Types
type Post = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  image?: string;
  breadcrumb: string;
  fullSlug: string;
};

export default function BlogsPage(): JSX.Element {

  //? Call function to get all posts from MDX files
  const posts: Post[] = getAllPosts();

  //? BREADCRUMBS
  const breadcrumbData = [
    { label: "Home", href: "/", active: false },
    { label: "Blogs", href: "/blogs", active: true },
  ];

  return (
    <div className="p-4 sm:px-0">
      {/* Header */}
      <small className="font-semibold">NEXT MDX | Next Built-in Markdown Support</small>
      <h1
        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold"
      >
        FEATURED BLOGS
      </h1>
      {/* Breadcrumbs bar */}
      <div className="my-5">
        <Breadcrumbs breadcrumbs={breadcrumbData} />
      </div>
      {/* Responsive grid of blogs */}
      <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
        {posts.map((post) => (
          <div key={post.slug} className="flex flex-col rounded shadow-sm bg-white overflow-hidden">
            {/* Blog image */}
            {post.image && (
              <Image
                src={post.image}
                alt={post.title}
                width={600}
                height={400}
                className="w-full h-auto object-cover border-[2px] border-black rounded-[15px]"
              />
            )}
            {/* Card content */}
            <div className="p-4 flex flex-col justify-between flex-1">
              <h2 className="text-lg font-semibold text-gray-800 hover:underline mb-2">
                <Link href={`/blogs/${post.slug}`}>{post.title}</Link>
              </h2>
              {/* Meta info: date */}
              <time dateTime={post.publishedAt} className="text-sm text-gray-500 mb-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    <VscCalendar className="w-4 h-4 text-gray-500" />
                    {format(new Date(post.publishedAt), "LLLL d, yyyy")}
                  </div>
                </div>
              </time>
              {/* Post description */}
              <p className="text-gray-600 text-sm">{post.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
