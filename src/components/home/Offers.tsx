import { BadgePercent, Truck } from "lucide-react";

export default function Offers() {
  return (
    <section className="bg-white px-6 py-16">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-2">
        <div className="rounded-3xl bg-gradient-to-r from-yellow-400 to-yellow-200 p-8 shadow-lg">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="mb-2 font-semibold text-red-700">
                Limited-time offer
              </p>

              <h2 className="text-3xl font-extrabold text-gray-900">
                Free Delivery
              </h2>

              <p className="mt-3 max-w-md text-gray-700">
                Get free delivery on orders above ₹999 within selected areas.
              </p>

              <button
                type="button"
                className="mt-6 rounded-full bg-red-700 px-6 py-3 font-semibold text-white transition hover:bg-red-800"
              >
                Shop Now
              </button>
            </div>

            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/80 text-red-700">
              <Truck className="h-8 w-8" />
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-red-700 p-8 text-white shadow-lg">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="mb-2 font-semibold text-yellow-300">
                Wholesale savings
              </p>

              <h2 className="text-3xl font-extrabold">
                Best Price Guarantee
              </h2>

              <p className="mt-3 max-w-md text-red-100">
                Special wholesale pricing is available for bulk orders and
                business customers.
              </p>

              <button
                type="button"
                className="mt-6 rounded-full bg-yellow-400 px-6 py-3 font-semibold text-red-900 transition hover:bg-yellow-300"
              >
                Enquire Now
              </button>
            </div>

            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-yellow-300">
              <BadgePercent className="h-8 w-8" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}