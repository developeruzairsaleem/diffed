import type { Role, Status, OrderAssignmentStatus } from "@/generated/prisma";

// Base Provider DTOs
export interface ProviderDto {
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

export interface ProviderAssignmentDto {
  id: string;
  orderId: string;
  claimedAt: Date;
  status: OrderAssignmentStatus;
  approved: boolean;
  completed: boolean;
  leftEarly: boolean;
  progress: number;
  proofUrl?: string;
  reviewRating?: number;
  reviewText?: string;
  order: {
    id: string;
    orderNumber: string;
    price: number;
    status: string;
    customer: {
      id: string;
      username: string;
      email: string;
    };
    subpackage: {
      id: string;
      name: string;
      service: {
        name: string;
        game: {
          name: string;
          image: string;
        };
      };
    };
  };
}

// Provider List DTO
export interface ProviderListDto {
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
  assignmentsCount: number;
  completedAssignments: number;
  totalEarnings: number;
  averageRating: number;
  lastAssignmentDate?: Date;
  activeAssignments: number;
}

// Provider Detail DTO
export interface ProviderDetailDto {
  id: string;
  username: string;
  email: string;
  role: Role;
  status: Status;
  profileImage?: string;
  stripeCustId?: string;
  createdAt: Date;
  updatedAt: Date;
  wallet?: {
    id: string;
    balance: number;
    currency: string;
    userId: string;
  };
  assignments: ProviderAssignmentDto[];
  transactions: Array<{
    id: string;
    walletId: string;
    type: string;
    amount: number;
    description?: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
  }>;
  stats: {
    totalAssignments: number;
    completedAssignments: number;
    approvedAssignments: number;
    cancelledAssignments: number;
    totalEarnings: number;
    averageRating: number;
    completionRate: number;
    approvalRate: number;
    averageCompletionTime: number;
    lastAssignmentDate?: Date;
    topGames: Array<{
      gameName: string;
      assignmentsCount: number;
      earnings: number;
    }>;
  };
}

// API Request/Response DTOs
export interface ProvidersListRequest {
  page?: number;
  limit?: number;
  status?: Status;
  role?: Role;
  search?: string;
  sortBy?:
    | "createdAt"
    | "updatedAt"
    | "username"
    | "email"
    | "totalEarnings"
    | "averageRating";
  sortOrder?: "asc" | "desc";
  hasAssignments?: boolean;
  minEarnings?: number;
  maxEarnings?: number;
  minRating?: number;
  gameId?: string;
  isAvailable?: boolean;
}

export interface ProvidersListResponse {
  providers: ProviderListDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  stats: {
    totalProviders: number;
    activeProviders: number;
    inactiveProviders: number;
    suspendedProviders: number;
    totalEarningsPaid: number;
    averageProviderEarnings: number;
    averageProviderRating: number;
  };
}

export interface ProviderUpdateRequest {
  username?: string;
  email?: string;
  status?: Status;
  profileImage?: string;
}

export interface ProviderStatsDto {
  totalProviders: number;
  newProvidersThisMonth: number;
  activeProviders: number;
  topPerformers: Array<{
    id: string;
    username: string;
    email: string;
    totalEarnings: number;
    assignmentsCount: number;
    averageRating: number;
    completionRate: number;
  }>;
  earningsByMonth: Array<{
    month: string;
    earnings: number;
    providers: number;
    assignments: number;
  }>;
  gamePopularity: Array<{
    gameName: string;
    providersCount: number;
    assignmentsCount: number;
    totalEarnings: number;
  }>;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
