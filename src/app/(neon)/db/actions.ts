"use server";

//? NEXT | revalidatePath, unstable_noStore(experimental), redirect
import { unstable_noStore as noStore } from "next/cache";
//? Import the 'sql' object from the neon module
import { sql } from "@/lib/db";

//* Asynchronous function named 'increment' takes 'slug' parameter of type string
export async function increment(slug: string) {
  noStore(); //* Invoke the 'noStore' function.
  //? Use the 'sql' tagged template literal 
  //? to perform an SQL insertion or update.
  await sql`
    INSERT INTO views (slug, count)
    VALUES (${slug}, 1)
    ON CONFLICT (slug)
    DO UPDATE SET count = views.count + 1
  `;
}
