import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react"

export function NotificationSettings() {
  return (
    <Card className="bg-black/30 backdrop-blur-sm border-white/10 shadow-2xl">
      <CardHeader>
        <CardTitle className="flex items-center text-white">
          <Bell className="w-5 h-5 mr-2" />
          Notifications
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-white">New Client Requests</h4>
            <p className="text-sm text-white/70">Get notified when someone books a session</p>
          </div>
          <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
            Enable
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-white">Session Reminders</h4>
            <p className="text-sm text-white/70">Reminders 30 minutes before sessions</p>
          </div>
          <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
            Enable
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-white">Payment Notifications</h4>
            <p className="text-sm text-white/70">Get notified about payments and earnings</p>
          </div>
          <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
            Enable
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
