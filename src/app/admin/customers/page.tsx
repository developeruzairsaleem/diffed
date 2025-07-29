import type { Metadata } from "next";
import CustomersTable from "@/components/customers/CustomersTable";

export const metadata: Metadata = {
  title: "Customer Management - Admin Dashboard",
  description: "Manage and monitor all customers in the system",
};

export default function CustomersPage() {
  return (
    <div style={{ padding: "24px" }}>
      <div style={{ marginBottom: 24 }}>
        <h1>Customer Management</h1>
        <p>Monitor and manage all customers in the system</p>
      </div>
      <CustomersTable />
    </div>
  );
}
