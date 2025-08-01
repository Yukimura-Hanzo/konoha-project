//? REACT
import React, { JSX, Suspense, cache } from "react";
//? NEXT
import type { Metadata, ResolvingMetadata } from "next";
import Image from "next/image";
//? NODE
import path from "path";
import fs from "fs";
//? GRAY MATTER
import matter from "gray-matter";
//? ICONS
import { VscCalendar } from "react-icons/vsc";
//? UI
import Breadcrumbs from "@/app/(ui)/breadcrumbs";
import ViewCounter from "@/app/(ui)/view-counter";
//? DB QUERIES
import { getViewsCount } from "@/app/(neon)/db/queries";
import { increment } from "@/app/(neon)/db/actions";

//? TS Types
type Props = {
  params: Promise<{ slug: string }>
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {

  //? Get slug from URL
  const { slug } = await params;
  //? Build the file path to the MDX blog post
  const filePath = path.join(process.cwd(), 'src/content', `${slug}.mdx`);
  //? Read and parse the MDX file
  const source = fs.readFileSync(filePath, 'utf8');
  const { data } = matter(source);
  //? Inherit any parent metadata (optional)
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: data.title || 'Blog Post',
    description: data.description || `Read about ${data.title}`,
    openGraph: {
      title: data.title,
      description: data.description,
      images: data.image ? [data.image, ...previousImages] : previousImages,
    },
    twitter: {
      card: 'summary_large_image',
      title: data.title,
      description: data.description,
      images: data.image ? [data.image] : [],
    },
  };
}

function formateDate(date: string) {
  //* VAR: Store today's date
  const currentDate = new Date();
  //* VAR: Store target date
  const targetDate = new Date(date);
  //* VAR: Get current year - target date year
  const yearsAgo = currentDate.getFullYear() - targetDate.getFullYear();
  //* VAR: Get current month - target date month
  const monthsAgo = currentDate.getMonth() - targetDate.getMonth();
  //* VAR: Get current date - target date
  const daysAgo = currentDate.getDate() - targetDate.getDate();

  //* VAR: String to store the formatted date
  let formattedDate = "";

  //? CONDITIONAL STATEMENT: Checks if today/month/year ago
  //* CONDITIONAL STATEMENT: Checks if it's more than a year ago
  if (yearsAgo > 0) {
    formattedDate = `${yearsAgo}y ago`;
    //* CONDITIONAL STATEMENT: Checks if it's more than a month ago
  } else if (monthsAgo > 0) {
    formattedDate = `${monthsAgo}mo ago`;
    //* CONDITIONAL STATEMENT: Checks if it's more than a day ago
  } else if (daysAgo > 0) {
    formattedDate = `${daysAgo}d ago`;
    //* CONDITIONAL STATEMENT: If none above conditions met, it's today
  } else {
    formattedDate = 'Today';
  }

  //* VAR: Get the full date in a human-readable format
  const fullDate = targetDate.toLocaleString('en-us', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  //? Return the formatted date including the human-readable date and the time ago
  return `${fullDate} (${formattedDate})`;
}

//? TS Types
type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function BlogPostPage({
  params,
}: BlogPostPageProps): Promise<JSX.Element> {

  //? Get slug from URL
  const  { slug } = await params;
  //? Get MDX content
  const { default: Post } = await import(`@/content/${slug}.mdx`);
  //? Build the path to the blog file based on the slug
  const filePath = path.join(process.cwd(), 'src/content', `${slug}.mdx`);
  //? Read the file contents
  const source = fs.readFileSync(filePath, 'utf8');
  //? Use gray-matter to parse frontmatter and content
  const { data } = matter(source);

  //? BREADCRUMBS
  const breadcrumbData = [
    { label: "Home", href: "/", active: false },
    { label: "Blogs", href: "/blogs", active: false },
    { label: data.breadcrumb, href: `/blogs/${data.slug}`, active: true },
  ];

  return  (
    <div className="d-flex-center__container">
      <div className="article__container">
        <div className="article__content">
          {/* Header */}
          <h1 className="text-[2rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[3.5rem] font-semibold border-b pb-2">{data.title}</h1>
          {/* Breadcrumbs bar */}
          <div className="my-5">
            <Breadcrumbs breadcrumbs={breadcrumbData} />
          </div>
          {/* Blog image */}
          {data.image && (
            <Image
              src={data.image}
              alt={data.title}
              width={600}
              height={400}
              className="w-full h-auto border-[3px] border-black rounded-[15px] mb-6"
            />
          )}
          <div className="flex md:flex-row justify-between items-start text-sm text-gray-600 mb-6 mx-3">
            {/* Meta info: date */}
            <time dateTime={data.publishedAt} className="flex items-center gap-2 mb-2 md:mb-0">
              <VscCalendar className="w-4 h-4" />
              <span className="hidden md:inline">Published on</span>
              <span>{formateDate(data.publishedAt)}</span>
            </time>
            {/* JSX code with 'Suspense' for lazy loading the 'Views' component */}
            <Suspense fallback={<span>Loading...</span>}>
              {/* Render 'Views' component w/ specified 'slug' */}
              <Views slug={data.fullSlug} />
            </Suspense>
          </div>
          {/* Post content */}
          <Post />
        </div>
      </div>
    </div>
  );
}

//? Create a cached version of the 'increment' function
const incrementViews = cache(increment);

//? Define asynchronous function named 'Views'
async function Views({ slug }: { slug: string }) {

  //* Fetch the current view counts for the specified blog post using 'getViewsCount'.
  const views = await getViewsCount();

  //* Increment the views count using the cached 'increment' function.
  incrementViews(slug);

  //? Return the 'ViewCounter' component with the fetched view counts and provided 'slug'.
  return <ViewCounter allViews={views} slug={slug} />;
}
