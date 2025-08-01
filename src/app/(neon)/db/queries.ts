"use server";

//? NEXT
import { unstable_noStore as noStore } from "next/cache";
//? Import the 'sql' object from the neon module
import { sql } from "@/lib/db";

//* Define an asynchronous function named 'getBlogViews'.
export async function getBlogViews() {
  noStore(); //* Invoke the 'noStore' function.
  //? 'sql' tagged template literal to query number of views from 'views' table.
  const data = await sql`
    SELECT count
    FROM views
  `;
  //* Return the sum of counts from the retrieved views.
  return data.reduce((acc, curr) => acc + Number(curr.count), 0);
}

//* Define an asynchronous function named 'getViewsCount'.
export async function getViewsCount(): Promise<{ slug: string; count: number }[]> {
  noStore(); //* Invoke the 'noStore' function.
  //? Query slugs and counts from the 'views' table.
  const data = await sql`
  SELECT slug, count
  FROM views
`;
//* Return result as an array of objects with 'slug' and 'count' properties.
return data as { slug: string; count: number}[];
}
