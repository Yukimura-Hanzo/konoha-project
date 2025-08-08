"use client";

//? REACT
import React, { ReactNode } from "react";
//? SHADCN
import { Badge } from "@/components/ui/badge";
//? CONTEXT
import { useTodoContext } from "../context/todo-context";

//? TS
interface StatsCardProps {
  icon: ReactNode
  label: string
  statKey: "todosCount" | "level" | "totalXp"; //? extend as needed
}

export default function StatsCard({ icon, label, statKey }: StatsCardProps) {

  //* todosCount, level, totalXp from context
  const { todosCount, level, totalXp } = useTodoContext();

  //* Map options
  const statsMap = {
    todosCount,
    level,
    totalXp,
  };

  //* Define options as value
  const value = statsMap[statKey];

  return (
    <div className="rounded-2xl border-zinc-300 border-2 min-h-24 flex flex-col justify-between p-3">
      <div className="flex items-center gap-2">
        <Badge className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums">
          {icon}
        </Badge>
        <span className="text-sm">{label}</span>
      </div>
      <div className="flex justify-end">
        <span className="text-3xl font-medium text-zinc-600">
          {value}
        </span>
      </div>
    </div>
  );
}
