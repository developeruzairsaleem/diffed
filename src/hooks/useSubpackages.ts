"use client";

import { useState, useEffect } from "react";
import type { ApiResponse } from "@/types/game.dto";
import { string } from "zod";

export interface SubpackageDetailDto {
  id: string;
  name: string;
  description: string;
  price: number;
  duration?: string;
  dynamicPricing: boolean;
  basePricePerELO?: number;
  requiredProviders: number;
  minELO?: number;
  maxELO?: number;
  serviceId: string;
  service: {
    id: string;
    name: string;
    description: string;
    gameId: string;
    game: {
      id: string;
      name: string;
      image: string;
      isEloBased: boolean;
      ranks: string[];
    };
  };
  orders: Array<{
    id: string;
    orderNumber: string;
    price: number;
    status: string;
    customer: {
      id: string;
      username: string;
      email: string;
    };
    createdAt: Date;
    assignmentsCount: number;
    completedAssignments: number;
  }>;
  stats: {
    ordersCount: number;
    totalRevenue: number;
    completedOrders: number;
    completionRate: number;
    averageRating: number;
    averageOrderValue: number;
  };

  createdAt: Date;
  updatedAt: Date;
}

export interface SubpackageListDto {
  id: string;
  name: string;
  description: string;
  price: number;
  duration?: string;
  dynamicPricing: boolean;
  basePricePerELO?: number;
  requiredProviders: number;
  minELO?: number;
  maxELO?: number;
  serviceId: string;
  service: {
    id: string;
    name: string;
    description: string;
    game: {
      id: string;
      name: string;
      image: string;
    };
  };
  ordersCount: number;
  totalRevenue: number;
  completedOrders: number;
  createdAt: Date;
  updatedAt: Date;
}
export interface SubpackageListResponse {
  subpackages: SubpackageListDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  allGames: Array<{
    id: string;
    name: string;
    image: string;
    services: Array<{
      id: string;
      name: string;
      description: string;
    }>;
  }>;
}

export interface PricingCalculation {
  subpackageId: string;
  subpackageName: string;
  basePrice: number;
  calculatedPrice: number;
  dynamicPricing: boolean;
  currentELO: number;
  targetELO: number;
  eloDifference: number;
  basePricePerELO: number;
  additionalCost: number;
  duration?: string;
  isEloBased: boolean;
  validELORange: {
    min?: number;
    max?: number;
  };
}

export function useSubpackages(serviceId?: string, gameId?: string) {
  const [data, setData] = useState<SubpackageListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubpackages = async () => {
    try {
      setLoading(true);
      setError(null);

      const searchParams = new URLSearchParams();
      if (serviceId) searchParams.append("serviceId", serviceId);
      if (gameId) searchParams.append("gameId", gameId);

      const response = await fetch(`/api/admin/subpackages?${searchParams}`);
      const result: ApiResponse<SubpackageListResponse> = await response.json();

      if (result.success && result.data) {
        setData(result?.data || {});
      } else {
        setError(result.error || "Failed to fetch subpackages");
      }
    } catch (err) {
      setError("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubpackages();
  }, [serviceId, gameId]);

  return { data, loading, error, refetch: fetchSubpackages };
}

export function useSubpackage(id: string) {
  const [data, setData] = useState<SubpackageDetailDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubpackage = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/admin/subpackages/${id}`);
      const result: ApiResponse<SubpackageDetailDto> = await response.json();

      if (result.success && result.data) {
        setData(result.data);
      } else {
        setError(result.error || "Failed to fetch subpackage");
      }
    } catch (err) {
      setError("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchSubpackage();
    }
  }, [id]);

  return { data, loading, error, refetch: fetchSubpackage };
}

export function usePricingCalculator() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculatePrice = async (
    subpackageId: string,
    currentELO: number,
    targetELO: number
  ): Promise<PricingCalculation | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/api/admin/subpackages/${subpackageId}/pricing`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ currentELO, targetELO }),
        }
      );

      const result: ApiResponse<PricingCalculation> = await response.json();

      if (result.success && result.data) {
        return result.data;
      } else {
        setError(result.error || "Failed to calculate pricing");
        return null;
      }
    } catch (err) {
      setError("Network error occurred");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { calculatePrice, loading, error };
}
