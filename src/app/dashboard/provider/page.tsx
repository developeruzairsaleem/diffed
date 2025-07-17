"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Edit, Settings, Target, Zap, Users, Clock } from "lucide-react"

// Import all the card components
import { ProfileSidebar } from "./components/profile-sidebar"
import { CoachStats } from "./components/coach-stats"
import CoachInformation from "./components/coach-information"
import { GamingAccounts } from "./components/gaming-accounts"
import { RecentActivity } from "./components/recent-activity"
import { ServiceCard } from "./components/service-card"
import { ActiveClients } from "./components/active-clients"
import { ClientReviews } from "./components/client-reviews"
import { NotificationSettings } from "./components/notification-settings"
import { PricingSettings } from "./components/pricing-settings"
import { SecuritySettings } from "./components/security-settings"
import Earning from "./components/Earning"
import Orders from "./components/Orders";
import DemoPage from "./components/orders/page"
import EarningChart from "./components/EarningChart"
import GamesComponent from "./components/Services"

export default function GamerCoachProfile() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen font-[lato]">

      {/* Header */}
      {/* <div className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-white">Coach Dashboard</h1>
              <span className="text-white/60">/</span>
              <span className="text-white/60">Profile</span>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button
                size="sm"
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>
        </div>
      </div> */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Profile Sidebar */}
          <div  className="lg:col-span-1 ">
            <ProfileSidebar />
            <div className="mt-6">
              <CoachStats />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 ">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className=" h-[50px] p-1 grid w-full grid-cols-7 bg-black/30 backdrop-blur-sm border-white/10">
                <TabsTrigger
                  value="overview"
                  className=" text-white/80 data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-500 border-0"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="orders"
                  className=" text-white/80 data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-500 border-0"
                >
                  Orders
                </TabsTrigger>
                <TabsTrigger
                  value="earnings"
                  className=" text-white/80 data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-500 border-0"
                >
                  Earnings
                </TabsTrigger>
                <TabsTrigger
                  value="services"
                  className="text-white/80 data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-500 border-0"
                >
                  Services
                </TabsTrigger>
                <TabsTrigger
                  value="clients"
                  className="text-white/80 data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-500 border-0"
                >
                  Clients
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="text-white/80 data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-500 border-0"
                >
                  Reviews
                </TabsTrigger>
                <TabsTrigger
                  value="settings"
                  className="text-white/80 data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-500 border-0"
                >
                  Settings
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <CoachInformation />
                <GamingAccounts />
                <RecentActivity />
              </TabsContent>

              {/* <TabsContent value="orders" className="space-y-6  border-2 border-white/10 rounded-lg py-4 px-6">
               */}
              <TabsContent value="orders" className="space-y-6">
                {/* <Orders /> */}
                <DemoPage />
              </TabsContent>

              <TabsContent value="earnings" className="space-y-6">
                <Earning />
              </TabsContent>

              <TabsContent value="services" className="space-y-6">
                <GamesComponent />
                {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ServiceCard
                    icon={Target}
                    title="1-on-1 Coaching"
                    description="Personalized coaching sessions"
                    price="$35/hr"
                    metric="Available slots"
                    metricValue="12 this week"
                    metricColor="text-green-400"
                    badges={["Valorant", "League of Legends", "CS2"]}
                  />
                  <ServiceCard
                    icon={Zap}
                    title="Rank Boosting"
                    description="Professional rank boosting service"
                    price="$25/rank"
                    metric="Completion time"
                    metricValue="24-48 hours"
                    metricColor="text-blue-400"
                    badges={["Solo Queue", "Duo Queue", "Placement"]}
                  />
                  <ServiceCard
                    icon={Users}
                    title="Team Coaching"
                    description="Group coaching for teams"
                    price="$120/2hrs"
                    metric="Max team size"
                    metricValue="5 players"
                    metricColor="text-purple-400"
                    badges={["Strategy", "Teamwork", "Communication"]}
                  />
                  <ServiceCard
                    icon={Clock}
                    title="VOD Review"
                    description="Gameplay analysis and feedback"
                    price="$20/game"
                    metric="Turnaround time"
                    metricValue="24 hours"
                    metricColor="text-orange-400"
                    badges={["Detailed Notes", "Video Analysis", "Improvement Plan"]}
                  />
                </div> */}
              </TabsContent>

              <TabsContent value="clients" className="space-y-6">
                <ActiveClients />
              </TabsContent>

              <TabsContent value="reviews" className="space-y-6">
                <ClientReviews />
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <NotificationSettings />
                <PricingSettings />
                <SecuritySettings />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
