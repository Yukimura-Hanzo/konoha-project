"use client";

//? SHADCN
import { toast } from "sonner";
//? components
import CreateForm from "./components/create-form";
import LevelProgressBar from "./components/level-progress-bar";
import StatsCard from "./components/stats-card";
import TodoItem from "./components/todo-item";
//? ICON
import { MdOutlineTaskAlt } from "react-icons/md";
import { HiClipboardList } from "react-icons/hi";
import { SiOpslevel } from "react-icons/si";
//? CONTEXT
import { useTodoContext, TodoProvider } from "./context/todo-context";

export default function TaskManagerAppPage() {
  return (
    <TodoProvider>
      <TaskManagerAppContent />
    </TodoProvider>
  );
}

function TaskManagerAppContent() {

  const {
    todos,
    totalXp,
    xpProgress,
    level,
    createTodo,
    toggleTodoCompletion,
    deleteTodoById,
    editTodoById,
    getXpForNextLevel,
  } = useTodoContext();

  return (
    <>
      <div className="m-3 pi-3">
        <small className="font-semibold">A task management app w/ xp points system</small>
        <h2 className="text-2xl flex items-center">
          <MdOutlineTaskAlt style={{ fontSize: '2rem'}} />
          <span className="mx-1 font-semibold">Task Manager App</span>
        </h2>
        <CreateForm />
        <LevelProgressBar />
        <div className="grid grid-cols-2 gap-2 mb-3">
          <StatsCard icon={<HiClipboardList />} label={`${todos.length !== 1 ? "To-Do's" : "To-Do"}`} statKey="todosCount" />
          <StatsCard icon={<SiOpslevel />} label="Level" statKey="level" />
          <ul>
            {todos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} />
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}