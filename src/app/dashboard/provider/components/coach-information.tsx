import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User } from "lucide-react"
import coachData from "../../../../../coach_booster.json";

const coach = coachData[0];


export default function CoachInformation() {
  return (
    <Card className="bg-black/20 backdrop-blur-sm border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center text-white">
          <User className="w-5 h-5 mr-2" />
          Coach Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="gamertag" className="text-white/80">
              Gamertag
            </Label>
            <Input
              id="gamertag"
              defaultValue="ProGamer_Coach"
              className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>
          <div>
            <Label htmlFor="realName" className="text-white/80">
              Real Name
            </Label>
            <Input
              id="realName"
              defaultValue={coach.name}
              className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>
          <div>
            <Label htmlFor="email" className="text-white/80">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              defaultValue="coach@progamer.gg"
              className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>
          <div>
            <Label htmlFor="discord" className="text-white/80">
              Discord
            </Label>
            <Input
              id="discord"
              defaultValue="ProGamer#1337"
              className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>
          <div>
            <Label htmlFor="timezone" className="text-white/80">
              Timezone
            </Label>
            <Input
              id="timezone"
              defaultValue="EST (UTC-5)"
              className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>
          <div>
            <Label htmlFor="experience" className="text-white/80">
              Years of Experience
            </Label>
            <Input
              id="experience"
              defaultValue={coach.experienceYears}
              className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="bio" className="text-white/80">
              Bio
            </Label>
            <Input
              id="bio"
              defaultValue={coach.bio}
              className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
