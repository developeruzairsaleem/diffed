import GamePage from "@/components/GamePage";
export type GamePageData = {
  image: string;
  packages: {
    name: string;
    subpackage: {
      name: string;
      price: string;
    }[];
    text: string;
  }[];
};

const data: GamePageData = {
  image: "/images/cs2.png",
  packages: [
    {
      name: "Bundles",
      subpackage: [
        {
          name: "Level 1-2",
          price: "$6",
        },
        {
          name: "Level 9",
          price: "$9",
        },
        {
          name: "2600-2800 Elo",
          price: "$21",
        },
      ],
      text: "Choose up to 10 games with our top rated players.",
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
export default function () {
  return <GamePage data={data} />;
}
