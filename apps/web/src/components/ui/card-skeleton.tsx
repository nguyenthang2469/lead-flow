const shimmer =
  'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

export function CardSkeleton() {
  return (
    <div
      className={`${shimmer} group/card bg-card text-card-foreground ring-foreground/10 flex flex-col gap-(--card-spacing) overflow-hidden rounded-xl px-6 py-(--card-spacing) text-sm shadow-xs ring-1 [--card-spacing:--spacing(5.5)] has-[>img:first-child]:pt-0 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl`}
    >
      <div className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="h-5 w-16 rounded-md bg-gray-200 text-sm font-medium" />
        <div className="h-5 w-5 rounded-md bg-gray-200" />
      </div>
      <div className="space-y-2">
        <div className="h-8 w-6 rounded-md bg-gray-200" />
        <div className="h-5 w-20 rounded-md bg-gray-200" />
      </div>
    </div>
  );
}
