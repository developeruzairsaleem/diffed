import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DollarSign } from "lucide-react"

export function PricingSettings() {
  return (
    <Card className="bg-black/30 backdrop-blur-sm border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center text-white">
          <DollarSign className="w-5 h-5 mr-2" />
          Pricing & Availability
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="hourlyRate" className="text-white/80">
              Hourly Rate ($)
            </Label>
            <Input
              id="hourlyRate"
              defaultValue="35"
              className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>
          <div>
            <Label htmlFor="boostRate" className="text-white/80">
              Boost Rate ($/rank)
            </Label>
            <Input
              id="boostRate"
              defaultValue="25"
              className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="availability" className="text-white/80">
            Weekly Availability (hours)
          </Label>
          <Input
            id="availability"
            defaultValue="25"
            className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/50"
          />
        </div>
      </CardContent>
    </Card>
  )
}
