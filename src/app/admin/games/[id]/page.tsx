import type { Metadata } from "next";
import GameDetail from "@/components/games/GameDetail";

export const metadata: Metadata = {
  title: "Game Details - Admin Dashboard",
  description: "View and manage game details, services, and subpackages",
};

interface GameDetailPageProps {
  params: {
    id: string;
  };
}

export default function GameDetailPage({ params }: GameDetailPageProps) {
  return (
    <div style={{ padding: "24px" }}>
      <GameDetail gameId={params.id} />
    </div>
  );
}
