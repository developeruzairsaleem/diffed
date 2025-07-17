import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { LucideIcon } from "lucide-react"

interface ServiceCardProps {
  icon: LucideIcon
  title: string
  description: string
  price: string
  metric: string
  metricValue: string
  metricColor: string
  badges: string[]
}

export function ServiceCard({
  icon: Icon,
  title,
  description,
  price,
  metric,
  metricValue,
  metricColor,
  badges,
}: ServiceCardProps) {
  return (
    <Card className="bg-black/30 backdrop-blur-sm border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center text-white">
          <Icon className="w-5 h-5 mr-2" />
          {title}
        </CardTitle>
        <CardDescription className="text-white/70">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-white/70">Price per hour</span>
            <span className="font-semibold text-white">{price}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-white/70">{metric}</span>
            <span className={`font-medium ${metricColor}`}>{metricValue}</span>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {badges.map((badge) => (
              <Badge key={badge} variant="outline" className="border-white/20 text-white/80 bg-white/5">
                {badge}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
