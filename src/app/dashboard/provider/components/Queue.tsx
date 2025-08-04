"use client";
import React, { useState, useEffect } from "react";
import {
  Flame,
  Users,
  DollarSign,
  Clock,
  List,
  Wifi,
  WifiOff,
  ServerCrash,
  AlertTriangle,
} from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { message } from "antd";
import { io } from "socket.io-client";
import { Socket } from "socket.io";
import { useStore } from "@/store/useStore";
dayjs.extend(relativeTime);

// --- TYPE DEFINITIONS BASED ON PROVIDED JSON AND SCHEMA ---
interface Game {
  id: string;
  name: string;
  image: string;
  isEloBased: boolean;
}

interface Service {
  id: string;
  name: string;
  description: string;
  game: Game;
}

interface Subpackage {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  requiredProviders: number;
  service: Service;
}

// This is the main Order object received from the GET /api/orders/queue endpoint
interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  subpackageId: string;
  discordTag: string;
  discordUsername: string;
  price: number;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELED";
  notes: string | null;
  rerollsLeft: number;
  approvedCount: number;
  requiredCount: number; // This is the total number of providers needed
  updatedAt: string; // ISO date string
  isInQueue: boolean;
  subpackage: Subpackage;
  // The following properties are from the OrderAssignment model but might not be on the initial queue object.
  // For this component, we primarily care about the queue data.
  // We'll assume the queue gives us the required count, but not who is assigned yet.
}

interface ApiResponse {
  success: boolean;
  data?: Order[];
  error?: string;
}

// --- HELPER & UI COMPONENTS ---

const OrderCardSkeleton = () => (
  <div className="bg-[#2a0a1e]/80 p-5 rounded-xl border border-white/10 animate-pulse">
    <div className="flex justify-between items-start">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-white/10 rounded-lg"></div>
        <div>
          <div className="h-5 w-40 bg-white/10 rounded mb-2"></div>
          <div className="h-4 w-32 bg-white/10 rounded"></div>
        </div>
      </div>
      <div className="h-4 w-20 bg-white/10 rounded"></div>
    </div>
    <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
      <div className="flex gap-6">
        <div className="h-5 w-24 bg-white/10 rounded"></div>
        <div className="h-5 w-24 bg-white/10 rounded"></div>
      </div>
      <div className="h-10 w-28 bg-white/20 rounded-lg"></div>
    </div>
  </div>
);

const EmptyQueue = () => (
  <div className="text-center py-20 px-6 rounded-lg bg-black/20 col-span-full">
    <ServerCrash className="w-16 h-16 mx-auto text-gray-500" />
    <h3 className="mt-4 text-2xl font-semibold text-white">
      The Queue is Empty
    </h3>
    <p className="mt-2 text-gray-400">
      There are no available orders right now. Check back soon!
    </p>
  </div>
);

const ErrorState = ({ message }: { message: string }) => (
  <div className="text-center py-20 px-6 rounded-lg bg-red-900/30 border border-red-500/50 col-span-full">
    <AlertTriangle className="w-16 h-16 mx-auto text-red-400" />
    <h3 className="mt-4 text-2xl font-semibold text-white">
      Failed to Load Queue
    </h3>
    <p className="mt-2 text-red-300">
      {message || "An unexpected error occurred. Please try again later."}
    </p>
  </div>
);

const OrderCard = ({
  order,
  onApply,
  isApplying,
}: {
  order: Order;
  onApply: (orderId: string, customerId: string) => void;
  isApplying: boolean;
}) => {
  // Assuming platform takes a 20% fee
  const earnings = order.price;
  const game = order.subpackage.service.game;

  return (
    <div className="p-px rounded-xl bg-gradient-to-br from-pink-500/50 via-purple-500/50 to-cyan-400/50">
      <div className="bg-[#1c0715] p-5 rounded-xl h-full">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <img
              src={game.image || "/logo/logo.png"}
              alt={game.name}
              className="w-16 h-16 rounded-lg object-cover border-2 border-white/10"
            />
            <div>
              <h3 className="font-bold text-white text-lg">{game.name}</h3>
              <p className="text-gray-300 text-sm">
                {order.subpackage.service.name}
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-400 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            {dayjs(order.updatedAt).fromNow()}
          </p>
        </div>

        <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-end">
          <div className="flex gap-x-6 gap-y-2 flex-wrap">
            <div>
              <p className="text-xs text-gray-400 uppercase font-semibold">
                Package
              </p>
              <p className="text-white font-medium truncate max-w-xs">
                {order.subpackage.name}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase font-semibold">
                Price
              </p>
              <p className="font-semibold text-green-400 flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                {earnings}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase font-semibold">
                Slots
              </p>
              <p className="font-semibold text-cyan-300 flex items-center gap-1">
                <Users className="w-4 h-4" />
                {/* This would need real-time data; for now, showing required count */}
                {order.approvedCount} / {order.requiredCount}
              </p>
            </div>
          </div>
          <button
            onClick={() => onApply(order.id, order.customerId)}
            disabled={isApplying}
            className="font-semibold text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg py-2 px-5 rounded-lg inline-flex items-center justify-center text-sm whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isApplying ? "Applying..." : "Apply Now"}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---

export function OrderQueue() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useStore();
  const [error, setError] = useState<string | null>(null);
  const [applyingOrderId, setApplyingOrderId] = useState<string | null>(null);

  const fetchQueue = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/orders/queue");

      if (!res.ok) {
        throw new Error("Failed to fetch data from the server.");
      }

      const data: ApiResponse = await res.json();

      if (data.success) {
        setOrders(data.data || []);
      } else {
        // Handle the case where API returns { success: false }
        throw new Error(data.error || "The API returned an error.");
      }
    } catch (err: any) {
      console.error("Failed to fetch queue:", err);
      setError(err?.message || "something went wrong");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchQueue();
  }, []);

  const handleApply = async (orderId: string, customerId: string) => {
    setApplyingOrderId(orderId);
    try {
      // Step 1: Create the OrderAssignment in the database
      const response = await fetch(`/api/orders/${orderId}/assignments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        // The server should return a meaningful error message
        throw new Error(result.message || "Failed to apply for the order.");
      }

      // Step 3: Update the UI by removing the order from the queue for this provider
      setOrders((prev) => prev.filter((order) => order.id !== orderId));

      message.success(
        `Successfully applied for order ${orderId}! The customer has been notified.`
      );
    } catch (error: any) {
      console.error("Application failed:", error);
      message.error(`Error: ${error.message}`);
    } finally {
      setApplyingOrderId(null);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <>
          <OrderCardSkeleton />
          <OrderCardSkeleton />
          <OrderCardSkeleton />
          <OrderCardSkeleton />
        </>
      );
    }
    if (error) {
      return <ErrorState message={error} />;
    }
    if (orders.length > 0) {
      return orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          onApply={handleApply}
          isApplying={applyingOrderId === order.id}
        />
      ));
    }
    return <EmptyQueue />;
  };

  return (
    <div className="space-y-8 p-4 md:p-8">
      <h1 className="text-3xl font-bold text-white flex items-center gap-3">
        <List className="text-cyan-300" /> Order Queue
      </h1>
      <div>
        <button
          onClick={fetchQueue}
          disabled={isLoading}
          className="text-white bg-cyan-700 hover:bg-cyan-800 px-4 py-2 rounded-lg font-medium disabled:opacity-50"
        >
          {isLoading ? "Refreshing..." : "Refresh Queue"}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">{renderContent()}</div>
    </div>
  );
}
