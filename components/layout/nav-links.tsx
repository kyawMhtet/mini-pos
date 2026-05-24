"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  ClipboardList,
  Package,
  Boxes,
  History,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useT, type TKey } from "@/lib/i18n";

const links = [
  {
    href: "/",
    labelKey: "nav.dashboard" as TKey,
    icon: LayoutDashboard,
    isActive: (p: string) => p === "/",
  },
  {
    href: "/new-order",
    labelKey: "nav.newOrder" as TKey,
    icon: ShoppingCart,
    isActive: (p: string) => p === "/new-order",
  },
  {
    href: "/orders",
    labelKey: "nav.orders" as TKey,
    icon: ClipboardList,
    isActive: (p: string) => p.startsWith("/orders"),
  },
  {
    href: "/products",
    labelKey: "nav.products" as TKey,
    icon: Package,
    isActive: (p: string) => p.startsWith("/products"),
  },
  {
    href: "/stock",
    labelKey: "nav.stock" as TKey,
    icon: Boxes,
    isActive: (p: string) => p.startsWith("/stock"),
  },
  {
    href: "/login-history",
    labelKey: "nav.loginHistory" as TKey,
    icon: History,
    isActive: (p: string) => p.startsWith("/login-history"),
  },
];

interface NavLinksProps {
  onNavigate?: () => void;
}

export function NavLinks({ onNavigate }: NavLinksProps) {
  const pathname = usePathname();
  const { t } = useT();

  return (
    <nav className="flex flex-col gap-0.5 px-3">
      {links.map(({ href, labelKey, icon: Icon, isActive }) => (
        <Link
          key={href}
          href={href}
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
            isActive(pathname)
              ? "bg-gray-100 text-gray-900"
              : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
          )}
        >
          <Icon className="size-4 shrink-0" />
          <span>{t(labelKey)}</span>
        </Link>
      ))}
    </nav>
  );
}
