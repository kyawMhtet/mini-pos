"use client";

import { useDashboard } from "@/hooks/useDashboard";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { RecentOrders } from "@/components/dashboard/RecentOrders";
import { TopProducts } from "@/components/dashboard/TopProducts";

function SkeletonCard() {
  return <div className="rounded-xl border border-gray-200 bg-gray-100 p-5 shadow-sm h-28 animate-pulse" />;
}

function SkeletonBlock({ h }: { h: string }) {
  return <div className={`rounded-xl border border-gray-200 bg-gray-100 shadow-sm animate-pulse ${h}`} />;
}

export default function DashboardPage() {
  const { data, isLoading, isError } = useDashboard();

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Overview of your store performance</p>
      </div>

      {isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
          Failed to load dashboard data. Please refresh.
        </div>
      ) : isLoading || !data ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SkeletonBlock h="h-80" />
            <SkeletonBlock h="h-80" />
          </div>
        </>
      ) : (
        <>
          <StatsCards data={data} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentOrders orders={data.recentOrders} />
            <TopProducts products={data.topProducts} />
          </div>
        </>
      )}
    </div>
  );
}
