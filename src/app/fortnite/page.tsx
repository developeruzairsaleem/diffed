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
  image: "/images/fortnite.svg",
  packages: [
    {
      name: "Bundles",
      subpackage: [
        {
          name: "Arena Rush - 3h",
          price: "$40",
        },
        {
          name: "Elite Rush - 5h",
          price: "$75",
        },
        {
          name: "FNCS Prep - 8h",
          price: "$100",
        },
      ],
      text: "Play 3/5/8 hours with our top rated players.",
    },
    {
      name: "Teammates",
      subpackage: [
        {
          name: "DuoSquad",
          price: "$10",
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
