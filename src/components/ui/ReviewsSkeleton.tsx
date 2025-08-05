import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Star } from "lucide-react";

export function ReviewsSkeleton() {
  return (
    <Card className="bg-black/30 backdrop-blur-sm border-white/10 shadow-2xl">
      <CardHeader>
        <CardTitle className="text-white">My Reviews</CardTitle>
        <CardDescription className="text-white/70">
          Feedback from clients I've coached
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6 animate-pulse">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="border-b border-white/10 pb-4 last:border-b-0"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gray-700"></div>
                  <div className="space-y-1">
                    <div className="h-4 bg-gray-600 rounded w-28"></div>
                    <div className="flex">
                      <Star className="w-4 h-4 text-gray-600" />
                      <Star className="w-4 h-4 text-gray-600" />
                      <Star className="w-4 h-4 text-gray-600" />
                      <Star className="w-4 h-4 text-gray-600" />
                      <Star className="w-4 h-4 text-gray-600" />
                    </div>
                  </div>
                </div>
                <div className="h-3 bg-gray-700 rounded w-20"></div>
              </div>
              <div className="space-y-2 mt-2">
                <div className="h-4 bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                <div className="h-3 bg-gray-700 rounded w-1/3 mt-1"></div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
