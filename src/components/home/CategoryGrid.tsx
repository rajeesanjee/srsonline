import {
  Coffee,
  Cookie,
  Droplets,
  Grid2X2,
  Package,
  Soup,
  Wheat,
} from "lucide-react";

const categories = [
  {
    name: "Rice & Flour",
    description: "Rice, wheat and flour products",
    icon: Wheat,
  },
  {
    name: "Dals & Pulses",
    description: "Quality dals and pulses",
    icon: Soup,
  },
  {
    name: "Cooking Oils",
    description: "Edible oils and ghee",
    icon: Droplets,
  },
  {
    name: "Spices & Masala",
    description: "Traditional spices and masalas",
    icon: Package,
  },
  {
    name: "Snacks",
    description: "Biscuits, chips and snacks",
    icon: Cookie,
  },
  {
    name: "Tea & Coffee",
    description: "Tea, coffee and beverages",
    icon: Coffee,
  },
  {
    name: "Household Needs",
    description: "Cleaning and daily essentials",
    icon: Grid2X2,
  },
];

export default function CategoryGrid() {
  return (
    <section className="bg-white px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <p className="mb-2 font-semibold text-red-700">
            Browse our collections
          </p>

          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
            Shop by Category
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-gray-600">
            Find quality groceries and household essentials at wholesale and
            retail prices.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <button
                key={category.name}
                type="button"
                className="group rounded-2xl border border-yellow-200 bg-yellow-50 p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-yellow-400 hover:shadow-lg"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-700 text-white transition group-hover:bg-red-800">
                  <Icon className="h-7 w-7" />
                </div>

                <h3 className="text-lg font-bold text-gray-900">
                  {category.name}
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {category.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}