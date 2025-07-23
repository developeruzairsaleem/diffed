import type { Metadata } from "next";
import OrdersTable from "@/components/orders/OrdersTable";

export const metadata: Metadata = {
  title: "Orders Management - Admin Dashboard",
  description: "Manage and monitor all orders in the system",
};

export default function OrdersPage() {
  return (
    <div style={{ padding: "24px" }}>
      <div style={{ marginBottom: 24 }}>
        <h1>Orders Management</h1>
        <p>Monitor and manage all orders in the system</p>
      </div>
      <OrdersTable />
    </div>
  );
}
