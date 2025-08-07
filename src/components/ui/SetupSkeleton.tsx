import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function SetupSkeleton() {
  return (
    <div className="p-4 md:p-6 space-y-8 animate-pulse">
      {/* Header */}
      <div className="h-24 md:h-32 bg-gray-800/50 rounded-lg flex items-end p-4">
        <div className="h-10 bg-gray-700/50 rounded w-1/2"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (Details) */}
        <div className="lg:col-span-1 space-y-8">
          <Card className="bg-black/20 backdrop-blur-sm border-white/10">
            <CardHeader>
              <div className="h-6 bg-gray-700/50 rounded w-32"></div>
            </CardHeader>
            <CardContent className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-gray-600/50"></div>
              <div className="h-5 bg-gray-700/50 rounded w-24"></div>
            </CardContent>
          </Card>
          <Card className="bg-black/20 backdrop-blur-sm border-white/10">
            <CardHeader>
              <div className="h-6 bg-gray-700/50 rounded w-32"></div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-4 bg-gray-700/50 rounded w-full"></div>
              <div className="h-4 bg-gray-700/50 rounded w-5/6"></div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (Chat & Actions) */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="bg-black/20 backdrop-blur-sm border-white/10">
            <CardHeader>
              <div className="h-6 bg-gray-700/50 rounded w-40"></div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-8 bg-gray-800/50 rounded-full w-full"></div>
              <div className="h-10 bg-gray-700/50 rounded-md w-36 ml-auto"></div>
            </CardContent>
          </Card>
          <Card className="bg-black/20 backdrop-blur-sm border-white/10 h-96">
            <CardHeader>
              <div className="h-6 bg-gray-700/50 rounded w-24"></div>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}
