// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type TodoItem = {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  xp: number;
  created_at: string;
  completed_at?: string;
}

export type BudgetItem = {
  id: number;
  title: string;
  amount: number;
  type: "income" | "expense";
  created_at: string;
  updated_at: string;
}