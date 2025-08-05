import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { User, Bell } from "lucide-react";

export function SettingsSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Profile Settings Skeleton */}
      <Card className="bg-black/20 backdrop-blur-sm border-white/10">
        <CardHeader>
          <div className="h-6 bg-gray-700/50 rounded w-48"></div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="h-4 bg-gray-700/50 rounded w-24"></div>
            <div className="h-10 bg-gray-800/80 rounded-md"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-700/50 rounded w-24"></div>
            <div className="h-10 bg-gray-800/80 rounded-md"></div>
          </div>
          <div className="h-10 bg-gray-700/50 rounded-md w-32"></div>
        </CardContent>
      </Card>
    </div>
  );
}
