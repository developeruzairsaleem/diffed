import PlayerCard from "@/components/PlayerCard";
import QueueStatus from "@/components/QueueStatus";
import SessionCard from "@/components/Session";
import { lato, orbitron } from "@/fonts/fonts";

export default function Matchmaking() {
  return (
    <div className="main mx-auto px-5 max-w-[1024px]">
      <QueueStatus />
      <PlayerCard />
      <SessionCard />
    </div>
  );
}
