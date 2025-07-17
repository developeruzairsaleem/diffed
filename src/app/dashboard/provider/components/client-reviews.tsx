import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Star } from "lucide-react"

export function ClientReviews() {
  return (
    <Card className="bg-black/30 backdrop-blur-sm border-white/10">
      <CardHeader>
        <CardTitle className="text-white">Client Reviews</CardTitle>
        <CardDescription className="text-white/70">Recent feedback from coached players</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="border-b border-white/10 pb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-white">GamerPro2024</span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
              <span className="text-sm text-white/60">2 days ago</span>
            </div>
            <p className="text-sm text-white/80">
              "Amazing coach! Helped me climb from Silver to Platinum in just 2 weeks. The aim training routines and
              game sense tips were incredibly valuable."
            </p>
            <p className="text-xs text-white/50 mt-1">Valorant Coaching</p>
          </div>

          <div className="border-b border-white/10 pb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-white">LeaguePlayer99</span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
              <span className="text-sm text-white/60">1 week ago</span>
            </div>
            <p className="text-sm text-white/80">
              "Best investment I've made for my gaming. The macro gameplay coaching completely changed how I approach
              ranked games. Highly recommended!"
            </p>
            <p className="text-xs text-white/50 mt-1">League of Legends Coaching</p>
          </div>

          <div className="border-b border-white/10 pb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-white">CS_Master</span>
                <div className="flex">
                  {[1, 2, 3, 4].map((star) => (
                    <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <Star className="w-4 h-4 text-white/30" />
                </div>
              </div>
              <span className="text-sm text-white/60">2 weeks ago</span>
            </div>
            <p className="text-sm text-white/80">
              "Great coach with solid game knowledge. The VOD reviews were particularly helpful. Only minor complaint is
              scheduling could be more flexible."
            </p>
            <p className="text-xs text-white/50 mt-1">CS2 VOD Review</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
