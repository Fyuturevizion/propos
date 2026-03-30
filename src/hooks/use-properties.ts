"use client";
import { useQuery } from "@tanstack/react-query";
import type { Property } from "@/lib/db/schema";

export function useProperties(filters?: Record<string, string>) {
  return useQuery<Property[]>({
    queryKey: ["properties", filters],
    queryFn: async () => {
      const params = new URLSearchParams(filters || {});
      const res = await fetch(`/api/properties?${params}`);
      if (!res.ok) throw new Error("Failed to fetch properties");
      return res.json();
    },
  });
}
