"use client";

import { useI18n } from "@/lib/i18n";

export function LanguageToggle({ className }: { className?: string }) {
  const { locale, setLocale } = useI18n();

  return (
    <button
      onClick={() => setLocale(locale === "en" ? "my" : "en")}
      className={`text-xs font-medium px-2.5 py-1 rounded-md border transition-colors ${className ?? ""}`}
      title={locale === "en" ? "Switch to Myanmar" : "Switch to English"}
    >
      {locale === "en" ? "မြန်မာ" : "English"}
    </button>
  );
}
