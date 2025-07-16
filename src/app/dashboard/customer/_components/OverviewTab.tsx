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
import getStatusColor from "../_lib/get-status-color";

const OverviewTab = () => {
  const getStatusIcon = (status: string) => {
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

  return (
    <div className="space-y-6">
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
            <div className="rounded-lg bg-[#52103A]">
              {/* starts inner card */}

              <div
                style={{ backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                className=" rounded-lg p-6 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-200">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-100">
                      {orders.length}
                    </p>
                  </div>
                  <div
                    style={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }}
                    className="p-3 bg-purple-100  rounded-full"
                  >
                    <Package className="w-6 h-6 text-white" />
                  </div>
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
            <div className="rounded-lg bg-[#52103A]">
              {/* starts inner card */}

              <div
                style={{ backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                className=" rounded-lg p-6 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-100">Active Orders</p>
                    <p className="text-2xl font-bold text-white">
                      {orders.filter((o) => o.status === "in_progress").length}
                    </p>
                  </div>
                  <div
                    className="p-3 bg-blue-100 rounded-full"
                    style={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }}
                  >
                    <Activity className="w-6 h-6 text-white" />
                  </div>
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
            <div className="rounded-lg bg-[#52103A]">
              {/* starts inner card */}

              <div
                style={{ backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                className=" rounded-lg p-6 shadow-sm "
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-100">Completed</p>
                    <p className="text-2xl font-bold text-white">
                      {orders.filter((o) => o.status === "completed").length}
                    </p>
                  </div>
                  <div
                    className="p-3 bg-green-100 rounded-full"
                    style={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }}
                  >
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
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
                    <p className="text-sm text-gray-100">Total Spent</p>
                    <p className="text-2xl font-bold text-white">
                      €{orders.reduce((sum, order) => sum + order.price, 0)}
                    </p>
                  </div>
                  <div
                    className="p-3 rounded-full"
                    style={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }}
                  >
                    <DollarSign className="w-6 h-6 text-white" />
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
        className={` rounded-lg `}
        style={{
          padding: "1px",
          background:
            "linear-gradient(90deg, #EE2C81 0%, #FE0FD0 33%, #58B9E3 66%, #F79FC5 100%)",
        }}
      >
        {" "}
        <div
          style={{
            padding: "1px",
            background:
              "linear-gradient(90deg, #EE2C81 0%, #FE0FD0 33%, #58B9E3 66%, #F79FC5 100%)",
          }}
          className="h-full rounded-lg"
        >
          {" "}
          {/* middle card */}{" "}
          <div className="rounded-lg bg-[#52103A]">
            {" "}
            <div
              style={{ backgroundColor: "rgba(255, 255, 255, 0.15)" }}
              className=" rounded-lg shadow-sm w-full"
            >
              {" "}
              <div className="p-6 border-gray-200">
                {" "}
                <h3 className="text-xl font-semibold text-white flex items-center">
                  {" "}
                  <Clock className="w-5 h-5 mr-2" /> Recent Orders{" "}
                </h3>{" "}
              </div>{" "}
              <div className="p-6">
                {" "}
                <div className="overflow-x-auto w-full">
                  {" "}
                  <table
                    className="w-full min-w-[600px] text-left"
                    style={{ borderCollapse: "separate", borderSpacing: 0 }}
                  >
                    {" "}
                    <thead>
                      {" "}
                      <tr
                        style={{
                          borderBottom: "3px solid",
                          borderImage:
                            "linear-gradient(90deg, #00C3FF 0%, #FFFF1C 100%) 1",
                        }}
                      >
                        {" "}
                        <th className="py-3 px-4 text-[#E1E1E1] font-semibold text-lg">
                          {" "}
                          Game{" "}
                        </th>{" "}
                        <th className="py-3 px-4 text-[#E1E1E1] font-semibold text-lg">
                          {" "}
                          Package{" "}
                        </th>{" "}
                        <th className="py-3 px-4 text-[#E1E1E1] font-semibold text-lg">
                          {" "}
                          Price{" "}
                        </th>{" "}
                        <th className="py-3 px-4 text-[#E1E1E1] font-semibold text-lg">
                          {" "}
                          Status{" "}
                        </th>{" "}
                      </tr>{" "}
                    </thead>{" "}
                    <tbody>
                      {" "}
                      {orders.slice(0, 3).map((order, idx) => (
                        <tr key={order.orderId}>
                          {" "}
                          <td
                            className={`py-3 px-4 text-[#E1E1E1] ${
                              idx !== orders.slice(0, 3).length - 1
                                ? "border-b border-white"
                                : ""
                            }`}
                          >
                            {" "}
                            <div className="flex items-center space-x-3">
                              {" "}
                              <div className="text-2xl">
                                {" "}
                                {
                                  (
                                    gamesData.find(
                                      (game) => game.name === order.game
                                    ) || {}
                                  ).icon
                                }{" "}
                              </div>{" "}
                              <span>{order.game}</span>{" "}
                            </div>{" "}
                          </td>{" "}
                          <td
                            className={`py-3 px-4 text-[#E1E1E1] ${
                              idx !== orders.slice(0, 3).length - 1
                                ? "border-b border-white"
                                : ""
                            }`}
                          >
                            {" "}
                            {order.packageName}{" "}
                          </td>{" "}
                          <td
                            className={`py-3 px-4 text-[#E1E1E1] ${
                              idx !== orders.slice(0, 3).length - 1
                                ? "border-b border-white"
                                : ""
                            }`}
                          >
                            {" "}
                            €{order.price}{" "}
                          </td>{" "}
                          <td
                            className={`py-3 px-4 text-[#E1E1E1] ${
                              idx !== orders.slice(0, 3).length - 1
                                ? "border-b border-white"
                                : ""
                            }`}
                          >
                            {" "}
                            <span
                              className={`px-2 py-1 text-xs rounded-full flex items-center space-x-1 ${getStatusColor(
                                order.status
                              )}`}
                            >
                              {" "}
                              {getStatusIcon(order.status)}{" "}
                              <span className="capitalize">
                                {" "}
                                {order.status.replace("_", " ")}{" "}
                              </span>{" "}
                            </span>{" "}
                          </td>{" "}
                        </tr>
                      ))}{" "}
                    </tbody>{" "}
                  </table>{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
};
export default OverviewTab;
