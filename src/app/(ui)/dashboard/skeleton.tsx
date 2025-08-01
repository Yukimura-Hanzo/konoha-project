import { Skeleton } from "@/components/ui/skeleton";

export function ProfileWidgetSkeleton() {
  return (
    <div className="rounded-2xl m-4">
      <div className="flex align-center">
        <div className="py-3 pl-0 pr-4 mt-1">
          <Skeleton className="h-12 w-12 rounded-full bg-skeleton" />
        </div>
        <div className="mt-5">
          <div className="text-xl mb-3">
            <Skeleton className="h-4 w-[200px] bg-skeleton" />
          </div>
          <div className="text-sm mt-3">
            <Skeleton className="h-4 w-[200px] bg-skeleton" />
          </div>
        </div>
      </div>
    </div>
  );
}