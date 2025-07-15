"use client";

import React, { useState } from "react";
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
  LogOut,
} from "lucide-react";

// Sample Data Structure
const gamesData = {
  valorant: {
    name: "Valorant",
    icon: "🎯",
    ranks: [
      { id: "iron1", name: "Iron I", price: 15 },
      { id: "iron2", name: "Iron II", price: 18 },
      { id: "iron3", name: "Iron III", price: 20 },
      { id: "bronze1", name: "Bronze I", price: 25 },
      { id: "bronze2", name: "Bronze II", price: 28 },
      { id: "bronze3", name: "Bronze III", price: 30 },
      { id: "silver1", name: "Silver I", price: 35 },
      { id: "silver2", name: "Silver II", price: 38 },
      { id: "silver3", name: "Silver III", price: 40 },
      { id: "gold1", name: "Gold I", price: 45 },
      { id: "gold2", name: "Gold II", price: 48 },
      { id: "gold3", name: "Gold III", price: 50 },
      { id: "platinum1", name: "Platinum I", price: 60 },
      { id: "platinum2", name: "Platinum II", price: 65 },
      { id: "platinum3", name: "Platinum III", price: 70 },
      { id: "diamond1", name: "Diamond I", price: 80 },
      { id: "diamond2", name: "Diamond II", price: 85 },
      { id: "diamond3", name: "Diamond III", price: 90 },
      { id: "ascendant1", name: "Ascendant I", price: 100 },
      { id: "ascendant2", name: "Ascendant II", price: 110 },
      { id: "ascendant3", name: "Ascendant III", price: 120 },
      { id: "immortal1", name: "Immortal I", price: 140 },
      { id: "immortal2", name: "Immortal II", price: 150 },
      { id: "immortal3", name: "Immortal III", price: 160 },
      { id: "radiant", name: "Radiant", price: 200 },
    ],
  },
  fortnite: {
    name: "Fortnite",
    icon: "🏆",
    ranks: [
      { id: "bronze", name: "Bronze", price: 20 },
      { id: "silver", name: "Silver", price: 25 },
      { id: "gold", name: "Gold", price: 30 },
      { id: "platinum", name: "Platinum", price: 40 },
      { id: "diamond", name: "Diamond", price: 55 },
      { id: "elite", name: "Elite", price: 70 },
      { id: "champion", name: "Champion", price: 90 },
      { id: "unreal", name: "Unreal", price: 120 },
    ],
  },
};

const services = {
  solo_boost: {
    name: "Solo Boosting",
    icon: "🎯",
    description:
      "Professional player plays on your account to achieve desired rank",
    multiplier: 1.0,
    features: [
      "Account security guaranteed",
      "Fast completion",
      "24/7 support",
      "Screenshot proof",
    ],
  },
  duo_boost: {
    name: "Duo Boosting",
    icon: "👥",
    description: "Play together with a professional to improve your rank",
    multiplier: 1.2,
    features: [
      "Learn while playing",
      "Keep your account",
      "Real-time coaching",
      "Friendship bonus",
    ],
  },
  coaching: {
    name: "1-on-1 Coaching",
    icon: "🎓",
    description: "Personal training session with gameplay analysis and tips",
    multiplier: 0.8,
    features: [
      "Personalized feedback",
      "VOD review",
      "Strategy development",
      "Skill improvement",
    ],
  },
  team_coaching: {
    name: "Team Coaching",
    icon: "👨‍👩‍👧‍👦",
    description: "Group coaching session for teams (2-5 players)",
    multiplier: 2.5,
    features: [
      "Team strategy",
      "Communication training",
      "Role optimization",
      "Group dynamics",
    ],
  },
  bundles: {
    name: "Boost Bundles",
    icon: "📦",
    description: "Multiple rank tiers package with discount",
    multiplier: 0.85,
    features: [
      "Cost effective",
      "Multiple ranks",
      "Priority support",
      "Bonus rewards",
    ],
  },
};

const boosters = [
  {
    id: "b1",
    name: "ProGamer_Alex",
    rating: 4.9,
    completedOrders: 1247,
    specialties: ["valorant", "fortnite"],
    status: "online",
    hourlyRate: 25,
    avatar: "👨‍💻",
  },
  {
    id: "b2",
    name: "SkillMaster_Sarah",
    rating: 4.8,
    completedOrders: 892,
    specialties: ["valorant"],
    status: "online",
    hourlyRate: 22,
    avatar: "👩‍💻",
  },
  {
    id: "b3",
    name: "RankUp_Mike",
    rating: 4.7,
    completedOrders: 654,
    specialties: ["fortnite"],
    status: "offline",
    hourlyRate: 20,
    avatar: "🧑‍💻",
  },
];

const sampleOrders = [
  {
    id: "ord_001",
    game: "valorant",
    service: "solo_boost",
    currentRank: "silver2",
    targetRank: "gold3",
    booster: "ProGamer_Alex",
    status: "in_progress",
    price: 65,
    progress: 60,
    createdAt: "2025-07-14T10:30:00Z",
    estimatedCompletion: "2025-07-14T18:00:00Z",
  },
  {
    id: "ord_002",
    game: "fortnite",
    service: "duo_boost",
    currentRank: "gold",
    targetRank: "diamond",
    booster: "RankUp_Mike",
    status: "completed",
    price: 90,
    progress: 100,
    createdAt: "2025-07-13T14:20:00Z",
    completedAt: "2025-07-13T20:15:00Z",
    rating: 5,
    tip: 10,
  },
  {
    id: "ord_003",
    game: "valorant",
    service: "coaching",
    currentRank: "bronze3",
    targetRank: "silver1",
    booster: "SkillMaster_Sarah",
    status: "pending",
    price: 35,
    progress: 0,
    createdAt: "2025-07-14T12:45:00Z",
  },
];

const walletTransactions = [
  {
    id: "tx_001",
    type: "deposit",
    amount: 100,
    method: "PayPal",
    description: "Wallet top-up",
    timestamp: "2025-07-14T09:15:00Z",
    status: "completed",
  },
  {
    id: "tx_002",
    type: "payment",
    amount: -65,
    method: "wallet",
    description: "Valorant Solo Boost - Silver to Gold",
    timestamp: "2025-07-14T10:30:00Z",
    status: "completed",
    orderId: "ord_001",
  },
  {
    id: "tx_003",
    type: "payment",
    amount: -90,
    method: "wallet",
    description: "Fortnite Duo Boost - Gold to Diamond",
    timestamp: "2025-07-13T14:20:00Z",
    status: "completed",
    orderId: "ord_002",
  },
  {
    id: "tx_004",
    type: "tip",
    amount: -10,
    method: "wallet",
    description: "Tip for RankUp_Mike",
    timestamp: "2025-07-13T20:20:00Z",
    status: "completed",
  },
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [walletBalance, setWalletBalance] = useState(145);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showAddFunds, setShowAddFunds] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-100";
      case "in_progress":
        return "text-blue-600 bg-blue-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "cancelled":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status) => {
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">
                {sampleOrders.length}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Package className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Orders</p>
              <p className="text-2xl font-bold text-gray-900">
                {sampleOrders.filter((o) => o.status === "in_progress").length}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {sampleOrders.filter((o) => o.status === "completed").length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">
                €{sampleOrders.reduce((sum, order) => sum + order.price, 0)}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <DollarSign className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Recent Orders
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {sampleOrders.slice(0, 3).map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">{gamesData[order.game].icon}</div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {gamesData[order.game].name} -{" "}
                      {services[order.service].name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {
                        gamesData[order.game].ranks.find(
                          (r) => r.id === order.currentRank
                        )?.name
                      }{" "}
                      →{" "}
                      {
                        gamesData[order.game].ranks.find(
                          (r) => r.id === order.targetRank
                        )?.name
                      }
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-1 text-xs rounded-full flex items-center space-x-1 ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusIcon(order.status)}
                      <span className="capitalize">
                        {order.status.replace("_", " ")}
                      </span>
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    €{order.price}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const OrdersTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Orders</h2>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-900">
                  Order ID
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">
                  Game & Service
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">
                  Rank Progress
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">
                  Booster
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">
                  Price
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">
                  Date
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sampleOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-mono text-sm text-gray-600">
                    {order.id}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-xl">
                        {gamesData[order.game].icon}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {gamesData[order.game].name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {services[order.service].name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-sm">
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-600">
                          {
                            gamesData[order.game].ranks.find(
                              (r) => r.id === order.currentRank
                            )?.name
                          }
                        </span>
                        <ArrowUpDown className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900 font-medium">
                          {
                            gamesData[order.game].ranks.find(
                              (r) => r.id === order.targetRank
                            )?.name
                          }
                        </span>
                      </div>
                      {order.status === "in_progress" && (
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${order.progress}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {order.progress}% complete
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <div className="text-xl">
                        {boosters.find((b) => b.name === order.booster)?.avatar}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {order.booster}
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="text-xs text-gray-500">
                            {
                              boosters.find((b) => b.name === order.booster)
                                ?.rating
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full flex items-center space-x-1 w-fit ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusIcon(order.status)}
                      <span className="capitalize">
                        {order.status.replace("_", " ")}
                      </span>
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-gray-900">
                    €{order.price}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-1 text-gray-400 hover:text-purple-600"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-purple-600">
                        <MessageCircle className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-purple-600">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const WalletTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Wallet</h2>
        <button
          onClick={() => setShowAddFunds(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          <Plus className="w-4 h-4" />
          <span>Add Funds</span>
        </button>
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-200 text-sm">Current Balance</p>
            <p className="text-3xl font-bold">€{walletBalance}</p>
          </div>
          <div className="p-3 bg-purple-500 bg-opacity-50 rounded-full">
            <Wallet className="w-8 h-8" />
          </div>
        </div>
        <div className="mt-4 flex items-center space-x-4">
          <div className="text-sm">
            <span className="text-purple-200">Available for orders</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-full">
              <Plus className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="font-medium text-gray-900">Add Funds</div>
              <div className="text-sm text-gray-500">Top up your wallet</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <ArrowUpDown className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="font-medium text-gray-900">
                Transaction History
              </div>
              <div className="text-sm text-gray-500">View all transactions</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 rounded-full">
              <Download className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <div className="font-medium text-gray-900">Export</div>
              <div className="text-sm text-gray-500">Download statements</div>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            Recent Transactions
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {walletTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`p-2 rounded-full ${
                      transaction.type === "deposit"
                        ? "bg-green-100"
                        : transaction.type === "payment"
                        ? "bg-red-100"
                        : "bg-blue-100"
                    }`}
                  >
                    {transaction.type === "deposit" ? (
                      <Plus
                        className={`w-4 h-4 ${
                          transaction.type === "deposit"
                            ? "text-green-600"
                            : transaction.type === "payment"
                            ? "text-red-600"
                            : "text-blue-600"
                        }`}
                      />
                    ) : transaction.type === "payment" ? (
                      <Minus className="w-4 h-4 text-red-600" />
                    ) : (
                      <Gift className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {transaction.description}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(transaction.timestamp)} • {transaction.method}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`font-semibold ${
                      transaction.amount > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {transaction.amount > 0 ? "+" : ""}€
                    {Math.abs(transaction.amount)}
                  </div>
                  <div className="text-sm text-gray-500 capitalize">
                    {transaction.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const ReviewsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Reviews & Ratings</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
            <span className="text-lg font-semibold text-gray-900">4.8</span>
            <span className="text-sm text-gray-500">Average Rating</span>
          </div>
        </div>
      </div>

      {/* Rating Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Rating Breakdown
        </h3>
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center space-x-4">
              <div className="w-4 text-sm text-gray-600">{rating}</div>
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-400 h-2 rounded-full"
                  style={{
                    width: `${
                      rating === 5
                        ? 70
                        : rating === 4
                        ? 20
                        : rating === 3
                        ? 8
                        : rating === 2
                        ? 2
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
              <div className="text-sm text-gray-600 w-8">
                {rating === 5
                  ? 70
                  : rating === 4
                  ? 20
                  : rating === 3
                  ? 8
                  : rating === 2
                  ? 2
                  : 0}
                %
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Reviews */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Reviews
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-6">
              <div className="flex items-start space-x-4">
                <div className="text-2xl">👨‍💻</div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="font-medium text-gray-900">
                      ProGamer_Alex
                    </div>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className="w-4 h-4 text-yellow-400 fill-current"
                        />
                      ))}
                    </div>
                    <div className="text-sm text-gray-500">
                      Valorant Solo Boost
                    </div>
                  </div>
                  <p className="text-gray-700 mb-2">
                    "Amazing service! Alex helped me climb from Silver to Gold
                    in just 2 days. Very professional and kept me updated
                    throughout the process. Highly recommended!"
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>2 days ago</span>
                    <span>•</span>
                    <span>Order #ord_001</span>
                    <span>•</span>
                    <span className="text-green-600">Tip: €5</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-b border-gray-200 pb-6">
              <div className="flex items-start space-x-4">
                <div className="text-2xl">🧑‍💻</div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="font-medium text-gray-900">RankUp_Mike</div>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className="w-4 h-4 text-yellow-400 fill-current"
                        />
                      ))}
                    </div>
                    <div className="text-sm text-gray-500">
                      Fortnite Duo Boost
                    </div>
                  </div>
                  <p className="text-gray-700 mb-2">
                    "Great duo partner! Mike taught me so much during our
                    sessions. Not only did we reach Diamond, but I learned
                    strategies I still use today."
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>1 week ago</span>
                    <span>•</span>
                    <span>Order #ord_002</span>
                    <span>•</span>
                    <span className="text-green-600">Tip: €10</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const SettingsTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Settings</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Account Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Account Settings
            </h3>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value="customer@example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Display Name
              </label>
              <input
                type="text"
                value="GameMaster_2024"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Zone
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                <option>UTC+1 (Central European Time)</option>
                <option>UTC+0 (Greenwich Mean Time)</option>
                <option>UTC-5 (Eastern Standard Time)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Bell className="w-5 h-5 mr-2" />
              Notifications
            </h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Order Updates</div>
                <div className="text-sm text-gray-500">
                  Get notified when order status changes
                </div>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="rounded border-gray-300"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">New Messages</div>
                <div className="text-sm text-gray-500">
                  Notifications for chat messages
                </div>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="rounded border-gray-300"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Promotions</div>
                <div className="text-sm text-gray-500">
                  Special offers and discounts
                </div>
              </div>
              <input type="checkbox" className="rounded border-gray-300" />
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Security
            </h3>
          </div>
          <div className="p-6 space-y-4">
            <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Shield className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">
                    Change Password
                  </div>
                  <div className="text-sm text-gray-500">
                    Update your account password
                  </div>
                </div>
              </div>
              <div className="text-gray-400">→</div>
            </button>

            <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <Shield className="w-4 h-4 text-green-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">
                    Two-Factor Authentication
                  </div>
                  <div className="text-sm text-gray-500">
                    Enable 2FA for extra security
                  </div>
                </div>
              </div>
              <div className="text-gray-400">→</div>
            </button>
          </div>
        </div>

        {/* Payment Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Payment Methods
            </h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <CreditCard className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    •••• •••• •••• 4242
                  </div>
                  <div className="text-sm text-gray-500">Expires 12/25</div>
                </div>
              </div>
              <button className="text-sm text-purple-600 hover:text-purple-700">
                Edit
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-yellow-100 rounded-full">
                  <Wallet className="w-4 h-4 text-yellow-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">PayPal</div>
                  <div className="text-sm text-gray-500">user@paypal.com</div>
                </div>
              </div>
              <button className="text-sm text-purple-600 hover:text-purple-700">
                Edit
              </button>
            </div>

            <button className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600">
              + Add New Payment Method
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Add Funds Modal
  const AddFundsModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Add Funds to Wallet
          </h3>
          <button
            onClick={() => setShowAddFunds(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                €
              </span>
              <input
                type="number"
                placeholder="0.00"
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Method
            </label>
            <div className="space-y-2">
              <div className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg">
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  defaultChecked
                />
                <CreditCard className="w-5 h-5 text-gray-600" />
                <span>Credit/Debit Card</span>
              </div>
              <div className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg">
                <input type="radio" name="payment" value="paypal" />
                <Wallet className="w-5 h-5 text-gray-600" />
                <span>PayPal</span>
              </div>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              onClick={() => setShowAddFunds(false)}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setWalletBalance((prev) => prev + 50);
                setShowAddFunds(false);
              }}
              className="flex-1 py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Add Funds
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Order Detail Modal
  const OrderDetailModal = ({ order }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Order Details</h3>
          <button
            onClick={() => setSelectedOrder(null)}
            className="text-gray-400 hover:text-gray-600"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Order Header */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="text-3xl">{gamesData[order.game].icon}</div>
              <div>
                <div className="font-semibold text-gray-900">
                  {gamesData[order.game].name}
                </div>
                <div className="text-sm text-gray-500">
                  {services[order.service].name}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                €{order.price}
              </div>
              <div
                className={`px-2 py-1 text-xs rounded-full flex items-center space-x-1 ${getStatusColor(
                  order.status
                )}`}
              >
                {getStatusIcon(order.status)}
                <span className="capitalize">
                  {order.status.replace("_", " ")}
                </span>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{order.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${order.progress}%` }}
              ></div>
            </div>
          </div>

          {/* Rank Progress */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Current Rank</div>
              <div className="font-semibold text-gray-900">
                {
                  gamesData[order.game].ranks.find(
                    (r) => r.id === order.currentRank
                  )?.name
                }
              </div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-sm text-purple-600 mb-1">Target Rank</div>
              <div className="font-semibold text-purple-900">
                {
                  gamesData[order.game].ranks.find(
                    (r) => r.id === order.targetRank
                  )?.name
                }
              </div>
            </div>
          </div>

          {/* Booster Info */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-4 mb-3">
              <div className="text-2xl">
                {boosters.find((b) => b.name === order.booster)?.avatar}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900">
                  {order.booster}
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span>
                    {boosters.find((b) => b.name === order.booster)?.rating}
                  </span>
                  <span>•</span>
                  <span>
                    {
                      boosters.find((b) => b.name === order.booster)
                        ?.completedOrders
                    }{" "}
                    orders
                  </span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200">
                  <MessageCircle className="w-4 h-4" />
                </button>
                <button className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200">
                  <AlertCircle className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Order Timeline</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="text-sm text-gray-600">
                  Order placed - {formatDate(order.createdAt)}
                </div>
              </div>
              {order.status !== "pending" && (
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="text-sm text-gray-600">
                    Booster assigned - {formatDate(order.createdAt)}
                  </div>
                </div>
              )}
              {order.status === "completed" && (
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div className="text-sm text-gray-600">
                    Order completed - {formatDate(order.completedAt)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <div className="text-xl font-bold text-gray-900">RankBoost</div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-purple-50 px-3 py-1 rounded-full">
                <Wallet className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-600">
                  €{walletBalance}
                </span>
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                <Bell className="w-5 h-5" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
                <span className="text-sm font-medium text-gray-900">
                  GameMaster_2024
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
              <button
                onClick={() => setActiveTab("overview")}
                className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left ${
                  activeTab === "overview"
                    ? "bg-purple-100 text-purple-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Home className="w-5 h-5" />
                <span>Overview</span>
              </button>

              <button
                onClick={() => setActiveTab("orders")}
                className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left ${
                  activeTab === "orders"
                    ? "bg-purple-100 text-purple-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Package className="w-5 h-5" />
                <span>Orders</span>
              </button>

              <button
                onClick={() => setActiveTab("wallet")}
                className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left ${
                  activeTab === "wallet"
                    ? "bg-purple-100 text-purple-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Wallet className="w-5 h-5" />
                <span>Wallet</span>
              </button>

              <button
                onClick={() => setActiveTab("reviews")}
                className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left ${
                  activeTab === "reviews"
                    ? "bg-purple-100 text-purple-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Star className="w-5 h-5" />
                <span>Reviews</span>
              </button>

              <button
                onClick={() => setActiveTab("settings")}
                className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left ${
                  activeTab === "settings"
                    ? "bg-purple-100 text-purple-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </button>
            </nav>

            <div className="pt-4 border-t border-gray-200">
              <button className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left text-gray-600 hover:bg-gray-100">
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === "overview" && <OverviewTab />}
            {activeTab === "orders" && <OrdersTab />}
            {activeTab === "wallet" && <WalletTab />}
            {activeTab === "reviews" && <ReviewsTab />}
            {activeTab === "settings" && <SettingsTab />}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAddFunds && <AddFundsModal />}
      {selectedOrder && <OrderDetailModal order={selectedOrder} />}
    </div>
  );
};

export default Dashboard;
