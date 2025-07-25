import type { Metadata } from "next";
import ServicesTable from "@/components/services/ServicesTable";

export const metadata: Metadata = {
  title: "Services Management - Admin Dashboard",
  description: "Manage and monitor all services and their subpackages",
};

export default function ServicesPage() {
  return (
    <div style={{ padding: "24px" }}>
      <div style={{ marginBottom: 24 }}>
        <h1>Services Management</h1>
        <p>
          Monitor and manage all services and their subpackages across all games
        </p>
      </div>

      <ServicesTable />
    </div>
  );
}
