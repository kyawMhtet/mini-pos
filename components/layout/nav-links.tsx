"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  ClipboardList,
  Package,
  Boxes,
} from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  {
    href: "/",
    label: "Dashboard",
    icon: LayoutDashboard,
    isActive: (p: string) => p === "/",
  },
  {
    href: "/new-order",
    label: "New Order",
    icon: ShoppingCart,
    isActive: (p: string) => p === "/new-order",
  },
  {
    href: "/orders",
    label: "Orders",
    icon: ClipboardList,
    isActive: (p: string) => p.startsWith("/orders"),
  },
  {
    href: "/products",
    label: "Products",
    icon: Package,
    isActive: (p: string) => p.startsWith("/products"),
  },
  {
    href: "/stock",
    label: "Stock",
    icon: Boxes,
    isActive: (p: string) => p.startsWith("/stock"),
  },
];

interface NavLinksProps {
  onNavigate?: () => void;
}

export function NavLinks({ onNavigate }: NavLinksProps) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-0.5 px-3">
      {links.map(({ href, label, icon: Icon, isActive }) => (
        <Link
          key={href}
          href={href}
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
            isActive(pathname)
              ? "bg-white/10 text-white"
              : "text-white/55 hover:bg-white/5 hover:text-white/90"
          )}
        >
          <Icon className="size-4 shrink-0" />
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  );
}
