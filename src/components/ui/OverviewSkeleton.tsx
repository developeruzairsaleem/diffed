import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { orbitron } from "@/fonts/fonts";

export function OverviewSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-10">
        <div className="w-16 h-16 rounded-full bg-gray-700/50"></div>
        <div>
          <div className="h-4 bg-gray-700/50 rounded w-48 mb-2"></div>
          <div className="h-8 bg-gray-700/50 rounded w-64"></div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="h-40 rounded-lg bg-gray-800/50"></div>
        <div className="h-40 rounded-lg bg-gray-800/50"></div>
        <div className="h-40 rounded-lg bg-gray-800/50"></div>
      </div>

      {/* Game Stats Section */}
      <div>
        <div
          className={`h-8 bg-gray-700/50 rounded w-1/3 mb-6 ${orbitron.className}`}
        ></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-32 rounded-lg bg-gray-800/50"></div>
          <div className="h-32 rounded-lg bg-gray-800/50"></div>
        </div>
      </div>
    </div>
  );
}
