import type { Role, Status } from "@/generated/prisma";
import type { OrderListDto } from "./order.dto";

// Base Customer DTOs
export interface CustomerDto {
  id: string;
  username: string;
  email: string;
  role: Role;
  status: Status;
  profileImage?: string;
  stripeCustId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WalletDto {
  id: string;
  balance: number;
  currency: string;
  userId: string;
}

export interface TransactionDto {
  id: string;
  walletId: string;
  type: string;
  amount: number;
  description?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

// Customer List DTO
export interface CustomerListDto {
  id: string;
  username: string;
  email: string;
  role: Role;
  status: Status;
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
  wallet?: {
    balance: number;
    currency: string;
  };
  ordersCount: number;
  totalSpent: number;
  lastOrderDate?: Date;
}

// Customer Detail DTO
export interface CustomerDetailDto {
  id: string;
  username: string;
  email: string;
  role: Role;
  status: Status;
  profileImage?: string;
  stripeCustId?: string;
  createdAt: Date;
  updatedAt: Date;
  wallet?: WalletDto;
  orders: OrderListDto[];
  transactions: TransactionDto[];
  stats: {
    totalOrders: number;
    completedOrders: number;
    cancelledOrders: number;
    totalSpent: number;
    averageOrderValue: number;
    lastOrderDate?: Date;
  };
}

// API Request/Response DTOs
export interface CustomersListRequest {
  page?: number;
  limit?: number;
  status?: Status;
  role?: Role;
  search?: string;
  sortBy?: "createdAt" | "updatedAt" | "username" | "email" | "totalSpent";
  sortOrder?: "asc" | "desc";
  hasOrders?: boolean;
  minSpent?: number;
  maxSpent?: number;
}

export interface CustomersListResponse {
  customers: CustomerListDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  stats: {
    totalCustomers: number;
    activeCustomers: number;
    inactiveCustomers: number;
    suspendedCustomers: number;
    totalRevenue: number;
    averageCustomerValue: number;
  };
}

export interface CustomerUpdateRequest {
  username?: string;
  email?: string;
  status?: Status;
  profileImage?: string;
}

export interface CustomerStatsDto {
  totalCustomers: number;
  newCustomersThisMonth: number;
  activeCustomers: number;
  topSpenders: Array<{
    id: string;
    username: string;
    email: string;
    totalSpent: number;
    ordersCount: number;
  }>;
  revenueByMonth: Array<{
    month: string;
    revenue: number;
    customers: number;
  }>;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
