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
  image: "/images/league-of-legends.png",
  packages: [
    {
      name: "Bundles",
      subpackage: [
        {
          name: "Bronze Breaker - 3h",
          price: "$30",
        },
        {
          name: "Elo Elevation - 5h",
          price: "$45",
        },
        {
          name: "LP Ascension - 8h",
          price: "$70",
        },
      ],
      text: "Play 3/5/8 hours with our top rated players.",
    },
    {
      name: "Teammates",
      subpackage: [
        {
          name: "Duo",
          price: "$7",
        },

        {
          name: "Flex",
          price: "$14",
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
export default function () {
  return <GamePage data={data} />;
}
