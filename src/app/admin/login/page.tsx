"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { LockKeyhole, Store } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("srs-admin-session") === "active") router.replace("/admin");
  }, [router]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    if (!email.includes("@") || password.length < 6) {
      setError("Enter a valid email and a password of at least 6 characters.");
      setLoading(false);
      return;
    }
    sessionStorage.setItem("srs-admin-session", "active");
    router.replace("/admin");
  }

  return (
    <main className="grid min-h-screen bg-stone-100 lg:grid-cols-2">
      <section className="hidden bg-red-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <Link href="/" className="flex items-center gap-3 text-xl font-bold"><Store className="text-yellow-400" /> Rajalakshmi Stores</Link>
        <div><p className="font-semibold uppercase tracking-[0.25em] text-yellow-400">Store management</p><h1 className="mt-4 max-w-xl text-5xl font-extrabold leading-tight">Manage products, stock and customer orders.</h1><p className="mt-5 max-w-lg text-lg leading-8 text-red-100">A clear daily view of the business, built for wholesale and retail operations.</p></div>
        <p className="text-sm text-red-300">Secure server authentication will be enabled when the database backend is connected.</p>
      </section>
      <section className="flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-xl sm:p-10">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-yellow-400 text-red-950"><LockKeyhole /></div>
          <h2 className="mt-6 text-center text-3xl font-extrabold">Admin sign in</h2>
          <p className="mt-2 text-center text-stone-600">Use your store administrator details.</p>
          <form onSubmit={submit} className="mt-8 space-y-5">
            <div><label htmlFor="email" className="mb-2 block text-sm font-semibold">Email address</label><input id="email" name="email" type="email" autoComplete="email" required placeholder="admin@rajalakshmistores.in" className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-red-700 focus:ring-2 focus:ring-red-100" /></div>
            <div><label htmlFor="password" className="mb-2 block text-sm font-semibold">Password</label><input id="password" name="password" type="password" autoComplete="current-password" required minLength={6} placeholder="Enter password" className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-red-700 focus:ring-2 focus:ring-red-100" /></div>
            {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-medium text-red-700">{error}</p>}
            <button disabled={loading} className="w-full rounded-xl bg-red-800 px-5 py-3 font-bold text-white hover:bg-red-900 disabled:opacity-60">{loading ? "Signing in…" : "Sign in"}</button>
          </form>
          <p className="mt-6 rounded-xl bg-yellow-50 p-3 text-center text-xs leading-5 text-yellow-900">Demo mode: any valid email and password with 6+ characters works until Neon authentication is connected.</p>
          <Link href="/" className="mt-5 block text-center text-sm font-semibold text-red-800 hover:underline">← Return to storefront</Link>
        </div>
      </section>
    </main>
  );
}
