"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Product = {
  id: string;
  name: string;
  category: string;
  price: number | string;
  stock: number;
};

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = String(params.id);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProduct() {
      try {
        const response = await fetch(`/api/products/${id}`);

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to load product");
        }

        const product = data as Product;

        setName(product.name);
        setCategory(product.category);
        setPrice(String(product.price));
        setStock(String(product.stock));
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load product"
        );
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setError("");

    try {
      const response = await fetch(`/api/products/${id}`, {
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
        throw new Error(data.error || "Failed to update product");
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
      setSaving(false);
    }
  }

  if (loading) {
    return <p>Loading product...</p>;
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <p className="font-semibold text-red-800">Catalogue</p>
        <h1 className="mt-1 text-3xl font-extrabold">
          Edit Product
        </h1>
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
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            className="w-full rounded-xl border px-4 py-3"
          />
        </div>

        <div>
          <label className="mb-2 block font-semibold">
            Category
          </label>

          <input
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            required
            className="w-full rounded-xl border px-4 py-3"
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
              onChange={(event) => setPrice(event.target.value)}
              required
              className="w-full rounded-xl border px-4 py-3"
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
              onChange={(event) => setStock(event.target.value)}
              required
              className="w-full rounded-xl border px-4 py-3"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-red-800 px-6 py-3 font-bold text-white disabled:opacity-50"
          >
            {saving ? "Saving..." : "Update Product"}
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
