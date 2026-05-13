import Image from "next/image";
import { NavLinks } from "./nav-links";

export function Sidebar() {
  return (
    <aside
      className="hidden lg:flex w-60 shrink-0 flex-col h-screen sticky top-0 print:hidden bg-white border-r border-gray-200"
    >
      {/* Brand */}
      <div className="flex items-center justify-center px-4 py-4 border-b border-gray-200">
        <Image src="/Diva-removebg-preview.png" alt="Diva Delivery Bag" width={180} height={90} className="object-contain" style={{ height: 72, width: "auto" }} />
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        <NavLinks />
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 px-6 py-4">
        <p className="text-xs text-gray-400">v1.0.0</p>
      </div>
    </aside>
  );
}
