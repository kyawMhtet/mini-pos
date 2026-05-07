import { MobileNav } from "./mobile-nav";
import { SignOutButton } from "./SignOutButton";

export function TopBar() {
  const storeName = process.env.NEXT_PUBLIC_STORE_NAME ?? "Mini POS";

  const date = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="flex h-16 shrink-0 items-center gap-4 border-b border-gray-100 bg-white px-6 print:hidden">
      {/* Mobile hamburger */}
      <MobileNav />

      {/* Store name — shown on mobile where sidebar is hidden */}
      <span className="font-semibold text-gray-800 text-sm lg:hidden">
        {storeName}
      </span>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Date */}
      <span className="text-sm text-gray-500 hidden sm:block">{date}</span>

      <div className="border-l border-gray-100 pl-4">
        <SignOutButton />
      </div>
    </header>
  );
}
