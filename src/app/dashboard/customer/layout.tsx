"use client";
import customers from "../../../../customers.json";
import formatDate from "./_lib/format-date";
import getStatusColor from "./_lib/get-status-color";
import React, { useEffect, useState } from "react";
import OrdersTab from "./_components/OrdersTab";
import { useStore } from "@/store/useStore";
import WalletTab from "./_components/WalletTab";
import SettingsTab from "./_components/SettingsTab";
import {
  User,
  Wallet,
  Trophy,
  Clock,
  Star,
  MessageCircle,
  Shield,
  Target,
  Users,
  BookOpen,
  Package,
  CheckCircle,
  XCircle,
  AlertCircle,
  CreditCard,
  ArrowUpDown,
  Eye,
  Gift,
  Download,
  TrendingUp,
  Calendar,
  DollarSign,
  Award,
  Activity,
  Settings,
  Bell,
  Plus,
  Minus,
  Search,
  Filter,
  MoreVertical,
  Home,
  Gamepad2,
  LogOut,
} from "lucide-react";
import GamesComponent from "./_components/Games";
import OverviewTab from "./_components/OverviewTab";
import { lato, orbitron } from "@/fonts/fonts";
import Image from "next/image";
import AddFundss from "./_components/ALLPAYMENT";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Dashboard = ({ children }: { children: React.ReactNode }) => {
  const store = useStore();
  const pathname = usePathname();
  // effect for getting the user dashboard info
  // TODO FOR SETTING THE STATE OF THE DASHBOARD
  useEffect(() => {
    async function getCustomerDashboard() {
      // API response
      const user = await fetch("/api/user/me").then((res) => res.json());
      const userData = {
        id: user.id,
        username: user.username,
        email: user.email,
        isLoggedIn: true,
        role: user.role,
      };
      store.setUser(userData);
      const wallet = await fetch("/api/wallet").then((res) => res.json());

      const walletData = {
        id: wallet.id,
        balance: wallet.balance,
        currency: wallet.currency,
      };
      store.setWallet(walletData);
      const tx = await fetch("/api/transaction/me").then((res) => res.json());
      const txData = tx.map((idTx: any) => {
        return {
          id: idTx.id,
          type: idTx.type,
          amount: idTx.amount,
          walletId: idTx.walletId,
          createdAt: idTx.createdAt,
          description: idTx.description,
          status: idTx.status,
        };
      });
      store.setTransactions(txData);
    }
    getCustomerDashboard();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "in_progress":
        return <Activity className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "cancelled":
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen max-h-screen overflow-hidden ">
      {/* Header */}
      <header className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-4">
                <Image src="/logo/logo.png" alt="logo" width="80" height="80" />
                <div
                  className={`text-2xl uppercase ${orbitron.className} font-bold text-white`}
                >
                  Diffed.gg
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div
                style={{ backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                className="flex items-center space-x-2 px-3 py-1 rounded-full"
              >
                <Wallet className="w-4 h-4 text-white" />
                <span className="text-sm font-medium text-white">
                  ${store.wallet?.balance || 0}
                </span>
              </div>
              {/* <button className="p-2 text-white hover:text-gray-100 cursor-pointer relative">
                <Bell className="w-5 h-5" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              </button> */}
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
                <span className="text-md  font-semibold text-gray-100">
                  {store.user?.username || "User"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex space-x-8">
          {/* Sidebar */}
          <div className="w-64 space-y-2">
            <nav className="space-y-1">
              <Link
                href={"/dashboard/customer"}
                className={`w-full  cursor-pointer flex items-center space-x-3 px-4 py-2 rounded-lg text-white text-left `}
                style={{
                  backgroundColor:
                    pathname === "/dashboard/customer"
                      ? "rgba(255, 255, 255, 0.15)"
                      : "",
                }}
              >
                <Home className="w-5 h-5" />
                <span>Overview</span>
              </Link>
              <Link
                href={"/dashboard/customer/games"}
                className={`w-full  cursor-pointer flex items-center space-x-3 px-4 py-2 rounded-lg text-left text-white`}
                style={{
                  backgroundColor:
                    pathname === "/dashboard/customer/games"
                      ? "rgba(255, 255, 255, 0.15)"
                      : "",
                }}
              >
                <Gamepad2 className="w-5 h-5" />
                <span>Games</span>
              </Link>

              <Link
                href="/dashboard/customer/orders"
                className={`w-full  cursor-pointer flex items-center space-x-3 px-4 py-2 rounded-lg text-left text-white`}
                style={{
                  backgroundColor:
                    pathname === "/dashboard/customer/orders"
                      ? "rgba(255, 255, 255, 0.15)"
                      : "",
                }}
              >
                <Package className="w-5 h-5" />
                <span>Orders</span>
              </Link>

              <Link
                href="/dashboard/customer/wallet"
                className={`w-full  cursor-pointer flex items-center space-x-3 px-4 py-2 rounded-lg text-left text-white`}
                style={{
                  backgroundColor:
                    pathname === "/dashboard/customer/wallet"
                      ? "rgba(255, 255, 255, 0.15)"
                      : "",
                }}
              >
                <Wallet className="w-5 h-5" />
                <span>Wallet</span>
              </Link>

              <Link
                href="/dashboard/customer/reviews"
                className={`w-full  cursor-pointer flex items-center space-x-3 px-4 py-2 rounded-lg text-left text-white`}
                style={{
                  backgroundColor:
                    pathname === "dashboard/customer/reviews"
                      ? "rgba(255, 255, 255, 0.15)"
                      : "",
                }}
              >
                <Star className="w-5 h-5" />
                <span>Reviews</span>
              </Link>
              {/* 
              <Link
                href="/dashboard/customer/settings"
                className={`w-full flex cursor-pointer items-center space-x-3 px-4 py-2 rounded-lg text-left text-white`}
                style={{
                  backgroundColor:
                    pathname === "/dashboard/customer/settings"
                      ? "rgba(255, 255, 255, 0.15)"
                      : "",
                }}
              >
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </Link>
*/}
            </nav>

            <div className="pt-4 border-t border-gray-200">
              <button
                className={` w-full flex items-center justify-center py-4 ${lato.className} relative cursor-pointer group
            bg-gradient-to-r from-pink-500 gap-3 via-purple-500 to-cyan-400
            transition-all
            hover:scale-105
            rounded-4xl
          `}
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div
            style={{
              height: "85vh",
              overflowY: "scroll",
            }}
            className="flex-1 h-full scrollbar-hide"
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
