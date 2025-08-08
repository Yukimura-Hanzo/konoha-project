"use client";

//? REACT
import React, { useEffect, useState } from "react";
//? DB
import { getTodos, addTodo, toggleTodo, deleteTodo, editTodo } from "@/app/(neon)/db/todo";
//? SHADCN
import { toast } from "sonner";
//? UI
import CreateForm from "./ui/create-form";
import LevelProgressBar from "./ui/level-progress-bar";
import StatsCard from "./ui/stats-card";
import TodoItem from "./ui/todo-item";
//? ICON
import { MdOutlineTaskAlt } from "react-icons/md";
import { HiClipboardList } from "react-icons/hi";
import { SiOpslevel } from "react-icons/si";

//? TS
interface Todo {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  xp: number;
  created_at: string;
  completed_at?: string;
}

//? XP required for the next level
function getXpForNextLevel(level: number) {
  return 100 + level * 50;
}

export default function TaskManagerAppPage() {

  //* State to store the list of todos, initialized as an empty array
  const [todos, setTodos] = useState<Todo[]>([]);
  //* State to store the total XP earned from completed todos
  const [totalXp, setTotalXp] = useState<number>(0);
  //* State to store the progress percentage toward the next level
  const [xpProgress, setXpProgress] = useState<number>(0);
  //* State to store the current user level
  const [level, setLevel] = useState<number>(1);

  //? Async function to fetch todos from the database & update state
  async function loadTodos() {
    const data = await getTodos() as Todo[]; //* Fetches todos using the getTodos query
    setTodos(data); //* Updates the todos state with fetched data
  }

  //? useEffect() Hook - load todos from db when component mounts
  useEffect(() => {
    loadTodos(); //* Calls the loadTodos function
  }, []); //* Empty dependency array: runs once on mount

  //? useEffect() Hook - recalculate total XP every time todos change & calculate XP progress bar & user level
  useEffect(() => {
    //* Filter completed todos and sum their XP
    const xpEarned = todos.filter((t) => t.completed).reduce((acc, t) => acc + t.xp, 0);
    setTotalXp(xpEarned); //* Update the total XP state
    //* Calculate XP earned from completed todos
    const earnedXp = todos.filter((t) => t.completed).reduce((acc, t) => acc + t.xp, 0);
    setTotalXp(earnedXp); //* Updates the totalXp state
    //* Initializes variables for level & remaining XP calculations
    let currentLevel = 1;
    let remainingXp = earnedXp;
    //* Loops to determine the current level by subtracting XP needed for each level
    while (remainingXp >= getXpForNextLevel(currentLevel)) {
      remainingXp -= getXpForNextLevel(currentLevel);
      currentLevel++;
    }
    setLevel(currentLevel); //* Update the current level
    const nextLevelXp = getXpForNextLevel(currentLevel); //* Calculate XP progress toward next level
    const progress = (remainingXp / nextLevelXp) * 100; //* Calculates progress as percentage toward next level
    setXpProgress(progress); //* Set progress as percentage
  }, [todos]); //* Re-run whenever `todos` array changes

  //? Async function to handle adding a new todo
  const handleCreate = async (title: string, description: string) => {
    await addTodo(title, description); //* Adds the todo using the addTodo query
    await loadTodos(); //* Reloads todos to reflect the create
    toast.success("✅ Added task successfully.");
  };

  //? Async function to toggle a todo's completion status
  const handleToggle = async (id: number, completed: boolean) => {
    await toggleTodo(id, !completed); //* Toggles completion status using toggleTodo query
    await loadTodos(); //* Reloads todos to reflect the updated status
  };

  //? Async function to delete a todo
  const handleDelete = async (id: number) => {
    await deleteTodo(id); //* Deletes the todo using the deleteTodo query
    await loadTodos(); //* Reloads todos to reflect the deletion
    toast.warning("✅ Task removed successfully.");
  };

  //? Async function to edit a todo
  const handleEdit = async (id: number, title: string, description: string) => {
    await editTodo(id, title, description); //* Edit the todo using the editTodo query
    await loadTodos(); //* Reloads todos to reflect the edit
    toast.success("✅ Task updated successfully.");
  };

  return (
    <>
      <div className="m-3 pi-3">
        <small className="font-semibold">A task management app w/ xp points system</small>
        <h2 className="text-2xl flex items-center">
          <MdOutlineTaskAlt style={{ fontSize: '2rem'}} />
          <span className="mx-1 font-semibold">Task Manager App</span>
        </h2>
        <CreateForm createTodo={handleCreate} />
        <LevelProgressBar xpProgress={xpProgress} totalXp={totalXp} level={level} getXpForNextLevel={getXpForNextLevel} />
        <div className="grid grid-cols-2 gap-2 mb-3">
          <StatsCard icon={<HiClipboardList />} label={`${todos.length !== 1 ? "To-Do's" : "To-Do"}`} value={todos.length} />
          <StatsCard icon={<SiOpslevel />} label="Level" value={level} />
          <ul>
            {todos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} onToggle={handleToggle} onDelete={handleDelete} onEdit={handleEdit} />
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
