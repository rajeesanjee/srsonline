import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-red-900 px-6 py-14 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <h2 className="text-2xl font-extrabold">Rajalakshmi Stores</h2>
          <p className="mt-2 text-sm text-red-100">
            Wholesale & Retail Provisions
          </p>

          <p className="mt-4 max-w-sm text-sm leading-6 text-red-100">
            Your trusted destination for quality grocery products, wholesale
            prices, and dependable customer service.
          </p>
<div className="mt-5 flex gap-3">
  <button
    type="button"
    className="rounded-full bg-white/10 px-4 py-2 transition hover:bg-white/20"
  >
    Facebook
  </button>

  <button
    type="button"
    className="rounded-full bg-white/10 px-4 py-2 transition hover:bg-white/20"
  >
    Instagram
  </button>
</div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-yellow-300">Quick Links</h3>

          <nav className="mt-4 flex flex-col gap-3 text-sm text-red-100">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <Link href="/products" className="hover:text-white">
              Products
            </Link>
            <Link href="/categories" className="hover:text-white">
              Categories
            </Link>
            <Link href="/offers" className="hover:text-white">
              Offers
            </Link>
            <Link href="/contact" className="hover:text-white">
              Contact Us
            </Link>
          </nav>
        </div>

        <div>
          <h3 className="text-lg font-bold text-yellow-300">
            Customer Service
          </h3>

          <nav className="mt-4 flex flex-col gap-3 text-sm text-red-100">
            <Link href="/orders" className="hover:text-white">
              My Orders
            </Link>
            <Link href="/shipping-policy" className="hover:text-white">
              Shipping Policy
            </Link>
            <Link href="/returns" className="hover:text-white">
              Returns & Refunds
            </Link>
            <Link href="/privacy" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms & Conditions
            </Link>
          </nav>
        </div>

        <div>
          <h3 className="text-lg font-bold text-yellow-300">Contact Us</h3>

          <div className="mt-4 space-y-4 text-sm text-red-100">
            <div className="flex gap-3">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-yellow-300" />
              <p>
                39, Saidapet Road,
                <br />
                Vadapalani, Chennai - 600026
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 shrink-0 text-yellow-300" />
              <div>
                <a href="tel:+917358653901" className="hover:text-white">
                  +91 73586 53901
                </a>
                <br />
                <a href="tel:+918925112312" className="hover:text-white">
                  +91 89251 12312
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 shrink-0 text-yellow-300" />
              <a
                href="mailto:support@rajalakshmistores.in"
                className="break-all hover:text-white"
              >
                support@rajalakshmistores.in
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-7xl flex-col gap-3 border-t border-white/15 pt-6 text-sm text-red-200 md:flex-row md:items-center md:justify-between">
        <p>
          © {new Date().getFullYear()} Rajalakshmi Stores. All rights reserved.
        </p>

        <p>GST: 33BXVPR5775C1ZW · FSSAI: 12423002001925</p>
      </div>
    </footer>
  );
}