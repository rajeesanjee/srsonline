"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { products } from "@/data/products";

type SavedCartItem = {
  productId: string;
  productName: string;
  quantity: number;
};

export default function CheckoutPage() {
  const [cart, setCart] = useState<SavedCartItem[]>([]);
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");

    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const cartItems = cart
    .map((cartItem) => {
      const product = products.find(
        (item) => item.id === cartItem.productId
      );

      if (!product) {
        return null;
      }

      return {
        ...cartItem,
        product,
        subtotal: product.price * cartItem.quantity,
      };
    })
    .filter(
      (
        item
      ): item is NonNullable<typeof item> => item !== null
    );

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.subtotal,
    0
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    localStorage.removeItem("cart");
    setCart([]);
    setOrderPlaced(true);
  }

  if (orderPlaced) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-12">
        <div className="mx-auto max-w-xl rounded-2xl bg-white p-8 text-center shadow-sm">
          <div className="mb-4 text-6xl">✅</div>

          <h1 className="text-3xl font-bold text-gray-900">
            Order Placed Successfully
          </h1>

          <p className="mt-3 text-gray-600">
            Thank you for shopping with S. Rajalakshmi Stores.
          </p>

          <Link
            href="/products"
            className="mt-6 inline-block rounded-lg bg-green-700 px-6 py-3 font-semibold text-white transition hover:bg-green-800"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Checkout
          </h1>

          <p className="mt-2 text-gray-600">
            Enter your delivery details and review your order.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid gap-6 lg:grid-cols-[1fr_360px]"
        >
          <section className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">
              Delivery Information
            </h2>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label
                  htmlFor="name"
                  className="mb-2 block font-medium text-gray-700"
                >
                  Full Name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="Enter your full name"
                  className="w-full rounded-lg border px-4 py-3 outline-none transition focus:border-green-700"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block font-medium text-gray-700"
                >
                  Phone Number
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  pattern="[0-9]{10}"
                  placeholder="10-digit phone number"
                  className="w-full rounded-lg border px-4 py-3 outline-none transition focus:border-green-700"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block font-medium text-gray-700"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Optional"
                  className="w-full rounded-lg border px-4 py-3 outline-none transition focus:border-green-700"
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="address"
                  className="mb-2 block font-medium text-gray-700"
                >
                  Delivery Address
                </label>

                <textarea
                  id="address"
                  name="address"
                  required
                  rows={4}
                  placeholder="House number, street, area and landmark"
                  className="w-full resize-none rounded-lg border px-4 py-3 outline-none transition focus:border-green-700"
                />
              </div>

              <div>
                <label
                  htmlFor="city"
                  className="mb-2 block font-medium text-gray-700"
                >
                  City
                </label>

                <input
                  id="city"
                  name="city"
                  type="text"
                  required
                  defaultValue="Chennai"
                  className="w-full rounded-lg border px-4 py-3 outline-none transition focus:border-green-700"
                />
              </div>

              <div>
                <label
                  htmlFor="pincode"
                  className="mb-2 block font-medium text-gray-700"
                >
                  PIN Code
                </label>

                <input
                  id="pincode"
                  name="pincode"
                  type="text"
                  required
                  pattern="[0-9]{6}"
                  placeholder="6-digit PIN code"
                  className="w-full rounded-lg border px-4 py-3 outline-none transition focus:border-green-700"
                />
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-bold text-gray-900">
                Payment Method
              </h2>

              <label className="mt-4 flex cursor-pointer items-center gap-3 rounded-lg border p-4">
                <input
                  type="radio"
                  name="payment"
                  value="cash-on-delivery"
                  defaultChecked
                />

                <div>
                  <p className="font-semibold text-gray-900">
                    Cash on Delivery
                  </p>

                  <p className="text-sm text-gray-600">
                    Pay when your order is delivered.
                  </p>
                </div>
              </label>
            </div>
          </section>

          <aside className="h-fit rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">
              Order Summary
            </h2>

            {cartItems.length === 0 ? (
              <div className="mt-5">
                <p className="text-gray-600">Your cart is empty.</p>

                <Link
                  href="/products"
                  className="mt-4 inline-block font-semibold text-green-700 hover:underline"
                >
                  Return to products
                </Link>
              </div>
            ) : (
              <>
                <div className="mt-5 space-y-4">
                  {cartItems.map(({ product, quantity, subtotal }) => (
                    <div
                      key={product.id}
                      className="flex justify-between gap-4 border-b pb-4"
                    >
                      <div>
                        <p className="font-semibold text-gray-900">
                          {product.name}
                        </p>

                        <p className="text-sm text-gray-500">
                          Quantity: {quantity}
                        </p>
                      </div>

                      <p className="font-semibold text-gray-900">
                        ₹{subtotal}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{cartTotal}</span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Delivery</span>
                    <span className="font-semibold text-green-700">
                      Free
                    </span>
                  </div>
                </div>

                <div className="mt-5 flex justify-between border-t pt-5 text-xl font-bold">
                  <span>Total</span>
                  <span>₹{cartTotal}</span>
                </div>

                <button
                  type="submit"
                  className="mt-6 w-full rounded-lg bg-green-700 px-4 py-3 font-semibold text-white transition hover:bg-green-800"
                >
                  Place Order
                </button>
              </>
            )}
          </aside>
        </form>
      </div>
    </main>
  );
}