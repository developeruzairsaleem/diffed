import {
  Search,
  Filter,
  Star,
  Eye,
  MessageCircle,
  MoreVertical,
} from "lucide-react";
import orders from "../../../../../orders.json";
import gamesData from "../../../../../gamedata.json";
import boosters from "../../../../../coach_booster.json";
import getStatusColor from "../_lib/get-status-color";
import {
  CheckCircle,
  Activity,
  Clock,
  XCircle,
  AlertCircle,
} from "lucide-react";
import formatDate from "../_lib/format-date";
const OrdersTab = ({
  setSelectedOrder,
}: {
  setSelectedOrder: (s: any) => void;
}) => {
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
    <div className="space-y-6 text-black">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Orders</h2>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-900">
                  Order ID
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">
                  Game & Service
                </th>

                <th className="text-left py-3 px-4 font-medium text-gray-900">
                  Booster
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">
                  Price
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">
                  Date
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.orderId} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-mono text-sm text-gray-600">
                    {order.orderId}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-xl">
                        {gamesData.find((g) => g.name === order.game)?.icon}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {order.game}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.packageName}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <div className="text-xl">{order.player_name}</div>
                      <div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="text-xs text-gray-500">
                            {
                              boosters.find((b) => b.name === order.player_name)
                                ?.rating
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full flex items-center space-x-1 w-fit ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusIcon(order.status)}
                      <span className="capitalize">
                        {order.status.replace("_", " ")}
                      </span>
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-gray-900">
                    €{order.price}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500">
                    {formatDate(order.scheduledAt)}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-1 text-gray-400 hover:text-purple-600"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-purple-600">
                        <MessageCircle className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-purple-600">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrdersTab;
