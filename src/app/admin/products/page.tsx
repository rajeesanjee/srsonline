import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeleteProductButton from "@/components/admin/DeleteProductButton";
export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              Products
            </h1>

            <p className="mt-2 text-gray-600">
              Manage products for Rajalakshmi Stores.
            </p>
          </div>

          <Link
            href="/admin/products/new"
            className="rounded-xl bg-red-700 px-5 py-3 font-semibold text-white hover:bg-red-800"
          >
            Add Product
          </Link>
        </div>

        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          {products.length === 0 ? (
            <div className="p-6 text-gray-600">
              No products found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Stock</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>

                <tbody>
  {products.map((product) => (
    <tr
      key={product.id}
      className="border-t border-gray-100"
    >
      <td className="px-6 py-4 font-semibold text-gray-900">
        {product.name}
      </td>

      <td className="px-6 py-4 text-gray-600">
        {product.category}
      </td>

      <td className="px-6 py-4 text-gray-600">
        ₹{product.price.toString()}
      </td>

      <td className="px-6 py-4 text-gray-600">
        {product.stock}
      </td>

      <td className="px-6 py-4">
        <DeleteProductButton
          productId={product.id}
          productName={product.name}
        />
      </td>
    </tr>
  ))}
</tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}