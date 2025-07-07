import { orbitron } from "@/fonts/fonts";

export default function Services() {
  const cardData = [
    {
      title: "Coaching",
      description: `Get 1-on-1 guidance from elite players. 
        Improve skills, strategies, and climb 
        ranks faster.`,
      imagePath: "/images/Maskgroup1.png",
      buttonText: "EXPLORE COACHING",
    },
    {
      title: "Teammate Matchmaking",
      description: `Let top-ranked pros boost your account 
safely and efficiently to your 
desired rank.`,
      imagePath: "/images/Maskgroup1.png",
      buttonText: "EXPLORE TEAMMATE",
    },
  ];
  return (
    <div className="py-40">
      <div className="flex justifly-center">
        <h3
          className={`${orbitron.className} font-bold text-center gradient-text mx-auto`}
          style={{
            fontSize: "4rem",
          }}
        >
          SERVICES
        </h3>
      </div>
      <h3
        className={`${orbitron.className} pb-30 font-bold text-center`}
        style={{ fontSize: "4rem" }}
      >
        SELECTOR
      </h3>

      <div className="cards flex max-w-6xl w-full m-auto gap-20 justify-center">
        {cardData.map((card, idx) => (
          <div
            className="p-4  flex flex-col w-1/3 border hover:scale-105 transition-all rounded-lg border-white"
            style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
          >
            <img src={card.imagePath} alt="card image" />
            <h3 className="pt-8 pb-4" style={{ fontSize: "1.5rem" }}>
              {card.title}
            </h3>
            <p className="pb-4" style={{ fontSize: "1rem" }}>
              {card.description}
            </p>

            <button
              className={` ${orbitron.className} relative mx-4 mt-6 mb-8 group cursor-pointer`}
            >
              <div
                className={`
            bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400
            transform -skew-x-12
            px-4 py-3
            transition-all duration-300 ease-out
            hover:scale-105
          `}
              >
                <div className="flex items-center justify-center h-full p-0.5 transform skew-x-12">
                  <span className="text-white text-lg font-bold tracking-wider">
                    EXPLORE COACHING
                  </span>
                </div>
              </div>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
