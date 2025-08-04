export const ReviewSkeleton = () => {
  return (
    <div className="animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between mb-6">
        <div className="h-8 bg-[#3A0F2A] rounded w-48"></div>
        <div className="flex items-center space-x-4">
          <div className="h-6 bg-[#3A0F2A] rounded w-16"></div>
          <div className="h-5 bg-[#3A0F2A] rounded w-24"></div>
        </div>
      </div>

      {/* Rating Overview Skeleton */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6 mb-6">
        <div className="h-6 bg-[#3A0F2A] rounded w-32 mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="w-4 h-4 bg-[#3A0F2A] rounded"></div>
              <div className="w-4 h-4 bg-[#3A0F2A] rounded"></div>
              <div className="flex-1 bg-[#3A0F2A]/30 rounded-full h-2">
                <div className="bg-[#3A0F2A] h-2 rounded-full w-1/3"></div>
              </div>
              <div className="w-8 h-4 bg-[#3A0F2A] rounded"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews Skeleton */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
        <div className="p-6 border-b border-white/20">
          <div className="h-6 bg-[#3A0F2A] rounded w-32"></div>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="border-b border-white/10 pb-6 last:border-b-0"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#3A0F2A] rounded-full"></div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="h-5 bg-[#3A0F2A] rounded w-24"></div>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <div
                            key={star}
                            className="w-4 h-4 bg-[#3A0F2A] rounded"
                          ></div>
                        ))}
                      </div>
                      <div className="h-4 bg-[#3A0F2A] rounded w-20"></div>
                    </div>
                    <div className="space-y-2 mb-2">
                      <div className="h-4 bg-[#3A0F2A] rounded w-full"></div>
                      <div className="h-4 bg-[#3A0F2A] rounded w-3/4"></div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="h-4 bg-[#3A0F2A] rounded w-16"></div>
                      <div className="h-4 bg-[#3A0F2A] rounded w-20"></div>
                      <div className="h-4 bg-[#3A0F2A] rounded w-12"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
