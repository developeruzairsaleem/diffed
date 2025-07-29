"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, Settings } from "lucide-react";

// Import Sidebar components
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";

// Import all the card components
import { ProfileSidebar } from "./components/profile-sidebar";
import { CoachStats } from "./components/coach-stats";
import CoachInformation from "./components/coach-information";
import { GamingAccounts } from "./components/gaming-accounts";
import { RecentActivity } from "./components/recent-activity";
import { ActiveClients } from "./components/active-clients";
import { ClientReviews } from "./components/client-reviews";
import { NotificationSettings } from "./components/notification-settings";
import { PricingSettings } from "./components/pricing-settings";
import { SecuritySettings } from "./components/security-settings";
import Earning from "./components/Earning";
import DemoPage from "./components/orders/page";
import GamesComponent from "./components/Services";
import { OrderQueue } from "./components/Queue";

export default function GamerCoachProfile() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <SidebarProvider className="lg:flex lg:gap-[100px] md:gap-8">
      <Sidebar className="w-auto h-auto border-none">
        <ProfileSidebar />
        {/* <div className="mt-0 hidden lg:block">
          {" "}
        </div> */}
      </Sidebar>

      <SidebarInset>
        <div className="min-h-screen bg-gaming-gradient font-[lato]">
          {/* Mobile Header with Sidebar Trigger */}
          <div className="bg-black/20 backdrop-blur-sm border-b border-white/10 md:hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-4">
                <div className="flex items-center space-x-4">
                  <SidebarTrigger className="-ml-1" />{" "}
                  {/* Mobile toggle button */}
                  <h1 className="text-2xl font-bold text-white">
                    Alex Turning
                  </h1>
                </div>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
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
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 ">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* This div creates spacing on desktop, actual sidebar is fixed */}
              <div className="lg:col-span-1 hidden lg:block"></div>

              {/* Main Content */}
              <div className="lg:col-span-3 ">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <div className="sticky top-0 z-20 bg-transparent">
                    <TabsList className="shadow-md h-[50px] p-1 grid grid-cols-8 bg-black/30 backdrop-blur-sm border-white/10 w-full mt-8 md:mt-0">
                      {/* <TabsList className="fixed top-4  z-20 w-full shadow-md h-[50px] p-1 grid grid-cols-8 bg-black/30 backdrop-blur-sm border-white/10"> */}
                      <TabsTrigger
                        value="overview"
                        className=" text-white/80 data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-500 border-0"
                      >
                        Overview
                      </TabsTrigger>
                      <TabsTrigger
                        value="queue"
                        className=" text-white/80 data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-500 border-0"
                      >
                        Queue
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
                  </div>
                  <TabsContent value="overview" className="space-y-6 pt-10">
                    <CoachInformation />
                    <GamingAccounts />
                    <RecentActivity />
                  </TabsContent>
                  <TabsContent value="queue" className="space-y-6 pt-10">
                    <OrderQueue />
                  </TabsContent>
                  <TabsContent value="orders" className="space-y-6 pt-10">
                    {/* <Orders /> */}
                    <DemoPage />
                  </TabsContent>
                  <TabsContent value="earnings" className="space-y-6 pt-10">
                    <Earning />
                  </TabsContent>
                  <TabsContent value="services" className="space-y-6">
                    <GamesComponent />
                  </TabsContent>
                  <TabsContent value="clients" className="space-y-6 pt-10">
                    <ActiveClients />
                  </TabsContent>
                  <TabsContent value="reviews" className="space-y-6 pt-10">
                    <ClientReviews />
                  </TabsContent>
                  <TabsContent value="settings" className="space-y-6 pt-10">
                    <NotificationSettings />
                    <PricingSettings />
                    <SecuritySettings />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
