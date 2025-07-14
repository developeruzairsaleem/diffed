"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Gamepad2, Sliders, ClipboardList } from "lucide-react";
import clsx from "clsx";

const tabs = [
  { label: "Profile", icon: User },
  { label: "Games", icon: Gamepad2 },
  { label: "Preferences", icon: Sliders },
  { label: "Orders", icon: ClipboardList },
];

export default function GamingDashboard() {
  const [activeTab, setActiveTab] = useState("Profile");

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1f002d] via-[#32003e] to-[#0d0d0d] text-white p-4 flex flex-col">
      
      {/* Top Navigation */}
      <div className="mb-4 flex justify-around bg-black/30 backdrop-blur rounded-full py-3 shadow-md">
        {tabs.map(({ label, icon: Icon }) => (
          <button
            key={label}
            onClick={() => setActiveTab(label)}
            className={clsx(
              "flex flex-col items-center gap-1 text-xs transition-all duration-150",
              activeTab === label ? "text-pink-400 scale-105" : "text-purple-300 hover:text-pink-300"
            )}
          >
            <Icon className="w-5 h-5" />
            {label}
          </button>
        ))}
      </div>

      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold tracking-wide">Welcome, Gamer</h1>
        <p className="text-sm text-purple-200">Your mission control center</p>
      </div>

      {/* Main Panel */}
      <div className="flex-1 rounded-2xl bg-black/30 backdrop-blur-lg shadow-lg p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "Profile" && <ProfileTab />}
            {activeTab === "Games" && <GamesTab />}
            {activeTab === "Preferences" && <PreferencesTab />}
            {activeTab === "Orders" && <OrdersTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// Tab Components
function ProfileTab() {
  return <div className="p-2">🧑‍💻 Profile details coming soon...</div>;
}

function GamesTab() {
  return <div className="p-2">🎮 Add your favorite games...</div>;
}

function PreferencesTab() {
  return <div className="p-2">⚙️ Tweak your gamer settings...</div>;
}

function OrdersTab() {
  return <div className="p-2">📦 Track your purchases or bookings...</div>;
}
