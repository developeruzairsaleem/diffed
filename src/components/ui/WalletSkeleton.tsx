import { Wallet, Activity } from "lucide-react";

export const WalletSkeleton = () => {
  return (
    <div className="space-y-6 pb-12 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-8 bg-[#3A0F2A] rounded w-24"></div>
        <div className="h-10 bg-[#3A0F2A] rounded-2xl w-32"></div>
      </div>

      {/* Balance Card Skeleton */}
      <div
        style={{ padding: "2px" }}
        className="bg-gradient-to-r rounded-xl from-pink-500 gap-3 via-purple-500 to-cyan-400"
      >
        <div className="bg-[#3A0F2A] rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="h-4 bg-[#3A0F2A]/60 rounded w-32 mb-2"></div>
              <div className="h-8 bg-[#3A0F2A]/60 rounded w-24"></div>
            </div>
            <div className="p-3 bg-gradient-to-r from-pink-500 gap-3 via-purple-500 to-cyan-400 bg-opacity-50 rounded-full">
              <Wallet className="w-8 h-8 text-white/50" />
            </div>
          </div>
          <div className="mt-4 flex items-center space-x-4">
            <div className="h-4 bg-[#3A0F2A]/60 rounded w-40"></div>
          </div>
        </div>
      </div>

      {/* Transaction History Skeleton */}
      <div
        style={{ padding: "2px" }}
        className="bg-gradient-to-r rounded-xl from-pink-500 via-purple-500 to-cyan-400"
      >
        <div className="bg-[#3A0F2A] rounded-xl">
          <div
            style={{
              backgroundColor: "rgba(255,255,255,0.05)",
            }}
            className="rounded-xl shadow-sm"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center">
                <Activity className="w-5 h-5 mr-2 text-white/50" />
                <div className="h-6 bg-[#3A0F2A]/60 rounded w-40"></div>
              </div>
            </div>

            {/* Transaction Items */}
            <div className="p-6">
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    style={{ backgroundColor: "rgba(255,255,255,0.25)" }}
                    className="flex items-center justify-between p-4 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        style={{ backgroundColor: "rgba(255,255,255,0.40)" }}
                        className="p-2 rounded-full w-9 h-9 bg-[#3A0F2A]/60"
                      ></div>
                      <div>
                        <div className="h-5 bg-[#3A0F2A]/60 rounded w-32 mb-1"></div>
                        <div className="h-4 bg-[#3A0F2A]/60 rounded w-24"></div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="h-5 bg-[#3A0F2A]/60 rounded w-16 mb-1"></div>
                      <div className="h-4 bg-[#3A0F2A]/60 rounded w-12"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
