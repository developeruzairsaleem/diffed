import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity } from "lucide-react"

export function RecentActivity() {
  return (
    <Card className="bg-black/20 backdrop-blur-sm border-white/10 shadow-2xl">
      <CardHeader>
        <CardTitle className="flex items-center text-white">
          <Activity className="w-5 h-5 mr-2" />
          Recent Coaching Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
            <div>
              <p className="text-sm text-white/90">Completed 2-hour Valorant coaching session with Client_123</p>
              <p className="text-xs text-white/60">Helped improve crosshair placement and game sense</p>
              <p className="text-xs text-white/50">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <div>
              <p className="text-sm text-white/90">Client ranked up from Gold to Platinum in League of Legends</p>
              <p className="text-xs text-white/60">After 5 coaching sessions focusing on macro play</p>
              <p className="text-xs text-white/50">1 day ago</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
            <div>
              <p className="text-sm text-white/90">Received 5-star review from satisfied client</p>
              <p className="text-xs text-white/60">"Amazing coach, improved my aim significantly!"</p>
              <p className="text-xs text-white/50">3 days ago</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
