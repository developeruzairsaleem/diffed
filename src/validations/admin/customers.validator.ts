// lib/validators/customerSchemas.ts
import { z } from "zod";

// // Wallet Schema
// export const WalletSchema = z.object({
//   id: z.string(),
//   currency: z.string(),
//   balance: z.number(),
// });

// // Order Schema
// export const OrderSchema = z.object({
//   id: z.string(),
//   price: z.number(),
//   status: z.string(),
//   createdAt: z.string(), //ISO Format
// });

// // OrderUser Schema
// export const OrderUserSchema = z.object({
//   Order: OrderSchema,
// });

// Customer Schema
export const CustomerSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string().email(),
  status: z.enum(["active", "inactive", "suspended"]),
  createdAt: z.date(), // or z.coerce.date() if you want it as Date
  updatedAt: z.date(),
  walletCurrency: z.string(),
  walletBalance: z.number(),
  totalOrders: z.number(),
});
/// BELOGS TO THE ABOVE
// _count: z.object({
//   orderUsers: z.number(),
// }),
// orderUsers: z.array(OrderUserSchema),
// Array schema for response
export const CustomerArraySchema = z.array(CustomerSchema);

// Inferred TypeScript types (optional, for strict typing)
// export type Wallet = z.infer<typeof WalletSchema>;
// export type Order = z.infer<typeof OrderSchema>;
// export type OrderUser = z.infer<typeof OrderUserSchema>;
export type Customer = z.infer<typeof CustomerSchema>;
