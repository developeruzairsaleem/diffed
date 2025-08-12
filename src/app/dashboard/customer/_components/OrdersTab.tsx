"use client";
import {
  Package,
  Activity,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Inbox,
} from "lucide-react";
import { useCustomerOrders } from "@/hooks/useOrders";
import { useStore } from "@/store/useStore";
import type { CustomerOrderListDto } from "@/types/order.dto";
import { useState } from "react";
import Link from "next/link";
import SafeImage from "@/components/ui/SafeImage";
import { OrdersSkeleton } from "@/components/ui/OrdersSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

const getStatusIcon = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return <CheckCircle className="w-4 h-4" />;
    case "IN_PROGRESS":
      return <Activity className="w-4 h-4" />;
    case "PENDING":
      return <Clock className="w-4 h-4" />;
    case "CANCELLED":
      return <XCircle className="w-4 h-4" />;
    default:
      return <AlertCircle className="w-4 h-4" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return "text-green-400 border-green-400 border-2 bg-green-500/10";
    case "IN_PROGRESS":
      return "text-blue-400 border-blue-400 border-2 bg-blue-500/10";
    case "PENDING":
      return "text-yellow-400 border-2 border-yellow-400 bg-yellow-500/10";
    case "CANCELLED":
      return "text-red-400 border-red-400 border-2 bg-red-500/10";
    default:
      return "text-gray-400 border-gray-400 border-2 bg-gray-500/10";
  }
};

const OrdersTab = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const { user } = useStore();

  const {
    data: ordersData,
    error: ordersError,
    refetch: refetchOrders,
    loading: loadingOrders,
  } = useCustomerOrders({
    customerId: user?.id,
    page,
    limit,
  });

  if (loadingOrders) {
    return (
      <div className="space-y-6 mb-20 flex flex-col">
        <div
          className="rounded-lg flex-1 mt-auto"
          style={{
            padding: "1px",
            background:
              "linear-gradient(90deg, #EE2C81 0%, #FE0FD0 33%, #58B9E3 66%, #F79FC5 100%)",
          }}
        >
          <div
            style={{
              padding: "1px",
              background:
                "linear-gradient(90deg, #EE2C81 0%, #FE0FD0 33%, #58B9E3 66%, #F79FC5 100%)",
            }}
            className="h-full rounded-lg"
          >
            <div className="rounded-lg h-full bg-[#52103A]">
              <div
                style={{ backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                className="rounded-lg h-full shadow-sm w-full"
              >
                {/* Header */}
                <div className="p-6 border-gray-200">
                  <h3 className="text-xl font-semibold text-white flex items-center">
                    <Clock className="w-5 h-5 mr-2" /> Orders
                  </h3>
                </div>

                {/* Table Skeleton */}
                <div className="p-6 overflow-x-auto w-full">
                  <table
                    className="w-full min-w-[600px] text-left"
                    style={{ borderCollapse: "separate", borderSpacing: 0 }}
                  >
                    <thead>
                      <tr
                        style={{
                          borderBottom: "3px solid",
                          borderImage:
                            "linear-gradient(90deg, #00C3FF 0%, #FFFF1C 100%) 1",
                        }}
                      >
                        {[
                          "Game",
                          "Service",
                          "Package",
                          "Boosters/Coaches",
                          "Price",
                          "Status",
                          "View",
                        ].map((header) => (
                          <th
                            key={header}
                            className="py-3 px-4 text-[#E1E1E1] font-semibold text-lg"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({ length: 6 }).map((_, idx) => (
                        <tr
                          key={idx}
                          className="hover:bg-white/5 transition-colors duration-200"
                        >
                          {/* Game */}
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-3">
                              <Skeleton className="w-10 h-10 rounded-md bg-[#3A0F2A]" />
                              <Skeleton className="h-4 w-24 rounded-md bg-[#3A0F2A] " />
                            </div>
                          </td>
                          {/* Service */}
                          <td className="py-4 px-4">
                            <Skeleton className="h-4 w-28 rounded-md bg-[#3A0F2A]" />
                          </td>
                          {/* Package */}
                          <td className="py-4 px-4">
                            <Skeleton className="h-4 w-36 rounded-md bg-[#3A0F2A]" />
                          </td>
                          {/* Boosters/Coaches */}
                          <td className="py-4 px-4">
                            <Skeleton className="h-4 w-32 rounded-md bg-[#3A0F2A]" />
                          </td>
                          {/* Price */}
                          <td className="py-4 px-4">
                            <Skeleton className="h-4 w-16 rounded-md bg-[#3A0F2A]" />
                          </td>
                          {/* Status */}
                          <td className="py-4 px-4">
                            <Skeleton className="h-6 w-20 rounded-full  bg-[#3A0F2A]" />
                          </td>
                          {/* View */}
                          <td className="py-4 px-4">
                            <Skeleton className="h-8 w-24 rounded-lg  bg-[#3A0F2A]" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Pagination Skeleton */}
                  <div className="flex justify-center items-center gap-4 mt-6">
                    <Skeleton className="h-10 w-24 rounded-lg bg-[#3A0F2A]" />
                    <Skeleton className="h-6 w-16 rounded-md bg-[#3A0F2A]" />
                    <Skeleton className="h-10 w-24 rounded-lg  bg-[#3A0F2A]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 mb-20 flex flex-col">
      <div
        className="rounded-lg flex-1 mt-auto"
        style={{
          padding: "1px",
          background:
            "linear-gradient(90deg, #EE2C81 0%, #FE0FD0 33%, #58B9E3 66%, #F79FC5 100%)",
        }}
      >
        <div
          style={{
            padding: "1px",
            background:
              "linear-gradient(90deg, #EE2C81 0%, #FE0FD0 33%, #58B9E3 66%, #F79FC5 100%)",
          }}
          className="h-full rounded-lg"
        >
          <div className="rounded-lg h-full bg-[#52103A]">
            <div
              style={{ backgroundColor: "rgba(255, 255, 255, 0.15)" }}
              className="rounded-lg h-full shadow-sm w-full"
            >
              <div className="p-6 border-gray-200">
                <h3 className="text-xl font-semibold text-white flex items-center">
                  <Clock className="w-5 h-5 mr-2" /> Orders
                </h3>
              </div>
              <div className="p-6">
                <div className="overflow-x-auto w-full">
                  {!ordersData?.orders?.length ? (
                    <div className="text-center py-20 px-6">
                      <Inbox className="w-16 h-16 mx-auto text-gray-500 mb-4" />
                      <h3 className="text-2xl font-semibold text-white mb-2">
                        No Orders Yet
                      </h3>
                      <p className="text-gray-300 mb-6">
                        When you place an order, it will appear here.
                      </p>
                      <button className="font-semibold text-white bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 hover:opacity-90 transition-opacity duration-200 py-3 px-6 rounded-lg text-base">
                        Place New Order
                      </button>
                    </div>
                  ) : (
                    <>
                      <table
                        className="w-full min-w-[600px] text-left"
                        style={{ borderCollapse: "separate", borderSpacing: 0 }}
                      >
                        <thead>
                          <tr
                            style={{
                              borderBottom: "3px solid",
                              borderImage:
                                "linear-gradient(90deg, #00C3FF 0%, #FFFF1C 100%) 1",
                            }}
                          >
                            <th className="py-3 px-4 text-[#E1E1E1] font-semibold text-lg">
                              Game
                            </th>
                            <th className="py-3 px-4 text-[#E1E1E1] font-semibold text-lg">
                              Service
                            </th>
                            <th className="py-3 px-4 text-[#E1E1E1] font-semibold text-lg">
                              Package
                            </th>
                            <th className="py-3 px-4 text-[#E1E1E1] font-semibold text-lg">
                              Boosters/Coaches
                            </th>
                            <th className="py-3 px-4 text-[#E1E1E1] font-semibold text-lg">
                              Price
                            </th>
                            <th className="py-3 px-4 text-[#E1E1E1] font-semibold text-lg">
                              Status
                            </th>
                            <th className="py-3 px-4 text-[#E1E1E1] font-semibold text-lg">
                              View
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {ordersData?.orders?.map(
                            (order: CustomerOrderListDto, idx: number) => (
                              <tr
                                className="hover:bg-white/5 transition-colors duration-200"
                                key={order?.id}
                              >
                                <td className="py-4 px-4 text-[#E1E1E1]">
                                  <div className="flex items-center space-x-3">
                                    {order?.subpackage?.service?.game?.image ? (
                                      <SafeImage
                                        placeholder="/images/placeholder.png"
                                        src={
                                          order?.subpackage?.service?.game
                                            ?.image
                                        }
                                        className="w-10 h-10 rounded-md object-cover"
                                        alt={
                                          order?.subpackage?.service?.game?.name
                                        }
                                      />
                                    ) : (
                                      <div className="w-10 h-10 bg-[#3A0F2A] rounded-md flex items-center justify-center">
                                        <Package className="w-5 h-5 text-gray-400" />
                                      </div>
                                    )}
                                    <span className="font-medium">
                                      {order?.subpackage?.service?.game?.name}
                                    </span>
                                  </div>
                                </td>
                                <td className="py-4 px-4 text-[#E1E1E1] font-medium">
                                  {order?.subpackage?.service?.name}
                                </td>
                                <td
                                  className="py-4 px-4 text-[#E1E1E1] max-w-[200px] truncate"
                                  title={order?.subpackage?.name}
                                >
                                  {order?.subpackage?.name}
                                </td>
                                <td className="py-4 px-4 text-[#E1E1E1]">
                                  {(() => {
                                    const filtered =
                                      order?.providers?.filter((provider) =>
                                        [
                                          "APPROVED",
                                          "COMPLETED",
                                          "VERIFIED",
                                        ].includes(provider?.status)
                                      ) || [];
                                    const first = filtered[0];
                                    if (!first)
                                      return (
                                        <span className="text-gray-400">
                                          No Providers
                                        </span>
                                      );
                                    return (
                                      <span>
                                        {first.username}
                                        {filtered.length > 1 && (
                                          <span className="text-gray-400">
                                            {" "}
                                            and {filtered.length - 1} more
                                          </span>
                                        )}
                                      </span>
                                    );
                                  })()}
                                </td>
                                <td className="py-4 px-4 text-[#E1E1E1] font-semibold">
                                  $ {order?.price}
                                </td>
                                <td className="py-4 px-4">
                                  <span
                                    className={`py-1.5 px-3 text-xs font-bold rounded-full inline-flex items-center gap-2 ${getStatusColor(
                                      order?.status
                                    )}`}
                                  >
                                    {getStatusIcon(order?.status)}
                                    <span className="capitalize">
                                      {order.status
                                        .replace("_", " ")
                                        .toLowerCase()}
                                    </span>
                                  </span>
                                </td>
                                <td className="py-4 px-4">
                                  <Link
                                    href={
                                      order.status === "PENDING"
                                        ? `/dashboard/customer/orders/${order.id}/pending`
                                        : `/dashboard/customer/orders/${order.id}`
                                    }
                                    className="font-semibold text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg py-2 px-4 rounded-lg inline-flex items-center justify-center whitespace-nowrap text-xs"
                                  >
                                    View Details
                                  </Link>
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                      <div className="flex justify-center items-center gap-4 mt-6">
                        <button
                          onClick={() =>
                            setPage((prev) => Math.max(prev - 1, 1))
                          }
                          disabled={page === 1}
                          className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-pink-600 hover:to-purple-700 transition-all duration-300 font-medium"
                        >
                          Previous
                        </button>
                        <span className="text-white font-medium px-4">
                          Page {page}
                        </span>
                        <button
                          onClick={() => {
                            if (
                              ordersData?.total &&
                              page * limit < ordersData.total
                            ) {
                              setPage((prev) => prev + 1);
                            }
                          }}
                          disabled={
                            !ordersData?.total ||
                            page * limit >= ordersData.total
                          }
                          className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-pink-600 hover:to-purple-700 transition-all duration-300 font-medium"
                        >
                          Next
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersTab;
