import Link from "next/link";
import {
  Boxes,
  Package,
  ShoppingCart,
  Truck,
  Users,
} from "lucide-react";

const stats = [
  {
    label: "Products",
    value: "3,511",
    icon: Package,
  },
  {
    label: "Customers",
    value: "949",
    icon: Users,
  },
  {
    label: "Suppliers",
    value: "388",
    icon: Truck,
  },
  {
    label: "Orders",
    value: "0",
    icon: ShoppingCart,
  },
];

export default function AdminDashboardPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b bg-white px-6 py-5">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">
              Rajalakshmi Stores Admin
            </h1>
            <p className="text-sm text-gray-600">
              Business management dashboard
            </p>
          </div>

          <div className="flex items-center gap-3">
  <Link
    href="/"
    className="rounded-xl border border-red-700 px-4 py-2 font-semibold text-red-700 hover:bg-red-50"
  >
    View Store
  </Link>
</div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <p className="font-semibold text-red-700">Welcome back</p>

          <h2 className="mt-2 text-4xl font-extrabold text-gray-900">
            Admin Dashboard
          </h2>

          <p className="mt-3 text-gray-600">
            Manage your products, customers, suppliers, orders, and inventory.
          </p>
        </div>

        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <article
                key={stat.label}
                className="rounded-2xl bg-white p-6 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-500">
                      {stat.label}
                    </p>

                    <p className="mt-2 text-3xl font-extrabold text-gray-900">
                      {stat.value}
                    </p>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-100 text-red-700">
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-3">
          <Link
            href="/admin/products"
            className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <Package className="h-8 w-8 text-red-700" />

            <h3 className="mt-4 text-xl font-bold text-gray-900">
              Manage Products
            </h3>

            <p className="mt-2 text-gray-600">
              Add, edit, import, and manage your product catalogue.
            </p>
          </Link>

          <Link
            href="/admin/inventory"
            className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <Boxes className="h-8 w-8 text-red-700" />

            <h3 className="mt-4 text-xl font-bold text-gray-900">
              Inventory
            </h3>

            <p className="mt-2 text-gray-600">
              Monitor stock levels and reorder requirements.
            </p>
          </Link>

          <Link
            href="/admin/orders"
            className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <ShoppingCart className="h-8 w-8 text-red-700" />

            <h3 className="mt-4 text-xl font-bold text-gray-900">
              Orders
            </h3>

            <p className="mt-2 text-gray-600">
              Review and process customer orders.
            </p>
          </Link>
        </section>
      </div>
    </main>
  );
}