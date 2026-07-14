"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function NewProductPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/products", {
        method: "POST",
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
        throw new Error(data.error || "Failed to create product");
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <p className="font-semibold text-red-800">Catalogue</p>
        <h1 className="mt-1 text-3xl font-extrabold">
          Add Product
        </h1>
        <p className="mt-2 text-stone-600">
          Create a new product for your store.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border bg-white p-6 shadow-sm"
      >
        {error && (
          <div className="rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        <div>
          <label className="mb-2 block font-semibold">
            Product Name
          </label>

          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-red-800"
            placeholder="Example: Ponni Rice"
          />
        </div>

        <div>
          <label className="mb-2 block font-semibold">
            Category
          </label>

          <input
            type="text"
            value={category}
            onChange={(event) =>
              setCategory(event.target.value)
            }
            required
            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-red-800"
            placeholder="Example: Rice"
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="mb-2 block font-semibold">
              Price
            </label>

            <input
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(event) =>
                setPrice(event.target.value)
              }
              required
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-red-800"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold">
              Stock
            </label>

            <input
              type="number"
              min="0"
              step="1"
              value={stock}
              onChange={(event) =>
                setStock(event.target.value)
              }
              required
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-red-800"
              placeholder="0"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-red-800 px-6 py-3 font-bold text-white disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Product"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/admin/products")}
            className="rounded-xl border px-6 py-3 font-bold"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
