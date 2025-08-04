"use server";

//? NEON SQL Client (replace with `pg` if needed)
import { sql } from "@/lib/db";
//? AUTH (assumed next-auth or custom session handler)
import { auth } from "@/auth";

//? TypeScript Interface for Budget Items
export interface BudgetItem {
  id: number;
  title: string;
  amount: number;
  type: "income" | "expense";
  created_at: string;
}

export async function getBudgetItems(): Promise<BudgetItem[]> {
  //* Retrieve session info for the currently logged-in user
  const session = await auth();
  //* Extract user ID from session; optional chaining ensures safe access
  const userId = session?.user?.id;
  //* If user not logged in, return an empty array (fail-safe)
  if (!userId) return [];
  //* Execute SQL query to fetch all budget items for user, most recent first
  const rows = await sql`
    SELECT id, title, amount, type, created_at
    FROM budget_items
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
  `;
  //* Return query result cast as a BudgetItem[]
  return rows as BudgetItem[];
}

export async function addBudgetItem(
  title: string,
  amount: number,
  type: "income" | "expense"
) {
  //* Get current session (logged-in user context)
  const session = await auth();
  //* Extract user ID from session
  const userId = session?.user?.id;
  //* If no user is authenticated, exit early
  if (!userId) return;
  //* Run SQL INSERT query with user_id, title, amount, and type
  await sql`
    INSERT INTO budget_items (user_id, title, amount, type)
    VALUES (${userId}, ${title}, ${amount}, ${type})
  `;
}

export async function deleteBudgetItem(id: number) {
  //* Execute SQL DELETE to remove a row with matching ID
  await sql`
    DELETE FROM budget_items WHERE id = ${id}
  `;
}

export async function editBudgetItem(
  id: number,
  title: string,
  amount: number,
  type: "income" | "expense"
) {
  //* Retrieve current session info
  const session = await auth();
  //* Get the logged-in user's ID
  const userId = session?.user?.id;
  //* If user is not authenticated, skip the update
  if (!userId) return;
  //* Execute SQL UPDATE query to modify fields for a specific item and user
  await sql`
    UPDATE budget_items
    SET title = ${title},
        amount = ${amount},
        type = ${type},
        updated_at = NOW()
    WHERE id = ${id} AND user_id = ${userId}
  `;
}
