import DeleteProductButton from "@/components/admin-delete-product-button";
import Link from "next/link";
import { Plus, Search } from "lucide-react";

import { currency } from "@/lib/admin-data";
import { prisma } from "@/lib/prisma";

type AdminProductsPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export default async function AdminProductsPage({
  searchParams,
}: AdminProductsPageProps) {
  const params = await searchParams;
  const query = params.q?.trim() || "";

  const products = await prisma.product.findMany({
    where: query
      ? {
          OR: [
            {
              name: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              nameTamil: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              productCode: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              barcode: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              category: {
                contains: query,
                mode: "insensitive",
              },
            },
          ],
        }
      : undefined,
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <>
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="font-semibold text-red-800">
            Catalogue
          </p>

          <h1 className="mt-1 text-3xl font-extrabold">
            Products
          </h1>

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
          <form
            method="GET"
            className="flex max-w-2xl gap-2"
          >
            <label className="flex flex-1 items-center gap-3 rounded-xl border bg-stone-50 px-4 py-2.5">
              <Search className="h-5 w-5 text-stone-400" />

              <input
                name="q"
                defaultValue={query}
                placeholder="Search English, Tamil, code or barcode..."
                className="w-full bg-transparent outline-none"
              />
            </label>

            <button
              type="submit"
              className="rounded-xl bg-red-800 px-4 font-bold text-white"
            >
              Search
            </button>
          </form>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-50 text-stone-500">
              <tr>
                <th className="px-5 py-3">Code</th>
                <th className="px-5 py-3">Product</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Retail Price</th>
                <th className="px-5 py-3">Stock</th>
                <th className="px-5 py-3">Counter</th>
                <th className="px-5 py-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => {
                const stock = Number(product.stock);

                return (
                  <tr
                    key={product.id}
                    className="border-t"
                  >
                    <td className="px-5 py-4">
                      {product.productCode || "-"}
                    </td>

                    <td className="px-5 py-4">
                      <div className="font-bold">
                        {product.name}
                      </div>

                      {product.nameTamil && (
                        <div
                          lang="ta"
                          className="mt-1 text-stone-600"
                        >
                          {product.nameTamil}
                        </div>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      {product.category}
                    </td>

                    <td className="px-5 py-4">
                      {currency.format(
                        Number(product.retailPrice)
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                          stock <= 10
                            ? "bg-amber-100 text-amber-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {stock <= 10
                          ? `Low · ${stock}`
                          : `In stock · ${stock}`}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      {product.counter}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex gap-4">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="font-bold text-red-800"
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
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}