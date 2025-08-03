"use client";

//? REACT
import React, { useEffect, useState } from "react";
//? DB QUERIES
import { getTodos, addTodo, toggleTodo, deleteTodo } from "@/app/(neon)/db/todo";
//? UI
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
//? ICONS
import { MoreHorizontal, AlertCircleIcon } from "lucide-react";
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

//* XP required for the next level
function getXpForNextLevel(level: number) {
  return 100 + level * 50;
}

export default function TodosApp() {
  //* State to store the list of todos, initialized as an empty array
  const [todos, setTodos] = useState<Todo[]>([]);
  //* State to store the title input for a new todo
  const [title, setTitle] = useState("");
  //* State to store the description input for a new todo
  const [description, setDescription] = useState("");
  //* State to store the total XP earned from completed todos
  const [totalXp, setTotalXp] = useState<number>(0);
  //* State to store the progress percentage toward the next level
  const [xpProgress, setXpProgress] = useState<number>(0);
  //* State to store the current user level
  const [level, setLevel] = useState<number>(1);
  //* State to store the ID of the selected todo for editing/viewing details
  const [selectedTodoId, setSelectedTodoId] = useState<number | null>(null);

  //? useEffect to recalculate total XP every time todos change
  useEffect(() => {
    //* Filter completed todos and sum their XP
    const xpEarned = todos.filter((t) => t.completed).reduce((acc, t) => acc + t.xp, 0);
    //* Update the total XP state
    setTotalXp(xpEarned);
  }, [todos]); //* Re-run whenever `todos` array changes

  //? useEffect to calculate XP progress bar and user level
  useEffect(() => {
    //* Calculate XP earned from completed todos
    const earnedXp = todos.filter((t) => t.completed).reduce((acc, t) => acc + t.xp, 0);
    //* Updates the totalXp state
    setTotalXp(earnedXp);
    //* Initializes variables for level & remaining XP calculations
    let currentLevel = 1;
    let remainingXp = earnedXp;
    //* Loops to determine the current level by subtracting XP needed for each level
    while (remainingXp >= getXpForNextLevel(currentLevel)) {
      remainingXp -= getXpForNextLevel(currentLevel);
      currentLevel++;
    }
    setLevel(currentLevel); //* Update the current level
    //* Calculate XP progress toward next level
    const nextLevelXp = getXpForNextLevel(currentLevel);
    //* Calculates progress as a percentage toward the next level
    const progress = (remainingXp / nextLevelXp) * 100;
    setXpProgress(progress); //* Set progress as percentage
  }, [todos]); //* Re-run when todos change

  //? Async function to fetch todos from the database & update state
  async function loadTodos() {
    //* Fetches todos using the getTodos query
    const data = await getTodos() as Todo[];
    //* Updates the todos state with fetched data
    setTodos(data);
  }

  //? useEffect hook to load todos when the component mounts
  useEffect(() => {
    //* Calls the loadTodos function
    loadTodos();
  }, []); //* Empty dependency array: runs once on mount

  //* Async function to handle adding a new todo
  const handleAdd = async () => {
    //* Prevents adding a todo if the title is empty
    if (!title) return;
    //* Adds the todo using the addTodo query
    await addTodo(title, description);
    //* Resets the title input
    setTitle("");
    //* Reloads todos to reflect the new addition
    setDescription("");
    await loadTodos();
  };

  //? Async function to toggle a todo's completion status
  const handleToggle = async (id: number, completed: boolean) => {
    //*d Toggles the todo's completion status using the toggleTodo query
    await toggleTodo(id, !completed);
    //* Reloads todos to reflect the updated status
    await loadTodos();
  };

  //? Async function to delete a todo
  const handleDelete = async (id: number) => {
    //* Deletes the todo using the deleteTodo query
    await deleteTodo(id);
    //* Reloads todos to reflect the deletion
    await loadTodos();
  };

  //* Finds the specific todo based on the selectedTodoId for displaying details
  const specificTodo = todos.find((todo) => todo.id === selectedTodoId);

  //* Determine whether to use "todo" or "todo's" based on the count
  const todosNoun = todos.length !== 1 ? "To-Do's" : "To-Do";

  //* Create heading text showing how many todos are remaining
  const headingText = `${todosNoun}`;

  return (
    <div className="m-4">
      <h2 className="font-semibold">📝 To-Do App</h2>
      <Dialog>
        <form>
          <DialogTrigger asChild>
            <Button className="my-3 w-full">Create a Task</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add a Task</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you&apos;re
                done.
              </DialogDescription>
            </DialogHeader>
            {/* Add Todo */}
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="todo-title">Title</Label>
                <Input
                  type="text"
                  placeholder="Start creating..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="border rounded p-2"
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="todo-description">Description</Label>
                <Textarea
                  placeholder="Description (optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="border rounded p-2"
                />
              </div>
              <DialogClose asChild>
                <Button
                  onClick={handleAdd}
                >
                  Create
                </Button>
              </DialogClose>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
      {/* Level progress bar */}
      <div className="bg-zinc-200 min-h-24 rounded-2xl flex flex-col justify-between mb-3 p-3">
        <div className="flex align-center mb-3">
          <span className="font-semibold">&#x1F680;	Progress Bar</span>
        </div>
        <Progress value={xpProgress} className="h-2" />
        <div className="flex justify-between mt-2">
          <p className="text-sm text-muted-foreground">
            {Math.round((xpProgress / 100) * getXpForNextLevel(level))} / {getXpForNextLevel(level)} XP
          </p>
          <p className="text-xs text-muted-foreground">Total XP: {totalXp}</p>
        </div>
      </div>
      {/* Grid content */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        {/* Todos remaining */}
        <div className="bg-zinc-200 min-h-24 rounded-2xl flex flex-col justify-between p-3">
          <div>
            <Badge className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums">
              <HiClipboardList />
            </Badge>
            <span className="text-sm mx-1">
              {headingText}
            </span>
          </div>
          <div className="flex justify-end">
            <span className="text-3xl font-medium text-zinc-600">
              {todos.length}
            </span>
          </div>
        </div>
        {/* Level */}
        <div className="bg-zinc-200 min-h-24 rounded-2xl flex flex-col justify-between p-3">
          <div>
            <Badge className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums">
              <SiOpslevel />
            </Badge>
            <span className="text-sm mx-1">Level</span>
          </div>
          <div className="flex justify-end">
            <span className="text-3xl font-medium text-zinc-600">
              {level}
            </span>
          </div>
        </div>
      </div>
      {/* Todo items */}
      <div className="bg-zinc-200 min-h-24 rounded-2xl mb-4 p-3">
        <ul>
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center justify-between w-full rounded-2xl border-zinc-300 border-2 p-4 mb-3"
          >
            <div>
              <span className="flex justify-start gap-3">
                <Checkbox
                  id={`${todo.id}`}
                  checked={todo.completed}
                  onChange={() => handleToggle(todo.id, todo.completed)}
                  onCheckedChange={(checked: boolean) => {
                    handleToggle(todo.id, todo.completed);
                    if (checked) {
                      toast.success(`✅ Task completed. Earned +${todo.xp} XP`, {
                        action: {
                          label: "Done",
                          onClick: () => console.log("Confirmed"),
                        },
                      });
                    }
                  }}
                  className="border-2 border-zinc-500"
                />
                {/* Label showing the task title */}
                <div
                  className={`flex flex-col ${
                    todo.completed ? "line-through text-muted-foreground" : ""
                  }`}
                >
                  <Label htmlFor={`${todo.id}`} className="form-label">
                    {todo.title}
                  </Label>
                </div>
              </span>
            </div>
            <div>
              <span>
                <Dialog>
                  <form>
                    <DialogTrigger asChild>
                    <Button variant="ghost" onClick={() => setSelectedTodoId(todo.id)} className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal />
                    </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader className="text-left">
                        <DialogTitle className="flex align-center">
                          <AlertCircleIcon />
                          <span className="p-1">Task Info</span>
                        </DialogTitle>
                        <div>
                        Feature: Edit, view or delete your task. Save changes here.
                        </div>
                      </DialogHeader>
                      {specificTodo && (
                        <div key={specificTodo.id}>
                        <div className="grid gap-4">
                          <div className="grid gap-3">
                            <Label htmlFor={`${specificTodo.id}`}>Title</Label>
                            <Input
                              type="text"
                              placeholder={specificTodo.title}
                              value={specificTodo.title}
                              onChange={(e) => setTitle(e.target.value)}
                              className="text-muted-foreground border rounded p-2"
                            />
                          </div>
                          <div className="grid gap-3">
                            <Label htmlFor={`${specificTodo.id}`}>Description</Label>
                            <Textarea
                              placeholder={specificTodo.description}
                              value={specificTodo.description?.trim() ? specificTodo.description : 'n/a'}
                              onChange={(e) => setDescription(e.target.value)}
                              className="text-muted-foreground border rounded p-2"
                            />
                          </div>
                        </div>
                        <div className="flex items-center mt-2">
                          <span>XP:</span>
                          <span className="mx-2">{todo.xp}+ Points</span>
                        </div>
                          <div className="font-semibold text-xs text-gray-400 mt-2">
                            Created: {new Date(specificTodo.created_at).toLocaleString()}
                          </div>
                          {specificTodo.completed && specificTodo.completed_at && (
                            <div className="text-xs text-green-500">
                              Completed: {new Date(specificTodo.completed_at).toLocaleString()}
                            </div>
                          )}
                        <DialogClose asChild>
                          <Button
                            variant="destructive"
                            onClick={() => handleDelete(todo.id)}
                            className="mt-3 w-full"
                          >
                            Delete
                          </Button>
                        </DialogClose>
                        </div>
                      )}
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </form>
                </Dialog>
              </span>
            </div>
          </li>
        ))}
        </ul>
      </div>
    </div>
  );
}
