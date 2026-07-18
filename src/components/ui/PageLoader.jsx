import Skeleton from "./Skeleton";

function PageLoader() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-56" />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="rounded-xl border bg-white p-6"
          >
            <Skeleton className="mb-4 h-4 w-24" />
            <Skeleton className="h-8 w-20" />
          </div>
        ))}
      </div>

      <div className="rounded-xl border bg-white p-6">
        <Skeleton className="mb-4 h-6 w-48" />
        <Skeleton className="h-72 w-full" />
      </div>
    </div>
  );
}

export default PageLoader;