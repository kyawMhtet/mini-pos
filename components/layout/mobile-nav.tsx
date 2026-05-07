"use client";

import { useState } from "react";
import { Menu, Store } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { NavLinks } from "./nav-links";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const storeName = process.env.NEXT_PUBLIC_STORE_NAME ?? "Mini POS";

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="size-5" />
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="left"
          style={{ backgroundColor: "#1a1a2e" }}
          showClose={false}
        >
          {/* Visually hidden accessible title */}
          <SheetTitle className="sr-only">Navigation menu</SheetTitle>

          {/* Brand */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-lg bg-white/10">
                <Store className="size-4 text-white" />
              </div>
              <span className="font-semibold text-white text-sm">
                {storeName}
              </span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="rounded-md p-1.5 text-white/50 hover:text-white hover:bg-white/5 focus:outline-none"
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto py-4">
            <NavLinks onNavigate={() => setOpen(false)} />
          </div>

          {/* Footer */}
          <div className="border-t border-white/10 px-6 py-4">
            <p className="text-xs text-white/30">v1.0.0</p>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
