import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Gamepad2 } from "lucide-react"

export function GamingAccounts() {
  return (
    <Card className="bg-black/20 backdrop-blur-sm border-white/10 shadow-2xl">
      <CardHeader>
        <CardTitle className="flex items-center text-white">
          <Gamepad2 className="w-5 h-5 mr-2" />
          Gaming Accounts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="valorant" className="text-white/80">
              Valorant Account
            </Label>
            <Input
              id="valorant"
              defaultValue="ProGamer#NA1"
              className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>
          <div>
            <Label htmlFor="lol" className="text-white/80">
              League of Legends
            </Label>
            <Input
              id="lol"
              defaultValue="ProGamerCoach"
              className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>
          <div>
            <Label htmlFor="steam" className="text-white/80">
              Steam Profile
            </Label>
            <Input
              id="steam"
              defaultValue="steamcommunity.com/id/progamercoach"
              className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>
          <div>
            <Label htmlFor="battlenet" className="text-white/80">
              Battle.net
            </Label>
            <Input
              id="battlenet"
              defaultValue="ProGamer#1337"
              className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
