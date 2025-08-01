//? NEON DATABASE
import { neon } from "@neondatabase/serverless";

//? Check if PostgreSQL connection URL is not defined in environment variables.
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL not set");
}

//? Initialize connection once (recommended)
export const sql = neon(process.env.DATABASE_URL!);
