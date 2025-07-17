import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function ActiveClients() {
  return (
    <Card className="bg-black/30 backdrop-blur-sm border-white/10">
      <CardHeader>
        <CardTitle className="text-white">Active Clients</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-white/10 rounded-lg bg-white/5">
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">JD</AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-medium text-white">JohnDoe_Gaming</h4>
                <p className="text-sm text-white/70">Valorant • Gold 2 → Platinum 1</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-white">8 sessions completed</p>
              <p className="text-xs text-white/60">Next: Tomorrow 7 PM</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border border-white/10 rounded-lg bg-white/5">
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-gradient-to-br from-green-500 to-blue-500 text-white">SG</AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-medium text-white">SilverGamer123</h4>
                <p className="text-sm text-white/70">League of Legends • Silver 3 → Gold 2</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-white">12 sessions completed</p>
              <p className="text-xs text-white/60">Next: Friday 6 PM</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border border-white/10 rounded-lg bg-white/5">
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-gradient-to-br from-orange-500 to-red-500 text-white">PX</AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-medium text-white">ProXPlayer</h4>
                <p className="text-sm text-white/70">CS2 • Master Guardian → Legendary Eagle</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-white">6 sessions completed</p>
              <p className="text-xs text-white/60">Next: Sunday 8 PM</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
