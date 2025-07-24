"use client";

import { useState, useEffect } from "react";
import type {
  GamesListRequest,
  GamesListResponse,
  GameDetailDto,
  ServiceDetailDto,
  ServicesListRequest,
  ServicesListResponse,
  GameStatsDto,
  ApiResponse,
} from "@/types/game.dto";

export function useGames(params: GamesListRequest) {
  const [data, setData] = useState<GamesListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGames = async () => {
    try {
      setLoading(true);
      setError(null);

      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });

      const response = await fetch(`/api/admin/games?${searchParams}`);
      const result: ApiResponse<GamesListResponse> = await response.json();

      if (result.success && result.data) {
        setData(result.data);
      } else {
        setError(result.error || "Failed to fetch games");
      }
    } catch (err) {
      setError("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, [JSON.stringify(params)]);

  return { data, loading, error, refetch: fetchGames };
}

export function useGame(id: string) {
  const [data, setData] = useState<GameDetailDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGame = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/admin/games/${id}`);
      const result: ApiResponse<GameDetailDto> = await response.json();

      if (result.success && result.data) {
        setData(result.data);
      } else {
        setError(result.error || "Failed to fetch game");
      }
    } catch (err) {
      setError("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchGame();
    }
  }, [id]);

  return { data, loading, error, refetch: fetchGame };
}

export function useServices(params: ServicesListRequest) {
  const [data, setData] = useState<ServicesListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);

      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });

      const response = await fetch(`/api/admin/services?${searchParams}`);
      const result: ApiResponse<ServicesListResponse> = await response.json();

      if (result.success && result.data) {
        setData(result.data);
      } else {
        setError(result.error || "Failed to fetch services");
      }
    } catch (err) {
      setError("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [JSON.stringify(params)]);

  return { data, loading, error, refetch: fetchServices };
}

export function useService(id: string) {
  const [data, setData] = useState<ServiceDetailDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchService = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/admin/services/${id}`);
      const result: ApiResponse<ServiceDetailDto> = await response.json();

      if (result.success && result.data) {
        setData(result.data);
      } else {
        setError(result.error || "Failed to fetch service");
      }
    } catch (err) {
      setError("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchService();
    }
  }, [id]);

  return { data, loading, error, refetch: fetchService };
}
// ------------------------------------------------------------

// ------------------------------------------------------------
// ------------------------------------------------------------
// ------------------------------------------------------------
// ------------------------------------------------------------
export function useGameStats() {
  const [data, setData] = useState<GameStatsDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/admin/games/stats");
      const result: ApiResponse<GameStatsDto> = await response.json();

      if (result.success && result.data) {
        setData(result.data);
      } else {
        setError(result.error || "Failed to fetch game statistics");
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
