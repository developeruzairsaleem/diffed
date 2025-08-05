import { Card, CardContent, CardHeader } from "@/components/ui/card";

const SkeletonCard = () => (
  <Card className="bg-black/20 backdrop-blur-sm border-white/10 shadow-lg animate-pulse">
    <CardHeader>
      <div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-700 rounded w-1/2"></div>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="h-5 bg-gray-700 rounded w-24"></div>
        <div className="h-8 bg-gray-600 rounded-full w-28"></div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-700 rounded w-full"></div>
        <div className="h-4 bg-gray-700 rounded w-5/6"></div>
      </div>
      <div className="flex justify-between text-sm">
        <div className="h-4 bg-gray-700 rounded w-1/3"></div>
        <div className="h-4 bg-gray-700 rounded w-1/4"></div>
      </div>
    </CardContent>
  </Card>
);

export function OrdersSkeleton() {
  return (
    <div className="grid grid-cols-1  gap-6">
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  );
}
