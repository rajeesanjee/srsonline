"use client";

import { useState } from "react";
import { adminOrders, currency, type AdminOrder } from "@/lib/admin-data";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState(adminOrders);
  function update(id: string, status: AdminOrder["status"]) { setOrders(current => current.map(order => order.id === id ? { ...order, status } : order)); }
  return <><header><p className="font-semibold text-red-800">Fulfilment</p><h1 className="mt-1 text-3xl font-extrabold">Orders</h1><p className="mt-2 text-stone-600">Track and update customer orders.</p></header><section className="mt-8 overflow-hidden rounded-2xl border bg-white shadow-sm"><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-stone-50 text-stone-500"><tr><th className="px-5 py-3">Order</th><th className="px-5 py-3">Customer</th><th className="px-5 py-3">Date</th><th className="px-5 py-3">Total</th><th className="px-5 py-3">Status</th></tr></thead><tbody>{orders.map(order => <tr key={order.id} className="border-t"><td className="px-5 py-4 font-bold">{order.id}</td><td className="px-5 py-4">{order.customer}</td><td className="px-5 py-4 text-stone-600">{order.date}</td><td className="px-5 py-4 font-semibold">{currency.format(order.total)}</td><td className="px-5 py-4"><select value={order.status} onChange={event => update(order.id, event.target.value as AdminOrder["status"])} className="rounded-lg border bg-white px-3 py-2 font-semibold"><option>Pending</option><option>Packed</option><option>Delivered</option></select></td></tr>)}</tbody></table></div></section></>;
}
