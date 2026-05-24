"use client";

import { MobileNav } from "./mobile-nav";
import { SignOutButton } from "./SignOutButton";
import { LanguageToggle } from "./LanguageToggle";
import { useI18n } from "@/lib/i18n";

export function TopBar() {
  const { locale } = useI18n();
  const storeName = process.env.NEXT_PUBLIC_STORE_NAME ?? "Mini POS";

  const date = new Date().toLocaleDateString(locale === "my" ? "my-MM" : "en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="flex h-16 shrink-0 items-center gap-4 border-b border-gray-100 bg-white px-6 print:hidden">
      <MobileNav />

      <span className="font-semibold text-gray-800 text-sm lg:hidden">
        {storeName}
      </span>

      <div className="flex-1" />

      <span className="text-sm text-gray-500 hidden sm:block">{date}</span>

      <LanguageToggle className="border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700" />

      <div className="border-l border-gray-100 pl-4">
        <SignOutButton />
      </div>
    </header>
  );
}
