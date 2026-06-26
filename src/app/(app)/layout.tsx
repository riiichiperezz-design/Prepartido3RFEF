import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";

/** Layout principal de la app (con navegación). El login queda fuera. */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileNav />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-24 pt-6 md:px-8 md:pb-10">
          {children}
        </main>
      </div>
    </div>
  );
}
