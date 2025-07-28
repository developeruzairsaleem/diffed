"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
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
import { Button } from "antd";

export default function OrderDetailPage() {
  const store = useStore();
  const CURRENT_USER = store.user;
  const params = useParams();
  const orderId = params!.id as string;
  const [order, setOrder] = useState<OrderDetailDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

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

  const progressPercent = Math.round(
    (order.approvedCount / order.requiredCount) * 100
  );

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
          <Link href="/chat">
            <div className="flex items-center gap-2 text-white hover:text-white/80 transition-colors cursor-pointer">
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Orders</span>
            </div>
          </Link>
          <Separator orientation="vertical" className="h-6 bg-white/30" />
          <h1 className="text-2xl font-bold text-white game-title">
            Order #{order.orderNumber.slice(-8)}
          </h1>
        </div>

        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="details" className="space-y-6">
            <TabsList className="grid p-2 w-full grid-cols-2 ">
              <TabsTrigger
                value="details"
                className="flex p-3 items-center gap-2 cursor-pointer text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500  data-[state=active]:via-purple-500 data-[state=active]:to-cyan-400
            transition-all"
              >
                <Gamepad2 className="h-4 w-4" />
                Order Details
              </TabsTrigger>
              <TabsTrigger
                value="chat"
                className="flex p-3 cursor-pointer items-center gap-2 text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500  data-[state=active]:via-purple-500 data-[state=active]:to-cyan-400
            transition-all"
              >
                <MessageCircle className="h-4 w-4" />
                Live Chat
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6">
              {/* Order Status Card */}
              <Card className="order-card">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-purple-300" />
                      Order Status
                    </span>
                    <Badge
                      className={`text-white ${getStatusColor(order.status)}`}
                    >
                      {getStatusIcon(order.status)}
                      <span className="ml-1">{order.status}</span>
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gray-50/25 rounded-lg">
                      <DollarSign className="h-8 w-8 mx-auto mb-2 text-green-300" />
                      <p className="text-2xl font-bold text-green-300">
                        ${order.price.toFixed(2)}
                      </p>
                      <p className="text-sm text-white">Total Price</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50/30 rounded-lg">
                      <User className="h-8 w-8 mx-auto mb-2 text-blue-300" />
                      <p className="text-2xl font-bold text-blue-300">
                        {order.approvedCount}/{order.requiredCount}
                      </p>
                      <p className="text-sm text-white">Providers</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50/30 rounded-lg">
                      <Calendar className="h-8 w-8 mx-auto mb-2 text-purple-300" />
                      <p className="text-2xl font-bold text-purple-300">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-white">Created</p>
                    </div>
                  </div>

                  {/* <div> */}
                  {/* <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Progress</span>
                      <span className="text-sm text-gray-600">
                        {progressPercent}%
                      </span>
                    </div> */}
                  {/* <Progress value={progressPercent} className="h-2" /> */}
                  {/* </div> */}
                </CardContent>
              </Card>

              {/* Service Details Card */}
              <Card className="order-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gamepad2 className="h-5 w-5 text-purple-600" />
                    Service Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 border-2 border-gray-200">
                      <AvatarImage
                        src={
                          order.subpackage.service.game.image ||
                          "/placeholder.svg"
                        }
                      />
                      <AvatarFallback>
                        <Gamepad2 className="h-8 w-8" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-semibold">
                        {order.subpackage.service.game.name}
                      </h3>
                      <p className="text-white">
                        {order.subpackage.service.name}
                      </p>
                      <p className="text-sm text-white">
                        {order.subpackage.name}
                      </p>
                    </div>
                  </div>

                  {order.subpackage.description && (
                    <div>
                      <h4 className="font-medium mb-2">Description</h4>
                      <p className="text-white text-sm">
                        {order.subpackage.description}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Provider Assignments */}
              {order.assignments.length > 0 && (
                <Card className="order-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5 text-purple-600" />
                      Provider Assignments
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {order.assignments.map((assignment) => (
                        <div
                          key={assignment.id}
                          className="flex items-center justify-between p-4 bg-gray-50/30 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage
                                src={
                                  assignment.provider.profileImage ||
                                  "/placeholder.svg"
                                }
                              />
                              <AvatarFallback>
                                <span className="p-3 rounded-full bg-gray-50/50">
                                  {assignment.provider.username[0].toUpperCase()}
                                </span>
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">
                                {assignment.provider.username}{" "}
                                <Badge
                                  className={`mb-2 ${
                                    assignment.status === "APPROVED"
                                      ? "bg-green-500"
                                      : assignment.status === "COMPLETED"
                                      ? "bg-blue-500"
                                      : assignment.status === "VERIFIED"
                                      ? "bg-purple-500"
                                      : assignment.status === "PENDING"
                                      ? "bg-yellow-500"
                                      : assignment.status === "REPLACED"
                                      ? "bg-red-500"
                                      : "bg-gray-500"
                                  } text-white`}
                                >
                                  {assignment.status}
                                </Badge>
                              </p>
                              <p className="text-sm text-gray-100">
                                {assignment.provider.email}
                              </p>
                            </div>
                          </div>
                          <div className="text-right flex gap-2">
                            <button className=" bg-gradient-to-r from-pink-500 p-3 inline-block via-purple-500 to-cyan-400 transition-all">
                              Approve Provider
                            </button>
                            <button className="inline-block bg-gradient-to-r from-pink-500 p-3 via-purple-500 to-cyan-400 transition-all">
                              Mark as Verified
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            <TabsContent value="chat">
              {store?.user && (
                <ChatInterface
                  orderId={order.id}
                  orderNumber={order.orderNumber}
                  currentUser={store?.user}
                />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
