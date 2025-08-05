import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function ActiveClientsSkeleton() {
  return (
    <Card className="bg-black/20 backdrop-blur-sm border-white/10 shadow-2xl animate-pulse">
      <CardHeader>
        <div className="h-7 bg-gray-700/50 rounded w-1/3"></div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 border border-white/10 rounded-lg bg-white/5"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gray-600/50"></div>
                <div className="space-y-2">
                  <div className="h-5 bg-gray-700/50 rounded w-32"></div>
                  <div className="h-4 bg-gray-700/50 rounded w-48"></div>
                </div>
              </div>
              <div className="text-right space-y-2">
                <div className="h-5 bg-gray-700/50 rounded w-28"></div>
                <div className="h-4 bg-gray-700/50 rounded w-36"></div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
