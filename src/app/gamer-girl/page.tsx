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
  image: "/images/gamer-girl.png",
  packages: [
    {
      name: "Play sessions per game",
      subpackage: [
        {
          name: "Lol",
          price: "$6",
        },
        {
          name: "Valorant",
          price: "$5",
        },
        {
          name: "Marvel Rivals",
          price: "$4",
        },
      ],
      text: "Chill and meet our top rated gamer girls.",
    },
  ],
};
export default function () {
  return <GamePage data={data} />;
}
