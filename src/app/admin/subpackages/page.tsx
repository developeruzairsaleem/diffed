import type { Metadata } from "next";
import SubpackagesTable from "@/components/subpackages/SubpackagesTable";

export const metadata: Metadata = {
  title: "Subpackages Management - Admin Dashboard",
  description:
    "Manage and monitor all subpackages across all services and games",
};

export default function SubpackagesPage() {
  return (
    <div style={{ padding: "24px" }}>
      <div style={{ marginBottom: 24 }}>
        <h1>Subpackages Management</h1>
        <p>
          Monitor and manage all subpackages with pricing, orders, and
          performance analytics
        </p>
      </div>
      <SubpackagesTable />
    </div>
  );
}
