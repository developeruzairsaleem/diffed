
type Customer = {
  firstName: string;
  lastName: string;
  customerType: string;
  gamingLevel: string;
  primaryGames: string[];
  currentRanks?: Record<string, string>;
  gamingGoals?: string[];
  budgetRange: string;
  preferredServiceTypes?: string[];
  activityPattern: string;
  learningStyle: string;
  communicationPreference: string;
  peakHours?: string[];
  riskTolerance: string;
  totalOrders: number;
  totalSpent: number;
  lifetimeValue: number;
  satisfactionScore: number;
  churnRiskScore: number;
  lastOrderDate?: string;
};


// export default function GamesTab({ customer }: { customer: Customer }) {
//   const games = customer.primaryGames || [];
//   const ranks = customer.currentRanks || {};
//   const goals = customer.gamingGoals || [];

//   return (
//     <div className="space-y-4 p-2">
//       {/* 🕹️ Primary Games */}
//       {games.length > 0 && (
//         <div className="border-b border-white/10 mb-10 pb-1 w-full">
//           <div className="text-xl text-purple-400 font-[orbitron] tracking-wide mb-2">
//             🕹️ Primary Games
//           </div>
//           <div className="text-lg text-white/90 font-normal font-[lato] break-words space-y-1">
//             {games.map((game) => (
//               <div key={game}>• {game}</div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* 🏆 Current Ranks */}
//       {Object.keys(ranks).length > 0 && (
//         <div className="border-b border-white/10 mb-10 pb-1 w-full">
//           <div className="text-xl text-purple-400 font-[orbitron] tracking-wide mb-2">
//             🏆 Current Ranks
//           </div>
//           <div className="text-lg text-white/90 font-normal font-[lato] break-words space-y-1">
//             {Object.entries(ranks).map(([game, rank]) => (
//               <div key={game}>• {game}: {rank}</div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* 🎯 Gaming Goals */}
//       {goals.length > 0 && (
//         <div className="border-b border-white/10 mb-10 pb-1 w-full">
//           <div className="text-xl text-purple-400 font-[orbitron] tracking-wide mb-2">
//             🎯 Gaming Goals
//           </div>
//           <div className="text-lg text-white/90 font-normal font-[lato] break-words space-y-1">
//             {goals.map((goal) => (
//               <div key={goal}>• {goal}</div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }










export default function GamesTab({ customer }: { customer: Customer }) {
  const games = customer.primaryGames || [];
  const ranks = customer.currentRanks || {};
  const goals = customer.gamingGoals || [];

  const cardStyle =
    "rounded-xl bg-gradient-to-br from-[#270022]/40 to-[#5A0057]/40 border border-white/10 p-5 shadow-lg backdrop-blur-md";

  const titleStyle =
    "text-xl text-white font-[orbitron] mb-3 tracking-wide";

  const contentStyle =
    "text-[1rem] text-white/90 font-[lato] space-y-1";

  return (
    <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 p-2">
      {/* 🕹️ Primary Games */}
      {games.length > 0 && (
        <div className={cardStyle}>
          <h3 className={titleStyle}>🕹️ Primary Games</h3>
          <div className={contentStyle}>
            {games.map((game) => (
              <div key={game}>• {game}</div>
            ))}
          </div>
        </div>
      )}

      {/* 🏆 Current Ranks */}
      {Object.keys(ranks).length > 0 && (
        <div className={cardStyle}>
          <h3 className={titleStyle}>🏆 Current Ranks</h3>
          <div className={contentStyle}>
            {Object.entries(ranks).map(([game, rank]) => (
              <div key={game}>• {game}: {rank}</div>
            ))}
          </div>
        </div>
      )}

      {/* 🎯 Gaming Goals */}
      {goals.length > 0 && (
        <div className={cardStyle}>
          <h3 className={titleStyle}>🎯 Gaming Goals</h3>
          <div className={contentStyle}>
            {goals.map((goal) => (
              <div key={goal}>• {goal}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
