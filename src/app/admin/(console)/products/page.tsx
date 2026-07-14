import DeleteProductButton from "@/components/admin-delete-product-button";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { currency } from "@/lib/admin-data";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <>
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="font-semibold text-red-800">Catalogue</p>
          <h1 className="mt-1 text-3xl font-extrabold">Products</h1>
          <p className="mt-2 text-stone-600">
            Review products, pricing and stock status.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="flex w-fit items-center gap-2 rounded-xl bg-red-800 px-5 py-3 font-bold text-white"
        >
          <Plus className="h-5 w-5" />
          Add product
        </Link>
      </header>

      <section className="mt-8 overflow-hidden rounded-2xl border bg-white shadow-sm">
        <div className="border-b p-4">
          <label className="flex max-w-md items-center gap-3 rounded-xl border bg-stone-50 px-4 py-2.5">
            <Search className="h-5 w-5 text-stone-400" />
            <input
              aria-label="Search products"
              placeholder="Search products…"
              className="w-full bg-transparent outline-none"
            />
          </label>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-50 text-stone-500">
              <tr>
                <th className="px-5 py-3">Product</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Price</th>
                <th className="px-5 py-3">Stock</th>
                <th className="px-5 py-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-10 text-center text-stone-500"
                  >
                    No products found.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="border-t">
                    <td className="px-5 py-4 font-bold">
                      {product.name}
                    </td>

                    <td className="px-5 py-4 text-stone-600">
                      {product.category}
                    </td>

                    <td className="px-5 py-4">
                      {currency.format(Number(product.price))}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                          product.stock <= 10
                            ? "bg-amber-100 text-amber-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {product.stock <= 10
                          ? `Low · ${product.stock}`
                          : `In stock · ${product.stock}`}
                      </span>
                    </td>

    <td className="px-5 py-4">
  <div className="flex items-center gap-4">
    <Link
      href={`/admin/products/${product.id}/edit`}
      className="font-bold text-red-800 hover:underline"
    >
      Edit
    </Link>

    <DeleteProductButton
      productId={product.id}
      productName={product.name}
    />
  </div>
</td>
                      </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
