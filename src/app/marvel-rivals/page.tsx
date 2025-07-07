import GamePage from "@/components/GamePage";
import { GamePageData } from "../valorant/page";
export default function () {
  const data: GamePageData = {
    image: "/images/marvel-rivals.png",
    packages: [
      {
        name: "Teammates",
        subpackage: [
          {
            name: "Duo",
            price: "$7",
          },
          {
            name: "Trio",
            price: "$14",
          },
          {
            name: "Flex",
            price: "$21",
          },
        ],
        text: "Play with our top rated players.",
      },
      {
        name: "Coaching",
        subpackage: [
          {
            name: "Coaching",
            price: "$13",
          },
          {
            name: "Team Coaching",
            price: "$25",
          },
        ],
        text: "Get team coaching from our top rated players.",
      },
    ],
  };

  return <GamePage data={data} />;
}
