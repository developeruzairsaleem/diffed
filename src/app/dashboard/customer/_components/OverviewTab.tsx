import {
  Package,
  Activity,
  CheckCircle,
  DollarSign,
  Clock,
  XCircle,
  AlertCircle,
  Inbox,
} from "lucide-react";
import { useCustomerOrders } from "@/hooks/useOrders";
import { useStore } from "@/store/useStore";
import { CustomerOrderListDto } from "@/types/order.dto";
import Link from "next/link";
import React from "react";

import SafeImage from "@/components/ui/SafeImage";
// --- Helper Functions & Components ---

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
      return "bg-green-500/20 text-green-400";
    case "IN_PROGRESS":
      return "bg-blue-500/20 text-blue-400";
    case "PENDING":
      return "bg-yellow-500/20 text-yellow-400";
    case "CANCELLED":
      return "bg-red-500/20 text-red-400";
    default:
      return "bg-gray-500/20 text-gray-400";
  }
};

const getProviderDisplay = (order: CustomerOrderListDto) => {
  const providers = order?.providers;
  if (!providers || providers.length === 0) return "No Providers Yet";

  const approvedProviders = providers.filter((p) =>
    ["APPROVED", "COMPLETED", "VERIFIED"].includes(p.status)
  );

  if (approvedProviders.length === 0) return "No Providers Yet";

  const first = approvedProviders[0].username;
  if (approvedProviders.length > 1) {
    return `${first} & ${approvedProviders.length - 1} more`;
  }
  return first;
};

const StatsCard = ({
  icon: Icon,
  title,
  value,
  loading,
}: {
  icon: any;
  title: any;
  value: any;
  loading: any;
}) => {
  return (
    <div className="rounded-lg p-px bg-gradient-to-r from-pink-500/50 via-purple-500/50 to-cyan-400/50 hover:from-pink-500 hover:via-purple-500 hover:to-cyan-400 transition-all duration-300">
      <div className="rounded-lg h-full bg-[#3a0f2a] p-6 shadow-lg transition-transform duration-300 hover:scale-[1.02]">
        {loading ? (
          <div className="flex items-center justify-between animate-pulse">
            <div>
              <div className="h-4 w-24 bg-white/10 rounded mb-3"></div>
              <div className="h-8 w-12 bg-white/10 rounded"></div>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full"></div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-300">{title}</p>
              <p className="text-3xl font-bold text-white mt-1">{value}</p>
            </div>
            <div className="p-3 bg-white/10 rounded-full">
              <Icon className="w-6 h-6 text-cyan-300" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const RecentOrdersSkeleton = () => (
  <div className="p-6">
    <div className="h-7 w-48 bg-white/10 rounded animate-pulse mb-6"></div>
    <div className="overflow-x-auto">
      <div className="min-w-[800px]">
        <div className="flex justify-between items-center py-3 px-6 bg-white/5 rounded-t-lg">
          <div className="h-4 w-32 bg-white/10 rounded"></div>
          <div className="h-4 w-24 bg-white/10 rounded"></div>
          <div className="h-4 w-28 bg-white/10 rounded"></div>
          <div className="h-4 w-16 bg-white/10 rounded"></div>
          <div className="h-4 w-24 bg-white/10 rounded"></div>
          <div className="h-4 w-20 bg-white/10 rounded"></div>
        </div>
        <div className="space-y-2 mt-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="flex gap-2 justify-between items-center p-4 rounded-lg bg-transparent animate-pulse border-b border-white/5"
            >
              <div className="flex items-center space-x-4 flex-1">
                <div className="w-10 h-10 rounded bg-white/10"></div>
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-white/10 rounded"></div>
                </div>
              </div>
              <div className="h-4 w-24 bg-white/10 rounded flex-1"></div>
              <div className="h-4 w-28 bg-white/10 rounded flex-1"></div>
              <div className="h-4 w-16 bg-white/10 rounded flex-1"></div>
              <div className="h-6 w-24 bg-white/10 rounded-full flex-1"></div>
              <div className="h-10 w-28 bg-white/10 rounded-lg flex-1"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// --- Main Component ---

const OverviewTab = () => {
  const { user } = useStore();
  const { data: ordersData, loading: loadingOrders } = useCustomerOrders({
    customerId: user?.id,
  });

  const statsCards = [
    { title: "Total Orders", value: ordersData?.total ?? 0, icon: Package },
    { title: "Active Orders", value: ordersData?.active ?? 0, icon: Activity },
    {
      title: "Completed",
      value: ordersData?.completed ?? 0,
      icon: CheckCircle,
    },
    {
      title: "Total Spent",
      value: `$${ordersData?.totalSpent?.toFixed(2) ?? "0.00"}`,
      icon: DollarSign,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card, index) => (
          <StatsCard key={index} {...card} loading={loadingOrders} />
        ))}
      </div>

      {/* Recent Orders Table */}
      <div className="rounded-lg p-px bg-gradient-to-b from-white/10 to-transparent">
        <div className="rounded-lg bg-[#2a0a1e] h-full shadow-2xl">
          {loadingOrders ? (
            <RecentOrdersSkeleton />
          ) : !ordersData?.orders?.length ? (
            <div className="text-center py-20 px-6">
              <Inbox className="w-16 h-16 mx-auto text-gray-500" />
              <h3 className="mt-4 text-2xl font-semibold text-white">
                No Orders Yet
              </h3>
              <p className="mt-2 text-gray-400">
                When you place an order, it will appear here.
              </p>
              <button className="mt-6 font-semibold text-white bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 hover:opacity-90 transition-opacity duration-200 py-2 px-5 rounded-lg text-base">
                Place New Order
              </button>
            </div>
          ) : (
            <div>
              <div className="p-6 border-b border-white/10">
                <h3 className="text-xl font-semibold text-white flex items-center">
                  <Clock className="w-5 h-5 mr-3 text-cyan-300" /> Recent Orders
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px] text-sm text-left">
                  <thead className="bg-white/5">
                    <tr>
                      <th
                        scope="col"
                        className="py-3 px-6 font-semibold text-gray-300 uppercase tracking-wider"
                      >
                        Game & Service
                      </th>
                      <th
                        scope="col"
                        className="py-3 px-6 font-semibold text-gray-300 uppercase tracking-wider"
                      >
                        Package
                      </th>
                      <th
                        scope="col"
                        className="py-3 px-6 font-semibold text-gray-300 uppercase tracking-wider"
                      >
                        Providers
                      </th>
                      <th
                        scope="col"
                        className="py-3 px-6 font-semibold text-gray-300 uppercase tracking-wider"
                      >
                        Price
                      </th>
                      <th
                        scope="col"
                        className="py-3 px-6 font-semibold text-gray-300 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="py-3 px-6 font-semibold text-gray-300 uppercase tracking-wider text-center"
                      >
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {ordersData.orders.map((order: CustomerOrderListDto) => (
                      <tr
                        key={order.id}
                        className="hover:bg-white/5 transition-colors duration-200"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-3">
                            <SafeImage
                              placeholder="/images/placeholder.png"
                              src={
                                order?.subpackage?.service?.game?.image ||
                                "/logo/logo.png"
                              }
                              className="w-10 h-10 rounded-md object-cover"
                              alt={order?.subpackage?.service?.game?.name}
                            />
                            <div>
                              <div className="font-semibold text-white">
                                {order?.subpackage?.service?.game?.name}
                              </div>
                              <div className="text-gray-400">
                                {order?.subpackage?.service?.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td
                          className="py-4 px-6 font-medium text-gray-300 max-w-[200px] truncate"
                          title={order?.subpackage?.name}
                        >
                          {order?.subpackage?.name}
                        </td>
                        <td className="py-4 px-6 text-gray-300">
                          {getProviderDisplay(order)}
                        </td>
                        <td className="py-4 px-6 font-semibold text-white">
                          $ {order?.price.toFixed(2)}
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`py-1.5 px-3 text-xs font-bold rounded-full inline-flex items-center gap-2 ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {getStatusIcon(order.status)}
                            <span className="capitalize">
                              {order.status.replace("_", " ").toLowerCase()}
                            </span>
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <Link
                            className="font-semibold text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg py-2 px-4 rounded-lg inline-flex items-center justify-center whitespace-nowrap text-xs"
                            href={
                              order.status === "PENDING"
                                ? `/dashboard/customer/orders/${order.id}/pending`
                                : `/dashboard/customer/orders/${order.id}`
                            }
                          >
                            View Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default OverviewTab;
