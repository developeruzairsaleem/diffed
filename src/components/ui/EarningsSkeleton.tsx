export function EarningsSkeleton() {
  return (
    <div className="mx-auto pb-60 animate-pulse">
      <div className="flex md:flex-row flex-col gap-10">
        {/* Left Card */}
        <div className="bg-gray-800/50 h-48 rounded-lg p-8 w-full md:w-1/2 flex flex-col justify-center">
          <div className="h-7 bg-gray-700/50 rounded w-3/4"></div>
          <div className="h-12 bg-gray-700/50 rounded w-1/2 mt-4"></div>
        </div>
        {/* Right Card */}
        <div className="bg-black/20 h-48 rounded-lg p-8 w-full md:w-1/2 flex flex-col justify-center">
          <div className="h-7 bg-gray-700/50 rounded w-3/4"></div>
          <div className="h-12 bg-gray-700/50 rounded w-1/2 mt-4"></div>
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-3 gap-8 mt-12">
        {/* Table Skeleton */}
        <div className="col-span-2 bg-black/20 rounded-[14px] p-8">
          <div className="h-8 bg-gray-700/50 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex justify-between items-center h-10 border-b border-gray-700/50"
              >
                <div className="h-4 bg-gray-700/50 rounded w-1/4"></div>
                <div className="h-4 bg-gray-700/50 rounded w-1/4"></div>
                <div className="h-4 bg-gray-700/50 rounded w-1/5"></div>
                <div className="h-4 bg-gray-700/50 rounded w-1/6"></div>
              </div>
            ))}
          </div>
        </div>
        {/* Payout Method Skeleton */}
        <div className="col-span-1 bg-black/20 rounded-[14px] p-8 flex flex-col items-center">
          <div className="h-8 bg-gray-700/50 rounded w-2/3 mb-8"></div>
          <div className="w-full h-12 bg-gray-700/50 mb-6 rounded-lg"></div>
          <div className="w-full h-14 bg-gray-700/50 mt-auto rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}
