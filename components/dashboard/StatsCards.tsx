"use client";

import { CalendarDays, CalendarRange, Clock } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useT, type TKey } from "@/lib/i18n";
import type { DashboardData } from "@/hooks/useDashboard";

interface Props {
  data: DashboardData;
}

interface CardProps {
  titleKey: TKey;
  revenue: number;
  orders: number;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
}

function StatCard({ titleKey, revenue, orders, icon: Icon, iconBg, iconColor }: CardProps) {
  const { t, plural } = useT();
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500">{t(titleKey)}</span>
        <div className={`flex size-9 items-center justify-center rounded-lg ${iconBg}`}>
          <Icon className={`size-4 ${iconColor}`} />
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900 tabular-nums">{formatCurrency(revenue)}</p>
        <p className="mt-1 text-sm text-gray-500">
          {plural(orders, "unit.order", "unit.orders")}
        </p>
      </div>
    </div>
  );
}

export function StatsCards({ data }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard titleKey="dashboard.today"     revenue={data.todayRevenue}  orders={data.todayOrders}  icon={Clock}         iconBg="bg-blue-50"    iconColor="text-blue-600" />
      <StatCard titleKey="dashboard.thisWeek"  revenue={data.weekRevenue}   orders={data.weekOrders}   icon={CalendarDays}  iconBg="bg-violet-50"  iconColor="text-violet-600" />
      <StatCard titleKey="dashboard.thisMonth" revenue={data.monthRevenue}  orders={data.monthOrders}  icon={CalendarRange} iconBg="bg-emerald-50" iconColor="text-emerald-600" />
    </div>
  );
}
