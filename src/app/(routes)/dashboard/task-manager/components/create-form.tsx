"use client";

//? REACT
import React, { useState } from "react";
//? UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
//? CONTEXT
import { useTodoContext } from "../context/todo-context";

export default function CreateForm() {

  //* createTodo from TodoContext
  const { createTodo } = useTodoContext();
  //* State to store the title input for a new todo
  const [title, setTitle] = useState<string>('');
  //* State to store the description input for a new todo
  const [description, setDescription] = useState<string>('');

  const handleAdd = async () => {
    if (!title) return; //* Prevents adding a todo if the title is empty
    await createTodo(title, description); //* Adds the todo using the addTodo query
    setTitle(""); //* Resets the title input
    setDescription(""); //* Reloads todos to reflect the new addition
  }

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button>+ Create a Task</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create a Task</DialogTitle>
            <DialogDescription>
              Create a new task here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="todo-title">Title</Label>
              <Input
                type="text"
                placeholder="Start creating..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="todo-description">Description</Label>
              <Textarea
                placeholder="Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleAdd}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
