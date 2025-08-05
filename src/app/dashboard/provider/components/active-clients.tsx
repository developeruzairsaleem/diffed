"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { message } from "antd";
import { ActiveClientsSkeleton } from "@/components/ui/ActiveClientsSkeleton"; // Adjust path if needed
import { Badge } from "@/components/ui/badge";

// Helper function to get initials from a username for the Avatar fallback
const getInitials = (name = "") =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

// Helper to style the status badge
const getStatusVariant = (status) => {
  switch (status) {
    case "APPROVED":
      return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    case "COMPLETED":
      return "bg-green-500/20 text-green-400 border-green-500/30";
    case "VERIFIED":
      return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    default:
      return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  }
};

export function ActiveClients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActiveClients = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/active-clients");
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Failed to load active clients.");
        }
        setClients(data);
      } catch (error) {
        console.error(error);
        message.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchActiveClients();
  }, []);

  if (loading) {
    return <ActiveClientsSkeleton />;
  }

  return (
    <Card className="bg-black/30 backdrop-blur-sm border-white/10 shadow-2xl">
      <CardHeader>
        <CardTitle className="text-white">Active Engagements</CardTitle>
      </CardHeader>
      <CardContent>
        {clients.length > 0 ? (
          <div className="space-y-4">
            {clients.map((assignment) => (
              <div
                key={assignment.id}
                className="flex items-center justify-between p-4 border border-white/10 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <Avatar className="w-12 h-12 border-2 border-pink-500/50">
                    <AvatarImage
                      src={assignment.order.customer.profileImage || ""}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-600 text-white font-bold">
                      {getInitials(assignment.order.customer.username)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium text-white text-lg">
                      {assignment.order.customer.username}
                    </h4>
                    <p className="text-sm text-white/70">
                      {assignment.order.subpackage.service.game.name} •{" "}
                      {assignment.order.subpackage.name}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-white/90">
                    Order:{" "}
                    <span className="font-mono text-cyan-400">
                      {assignment.order.orderNumber.substring(0, 8)}...
                    </span>
                  </p>
                  <Badge
                    className={`mt-2 text-xs font-bold ${getStatusVariant(
                      assignment.status
                    )}`}
                  >
                    Assignment Status: {assignment.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-white/70">No active clients at the moment.</p>
            <p className="text-sm text-white/50 mt-1">
              Claim an order from the queue to get started!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
