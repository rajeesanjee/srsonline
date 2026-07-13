import Link from "next/link";
import { AlertTriangle, Boxes, IndianRupee, PackageCheck, ShoppingBag, TrendingUp } from "lucide-react";
import { adminOrders, currency } from "@/lib/admin-data";
import { products } from "@/data/products";

const cards = [
  { label: "Today's sales", value: currency.format(18475), note: "+12% from yesterday", icon: IndianRupee, color: "bg-emerald-100 text-emerald-700" },
  { label: "New orders", value: "18", note: "5 waiting to pack", icon: ShoppingBag, color: "bg-blue-100 text-blue-700" },
  { label: "Products", value: String(products.length), note: "Demo catalogue", icon: Boxes, color: "bg-violet-100 text-violet-700" },
  { label: "Low stock", value: "3", note: "Needs attention", icon: AlertTriangle, color: "bg-amber-100 text-amber-700" },
];

export default function AdminDashboardPage() {
  return <>
    <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="font-semibold text-red-800">Monday, 13 July 2026</p><h1 className="mt-1 text-3xl font-extrabold sm:text-4xl">Good afternoon, Admin</h1><p className="mt-2 text-stone-600">Here is today’s store overview.</p></div><Link href="/admin/orders" className="w-fit rounded-xl bg-red-800 px-5 py-3 font-bold text-white hover:bg-red-900">View orders</Link></header>
    <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(({ label, value, note, icon: Icon, color }) => <article key={label} className="rounded-2xl border bg-white p-5 shadow-sm"><div className="flex items-start justify-between"><div><p className="text-sm font-medium text-stone-500">{label}</p><p className="mt-2 text-3xl font-extrabold">{value}</p></div><span className={`rounded-xl p-3 ${color}`}><Icon className="h-5 w-5" /></span></div><p className="mt-4 text-sm text-stone-600">{note}</p></article>)}</section>
    <section className="mt-8 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
      <article className="overflow-hidden rounded-2xl border bg-white shadow-sm"><div className="flex items-center justify-between border-b p-5"><div><h2 className="text-xl font-bold">Recent orders</h2><p className="text-sm text-stone-500">Latest store activity</p></div><Link href="/admin/orders" className="font-semibold text-red-800">View all</Link></div><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-stone-50 text-stone-500"><tr><th className="px-5 py-3">Order</th><th className="px-5 py-3">Customer</th><th className="px-5 py-3">Total</th><th className="px-5 py-3">Status</th></tr></thead><tbody>{adminOrders.slice(0, 4).map(order => <tr key={order.id} className="border-t"><td className="px-5 py-4 font-bold">{order.id}</td><td className="px-5 py-4">{order.customer}</td><td className="px-5 py-4">{currency.format(order.total)}</td><td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${order.status === "Delivered" ? "bg-emerald-100 text-emerald-700" : order.status === "Packed" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"}`}>{order.status}</span></td></tr>)}</tbody></table></div></article>
      <article className="rounded-2xl bg-red-950 p-6 text-white shadow-sm"><div className="flex items-center gap-3"><span className="rounded-xl bg-yellow-400 p-3 text-red-950"><TrendingUp /></span><div><h2 className="text-xl font-bold">Sales snapshot</h2><p className="text-sm text-red-200">This week</p></div></div><p className="mt-8 text-4xl font-extrabold">{currency.format(92750)}</p><p className="mt-2 text-red-200">Across 86 orders</p><div className="mt-8 space-y-4"><div><div className="flex justify-between text-sm"><span>Retail sales</span><span>68%</span></div><div className="mt-2 h-2 rounded-full bg-white/15"><div className="h-2 w-[68%] rounded-full bg-yellow-400" /></div></div><div><div className="flex justify-between text-sm"><span>Wholesale sales</span><span>32%</span></div><div className="mt-2 h-2 rounded-full bg-white/15"><div className="h-2 w-[32%] rounded-full bg-red-400" /></div></div></div><Link href="/admin/products" className="mt-8 flex items-center justify-center gap-2 rounded-xl bg-white/10 px-4 py-3 font-semibold hover:bg-white/15"><PackageCheck className="h-5 w-5" /> Manage inventory</Link></article>
    </section>
  </>;
}
