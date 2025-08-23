"use client";

import React, { useEffect, useState } from "react";
import { useStore } from "@/store/useStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Edit,
  Settings,
  LayoutGrid,
  List,
  Package,
  DollarSign,
  Users,
  Star,
  Cog,
} from "lucide-react";
import { PanelLeftIcon } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

// Main Profile Sidebar
import { ProfileSidebar } from "./components/profile-sidebar";

// Tab Content Components
import { OrderQueue } from "./components/Queue";
import CoachInformation from "./components/coach-information";
import { GamingAccounts } from "./components/gaming-accounts";
import { RecentActivity } from "./components/recent-activity";
import OrdersPage from "./components/Orders";
import Earning from "./components/Earning";
import Services from "./components/Services";
import { ActiveClients } from "./components/active-clients";
import { ProviderReviews } from "./components/provider-reviews";
import { SettingsTab } from "./components/notification-settings";
import { PricingSettings } from "./components/pricing-settings";
import { SecuritySettings } from "./components/security-settings";
import ProviderSetupPage from "./components/order-detail";

// This is the new dashboard component
export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const { user } = useStore();
  const TABS = [
    { value: "overview", label: "Overview", icon: LayoutGrid },
    { value: "queue", label: "Services", icon: List },
    { value: "orders", label: "Orders", icon: Package },
    { value: "earnings", label: "Earnings", icon: DollarSign },
    // { value: "clients", label: "Clients", icon: Users },
    { value: "reviews", label: "Reviews", icon: Star },
    { value: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen font-sans bg-[#3A0F2A] text-white">
      <div className="flex">
        {/* --- FIXED SIDEBAR ON DESKTOP --- */}
        <aside className="hidden lg:block lg:w-80 lg:flex-shrink-0 h-screen sticky top-0">
          <ProfileSidebar />
        </aside>

        {/* --- SCROLLABLE MAIN CONTENT --- */}
        <main className="flex-1 min-w-0">
          <div className="py-4 sm:py-6 lg:py-8 px-1 sm:px-2 lg:px-3">
            {/* --- MOBILE SIDEBAR TOGGLE + GREETING --- */}
            <div className="flex items-center gap-3 lg:hidden mb-4 px-4 sm:px-8 lg:px-12">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="bg-white/10 hover:bg-white/20"
                    aria-label="Open profile sidebar"
                  >
                    <PanelLeftIcon className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-80 sm:max-w-sm">
                  <ProfileSidebar />
                </SheetContent>
                <SheetTrigger asChild>
                  <button className="text-xl font-semibold truncate">
                    Welcome back, {user?.username || "Provider"}!
                  </button>
                </SheetTrigger>
              </Sheet>
            </div>

            {/* --- MAIN HEADER --- */}
            <header className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8 px-4 sm:px-8 lg:px-12">
              <div>
                <h1 className="text-3xl font-bold tracking-tight hidden lg:block">
                  Welcome back, {user?.username || "Provider"}!
                </h1>
                <p className="text-gray-400 mt-1">
                  Here's what's happening with your coaching dashboard today.
                </p>
              </div>
            </header>

            {/* --- TABS NAVIGATION & CONTENT --- */}
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="relative"
            >
              <div className="w-full sticky top-0 z-10 py-2  ">
                <TabsList className="w-full py-1.5 h-auto bg-black/30 backdrop-blur-2xl border border-white/10 rounded-xl flex flex-wrap items-center gap-3">
                  {TABS.map(({ value, label, icon: Icon }) => (
                    <TabsTrigger
                      key={value}
                      value={value}
                      className="w-[80%] h-12 flex flex-col sm:flex-row items-center justify-center gap-2 px-2 text-gray-300 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-purple-600/20 transition-all duration-300"
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-xs sm:text-sm">{label}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              <div className="mt-8">
                <TabsContent value="overview" className="space-y-6">
                  <CoachInformation />
                </TabsContent>
                <TabsContent value="queue">
                  <OrderQueue />
                </TabsContent>
                <TabsContent value="orders">
                  <OrdersPage />
                </TabsContent>
                <TabsContent value="earnings">
                  <Earning />
                </TabsContent>
                {/* <TabsContent value="services">
                  <Services />
                </TabsContent> */}
                <TabsContent value="clients">
                  <ActiveClients />
                </TabsContent>
                <TabsContent value="reviews">
                  <ProviderReviews />
                </TabsContent>
                <TabsContent value="settings" className="space-y-8">
                  <SettingsTab />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
