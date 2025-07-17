"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Gamepad2, Sliders, ClipboardList } from "lucide-react";
import clsx from "clsx";
import ProfileTab from "./profile/page";
import GamesTab from "./games/page";
import PreferencesTab from "./preferences/page";
import OrdersTab from "./orders/page";

type Customer = {
  firstName: string;
  lastName: string;
  customerType: string;
  gamingLevel: string;
  primaryGames: string[];
  currentRanks?: Record<string, string>;
  gamingGoals?: string[];
  budgetRange: string;
  preferredServiceTypes?: string[];
  activityPattern: string;
  learningStyle: string;
  communicationPreference: string;
  peakHours?: string[];
  riskTolerance: string;
  totalOrders: number;
  totalSpent: number;
  lifetimeValue: number;
  satisfactionScore: number;
  churnRiskScore: number;
  lastOrderDate?: string;
};

const tabs = [
  { label: "Profile", icon: User },
  { label: "Games", icon: Gamepad2 },
  { label: "Preferences", icon: Sliders },
  { label: "Orders", icon: ClipboardList },
];

const dummyCustomer: Customer = {
  firstName: "Shabir",
  lastName: "Ahmed",
  customerType: "competitive",
  gamingLevel: "pro",
  primaryGames: ["Valorant", "CS2"],
  currentRanks: { Valorant: "Immortal 2", CS2: "Global Elite" },
  gamingGoals: ["Rank up", "Become esports-ready"],
  budgetRange: "high",
  preferredServiceTypes: ["coaching", "boosting"],
  activityPattern: "hardcore_grinder",
  learningStyle: "visual",
  communicationPreference: "voice",
  peakHours: ["8PM-12AM"],
  riskTolerance: "high",
  totalOrders: 12,
  totalSpent: 670.5,
  lifetimeValue: 1250,
  satisfactionScore: 4.8,
  churnRiskScore: 0.2,
  lastOrderDate: "2025-07-10",
};

export default function GamingDashboard() {
  const [activeTab, setActiveTab] = useState("Profile");

  // const [customer, setCustomer] = useState<Customer | null>(null);
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const fetchCustomer = async () => {
  //     try {
  //       const res = await fetch("/api/customer/me");
  //       const data = await res.json();
  //       setCustomer(data);
  //     } catch (err) {
  //       console.error("Failed to load customer", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchCustomer();
  // }, []);

  // if (loading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center text-purple-200">
  //       Loading your dashboard...
  //     </div>
  //   );
  // }

  const customer = dummyCustomer;

  console.log('tab selected: ', activeTab)

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#4E0D37] via-[#5D1A45] to-[#5E1043] text-white p-4 flex flex-col relative overflow-hidden">
      {/* Top Nav */}
      <div className="mb-6 flex justify-around bg-black/20 backdrop-blur-sm rounded-xl py-3 shadow-md border border-purple-600/20">
        {tabs.map(({ label, icon: Icon }) => (
          <button
          type='button'
            key={label}
            onClick={() => setActiveTab(label)}
            className={clsx(
              "flex flex-col items-center gap-1 text-xs px-2 transition-all duration-150",
              activeTab === label
                ? "text-[#58B9E3]-300 scale-110 drop-shadow-[0_0_6px_#58B9E3]"
                : "text-purple-300 hover:text-pink-300"
            )}
          >
            <Icon className="w-5 h-5" />
            {label}
          </button>
        ))}
      </div>

      {/* Welcome */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold tracking-wide neon-text-gradient">
          🎮 Welcome, {customer.firstName || "Gamer"}
        </h1>
        <p className="text-sm text-purple-300">Your mission control panel</p>
      </div>

      {/* Main Panel */}
      <div className="flex-1 rounded-2xl bg-black/20 backdrop-blur-md shadow-2xl border border-purple-600/10 p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "Profile" && <ProfileTab customer={customer} />}
            {activeTab === "Games" && <GamesTab customer={customer} />}
            {activeTab === "Preferences" && (
              <PreferencesTab customer={customer} />
            )}
            {activeTab === "Orders" && <OrdersTab customer={customer} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Glowing Blob */}
      <motion.div
        className="absolute -top-32 -right-32 w-[400px] h-[400px] bg-pink-500 opacity-10 blur-[100px] rounded-full z-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}
