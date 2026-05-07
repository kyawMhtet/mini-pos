import { Store } from "lucide-react";
import { NavLinks } from "./nav-links";

export function Sidebar() {
  const storeName = process.env.NEXT_PUBLIC_STORE_NAME ?? "Mini POS";

  return (
    <aside
      className="hidden lg:flex w-60 shrink-0 flex-col h-screen sticky top-0 print:hidden"
      style={{ backgroundColor: "#1a1a2e" }}
    >
      {/* Brand */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
        <div className="flex size-8 items-center justify-center rounded-lg bg-white/10">
          <Store className="size-4 text-white" />
        </div>
        <span className="font-semibold text-white text-sm leading-none">
          {storeName}
        </span>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        <NavLinks />
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 px-6 py-4">
        <p className="text-xs text-white/30">v1.0.0</p>
      </div>
    </aside>
  );
}
