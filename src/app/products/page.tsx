import Link from "next/link";
import AddToCartButton from "@/components/cart/AddToCartButton";
import { products } from "@/data/products";
export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Our Products</h1>
          <p className="mt-2 text-gray-600">
            Shop quality groceries and provisions at affordable prices.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="overflow-hidden rounded-xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="aspect-square overflow-hidden bg-gray-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover transition duration-300 hover:scale-105"
                />
              </div>

              <div className="p-4">
                <p className="text-sm text-gray-500">{product.category}</p>

                <h2 className="mt-1 line-clamp-2 min-h-12 font-semibold text-gray-900">
                  {product.name}
                </h2>

                <div className="mt-3 flex items-center gap-2">
                  <span className="text-lg font-bold text-green-700">
                    ₹{product.price}
                  </span>

                  {product.originalPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      ₹{product.originalPrice}
                    </span>
                  )}
                </div>

                <Link
                  href={`/products/${product.id}`}
                  className="mt-4 block rounded-lg bg-yellow-500 px-4 py-2 text-center font-semibold text-gray-900 transition hover:bg-yellow-400"
                >
                  View Product
                </Link>
                <AddToCartButton
  productId={product.id}
  productName={product.name}
/>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}