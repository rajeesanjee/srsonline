import Link from "next/link";
import {
  BarChart3,
  Boxes,
  Calculator,
  Home,
  Package,
  ShoppingCart,
  Truck,
  Users,
} from "lucide-react";

const menuItems = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: Home,
  },
  {
    label: "Billing",
    href: "/admin/billing",
    icon: Calculator,
  },
  {
    label: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    label: "Inventory",
    href: "/admin/inventory",
    icon: Boxes,
  },
  {
    label: "Customers",
    href: "/admin/customers",
    icon: Users,
  },
  {
    label: "Suppliers",
    href: "/admin/suppliers",
    icon: Truck,
  },
  {
    label: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    label: "Reports",
    href: "/admin/reports",
    icon: BarChart3,
  },
];

export default function AdminSidebar() {
  return (
    <aside className="min-h-screen w-64 bg-red-900 px-4 py-6 text-white">
      <div className="mb-8 px-3">
        <h2 className="text-2xl font-extrabold">
          Rajalakshmi Stores
        </h2>

        <p className="mt-1 text-sm text-red-200">
          Admin Portal
        </p>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-red-100 transition hover:bg-red-800 hover:text-white"
            >
              <Icon className="h-5 w-5" />

              <span className="font-semibold">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}