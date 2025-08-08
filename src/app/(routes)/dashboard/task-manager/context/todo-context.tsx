"use client";

//? REACT
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
//? NEON
import { getTodos, addTodo, toggleTodo, deleteTodo, editTodo } from "@/app/(neon)/db/todo";
//? SHADCN
import { toast } from "sonner";

//? TS Interfaces
interface Todo {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  xp: number;
  created_at: string;
  completed_at?: string;
}

interface TodoContextType {
  todos: Todo[];
  todosCount: number;
  totalXp: number;
  xpProgress: number;
  level: number;
  createTodo: (title: string, description: string) => Promise<void>;
  toggleTodoCompletion: (id: number, completed: boolean) => Promise<void>;
  deleteTodoById: (id: number) => Promise<void>;
  editTodoById: (id: number, title: string, description: string) => Promise<void>;
  getXpForNextLevel: (level: number) => number;
}

//* createContext lets you create a context that components can provide or read
const TodoContext = createContext<TodoContextType | undefined>(undefined);

export function TodoProvider({ children }: { children: ReactNode }) {

  //* State to store the list of todos, initialized as an empty array
  const [todos, setTodos] = useState<Todo[]>([]);
  //* State to store the total XP earned from completed todos
  const [totalXp, setTotalXp] = useState<number>(0);
  //* State to store the progress percentage toward the next level
  const [xpProgress, setXpProgress] = useState<number>(0);
  //* State to store the current user level
  const [level, setLevel] = useState<number>(1);

  //? XP required for the next level
  function getXpForNextLevel(level: number) {
    return 100 + level * 50;
  }

  const todosCount = todos.length;

  //? Async function to fetch todos from the database & update state
  async function loadTodos() {
    const data = await getTodos() as Todo[]; //* Fetches todos using the getTodos query
    setTodos(data); //* Updates the todos state with fetched data
  }

  //? useEffect() Hook - load todos from db when component mounts
  useEffect(() => {
    loadTodos(); //* Calls the loadTodos function
  }, []); //* Empty dependency array: runs once on mount

  //? useEffect() Hook - calculates xp
  useEffect(() => {
    const xpEarned = todos.filter((t) => t.completed).reduce((acc, t) => acc + t.xp, 0);
    setTotalXp(xpEarned);

    let currentLevel = 1;
    let remainingXp = xpEarned;
    while (remainingXp >= getXpForNextLevel(currentLevel)) {
      remainingXp -= getXpForNextLevel(currentLevel);
      currentLevel++;
    }
    setLevel(currentLevel);
    const nextLevelXp = getXpForNextLevel(currentLevel);
    const progress = (remainingXp / nextLevelXp) * 100;
    setXpProgress(progress);
  }, [todos]);

  const createTodo = async (title: string, description: string) => {
    await addTodo(title, description);
    await loadTodos();
    toast.success("✅ Added task successfully.");
  };

  const toggleTodoCompletion = async (id: number, completed: boolean) => {
    await toggleTodo(id, !completed);
    await loadTodos();
  };

  const deleteTodoById = async (id: number) => {
    await deleteTodo(id);
    await loadTodos();
    toast.warning("✅ Task removed successfully.");
  };

  const editTodoById = async (id: number, title: string, description: string) => {
    await editTodo(id, title, description);
    await loadTodos();
    toast.success("✅ Task updated successfully.");
  };

  return ( //? NOTE: use provider to wrap components that need to todo content
    <TodoContext.Provider
      value={{
        todos,
        todosCount,
        totalXp,
        xpProgress,
        level,
        createTodo,
        toggleTodoCompletion,
        deleteTodoById,
        editTodoById,
        getXpForNextLevel,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
}

export function useTodoContext() {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error("useTodoContext must be used within a TodoProvider");
  }
  return context;
}
