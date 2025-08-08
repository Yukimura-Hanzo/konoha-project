"use  client";

//? REACT
import React, { useState } from "react";
//? SHADCN
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
//? ICON
import { AlertCircleIcon, MoreHorizontal } from "lucide-react";
//? CONTEXT
import { useTodoContext } from "../context/todo-context";

//? TS Types
interface Todo {
  id: number
  title: string
  description?: string
  completed: boolean
  xp: number
  created_at: string
  completed_at?: string
}

interface TodoItemProps {
  todo: Todo;
}

export default function TodoItem({ todo }: TodoItemProps) {
  //* State to store edited title
  const [editTitle, setEditTitle] = useState<string>(todo.title);
  //* State to store edited description
  const [editDescription, setEditDescription] = useState<string>(todo.description ?? "");

  //* toggleTodoCompletion, deleteTodoById, editTodoById from context
  const { toggleTodoCompletion, deleteTodoById, editTodoById } = useTodoContext();

  //* Handle when todo is checked / completed
  const handleCheckboxChange = (checked: boolean) => {
    toggleTodoCompletion(todo.id, todo.completed)
    if (checked) {
      toast.success(`✅ Task completed. Earned +${todo.xp} XP`, {
        action: {
          label: "Done",
          onClick: () => console.log("Confirmed"),
        },
      })
    }
  }

  //* Handle edit todo
  const handleEdit = () => {
    editTodoById(todo.id, editTitle, editDescription)
  }

  return (
    <li className="flex items-center justify-between w-full rounded-2xl border-zinc-300 border-2 p-4 mb-3">
      <div>
        <span className="flex justify-start gap-3">
          <Checkbox
            id={`${todo.id}`}
            checked={todo.completed}
            onChange={() => toggleTodoCompletion(todo.id, todo.completed)}
            onCheckedChange={handleCheckboxChange}
            className="border-2 border-zinc-500"
          />
          <div
            className={`flex flex-col ${
              todo.completed ? "line-through text-muted-foreground" : ""
            }`}
          >
            <Label htmlFor={`${todo.id}`}>{todo.title}</Label>
          </div>
        </span>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            onClick={() => {
              setEditTitle(todo.title)
              setEditDescription(todo.description ?? "")
            }}
            className="h-8 w-8 p-0"
          >
            <span className="sr-only">Open menu</span>
            <MoreHorizontal />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader className="text-left">
            <DialogTitle className="flex items-center">
              <AlertCircleIcon className="mr-1" />
              Task Info
            </DialogTitle>
            <div className="text-sm text-muted-foreground">
              Feature: Edit, view or delete your task. Save changes here.
            </div>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor={`edit-title-${todo.id}`}>Title</Label>
              <Input
                id={`edit-title-${todo.id}`}
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor={`edit-description-${todo.id}`}>Description</Label>
              <Textarea
                id={`edit-description-${todo.id}`}
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
              />
            </div>
            <div className="flex items-center mt-2">
              <span>XP:</span>
              <span className="mx-2">{todo.xp}+ Points</span>
            </div>
            <div className="text-xs text-gray-400 mt-2 font-semibold">
              Created: {new Date(todo.created_at).toLocaleString()}
            </div>
            {todo.completed && todo.completed_at && (
              <div className="text-xs text-green-500">
                Completed: {new Date(todo.completed_at).toLocaleString()}
              </div>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button variant="destructive" onClick={() => deleteTodoById(todo.id)}>
                Delete
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button onClick={handleEdit}>Save Changes</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </li>
  );
}
