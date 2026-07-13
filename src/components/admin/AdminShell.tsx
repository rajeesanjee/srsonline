"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { Boxes, ExternalLink, LayoutDashboard, LogOut, Menu, PackageCheck, Store, X } from "lucide-react";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Boxes },
  { href: "/admin/orders", label: "Orders", icon: PackageCheck },
];

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("srs-admin-session") !== "active") {
      router.replace("/admin/login");
      return;
    }
    queueMicrotask(() => setReady(true));
  }, [router]);

  function logout() {
    sessionStorage.removeItem("srs-admin-session");
    router.replace("/admin/login");
  }

  if (!ready) {
    return <main className="grid min-h-screen place-items-center bg-stone-100 text-stone-600">Checking admin session…</main>;
  }

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900">
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-white px-4 lg:hidden">
        <Link href="/admin" className="flex items-center gap-2 font-bold text-red-800"><Store className="h-5 w-5" /> SRS Admin</Link>
        <button type="button" onClick={() => setOpen(!open)} aria-label="Toggle admin menu" className="rounded-lg border p-2">{open ? <X /> : <Menu />}</button>
      </header>

      {open && <button className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu" />}

      <aside className={`${open ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-red-950 text-white transition-transform lg:translate-x-0`}>
        <div className="border-b border-white/10 p-6">
          <Link href="/admin" className="flex items-center gap-3 text-xl font-extrabold"><span className="grid h-10 w-10 place-items-center rounded-xl bg-yellow-400 text-red-950"><Store /></span><span>Rajalakshmi<br /><small className="font-medium text-red-200">Admin Console</small></span></Link>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return <Link key={href} href={href} onClick={() => setOpen(false)} className={`flex items-center gap-3 rounded-xl px-4 py-3 font-medium ${active ? "bg-yellow-400 text-red-950" : "text-red-100 hover:bg-white/10"}`}><Icon className="h-5 w-5" />{label}</Link>;
          })}
        </nav>
        <div className="space-y-2 border-t border-white/10 p-4">
          <Link href="/" className="flex items-center gap-3 rounded-xl px-4 py-3 text-red-100 hover:bg-white/10"><ExternalLink className="h-5 w-5" /> View Store</Link>
          <button type="button" onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-red-100 hover:bg-white/10"><LogOut className="h-5 w-5" /> Sign out</button>
        </div>
      </aside>
      <main className="lg:pl-64"><div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">{children}</div></main>
    </div>
  );
}
