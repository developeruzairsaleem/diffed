"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageCircle,
  Gamepad2,
  DollarSign,
  Calendar,
  Target,
} from "lucide-react";
import Link from "next/link";
import ChatInterface from "@/components/chat/ChatInterface";
import type { OrderDetailDto } from "@/types/order.dto";
import { useStore } from "@/store/useStore";
import { Button, message } from "antd";
import MatchMakingReview from "@/app/matchmaking-review/page";

// -------------------------------
// order detail page for customer
// ------------------------------------
export default function AssignmentReview() {
  // ---------------------------------------------
  // application state for orderdetail page and chat page
  // --------------------------------------------

  const store = useStore();
  const params = useParams();
  console.log('PARAAAMSS:  ', params)
  const orderId = params!.id as string;
  const assignmentId = params!.assignmentId as string;
  const [order, setOrder] = useState<OrderDetailDto | null>(null);
  const [assignmentReview, setAssignmentReview] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const [approvingId, setApprovingId] = useState<string | null>(null);
  const handleApproveAssignment = async (assingmentId: string) => {
    setApprovingId(assingmentId);
    try {
      //  -------------------------------------------------
      // update the order assignment status to approved.
      // ---------------------------------------------------
      const response = await fetch(
        `/api/orders/${orderId}/assignments/${assingmentId}/approve`,
        {
          method: "PUT",
          body: JSON.stringify({}),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const result = await response.json();
      // ------------------------------------------------------
      // check if the update of assignment was successful or not
      // ------------------------------------------------------
      if (!result.success) {
        setApprovingId(null);
        return message.error("Failed to approve the assignment");
      }
      message.success("Successfully Approved!");
      // Refetch order to update UI
      await fetchOrder();
    } catch (error) {
      console.error("something went wrong", error);
      message.error("Something went wrong updating.");
    } finally {
      setApprovingId(null);
    }
  };

  //----------------------------------
  // Fetching order detail data
  // -------------------------------
  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      const data = await response.json();
      if (data.success) {
        setOrder(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch order:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignment = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}/assignments/${assignmentId}/review`);
      const data = await response.json();
      if (data.success) {
        setAssignmentReview(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch order:", error);
    } finally {
      setLoading(false);
    }
  };

  //-------------------------------------------
  //  fetch order on orderId change or first page load
  //--------------------------------------------
  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  useEffect(() => {
    if(assignmentId) {
      fetchAssignment();
    }
  }, [assignmentId])

  // --------------------------------------------------
  // status color depending on the current order status
  // -------------------------------------------------
  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-500";
      case "IN_PROGRESS":
        return "bg-blue-500";
      case "COMPLETED":
        return "bg-green-500";
      case "CANCELLED":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };
  // ----------------------------------------------------
  // Get icon depending on the status of individual order
  // ----------------------------------------------------
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Clock className="h-4 w-4" />;
      case "IN_PROGRESS":
        return <AlertCircle className="h-4 w-4" />;
      case "COMPLETED":
        return <CheckCircle className="h-4 w-4" />;
      case "CANCELLED":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };
  // ------------------------------------------------------
  // If the order detail is loading show a loader by default
  // ------------------------------------------------------
  if (loading) {
    return (
      <div
        className="min-h-screen 
            transition-all flex items-center justify-center"
      >
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }
  // If no order exist return the message that no order found
  if (!order) {
    return (
      <div className="min-h-screen  flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-2">Order Not Found</h1>
          <p className="text-white/80">
            The order you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  // Calculate the number of assignments with status APPROVED, VERIFIED, or COMPLETED
  const approvedAssignmentsCount = order.assignments.filter((a) =>
    ["APPROVED", "VERIFIED", "COMPLETED"].includes(a.status)
  ).length;

  // Access control: only allow if order.status is IN_PROGRESS and user is owner or approved/verified/completed provider
  const userId = store?.user?.id;
  const isCustomer = userId && userId === order.customerId;
  const isProvider =
    userId &&
    order.assignments.some(
      (a) =>
        a.providerId === userId &&
        ["APPROVED", "VERIFIED", "COMPLETED"].includes(a.status)
    );
  // can access the page if is pending or is in progress
  const canAccess =
    (order.status === "IN_PROGRESS" || order.status === "PENDING") &&
    (isCustomer || isProvider);

  if (!canAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-white/80">
            You do not have permission to view this order.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <style jsx global>{`
        .game-title {
          background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: bold;
        }
        .order-card {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          border: none;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }
      `}</style>

      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/dashboard/customer/orders">
            <div className="flex items-center gap-2 text-white hover:text-white/80 transition-colors cursor-pointer">
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Order</span>
            </div>
          </Link>
          <Separator orientation="vertical" className="h-6 bg-white/30" />
          <h1 className="text-2xl font-bold text-white game-title">
            Provider {assignmentReview && assignmentReview.provider.username}
          </h1>
        </div>

        <MatchMakingReview />
        
      </div>
    </div>
  );
}
