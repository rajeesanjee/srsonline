import { BadgeCheck, Headphones, PackageCheck, Truck } from "lucide-react";

const benefits = [
  {
    title: "Wholesale Prices",
    description: "Competitive pricing for retail and bulk orders.",
    icon: BadgeCheck,
  },
  {
    title: "Quality Products",
    description: "Trusted grocery essentials from reliable brands.",
    icon: PackageCheck,
  },
  {
    title: "Fast Delivery",
    description: "Quick local delivery for eligible orders.",
    icon: Truck,
  },
  {
    title: "Customer Support",
    description: "Friendly assistance before and after every order.",
    icon: Headphones,
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-yellow-50 px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <p className="mb-2 font-semibold text-red-700">
            Trusted by local customers
          </p>

          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
            Why Choose Rajalakshmi Stores?
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-gray-600">
            We combine quality, fair pricing, dependable service, and a wide
            product range for both retail and wholesale customers.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <article
                key={benefit.title}
                className="rounded-2xl bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-700 text-white">
                  <Icon className="h-7 w-7" />
                </div>

                <h3 className="text-lg font-bold text-gray-900">
                  {benefit.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {benefit.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}