import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// dummy json data - To be replaced by api
import ordersData from "../../../../../orders.json";
const orders = ordersData;
// end of dummy json data

export default function Orders() {
  return (
    <div className="overflow-x-auto w-full">
      <Table
        className="min-w-full"
        style={{
          scrollbarWidth: "none", // Firefox
          msOverflowStyle: "none", // IE/Edge
        }}
      >
        <TableHeader>
          <TableRow className="border-b-1 border-white/30 mb-6">
            <TableHead className="py-4 font-bold text-md">Order ID</TableHead>
            <TableHead className="py-4 font-bold text-md">Game</TableHead>
            <TableHead className="py-4 font-bold text-md">
              Package Type
            </TableHead>
            <TableHead className="py-4 font-bold text-md">Package ID</TableHead>
            <TableHead className="py-4 font-bold text-md">
              Package Name
            </TableHead>
            <TableHead className="py-4 font-bold text-md">Duration</TableHead>
            <TableHead className="py-4 font-bold text-md">Price</TableHead>
            <TableHead className="py-4 font-bold text-md">Status</TableHead>
            <TableHead className="py-4 font-bold text-md">
              Scheduled At
            </TableHead>
            <TableHead className="py-4 font-bold text-md">
              Completed At
            </TableHead>
            <TableHead className="py-4 font-bold text-md">
              Feedback Rating
            </TableHead>
            <TableHead className="py-4 font-bold text-md">
              Feedback Review
            </TableHead>
            <TableHead className="py-4 font-bold text-md">
              Player Name
            </TableHead>
            <TableHead className="py-4 font-bold text-md">
              Customer Name
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody
          style={{
            scrollbarWidth: "none", // Firefox
            msOverflowStyle: "none", // IE/Edge
          }}
        >
          {orders.map((order) => (
            <TableRow
              key={order.orderId}
              className="border-b-1 border-white/30"
            >
              <TableCell className="font-medium py-4 border-r-2 border-white/20 h-4/5">
                {order.orderId}
              </TableCell>
              <TableCell className="py-4 border-r-1 border-white/5 ">
                {order.game}
              </TableCell>
              <TableCell className="py-4 border-r-1 border-white/5">
                {order.packageType}
              </TableCell>
              <TableCell className="py-4 border-r-1 border-white/5">
                {order.packageId}
              </TableCell>
              <TableCell className="py-4 border-r-1 border-white/5">
                {order.packageName}
              </TableCell>
              <TableCell className="py-4 border-r-1 border-white/5">
                {order.duration}
              </TableCell>
              <TableCell className="py-4 border-r-1 border-white/5">
                {order.price}
              </TableCell>
              <TableCell className="py-4 border-r-1 border-white/5">
                {order.status}
              </TableCell>
              <TableCell className="py-4 border-r-1 border-white/5">
                {order.scheduledAt}
              </TableCell>
              <TableCell className="py-4 border-r-1 border-white/5">
                {order.completedAt}
              </TableCell>
              <TableCell className="py-4 border-r-1 border-white/5">
                {order.feedback?.rating}
              </TableCell>
              <TableCell className="py-4 border-r-1 border-white/5">
                {order.feedback?.review}
              </TableCell>
              <TableCell className="py-4 border-r-1 border-white/5">
                {order.player_name}
              </TableCell>
              <TableCell className="py-4 border-r-1 border-white/5">
                {order.customer_name}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
