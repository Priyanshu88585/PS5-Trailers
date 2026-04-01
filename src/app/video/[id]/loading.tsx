export default function VideoLoading() {
  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6 animate-pulse">
      <div className="space-y-4">
        <div className="skeleton rounded-xl aspect-video w-full" />
        <div className="space-y-2">
          <div className="skeleton h-8 w-3/4 rounded-lg" />
          <div className="skeleton h-5 w-1/2 rounded" />
          <div className="flex gap-3 mt-3">
            <div className="skeleton h-10 w-24 rounded-xl" />
            <div className="skeleton h-10 w-28 rounded-xl" />
            <div className="skeleton h-10 w-20 rounded-xl" />
          </div>
        </div>
        <div className="skeleton h-24 w-full rounded-xl" />
        <div className="skeleton h-48 w-full rounded-xl" />
      </div>
      <div className="space-y-3">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex gap-3">
            <div className="skeleton w-36 aspect-video rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-2 py-1">
              <div className="skeleton h-4 w-full rounded" />
              <div className="skeleton h-3 w-2/3 rounded" />
              <div className="skeleton h-3 w-1/2 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
