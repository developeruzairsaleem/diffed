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
  image: "/images/herobackground.png",
  packages: [
    {
      name: "Bundles",
      subpackage: [
        {
          name: "Spike Run - 3h",
          price: "$35",
        },
        {
          name: "Agent Ascension - 5h",
          price: "$55",
        },
        {
          name: "Ranked Overload - 8h",
          price: "$75",
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

export default function () {
  return <GamePage data={data} />;
}
