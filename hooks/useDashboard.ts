import { useQuery } from "@tanstack/react-query";
import type { OrderSummary } from "@/types";

export interface DashboardData {
  todayRevenue: number;
  todayOrders:  number;
  weekRevenue:  number;
  weekOrders:   number;
  monthRevenue: number;
  monthOrders:  number;
  topProducts:  { name: string; qtySold: number }[];
  recentOrders: OrderSummary[];
}

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: async (): Promise<DashboardData> => {
      const res = await fetch("/api/dashboard");
      if (!res.ok) throw new Error("Failed to fetch dashboard");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}
