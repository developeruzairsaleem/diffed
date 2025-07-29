import type { Metadata } from "next";
import ProvidersTable from "@/components/providers/ProvidersTable";

export const metadata: Metadata = {
  title: "Provider Management - Admin Dashboard",
  description: "Manage and monitor all providers in the system",
};

export default function ProvidersPage() {
  return (
    <div style={{ padding: "24px" }}>
      <div style={{ marginBottom: 24 }}>
        <h1>Provider Management</h1>
        <p>Monitor and manage all service providers in the system</p>
      </div>
      <ProvidersTable />
    </div>
  );
}
