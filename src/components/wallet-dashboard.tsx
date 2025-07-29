// "use client"

// import { useState, useEffect } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Wallet, Plus, Minus, CreditCard, ArrowUpRight, ArrowDownLeft } from "lucide-react"
// import { supabase } from "@/lib/supabase"

// interface Transaction {
//   id: string
//   type: string
//   amount: number
//   description: string
//   created_at: string
//   status: string
// }

// interface WalletDashboardProps {
//   onAddFunds: () => void
//   onWithdraw: () => void
//   onCheckout: () => void
// }

// export function WalletDashboard({ onAddFunds, onWithdraw, onCheckout }: WalletDashboardProps) {
//   const [balance, setBalance] = useState(0)
//   const [transactions, setTransactions] = useState<Transaction[]>([])
//   const [loading, setLoading] = useState(true)

//   const DEMO_USER_ID = "550e8400-e29b-41d4-a716-446655440000"

//   useEffect(() => {
//     fetchWalletData()
//   }, [])

//   const fetchWalletData = async () => {
//     try {
//       // Fetch wallet balance
//       const { data: wallet } = await supabase.from("wallets").select("balance, id").eq("user_id", DEMO_USER_ID).single()

//       if (wallet) {
//         setBalance(wallet.balance)

//         // Fetch recent transactions
//         const { data: txns } = await supabase
//           .from("transactions")
//           .select("*")
//           .eq("wallet_id", wallet.id)
//           .order("created_at", { ascending: false })
//           .limit(10)

//         setTransactions(txns || [])
//       }
//     } catch (error) {
//       console.error("Error fetching wallet data:", error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const getTransactionIcon = (type: string) => {
//     switch (type) {
//       case "deposit":
//         return <ArrowDownLeft className="h-4 w-4 text-green-600" />
//       case "withdrawal":
//         return <ArrowUpRight className="h-4 w-4 text-red-600" />
//       case "payment":
//         return <CreditCard className="h-4 w-4 text-blue-600" />
//       default:
//         return <Wallet className="h-4 w-4" />
//     }
//   }

//   const getTransactionColor = (type: string) => {
//     switch (type) {
//       case "deposit":
//         return "text-green-600"
//       case "withdrawal":
//       case "payment":
//         return "text-red-600"
//       default:
//         return "text-gray-600"
//     }
//   }

//   if (loading) {
//     return (
//       <div className="space-y-6">
//         <Card>
//           <CardContent className="p-6">
//             <div className="animate-pulse space-y-4">
//               <div className="h-8 bg-gray-200 rounded w-1/3"></div>
//               <div className="h-12 bg-gray-200 rounded w-1/2"></div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-6">
//       {/* Balance Card */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <Wallet className="h-5 w-5" />
//             Wallet Balance
//           </CardTitle>
//           <CardDescription>Your current available balance</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="text-3xl font-bold text-green-600 mb-4">${balance.toFixed(2)}</div>
//           <div className="flex gap-2">
//             <Button onClick={onAddFunds} className="flex items-center gap-2">
//               <Plus className="h-4 w-4" />
//               Add Funds
//             </Button>
//             <Button onClick={onWithdraw} variant="outline" className="flex items-center gap-2 bg-transparent">
//               <Minus className="h-4 w-4" />
//               Withdraw
//             </Button>
//             <Button onClick={onCheckout} variant="secondary" className="flex items-center gap-2">
//               <CreditCard className="h-4 w-4" />
//               Checkout
//             </Button>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Recent Transactions */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Recent Transactions</CardTitle>
//           <CardDescription>Your latest wallet activity</CardDescription>
//         </CardHeader>
//         <CardContent>
//           {transactions.length === 0 ? (
//             <p className="text-gray-500 text-center py-4">No transactions yet</p>
//           ) : (
//             <div className="space-y-4">
//               {transactions.map((transaction) => (
//                 <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
//                   <div className="flex items-center gap-3">
//                     {getTransactionIcon(transaction.type)}
//                     <div>
//                       <p className="font-medium">{transaction.description}</p>
//                       <p className="text-sm text-gray-500">{new Date(transaction.created_at).toLocaleDateString()}</p>
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <p className={`font-medium ${getTransactionColor(transaction.type)}`}>
//                       {transaction.type === "deposit" ? "+" : "-"}${transaction.amount.toFixed(2)}
//                     </p>
//                     <Badge variant={transaction.status === "completed" ? "default" : "secondary"}>
//                       {transaction.status}
//                     </Badge>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   )
// }
