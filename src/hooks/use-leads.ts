"use client";
import { useQuery } from "@tanstack/react-query";
import type { Lead } from "@/lib/db/schema";

export function useLeads(status?: string) {
  return useQuery<Lead[]>({
    queryKey: ["leads", status],
    queryFn: async () => {
      const params = status ? `?status=${status}` : "";
      const res = await fetch(`/api/leads${params}`);
      if (!res.ok) throw new Error("Failed to fetch leads");
      return res.json();
    },
  });
}
