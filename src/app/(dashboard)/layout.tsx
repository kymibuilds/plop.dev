import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/get-user";
import Navbar from "@/app/(dashboard)/_components/nav-bar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen">
      {/* Fixed sidebar */}
      <Navbar />

      {/* Offset main content */}
      <main className="ml-64 min-h-screen px-8 py-6">{children}</main>
    </div>
  );
}
