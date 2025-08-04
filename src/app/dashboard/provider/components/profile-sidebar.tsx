"use client";

import React from "react";
import { useStore } from "@/store/useStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Mail, Crown, User as UserIcon } from "lucide-react";

// Helper to capitalize the first letter for display
const capitalize = (s: string) => {
  if (!s) return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

/**
 * A dedicated skeleton component for a clean loading state.
 * It mimics the final layout for a smooth visual transition.
 */
const ProfileSidebarSkeleton = () => (
  <Card className="w-80 flex-shrink-0 h-full bg-black/30 backdrop-blur-sm border-none shadow-2xl">
    <CardContent className="p-6">
      <div className="text-center animate-pulse">
        <Skeleton className="w-24 h-24 rounded-full mx-auto bg-white/10" />
        <Skeleton className="h-6 w-40 mt-4 mx-auto bg-white/10 rounded-md" />
        <Skeleton className="h-5 w-28 mt-2 mx-auto bg-white/10 rounded-md" />
      </div>
      <Separator className="my-6 bg-white/10" />
      <div className="space-y-4 animate-pulse">
        <div className="flex items-center space-x-3">
          <Skeleton className="w-5 h-5 rounded bg-white/10" />
          <Skeleton className="h-5 w-full bg-white/10 rounded-md" />
        </div>
      </div>
    </CardContent>
  </Card>
);

/**
 * A professional, data-driven sidebar component to display user profile information.
 * It shows a skeleton loader while fetching data.
 */
export function ProfileSidebar() {
  const { user } = useStore();

  if (!user) {
    return <ProfileSidebarSkeleton />;
  }

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-gradient-to-r from-red-500 to-red-700";
      case "provider":
        return "bg-gradient-to-r from-teal-500 to-cyan-600";
      case "customer":
      default:
        return "bg-gradient-to-r from-blue-500 to-indigo-600";
    }
  };

  return (
    <Card className="w-80 flex-shrink-0 h-full bg-black/30 backdrop-blur-sm border-none shadow-2xl overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-pink-900/10"></div>
      <CardContent className="p-6 relative">
        <div className="text-center">
          <div className="relative inline-block group">
            <Avatar className="w-24 h-24 mx-auto border-4 border-white/10 group-hover:border-pink-500/50 transition-all duration-300">
              <AvatarImage src={user.avatar} alt={user.username} />
              <AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-600 text-white text-3xl font-bold">
                {user.username ? user.username[0].toUpperCase() : "?"}
              </AvatarFallback>
            </Avatar>
          </div>
          <h3 className="mt-4 text-2xl font-bold text-white tracking-tight">
            {user.username}
          </h3>
          <div className="flex items-center justify-center mt-2">
            <Badge
              variant="default"
              className={`border-0 text-white font-semibold text-xs py-1 px-3 ${getRoleBadgeStyle(
                user.role
              )}`}
            >
              {user.role === "provider" ? (
                <Crown className="w-3 h-3 mr-1.5" />
              ) : (
                <UserIcon className="w-3 h-3 mr-1.5" />
              )}
              {capitalize(user.role)}
            </Badge>
          </div>
        </div>

        <Separator className="my-6 bg-white/20" />

        <div className="space-y-4">
          <h4 className="font-semibold text-sm text-gray-400 uppercase tracking-wider">
            Contact Info
          </h4>
          <div className="flex items-center space-x-4">
            <Mail className="w-5 h-5 text-purple-400 flex-shrink-0" />
            <span className="text-sm text-gray-200 break-all">
              {user.email}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
