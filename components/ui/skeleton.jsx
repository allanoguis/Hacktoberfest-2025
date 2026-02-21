import { cn } from "@/lib/utils";

const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted",
        className
      )}
      {...props}
    />
  );
};

// Leaderboard skeleton component
export const LeaderboardSkeleton = () => {
  return (
    <div className="flex flex-col w-full min-h-screen items-center text-white pt-[calc(var(--nav-height)+4rem)] pb-20">
      <div className="mb-12 text-center px-4">
        <Skeleton className="h-8 w-48 mx-auto mb-4" />
        <Skeleton className="h-4 w-32 mx-auto" />
      </div>
      
      <ul className="flex flex-col gap-4 w-full max-w-2xl px-4 pb-20">
        {Array.from({ length: 5 }).map((_, index) => (
          <li key={index} className="w-full">
            <div className="flex items-center gap-2 mb-1">
              <Skeleton className="h-6 w-24" />
            </div>
            <div className="flex items-center p-4 gap-4 bg-card-foreground rounded-xl shadow-lg">
              <Skeleton className="w-8 h-8 rounded-full" />
              <Skeleton className="w-12 h-12 rounded-full" />
              <div className="flex-grow">
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-3 w-24" />
              </div>
              <div className="text-right">
                <Skeleton className="h-8 w-16 mb-1" />
                <Skeleton className="h-3 w-12" />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Player card skeleton
export const PlayerCardSkeleton = () => {
  return (
    <div className="flex items-center p-4 gap-4 bg-card-foreground rounded-xl shadow-lg animate-pulse">
      <Skeleton className="w-8 h-8 rounded-full" />
      <Skeleton className="w-12 h-12 rounded-full" />
      <div className="flex-grow">
        <Skeleton className="h-5 w-32 mb-2" />
        <Skeleton className="h-3 w-24" />
      </div>
      <div className="text-right">
        <Skeleton className="h-8 w-16 mb-1" />
        <Skeleton className="h-3 w-12" />
      </div>
    </div>
  );
};

export default Skeleton;
