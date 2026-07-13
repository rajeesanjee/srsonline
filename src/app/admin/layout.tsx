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
    <div className="min-h-screen bg-gray-50 lg:flex">
      <div className="hidden lg:block">
        <AdminSidebar />
      </div>

      <div className="flex-1">
        <header className="flex items-center justify-between border-b bg-white px-6 py-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Admin Dashboard
            </h1>

            <p className="text-sm text-gray-500">
              Rajalakshmi Stores Management System
            </p>
          </div>

          <LogoutButton />
        </header>

        {children}
      </div>
    </div>
  );
}