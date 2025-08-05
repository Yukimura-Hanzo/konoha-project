"use server";

//? NEON
import { sql } from "@/lib/db";
//? AUTH
import { auth } from "@/auth";
//? TS
import { TodoItem } from "./definitions";

//? Defines an asynchronous function named `getTodos` that retrieves a user's to-do items
export async function getTodos(): Promise<TodoItem[]> {
  //* Calls the `auth` function to get current user's session
  const session = await auth();
  //* Extracts user ID from session object w/ optional chaining to handle cases
  //* where session or user might be undefined
  const userId = session?.user?.id;
  //* Checks if no user is logged in
  //* if so, returns an empty array to avoid proceeding with query
  if (!userId) return [];
  //* Executes a tagged template literal SQL query w/`sql` function
  const rows = await sql`
    SELECT * FROM todos WHERE user_id = ${userId} ORDER BY created_at DESC
  `;
  //* Returns query result, which contains the user's to-do items
  return rows as TodoItem[];
}

//? Defines an asynchronous function named `addTodo` to create a new to-do item
//? accepting required `title` & optional `description` with a default empty string
export async function addTodo(title: string, description: string = "") {
  //* Retrieves the current user's session by calling the `auth` function
  const session = await auth();
  //* Extracts user ID from session object w/ optional chaining for safety
  const userId = session?.user?.id;
  //* Checks if no user is logged in
  //* if so, returns an empty array to avoid proceeding with query
  if (!userId) return;
  //* Generates random XP value between 5 and 24 (inclusive) to assign to new to-do item
  const randomXP = Math.floor(Math.random() * 20) + 5;
  //* Executes an SQL query w/ the `sql` function
  await sql`
    INSERT INTO todos (user_id, title, description, xp)
    VALUES (${userId}, ${title}, ${description}, ${randomXP})
  `;
}

//? Defines an asynchronous function named `toggleTodo` to update completion status of to-do item
//? accepting the to-do `id` and a `completed` boolean
export async function toggleTodo(id: number, completed: boolean) {
  //* Sets `completedAt` to current timestamp in ISO format
  //* if `completed` is true, otherwise sets it to null
  const completedAt = completed ? new Date().toISOString() : null;
  //* Executes SQL query using the `sql` function
  //* Specifies the update should apply only to the row
  //* where the `id` matches the provided to-do ID
  await sql`
    UPDATE todos
    SET completed = ${completed},
        completed_at = ${completedAt},
        updated_at = NOW()
    WHERE id = ${id}
  `;
}

//? Defines an asynchronous function named `deleteTodo` to delete a to-do item
//? accepting the to-do `id` as a parameter
export async function deleteTodo(id: number) {
  await sql`
    DELETE FROM todos WHERE id = ${id}
  `;
}

//? Defines an asynchronous function to edit the title and/or description of a to-do item
export async function editTodo(id: number, title: string, description: string = "") {
  //* Retrieves the current user's session
  const session = await auth();
  //* Extracts user ID from session object
  const userId = session?.user?.id;
  //* If no user is logged in, exit early
  if (!userId) return;

  //* Update the todo where both the id and user_id match
  await sql`
    UPDATE todos
    SET title = ${title},
        description = ${description},
        updated_at = NOW()
    WHERE id = ${id} AND user_id = ${userId}
  `;
}
