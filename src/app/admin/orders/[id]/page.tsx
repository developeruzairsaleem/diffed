import type { Metadata } from "next";
import OrderDetail from "@/components/orders/OrderDetail";

export const metadata: Metadata = {
  title: "Order Details - Admin Dashboard",
  description: "View and manage order details",
};

interface OrderDetailPageProps {
  params: {
    id: string;
  };
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  return (
    <div style={{ padding: "24px" }}>
      <OrderDetail orderId={params.id} />
    </div>
  );
}
