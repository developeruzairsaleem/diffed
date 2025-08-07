import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

// Helper function to get status colors
const getStatusVariant = (status: any) => {
  switch (status) {
    case "PENDING":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    case "APPROVED":
      return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    case "COMPLETED":
      return "bg-green-500/20 text-green-400 border-green-500/30";
    case "VERIFIED":
      return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    case "REPLACED":
      return "bg-red-500/20 text-red-400 border-red-500/30";
    default:
      return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  }
};

export function OrderAssignmentCard({ assignment }: { assignment: any }) {
  const {
    order,
    id: assignmentId,
    status,
    claimedAt,
    reviewRating,
    reviewText,
  } = assignment;
  const { subpackage, customer, orderNumber, id: orderId } = order;
  const gameName = subpackage.service.game.name;
  const router = useRouter();

  return (
    <Card className="bg-black/30 backdrop-blur-sm border-white/10 shadow-2xl flex flex-col h-full">
      <CardHeader>
        <CardTitle className="text-white text-lg">{subpackage.name}</CardTitle>
        <CardDescription className="text-white/70">
          {gameName} Coaching
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-white/80 font-semibold">
              ${subpackage.price}
            </span>
            <div className="flex flex-col gap-3">
              <Badge
                className={`text-xs font-bold ${getStatusVariant(status)}`}
              >
                {status}
              </Badge>
              {(status === "APPROVED" || status === "COMPLETED") && (
                <button
                  className="bg-gradient-to-r p-2 rounded-lg cursor-pointer hover:scale-105 transition-all   from-pink-500 via-purple-500 to-cyan-400"
                  onClick={() =>
                    router.push(
                      `/dashboard/provider/order-assignments/${assignmentId}`
                    )
                  }
                >
                  View Order
                </button>
              )}
            </div>
          </div>
          <p className="text-sm text-white/60">
            <span className="font-bold text-white/80">Order ID:</span>{" "}
            {orderNumber}
          </p>
          <p className="text-sm text-white/60">
            <span className="font-bold text-white/80">Customer:</span>{" "}
            {customer.username}
          </p>
        </div>
        <div className="mt-6 border-t border-white/10 pt-4 text-xs text-white/50">
          <p>Claimed on: {format(new Date(claimedAt), "PPP")}</p>
        </div>
      </CardContent>
    </Card>
  );
}
