import {
  Package,
  Activity,
  CheckCircle,
  DollarSign,
  Clock,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import gamesData from "../../../../../gamedata.json";
import orders from "../../../../../orders.json";
import { useCustomerOrders } from "@/hooks/useOrders";
import { useStore } from "@/store/useStore";
import { CustomerOrderListDto } from "@/types/order.dto";
import { Spinner } from "flowbite-react";
import Link from "next/link";
const OverviewTab = () => {
  const { user } = useStore();
  //  renaming hooks name for recent orders
  const {
    data: ordersData,
    error: ordersError,
    refetch: refetchOrders,
    loading: loadingOrders,
  } = useCustomerOrders({
    customerId: user?.id,
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
    <div className="space-y-6 flex mb-20 flex-col">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* outer cards */}
        <div
          className={`rounded-lg `}
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
            {/* middle card */}
            <div className="rounded-lg h-full bg-[#52103A]">
              {/* starts inner card */}

              <div
                style={{ backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                className="h-full rounded-lg p-6 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    {loadingOrders ? (
                      <Skeleton className="h-4 w-24 bg-pink-700" />
                    ) : (
                      <p className="text-sm text-gray-200">Total Orders</p>
                    )}
                    <p className="text-2xl font-bold text-gray-100">
                      {loadingOrders ? (
                        <Skeleton className="h-4 w-8 mt-4 rounded-full bg-pink-700" />
                      ) : (
                        ordersData?.total
                      )}
                    </p>
                  </div>

                  {loadingOrders ? (
                    <div className="p-3 bg-pink-700 rounded-full">
                      <Skeleton className="h-6 w-6 rounded-full bg-pink-700" />
                    </div>
                  ) : (
                    <div
                      className="p-3 bg-blue-100 rounded-full"
                      style={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }}
                    >
                      <Package className="w-6 h-6 text-white" />
                    </div>
                  )}
                </div>
              </div>
              {/* end inner card */}
            </div>
            {/* middle card end */}
          </div>
        </div>

        {/* outer cards */}
        <div
          className={`  rounded-lg `}
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
            {/* middle card */}
            <div className="rounded-lg h-full bg-[#52103A]">
              {/* starts inner card */}

              <div
                style={{ backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                className="h-full rounded-lg p-6 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    {loadingOrders ? (
                      <Skeleton className="h-4 w-24 bg-pink-700" />
                    ) : (
                      <p className="text-sm text-gray-100">Active Orders</p>
                    )}

                    <p className="text-2xl font-bold text-white">
                      {loadingOrders ? (
                        <Skeleton className="h-4 w-8 mt-4 rounded-full bg-pink-700" />
                      ) : (
                        ordersData?.active
                      )}
                    </p>
                  </div>

                  {loadingOrders ? (
                    <div className="p-3 bg-pink-700 rounded-full">
                      <Skeleton className="h-6 w-6 rounded-full bg-pink-700" />
                    </div>
                  ) : (
                    <div
                      className="p-3 bg-blue-100 rounded-full"
                      style={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }}
                    >
                      <Activity className="w-6 h-6 text-white" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* outer cards */}
        <div
          className={` rounded-lg `}
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
            {/* middle card */}
            <div className="rounded-lg h-full bg-[#52103A]">
              {/* starts inner card */}

              <div
                style={{ backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                className=" h-full rounded-lg p-6 shadow-sm "
              >
                <div className="flex items-center justify-between">
                  <div>
                    {loadingOrders ? (
                      <Skeleton className="h-4 w-24 bg-pink-700" />
                    ) : (
                      <p className="text-sm text-gray-100">Completed</p>
                    )}
                    <p className="text-2xl font-bold text-white">
                      {loadingOrders ? (
                        <Skeleton className="h-4 w-8 mt-4 rounded-full bg-pink-700" />
                      ) : (
                        ordersData?.completed
                      )}
                    </p>
                  </div>

                  {loadingOrders ? (
                    <div className="p-3 bg-pink-700 rounded-full">
                      <Skeleton className="h-6 w-6 rounded-full bg-pink-700" />
                    </div>
                  ) : (
                    <div
                      className="p-3 bg-blue-100 rounded-full"
                      style={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }}
                    >
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* third card */}

        {/* outer cards */}
        <div
          className={` rounded-lg `}
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
            {/* middle card */}
            <div className="rounded-lg bg-[#52103A]">
              {/* starts inner card */}

              <div
                style={{ backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                className=" rounded-lg p-6 shadow-sm "
              >
                <div className="flex items-center justify-between">
                  <div>
                    {loadingOrders ? (
                      <Skeleton className="h-4 w-24 bg-pink-700" />
                    ) : (
                      <p className="text-sm text-gray-100">Total Spent</p>
                    )}
                    <p className="text-2xl font-bold text-white">
                      {loadingOrders ? (
                        <Skeleton className="h-4 w-8 mt-4 rounded-full bg-pink-700" />
                      ) : (
                        ordersData?.totalSpent
                      )}
                    </p>
                  </div>
                  <div className=" rounded-full">
                    {loadingOrders ? (
                      <div className="p-3 bg-pink-700 rounded-full">
                        <Skeleton className="h-6 w-6 rounded-full bg-pink-700" />
                      </div>
                    ) : (
                      <div
                        className="p-3 bg-blue-100 rounded-full"
                        style={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }}
                      >
                        <DollarSign className="w-6 h-6 text-white" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        {/* inner card */}
      </div>
      {/* END OF THE FIRST ROW */}
      {/* NOW STARTS THE TABLE */}
      <div
        className={` rounded-lg flex-1  mt-auto `}
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
          <div className="rounded-lg  h-full bg-[#52103A]">
            <div
              style={{ backgroundColor: "rgba(255, 255, 255, 0.15)" }}
              className="  rounded-lg h-full shadow-sm w-full"
            >
              <div className="p-6 border-gray-200">
                {loadingOrders ? (
                  <Skeleton className="h-5 w-28 bg-pink-700" />
                ) : (
                  <h3 className="text-xl font-semibold text-white flex items-center">
                    <Clock className="w-5 h-5 mr-2" /> Recent Orders
                  </h3>
                )}
              </div>
              <div className="p-6">
                <div className="overflow-x-auto hide-scrollbar scrollbar-hide w-full">
                  {loadingOrders ? (
                    <>
                      <Skeleton className="bg-pink-700 h-4 my-4 w-60 rounded-full" />

                      <Skeleton className="bg-pink-700 h-4 my-4 w-72 rounded-full" />
                      <Skeleton className="bg-pink-700 h-4 my-4 w-96 rounded-full" />
                      <Skeleton className="bg-pink-700 h-4 my-4 w-96 rounded-full" />
                    </>
                  ) : !ordersData?.orders?.length ? (
                    <h3 className="text-white text-center my-5 text-2xl">
                      No Orders Found
                    </h3>
                  ) : (
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
                                        order?.subpackage?.service?.game?.image
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
                                  className="bg-indigo-500 p-3 whitespace-nowrape rounded-xl"
                                  href={`/dashboard/customer/orders/${order.id}`}
                                >
                                  View Detail
                                </Link>
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
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
export default OverviewTab;
