import { lato, orbitron } from "@/fonts/fonts";

export default function Packages() {
  const packages = [
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
  ];

  return (
    <div className="pb-20">
      <div className="flex mx-auto justify-center px-4">
        <h2 className="gradient-text">PACKAGES</h2>
      </div>
      <div className="flex justify-center flex-col lg:flex-row gap-12 mt-16 max-w-2xl w-full px-4 mx-auto">
        {packages.map((indPack, idx) => {
          return (
            <div
              className="bg-[#13161B] w-full mx-auto lg:w-1/2  flex flex-col p-6 rounded-2xl"
              style={{
                backgroundColor: "rgba(19,22,27,0.3)",
                minHeight: "400px",
              }}
              key={idx}
            >
              <h3
                className={`${lato.className} pb-8 bg-clip-text text-transparent`}
                style={{
                  fontSize: "1.5rem",
                  backgroundImage:
                    "linear-gradient(90deg, #FF23C1 0%, #C657FF 35%, #7B5FFF 60%, #AEEBFF 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {indPack.name}
              </h3>
              <div>
                {indPack.subpackage.map((item, idx) => (
                  <div className="flex my-3 items-center gap-2 ">
                    <img src="images/tick.png" alt="check" />
                    <div style={{ fontSize: "1rem", fontWeight: 300 }}>
                      {item.name} - {item.price}
                    </div>
                  </div>
                ))}
              </div>
              <p className="py-5" style={{ fontSize: "1rem", fontWeight: 300 }}>
                {indPack.text}
              </p>
              <button
                className={` ${lato.className} mt-auto relative cursor-pointer group
          
            bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400

            px-8 py-3
            transition-all
            hover:scale-105
            rounded-4xl
          `}
              >
                {" "}
                Get Started
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
