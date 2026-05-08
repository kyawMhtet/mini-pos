"use client";

import { useSession, signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { useT } from "@/lib/i18n";

export function SignOutButton() {
  const { data: session } = useSession();
  const { t } = useT();

  if (!session) return null;

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-500 hidden md:block truncate max-w-40">
        {session.user?.name ?? session.user?.email}
      </span>
      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
        title={t("auth.signOut")}
      >
        <LogOut className="size-4" />
        <span className="hidden sm:block">{t("auth.signOut")}</span>
      </button>
    </div>
  );
}
