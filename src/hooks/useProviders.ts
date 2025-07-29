"use client";

import { useState, useEffect } from "react";
import type {
  ProvidersListRequest,
  ProvidersListResponse,
  ProviderDetailDto,
  ProviderStatsDto,
  ApiResponse,
} from "@/types/provider.dto";

export function useProviders(params: ProvidersListRequest) {
  const [data, setData] = useState<ProvidersListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      setError(null);

      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });

      const response = await fetch(`/api/admin/providers?${searchParams}`);
      const result: ApiResponse<ProvidersListResponse> = await response.json();

      if (result.success && result.data) {
        setData(result.data);
      } else {
        setError(result.error || "Failed to fetch providers");
      }
    } catch (err) {
      setError("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, [JSON.stringify(params)]);

  return { data, loading, error, refetch: fetchProviders };
}

export function useProvider(id: string) {
  const [data, setData] = useState<ProviderDetailDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProvider = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/admin/providers/${id}`);
      const result: ApiResponse<ProviderDetailDto> = await response.json();

      if (result.success && result.data) {
        setData(result.data);
      } else {
        setError(result.error || "Failed to fetch provider");
      }
    } catch (err) {
      setError("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProvider();
    }
  }, [id]);

  return { data, loading, error, refetch: fetchProvider };
}

export function useProviderStats() {
  const [data, setData] = useState<ProviderStatsDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/admin/providers/stats");
      const result: ApiResponse<ProviderStatsDto> = await response.json();

      if (result.success && result.data) {
        setData(result.data);
      } else {
        setError(result.error || "Failed to fetch provider statistics");
      }
    } catch (err) {
      setError("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { data, loading, error, refetch: fetchStats };
}
