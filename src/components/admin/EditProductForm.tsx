"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
};

type EditProductFormProps = {
  product: Product;
};

export default function EditProductForm({
  product,
}: EditProductFormProps) {
  const router = useRouter();

  const [name, setName] = useState(product.name);
  const [category, setCategory] = useState(product.category);
  const [price, setPrice] = useState(String(product.price));
  const [stock, setStock] = useState(String(product.stock));

  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setIsSaving(true);

    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          category,
          price: Number(price),
          stock: Number(stock),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to update product");
        return;
      }

      router.push("/admin/products");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl bg-white p-6 shadow-sm"
    >
      {error && (
        <div className="rounded-xl bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      <div>
        <label className="mb-2 block font-semibold text-gray-700">
          Product Name
        </label>

        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-red-600"
        />
      </div>

      <div>
        <label className="mb-2 block font-semibold text-gray-700">
          Category
        </label>

        <input
          type="text"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          required
          className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-red-600"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="mb-2 block font-semibold text-gray-700">
            Price
          </label>

          <input
            type="number"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            min="0"
            step="0.01"
            required
            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-red-600"
          />
        </div>

        <div>
          <label className="mb-2 block font-semibold text-gray-700">
            Stock
          </label>

          <input
            type="number"
            value={stock}
            onChange={(event) => setStock(event.target.value)}
            min="0"
            step="1"
            required
            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-red-600"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          disabled={isSaving}
          className="flex-1 rounded-xl bg-red-700 px-5 py-3 font-semibold text-white hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? "Saving..." : "Update Product"}
        </button>

        <Link
          href="/admin/products"
          className="rounded-xl border border-gray-300 px-5 py-3 text-center font-semibold text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}