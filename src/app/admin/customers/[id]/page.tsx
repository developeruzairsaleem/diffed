import type { Metadata } from "next";
import CustomerDetail from "@/components/customers/CustomerDetail";

export const metadata: Metadata = {
  title: "Customer Details - Admin Dashboard",
  description: "View and manage customer details",
};

export default function CustomerDetailPage({ params }: any) {
  return (
    <div style={{ padding: "24px" }}>
      <CustomerDetail customerId={params.id} />
    </div>
  );
}
