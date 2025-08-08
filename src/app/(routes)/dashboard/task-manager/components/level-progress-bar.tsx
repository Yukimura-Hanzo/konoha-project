"use client";

//? SHADCN
import { Progress } from "@/components/ui/progress";
//? CONTEXT
import { useTodoContext } from "../context/todo-context";

export default function LevelProgressBar() {

  //* xpProgress, totalXp, level, getXpForNextLevel from context
  const { xpProgress, totalXp, level, getXpForNextLevel } = useTodoContext();

  const currentXp = Math.round((xpProgress / 100) * getXpForNextLevel(level));
  const nextLevelXp = getXpForNextLevel(level);

  return (
    <div className="rounded-2xl border-zinc-300 border-2 min-h-24 flex flex-col justify-between mb-3 p-3">
      <div className="flex items-center mb-3">
        <span className="font-semibold">&#x1F680; Progress Bar</span>
      </div>
      <Progress value={xpProgress} className="h-2" />
      <div className="flex justify-between mt-2">
        <p className="text-sm text-muted-foreground">
          {currentXp} / {nextLevelXp} XP
        </p>
        <p className="text-xs text-muted-foreground">Total XP: {totalXp}</p>
      </div>
    </div>
  );
}
