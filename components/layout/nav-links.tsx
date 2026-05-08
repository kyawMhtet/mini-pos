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
import { useT, type TKey } from "@/lib/i18n";

const links: { href: string; labelKey: TKey; icon: React.ElementType; isActive: (p: string) => boolean }[] = [
  { href: "/",         labelKey: "nav.dashboard", icon: LayoutDashboard, isActive: (p) => p === "/" },
  { href: "/new-order",labelKey: "nav.newOrder",  icon: ShoppingCart,    isActive: (p) => p === "/new-order" },
  { href: "/orders",   labelKey: "nav.orders",    icon: ClipboardList,   isActive: (p) => p.startsWith("/orders") },
  { href: "/products", labelKey: "nav.products",  icon: Package,         isActive: (p) => p.startsWith("/products") },
  { href: "/stock",    labelKey: "nav.stock",     icon: Boxes,           isActive: (p) => p.startsWith("/stock") },
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
              ? "bg-white/10 text-white"
              : "text-white/55 hover:bg-white/5 hover:text-white/90"
          )}
        >
          <Icon className="size-4 shrink-0" />
          <span>{t(labelKey)}</span>
        </Link>
      ))}
    </nav>
  );
}
