import { prisma } from "@/lib/prisma";
import GamesTable from "./GamesTable";

async function getGames() {
  return await prisma.game.findMany({
    orderBy: { id: "desc" },
  });
}

export default async function GamesPage() {
  const games = await getGames();
  return <GamesTable games={games} />;
}
