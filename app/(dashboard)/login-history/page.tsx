import { prisma } from "@/lib/prisma";
import { Monitor, Smartphone, Globe, ShieldCheck, ShieldAlert } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function LoginHistoryPage() {
  const history = await prisma.loginAttempt.findMany({
    orderBy: { createdAt: "desc" },
    take: 100, // limit to recent 100
  });

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
          Login History
        </h2>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
            <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-900 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th scope="col" className="px-6 py-4 font-medium">Status</th>
                <th scope="col" className="px-6 py-4 font-medium">Email Attempted</th>
                <th scope="col" className="px-6 py-4 font-medium">Reason</th>
                <th scope="col" className="px-6 py-4 font-medium">Device & OS</th>
                <th scope="col" className="px-6 py-4 font-medium">Browser</th>
                <th scope="col" className="px-6 py-4 font-medium">Time</th>
              </tr>
            </thead>
            <tbody>
              {history.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    No login attempts recorded yet.
                  </td>
                </tr>
              ) : (
                history.map((attempt) => (
                  <tr 
                    key={attempt.id} 
                    className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      {attempt.success ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400">
                          <ShieldCheck className="size-3.5" />
                          Success
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-800 dark:bg-rose-500/10 dark:text-rose-400">
                          <ShieldAlert className="size-3.5" />
                          Failed
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">
                      {attempt.email}
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs">
                      {attempt.reason ?? "—"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {attempt.device === "mobile" || attempt.device === "tablet" ? (
                          <Smartphone className="size-4 text-slate-400" />
                        ) : (
                          <Monitor className="size-4 text-slate-400" />
                        )}
                        <span className="capitalize">{attempt.os || "Unknown OS"}</span>
                        <span className="text-slate-400 text-xs ml-1">({attempt.device})</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Globe className="size-4 text-slate-400" />
                        <span>{attempt.browser || "Unknown"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-400 whitespace-nowrap">
                      {new Date(attempt.createdAt).toLocaleString(undefined, {
                        dateStyle: 'medium',
                        timeStyle: 'short'
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
