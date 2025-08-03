//? REACT
import React, { Suspense } from "react";
//? UI
import ProfileWidget from "@/app/(ui)/dashboard/profile-widget";
import { ProfileWidgetSkeleton } from "@/app/(ui)/dashboard/skeleton";
import TodosApp from "./components/todo-app";

export default function DashboardOverview() {
  return (
    <div className="container">
      <Suspense fallback={<ProfileWidgetSkeleton />}>
        <ProfileWidget />
      </Suspense>
      <TodosApp />
    </div>
  );
}