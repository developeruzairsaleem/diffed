import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Star } from "lucide-react";

// dummy json data - To be replaced by api
import coachData from "../../../../../coach_booster.json";
const coach = coachData[0];
// end of dummy json data

export function CoachStats() {
  return (
    <Card className="bg-black/20 backdrop-blur-sm border-white/10">
      <CardHeader>
        <CardTitle className="text-lg flex items-center text-white">
          <Trophy className="w-4 h-4 mr-2" />
          Coach Stats
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-white/70">Clients Coached</span>
          <span className="font-semibold text-white">{coach.completedOrders}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-white/70">Success Rate</span>
          <span className="font-semibold text-green-400">94%</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-white/70">Avg. Rank Boost</span>
          <span className="font-semibold text-white">+{coach.averageCompletionTimeHrs} Tiers</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-white/70">Rating</span>
          <div className="flex items-center">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold ml-1 text-white">{coach.rating}</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-white/70">Hours Coached</span>
          <span className="font-semibold text-white">1,247</span>
        </div>
      </CardContent>
    </Card>
  )
}
