// "use client";

// import type React from "react";

// import { useState } from "react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { Loader2, Minus } from "lucide-react";
// import { withdrawFunds } from "@/actions/wallet";

// interface WithdrawFundsProps {
//   onSuccess: () => void;
//   onCancel: () => void;
// }

// export function WithdrawFunds({ onSuccess, onCancel }: WithdrawFundsProps) {
//   const [amount, setAmount] = useState("");
//   const [accountNumber, setAccountNumber] = useState("");
//   const [routingNumber, setRoutingNumber] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const amountNum = Number.parseFloat(amount);
//     if (isNaN(amountNum) || amountNum <= 0) {
//       setError("Please enter a valid amount");
//       return;
//     }

//     if (!accountNumber || !routingNumber) {
//       setError("Please enter valid bank account details");
//       return;
//     }

//     setLoading(true);
//     setError("");

//     try {
//       const result = await withdrawFunds(
//         amountNum,
//         accountNumber,
//         routingNumber
//       );

//       if (!result.success) {
//         throw new Error(result.error);
//       }

//       onSuccess();
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Failed to withdraw funds");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Card className="w-full max-w-md mx-auto">
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <Minus className="h-5 w-5" />
//           Withdraw Funds
//         </CardTitle>
//         <CardDescription>
//           Transfer money from your wallet to your bank account
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <Label htmlFor="amount">Amount (USD)</Label>
//             <Input
//               id="amount"
//               type="number"
//               step="0.01"
//               min="1"
//               placeholder="0.00"
//               value={amount}
//               onChange={(e) => setAmount(e.target.value)}
//               required
//             />
//           </div>

//           <div>
//             <Label htmlFor="routing">Routing Number</Label>
//             <Input
//               id="routing"
//               type="text"
//               placeholder="123456789"
//               value={routingNumber}
//               onChange={(e) => setRoutingNumber(e.target.value)}
//               required
//             />
//           </div>

//           <div>
//             <Label htmlFor="account">Account Number</Label>
//             <Input
//               id="account"
//               type="text"
//               placeholder="1234567890"
//               value={accountNumber}
//               onChange={(e) => setAccountNumber(e.target.value)}
//               required
//             />
//           </div>

//           {error && (
//             <Alert variant="destructive">
//               <AlertDescription>{error}</AlertDescription>
//             </Alert>
//           )}

//           <div className="flex gap-2">
//             <Button type="submit" disabled={loading} className="flex-1">
//               {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//               Withdraw ${amount || "0.00"}
//             </Button>
//             <Button type="button" variant="outline" onClick={onCancel}>
//               Cancel
//             </Button>
//           </div>
//         </form>
//       </CardContent>
//     </Card>
//   );
// }
