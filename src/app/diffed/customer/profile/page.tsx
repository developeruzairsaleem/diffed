
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


export default function ProfileTab({ customer }: { customer: Customer }) {
  return (
    <div className="space-y-4 p-2">
      {[
        { title: "Name", value: `${customer.firstName} ${customer.lastName}` },
        { title: "Type", value: customer.customerType },
        { title: "Gaming Level", value: customer.gamingLevel },
      ].map(({ title, value }) => (
        <div
          key={title}
          className="border-b border-white/10 mb-10 pb-1 w-full"
        >
          <div className="text-xl text-purple-400 font-[orbitron] tracking-wide mb-2">
            {title}
          </div>
          <div className="text-lg text-white/90 font-normal font-[lato] break-words">
            {value}
          </div>
        </div>
      ))}
    </div>
  );
}
