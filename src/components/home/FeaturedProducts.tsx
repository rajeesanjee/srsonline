import { ShoppingCart } from "lucide-react";

const products = [
  {
    name: "Ponni Rice 25kg",
    category: "Rice",
    price: 1450,
    oldPrice: 1600,
  },
  {
    name: "Urad Dal 1kg",
    category: "Dals & Pulses",
    price: 165,
    oldPrice: 185,
  },
  {
    name: "Sunflower Oil 1L",
    category: "Cooking Oils",
    price: 155,
    oldPrice: 170,
  },
  {
    name: "Chilli Powder 500g",
    category: "Spices & Masala",
    price: 145,
    oldPrice: 160,
  },
];

export default function FeaturedProducts() {
  return (
    <section className="bg-yellow-50 px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="mb-2 font-semibold text-red-700">
              Popular choices
            </p>

            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
              Featured Products
            </h2>

            <p className="mt-3 max-w-2xl text-gray-600">
              Start with these sample products. Later, we will connect this
              section to your real product database.
            </p>
          </div>

          <button
            type="button"
            className="w-fit rounded-full border border-red-700 px-5 py-2 font-semibold text-red-700 transition hover:bg-red-700 hover:text-white"
          >
            View All Products
          </button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => {
            const discount = Math.round(
              ((product.oldPrice - product.price) / product.oldPrice) * 100
            );

            return (
              <article
                key={product.name}
                className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex h-48 items-center justify-center bg-gradient-to-br from-yellow-200 to-yellow-50">
                  <span className="text-center text-5xl">🛒</span>
                </div>

                <div className="p-5">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800">
                      {product.category}
                    </span>

                    <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
                      {discount}% OFF
                    </span>
                  </div>

                  <h3 className="min-h-14 text-lg font-bold text-gray-900">
                    {product.name}
                  </h3>

                  <div className="mt-4 flex items-end gap-2">
                    <span className="text-2xl font-extrabold text-red-700">
                      ₹{product.price}
                    </span>

                    <span className="pb-1 text-sm text-gray-500 line-through">
                      ₹{product.oldPrice}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-red-700 px-4 py-3 font-semibold text-white transition hover:bg-red-800"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    Add to Cart
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}