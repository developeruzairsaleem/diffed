// "use client"

// import type React from "react"

// import { useState, useEffect } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { Label } from "@/components/ui/label"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { Badge } from "@/components/ui/badge"
// import { Loader2, ShoppingCart, Wallet, CreditCard } from "lucide-react"
// import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
// import { loadStripe } from "@stripe/stripe-js"
// import { processCheckout, createCheckoutPaymentIntent } from "@/actions/wallet"
// import { supabase } from "@/lib/supabase"

// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

// const SAMPLE_ITEMS = [
//   { id: "1", name: "Premium Subscription", price: 29.99, quantity: 1 },
//   { id: "2", name: "Extra Storage (100GB)", price: 9.99, quantity: 1 },
// ]

// interface CheckoutFormProps {
//   onSuccess: () => void
//   onCancel: () => void
// }

// function CheckoutForm({ onSuccess, onCancel }: CheckoutFormProps) {
//   const [paymentMethod, setPaymentMethod] = useState<"wallet" | "card">("wallet")
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState("")
//   const [walletBalance, setWalletBalance] = useState(0)
//   const stripe = useStripe()
//   const elements = useElements()

//   const DEMO_USER_ID = "550e8400-e29b-41d4-a716-446655440000"
//   const total = SAMPLE_ITEMS.reduce((sum, item) => sum + item.price * item.quantity, 0)

//   useEffect(() => {
//     fetchWalletBalance()
//   }, [])

//   const fetchWalletBalance = async () => {
//     try {
//       const { data: wallet } = await supabase.from("wallets").select("balance").eq("user_id", DEMO_USER_ID).single()

//       if (wallet) {
//         setWalletBalance(wallet.balance)
//       }
//     } catch (error) {
//       console.error("Error fetching wallet balance:", error)
//     }
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setLoading(true)
//     setError("")

//     try {
//       if (paymentMethod === "wallet") {
//         if (walletBalance < total) {
//           throw new Error("Insufficient wallet balance")
//         }

//         const result = await processCheckout(SAMPLE_ITEMS, "wallet")

//         if (!result.success) {
//           throw new Error(result.error)
//         }
//       } else {
//         // Card payment
//         if (!stripe || !elements) throw new Error("Stripe not loaded")

//         // Create payment intent
//         const paymentIntentResult = await createCheckoutPaymentIntent(total)

//         if (!paymentIntentResult.success) {
//           throw new Error(paymentIntentResult.error)
//         }

//         // Confirm payment
//         const cardElement = elements.getElement(CardElement)
//         if (!cardElement) throw new Error("Card element not found")

//         const { error: stripeError } = await stripe.confirmCardPayment(paymentIntentResult.clientSecret!, {
//           payment_method: {
//             card: cardElement,
//           },
//         })

//         if (stripeError) {
//           throw new Error(stripeError.message)
//         }

//         // Process checkout in our system
//         const result = await processCheckout(SAMPLE_ITEMS, "card", paymentIntentResult.paymentIntentId!)

//         if (!result.success) {
//           throw new Error(result.error)
//         }
//       }

//       onSuccess()
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Failed to process checkout")
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <Card className="w-full max-w-md mx-auto">
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <ShoppingCart className="h-5 w-5" />
//           Checkout
//         </CardTitle>
//         <CardDescription>Complete your purchase</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Order Summary */}
//           <div className="space-y-3">
//             <h3 className="font-medium">Order Summary</h3>
//             {SAMPLE_ITEMS.map((item) => (
//               <div key={item.id} className="flex justify-between items-center p-3 border rounded">
//                 <div>
//                   <p className="font-medium">{item.name}</p>
//                   <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
//                 </div>
//                 <p className="font-medium">${item.price.toFixed(2)}</p>
//               </div>
//             ))}
//             <div className="flex justify-between items-center pt-3 border-t font-bold">
//               <span>Total</span>
//               <span>${total.toFixed(2)}</span>
//             </div>
//           </div>

//           {/* Payment Method */}
//           <div className="space-y-3">
//             <Label>Payment Method</Label>
//             <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as "wallet" | "card")}>
//               <div className="flex items-center space-x-2 p-3 border rounded">
//                 <RadioGroupItem value="wallet" id="wallet" />
//                 <Label htmlFor="wallet" className="flex items-center gap-2 flex-1 cursor-pointer">
//                   <Wallet className="h-4 w-4" />
//                   <div className="flex-1">
//                     <p>Wallet Balance</p>
//                     <p className="text-sm text-gray-500">Available: ${walletBalance.toFixed(2)}</p>
//                   </div>
//                   {walletBalance < total && <Badge variant="destructive">Insufficient</Badge>}
//                 </Label>
//               </div>

//               <div className="flex items-center space-x-2 p-3 border rounded">
//                 <RadioGroupItem value="card" id="card" />
//                 <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
//                   <CreditCard className="h-4 w-4" />
//                   Credit/Debit Card
//                 </Label>
//               </div>
//             </RadioGroup>
//           </div>

//           {/* Card Details */}
//           {paymentMethod === "card" && (
//             <div>
//               <Label>Card Details</Label>
//               <div className="border rounded-md p-3 mt-1">
//                 <CardElement
//                   options={{
//                     style: {
//                       base: {
//                         fontSize: "16px",
//                         color: "#424770",
//                         "::placeholder": {
//                           color: "#aab7c4",
//                         },
//                       },
//                     },
//                   }}
//                 />
//               </div>
//             </div>
//           )}

//           {error && (
//             <Alert variant="destructive">
//               <AlertDescription>{error}</AlertDescription>
//             </Alert>
//           )}

//           <div className="flex gap-2">
//             <Button
//               type="submit"
//               disabled={
//                 loading ||
//                 (paymentMethod === "card" && !stripe) ||
//                 (paymentMethod === "wallet" && walletBalance < total)
//               }
//               className="flex-1"
//             >
//               {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//               Pay ${total.toFixed(2)}
//             </Button>
//             <Button type="button" variant="outline" onClick={onCancel}>
//               Cancel
//             </Button>
//           </div>
//         </form>
//       </CardContent>
//     </Card>
//   )
// }

// interface CheckoutProps {
//   onSuccess: () => void
//   onCancel: () => void
// }

// export function Checkout({ onSuccess, onCancel }: CheckoutProps) {
//   return (
//     <Elements stripe={stripePromise}>
//       <CheckoutForm onSuccess={onSuccess} onCancel={onCancel} />
//     </Elements>
//   )
// }
