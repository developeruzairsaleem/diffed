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

// This is the new dashboard component
export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const { user, setUser, setWallet, setTransactions } = useStore();

  // Effect for getting the provider dashboard info
  useEffect(() => {
    const getProviderDashboard = async () => {
      try {
        const userRes = await fetch("/api/user/me");
        if (!userRes.ok) throw new Error("Failed to fetch user");
        const userData = await userRes.json();
        setUser({
          id: userData.id,
          username: userData.username,
          email: userData.email,
          isLoggedIn: true,
          role: userData.role,
          avatar: userData.profileImage,
        });

        const walletRes = await fetch("/api/wallet");
        if (!walletRes.ok) throw new Error("Failed to fetch wallet");
        const walletData = await walletRes.json();
        setWallet({
          id: walletData.id,
          balance: walletData.balance,
          currency: walletData.currency,
        });

        const txRes = await fetch("/api/transaction/me");
        if (!txRes.ok) throw new Error("Failed to fetch transactions");
        const txData = await txRes.json();
        setTransactions(
          txData.map((idTx: any) => ({
            id: idTx.id,
            type: idTx.type,
            amount: idTx.amount,
            walletId: idTx.walletId,
            createdAt: idTx.createdAt,
            description: idTx.description,
            status: idTx.status,
          }))
        );
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };
    getProviderDashboard();
  }, [setUser, setWallet, setTransactions]);

  const TABS = [
    { value: "overview", label: "Overview", icon: LayoutGrid },
    { value: "queue", label: "Queue", icon: List },
    { value: "orders", label: "Orders", icon: Package },
    { value: "earnings", label: "Earnings", icon: DollarSign },
    { value: "clients", label: "Clients", icon: Users },
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
          <div className="p-4 sm:p-6 lg:p-8">
            {/* --- MAIN HEADER --- */}
            <header className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
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
              <div className="sticky top-0 z-10 bg-[#3A0F2A]/50 backdrop-blur-lg py-2 -mx-8 px-8">
                <TabsList className="p-1.5 h-auto bg-black/30 border border-white/10 rounded-xl grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-1">
                  {TABS.map(({ value, label, icon: Icon }) => (
                    <TabsTrigger
                      key={value}
                      value={value}
                      className="w-full h-12 flex flex-col sm:flex-row items-center justify-center gap-2 px-2 text-gray-300 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-purple-600/20 transition-all duration-300"
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
