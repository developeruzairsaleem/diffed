import {
  Package,
  Activity,
  CheckCircle,
  DollarSign,
  Clock,
  XCircle,
  AlertCircle,
} from "lucide-react";
import gamesData from "../../../../../gamedata.json";
import orders from "../../../../../orders.json";
import { useCustomerOrders } from "@/hooks/useOrders";
import { useStore } from "@/store/useStore";
import { CustomerOrderListDto } from "@/types/order.dto";
import { Spinner } from "flowbite-react";
import { useState } from "react";
import Link from "next/link";
const OrdersTab = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const { user } = useStore();
  //  renaming hooks name for recent orders
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
        return "text-green-600 border-green-600 border-2 bg-transparent";
      case "IN_PROGRESS":
        return "text-blue-600 border-blue-600 border-2 bg-transparent";
      case "PENDING":
        return "text-yellow-600 border-2 border-yellow-600 bg-transparent";
      case "CANCELLED":
        return "text-red-600 border-red-600 border-2 bg-transparent";
      default:
        return "text-gray-600 border-gray-600 border-2 bg-transparent";
    }
  };

  return (
    <div className="space-y-6 mb-20 flex flex-col">
      <div
        className={` rounded-lg flex-1 mt-auto `}
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
              className="  rounded-lg h-full shadow-sm w-full"
            >
              <div className="p-6  border-gray-200">
                <h3 className="text-xl font-semibold text-white flex items-center">
                  <Clock className="w-5 h-5 mr-2" /> Orders
                </h3>
              </div>
              <div className="p-6 ">
                <div className="overflow-x-auto w-full">
                  {loadingOrders ? (
                    <Spinner
                      color="pink"
                      className="my-5 mx-auto block"
                      aria-label="Pink spinner example"
                    />
                  ) : !ordersData?.orders?.length ? (
                    <h3 className="text-white text-center my-5 text-2xl">
                      No Orders Found
                    </h3>
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
                              <tr className="" key={order?.id}>
                                <td className={`py-3 px-4 text-[#E1E1E1] `}>
                                  <div className="flex items-center space-x-3">
                                    {order?.subpackage?.service?.game?.image ? (
                                      <img
                                        src={
                                          order?.subpackage?.service?.game
                                            ?.image
                                        }
                                        className="w-8 h-8"
                                      />
                                    ) : (
                                      <div className="w-8 h-8"></div>
                                    )}
                                    <span>
                                      {order?.subpackage?.service?.game?.name}
                                    </span>
                                  </div>
                                </td>

                                <td className={`py-3 px-4 text-[#E1E1E1] `}>
                                  {order?.subpackage?.service?.name}
                                </td>

                                <td className={`py-3 px-4 text-[#E1E1E1] `}>
                                  {order?.subpackage?.name}
                                </td>

                                <td className={`py-3 px-4 text-[#E1E1E1] `}>
                                  {(() => {
                                    console.log(order);
                                    const filtered =
                                      order?.providers?.filter((provider) =>
                                        [
                                          "APPROVED",
                                          "COMPLETED",
                                          "VERIFIED",
                                        ].includes(provider?.status)
                                      ) || [];

                                    const first = filtered[0];

                                    if (!first) return "No Providers"; // or return "No providers" or fallback

                                    return (
                                      <span>
                                        {first.username}
                                        {filtered.length > 1 && " and more"}
                                      </span>
                                    );
                                  })()}
                                </td>

                                <td className={`py-3 px-4 text-[#E1E1E1] `}>
                                  $ {order?.price}
                                </td>

                                <td
                                  className={`py-1  flex px-4 text-[#E1E1E1] ${getStatusColor(
                                    order?.status
                                  )} items-center  gap-2 rounded-xl font-bold `}
                                >
                                  {getStatusIcon(order?.status)} {order?.status}
                                </td>
                                <td>
                                  <Link
                                    href={`/dashboard/customer/orders/${order.id}`}
                                  >
                                    View Chat
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
                          className="px-4 py-2 bg-pink-600 text-white rounded disabled:opacity-50"
                        >
                          Previous
                        </button>

                        <span className="text-white">Page {page}</span>

                        <button
                          onClick={() => {
                            if (
                              ordersData?.total &&
                              page * limit < ordersData.total
                            ) {
                              setPage((prev) => prev + 1);
                            }
                          }}
                          disabled={page * limit > ordersData.total}
                          className="px-4 py-2 bg-pink-600 text-white rounded disabled:opacity-50"
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
