import Link from "next/link";
import { Search, ShoppingCart, User } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-yellow-400 shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <div>
          <Link href="/">
            <h1 className="cursor-pointer text-3xl font-extrabold text-red-700">
              Rajalakshmi Stores
            </h1>
          </Link>
          <p className="text-sm text-gray-700">
            Wholesale & Retail Provisions
          </p>
        </div>

        {/* Search */}
        <div className="hidden w-1/3 items-center rounded-full bg-white px-4 py-2 md:flex">
          <Search className="mr-2 h-5 w-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search 3500+ products..."
            className="w-full bg-transparent outline-none"
          />
        </div>

        {/* Navigation */}
        <nav className="hidden gap-6 font-medium lg:flex">
          <Link href="/">Home</Link>
          <Link href="/products">Products</Link>
          <Link href="/categories">Categories</Link>
          <Link href="/contact">Contact</Link>
        </nav>

        {/* Icons */}
        <div className="flex items-center gap-5">
          <User className="cursor-pointer hover:text-red-700" />
          <ShoppingCart className="cursor-pointer hover:text-red-700" />
        </div>
      </div>
    </header>
  );
}