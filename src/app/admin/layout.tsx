import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import AdminSidebar from "@/components/admin/AdminSidebar";
import LogoutButton from "@/components/admin/LogoutButton";
import { verifyAdminSessionToken } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;

  if (!token) {
    redirect("/admin-login");
  }

  try {
    await verifyAdminSessionToken(token);
  } catch {
    redirect("/admin-login");
  }

  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      <aside className="hidden w-64 shrink-0 lg:block">
        <AdminSidebar />
      </aside>

      <div className="min-w-0 flex-1">
        <header className="flex h-16 items-center justify-between border-b bg-white px-5">
          <div>
            <h1 className="text-lg font-bold text-gray-900">
              Admin Dashboard
            </h1>

            <p className="text-xs text-gray-500">
              Rajalakshmi Stores Management System
            </p>
          </div>

          <LogoutButton />
        </header>

        <div className="w-full min-w-0">
          {children}
        </div>
      </div>
    </div>
  );
}