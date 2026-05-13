"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LanguageToggle } from "@/components/layout/LanguageToggle";
import { useT } from "@/lib/i18n";

export default function LoginPage() {
  const router = useRouter();
  const { t } = useT();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    const result = await signIn("credentials", { email, password, redirect: false });

    if (result?.error) {
      if (result.error === "CredentialsSignin") {
        setError(t("auth.invalidCredentials"));
      } else {
        setError(`${t("auth.signInErrorPrefix")} ${result.error}`);
      }
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 flex flex-col items-center gap-2">
        <Image src="/Diva.jpg" alt="Diva Delivery Bag" width={200} height={100} className="object-contain" style={{ height: 100, width: "auto" }} />
        <p className="text-sm text-gray-500">{t("auth.signInToContinue")}</p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">{t("auth.email")}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder={t("auth.emailPlaceholder")}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">{t("auth.password")}</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder={t("auth.passwordPlaceholder")}
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 border border-red-100">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="size-4 animate-spin" />}
            {loading ? t("auth.signingIn") : t("auth.signIn")}
          </Button>
        </form>
      </div>

      <div className="mt-4 flex justify-center">
        <LanguageToggle className="border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700" />
      </div>
    </div>
  );
}
