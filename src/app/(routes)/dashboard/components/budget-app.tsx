"use client";

//? REACT
import React, { useEffect, useState, FormEvent } from "react";
//? DB QUERIES
import { BudgetItem, getBudgetItems, addBudgetItem, deleteBudgetItem, editBudgetItem } from "@/app/(neon)/db/budget";
//? SHADCN
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
//? UI
import { ChartRadialBudget } from "./finance-flowchart";
//? ICONS
import { HiMiniArrowTrendingUp, HiArrowTrendingDown } from "react-icons/hi2";

export default function BudgetApp() {
  //* Store all budget entries
  const [items, setItems] = useState<BudgetItem[]>([]);
  //* Dialog box visibility state
  const [open, setOpen] = useState(false);
  //* Entry type state
  const [type, setType] = useState<'income' | 'expense'>('income');
  //* Entry title input
  const [title, setTitle] = useState<string>("");
  //* Entry amount input
  const [amountInput, setAmountInput] = useState<string>("");
  //* State to store edited type
  const [editType, setEditType] = useState<'income' | 'expense'>();
  //* State to store edited title
  const [editTitle, setEditTitle] = useState<string>("");
  //* State to store edited amount
  const [editAmount, setEditAmount] = useState<string>("");
  //* State to store ID of edited entry
  const [selectedEntryId, setSelectedEntryId] = useState<number | null>(null);

  async function loadItems() {
    //* Fetch entries from the database
    const data = await getBudgetItems();
    //* Store them in the state
    setItems(data);
  }

  //? useEffect on mount to fetch the budget items
  useEffect(() => {
    //* Call async function
    loadItems();
  }, []); //* Empty dependency array ensures this runs only once

  function parseAmount(type: 'income' | 'expense', input: string): number {
    //* Convert string to float
    const parsed = parseFloat(input);
    //* Return 0 if input invalid
    if (isNaN(parsed)) return 0;
    //* Return positive for income, negative for expense
    return type === "income" ? Math.abs(parsed) : -Math.abs(parsed);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    //* Prevent page reload on form submit
    e.preventDefault();
    //* Parse & normalize amount
    const parsedAmount = parseAmount(type, amountInput);
    //* Stop if title empty or amount is zero
    if (!title || parsedAmount === 0) return;
    //* Add item to database
    await addBudgetItem(title, parsedAmount, type);
    //* Refecth updated items
    const updated = await getBudgetItems();
    //* Update local state
    setItems(updated);
    //* Clear all inputs
    setTitle("");
    setAmountInput("");
    setOpen(false);
    toast.success("✅ Entry added successfully.");
  }

  async function handleDelete(id: number) {
    //* Delete entry w/ deleteBudgetItem
    await deleteBudgetItem(id);
    //* Reload
    await loadItems();
    toast.warning("✅ Entry removed successfully.");
  }

  async function handleEdit() {
    //* Guard clause: exit early if any critical input is missing or empty
    if (
      selectedEntryId === null ||   //* No entry is selected to edit
      !editTitle?.trim() ||         //* Title is missing or just whitespace
      !editType ||                  //* Type ('income' or 'expense') is missing
      !editAmount                   //* Amount is missing (string)
    )
      return;
    //* Validate that the type is exactly 'income' or 'expense'
    if (editType !== 'income' && editType !== 'expense') {
      //* Show error toast for invalid type
      toast.error("❌ Invalid type.");
      return;
    }
    //* Convert the string amount input into a signed number based on type
    const parsedAmount = parseAmount(editType, editAmount);
    //* Validate that parsed amount is not zero
    if (parsedAmount === 0) {
      //* Show error toast
      toast.error("❌ Amount must be non-zero.");
      return;
    }
    //* Call DB update function with valid values (correct argument order)
    await editBudgetItem(
      selectedEntryId,    //* ID of the item to update
      editTitle.trim(),   //* Trimmed title string
      parsedAmount,       //* Parsed number (can be negative for 'expense')
      editType            //* Either 'income' or 'expense'
    );
    //* Clear edit state after successful update
    setSelectedEntryId(null);    //* Unset selected ID
    setEditTitle("");            //* Reset title input
    setEditAmount("");           //* Reset amount input
    setEditType("income");       //* Default edit type back to 'income'
    //* Reload the items from the database to reflect updated changes
    await loadItems();
    //* Show success toast to user
    toast.success("✅ Entry updated successfully.");
  }

  const income = items
    //* Keep only income items
    .filter((item) => item.type === "income")
    //* Sum all income amounts
    .reduce((acc, item) => acc + item.amount, 0);

  const expense = items
    //* Keep only expense items
    .filter((item) => item.type === "expense")
    //* Sum all expense amounts (as positive)
    .reduce((acc, item) => acc + Math.abs(item.amount), 0);

  //* Calculate remaining balance
  const balance = income - expense;

  function formatRelativeDateTime(dateString: string): string {
    //* Parse input date string
    const date = new Date(dateString);
    //* Current date/time
    const now = new Date();
    //* Time difference in ms
    const diffMs = now.getTime() - date.getTime();
    //* Convert to full days difference
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    //* Format hours
    const hours = String(date.getHours()).padStart(2, "0");
    //* Format minutes
    const minutes = String(date.getMinutes()).padStart(2, "0");
    //* Format as "HH.MM"
    const time = `${hours}.${minutes}`;
    //* Case for today or days ago
    if (diffDays <= 0) { return `Today, ${time}`; }
    if (diffDays === 1) { return `Yesterday, ${time}`; }
    if (diffDays < 7) { return `${diffDays} days ago`; }
    //* Older than a week → format as "dd/mm, hh.mm"
    //* Day of the month
    const day = String(date.getDate()).padStart(2, "0");
    //* Month (0-indexed)
    const month = String(date.getMonth() + 1).padStart(2, "0");
    //* Fallback formatted date
    return `${day}/${month}, ${time}`;
  }

  return (
    <div className="container mx-auto p-4 flex flex-col gap-6">
      <h1 className="font-semibold">💰 Financial Log App</h1>
      {/* Add entry dialog button */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Add Entry</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>New Budget Entry</DialogTitle>
            <DialogDescription>
              Fill in the fields below to add a new income or expense.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Select value={type} onValueChange={(val) => setType(val as 'income' | 'expense')}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Entry Type</SelectLabel>
                  <SelectItem value="income">
                    <HiMiniArrowTrendingUp className="text-green-700 inline mr-1" />
                    Income
                  </SelectItem>
                  <SelectItem value="expense">
                    <HiArrowTrendingDown className="text-red-700 inline mr-1" />
                    Expense
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Input
              type="text"
              placeholder="Enter title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Amount (£)"
              value={amountInput}
              onChange={(e) => setAmountInput(e.target.value)}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Add Entry</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {/* Budget radial chart */}
      <ChartRadialBudget income={income} expense={expense} balance={balance} />
      {/* Transactions */}
      <div className="flex justify-between mx-2">
        <h2>Transactions</h2>
        <a href="#">See All</a>
      </div>
      <div className="mx-2">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between">
            <div className="flex flex-col mb-3">
              <Dialog>
                <form>
                  <DialogTrigger asChild>
                    <span
                      className="text-md"
                      onClick={() => {
                        setSelectedEntryId(item.id);
                        setEditType(item.type);
                        setEditTitle(item.title);
                        setEditAmount(String(Math.abs(item.amount)));
                      }}
                    >{item.title}</span>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Edit Entry: {item.title}</DialogTitle>
                      <DialogDescription>
                        Make changes to your transactions here. Click save when you&apos;re
                        done.
                      </DialogDescription>
                    </DialogHeader>
                    <Select
                      value={editType}
                      onValueChange={(val) => setEditType(val as 'income' | 'expense')}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Entry Type</SelectLabel>
                          <SelectItem value="income">
                            <HiMiniArrowTrendingUp className="text-green-700 inline mr-1" />
                            Income
                          </SelectItem>
                          <SelectItem value="expense">
                            <HiArrowTrendingDown className="text-red-700 inline mr-1" />
                            Expense
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <Input
                      type="text"
                      placeholder={item.title}
                      value={editTitle  || ""}
                      onChange={(e) => setEditTitle(e.target.value)}
                    />
                    <Input
                      type="text"
                      placeholder={`(£) ${item.amount}`}
                      value={editAmount  || ""}
                      onChange={(e) => setEditAmount(e.target.value)}
                    />
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <DialogClose asChild>
                        <Button onClick={handleEdit} type="submit">Save changes</Button>
                      </DialogClose>
                      <DialogClose asChild>
                        <Button
                          variant="destructive"
                          onClick={() => handleDelete(item.id)}
                          className="mt-3 w-full"
                        >
                          Delete
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </form>
              </Dialog>
              {/* Display entry type & updated */}
              <div className="flex">
                <span className="text-xs text-zinc-600">{item.type}</span>
                {/* <span className="text-xs text-zinc-600 mx-2">{new Date(item.created_at).toLocaleString()}</span> */}
                <span className="text-xs text-zinc-600 mx-2">
                  {formatRelativeDateTime(item.updated_at)}
                </span>
              </div>
            </div>
            {/* Display amount */}
            <div>
              <span
                className={`text-sm font-medium ${
                  item.amount >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {item.amount >= 0 ? "+" : "−"}£{Math.abs(item.amount)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
