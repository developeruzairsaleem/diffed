import type { Metadata } from "next";
import GamesTable from "@/components/games/GamesTable";

export const metadata: Metadata = {
  title: "Games Management - Admin Dashboard",
  description:
    "Manage and monitor all games, services, and subpackages in the system",
};

export default function GamesPage() {
  return (
    <div style={{ padding: "24px" }}>
      <div style={{ marginBottom: 24 }}>
        <h1>Games Management</h1>
        <p>
          Monitor and manage all games, services, and subpackages in the system
        </p>
      </div>
      <GamesTable />
    </div>
  );
}
