import { Sidebar } from "@/components/layout/sidebar";
import { TopBar } from "@/components/layout/topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <div className="print:hidden">
        <Sidebar />
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="print:hidden">
          <TopBar />
        </div>
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6 print:overflow-visible print:bg-white print:p-0">
          {children}
        </main>
      </div>
    </div>
  );
}
