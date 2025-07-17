import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield } from "lucide-react"

export function SecuritySettings() {
  return (
    <Card className="bg-black/30 backdrop-blur-sm border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center text-white">
          <Shield className="w-5 h-5 mr-2" />
          Security
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-white">Two-Factor Authentication</h4>
            <p className="text-sm text-white/70">Secure your coaching account</p>
          </div>
          <Button
            size="sm"
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
          >
            Setup
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-white">Change Password</h4>
            <p className="text-sm text-white/70">Update your account password</p>
          </div>
          <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
            Change
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
