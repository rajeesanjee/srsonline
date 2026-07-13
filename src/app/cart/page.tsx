"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { products } from "@/data/products";

type SavedCartItem = {
  productId: string;
  productName: string;
  quantity: number;
};

export default function CartPage() {
  const [cart, setCart] = useState<SavedCartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart");

      if (savedCart) {
        queueMicrotask(() => setCart(JSON.parse(savedCart)));
      }
    } catch (error) {
      console.error("Unable to load cart:", error);
      localStorage.removeItem("cart");
    } finally {
      queueMicrotask(() => setLoaded(true));
    }
  }, []);

  function saveCart(updatedCart: SavedCartItem[]) {
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  }

  function increaseQuantity(productId: string) {
    const updatedCart = cart.map((item) =>
      item.productId === productId
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );

    saveCart(updatedCart);
  }

  function decreaseQuantity(productId: string) {
    const updatedCart = cart
      .map((item) =>
        item.productId === productId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter((item) => item.quantity > 0);

    saveCart(updatedCart);
  }

  function removeItem(productId: string) {
    const updatedCart = cart.filter(
      (item) => item.productId !== productId
    );

    saveCart(updatedCart);
  }

  const cartItems = cart
    .map((cartItem) => {
      const product = products.find(
        (product) => product.id === cartItem.productId
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

  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.subtotal,
    0
  );

  if (!loaded) {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <p className="text-center text-gray-600">Loading cart...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Shopping Cart
            </h1>

            <p className="mt-1 text-gray-600">
              {totalItems} item{totalItems !== 1 ? "s" : ""} in your cart
            </p>
          </div>

          <Link
            href="/products"
            className="rounded-lg bg-yellow-500 px-4 py-2 font-semibold text-gray-900 transition hover:bg-yellow-400"
          >
            Continue Shopping
          </Link>
        </div>

        {cartItems.length === 0 ? (
          <div className="rounded-xl bg-white p-10 text-center shadow-sm">
            <div className="mb-4 text-5xl">🛒</div>

            <h2 className="text-2xl font-bold text-gray-900">
              Your cart is empty
            </h2>

            <p className="mt-2 text-gray-600">
              Add products to your cart to continue shopping.
            </p>

            <Link
              href="/products"
              className="mt-6 inline-block rounded-lg bg-green-700 px-6 py-3 font-semibold text-white transition hover:bg-green-800"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="space-y-4">
              {cartItems.map(({ product, quantity, subtotal }) => (
                <div
                  key={product.id}
                  className="rounded-xl border bg-white p-4 shadow-sm"
                >
                  <div className="flex gap-4">
                    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <p className="text-sm text-gray-500">
                          {product.category}
                        </p>

                        <h2 className="font-semibold text-gray-900">
                          {product.name}
                        </h2>

                        <p className="mt-1 font-bold text-green-700">
                          ₹{product.price}
                        </p>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center rounded-lg border">
                          <button
                            type="button"
                            onClick={() =>
                              decreaseQuantity(product.id)
                            }
                            className="px-4 py-2 text-lg font-bold hover:bg-gray-100"
                            aria-label={`Decrease ${product.name} quantity`}
                          >
                            −
                          </button>

                          <span className="min-w-10 px-3 text-center font-semibold">
                            {quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              increaseQuantity(product.id)
                            }
                            className="px-4 py-2 text-lg font-bold hover:bg-gray-100"
                            aria-label={`Increase ${product.name} quantity`}
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(product.id)}
                          className="font-semibold text-red-600 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    <div className="hidden text-right sm:block">
                      <p className="text-sm text-gray-500">Subtotal</p>
                      <p className="text-lg font-bold text-gray-900">
                        ₹{subtotal}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-between border-t pt-3 sm:hidden">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-bold">₹{subtotal}</span>
                  </div>
                </div>
              ))}
            </div>

            <aside className="h-fit rounded-xl border bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900">
                Order Summary
              </h2>

              <div className="mt-5 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Total items</span>
                  <span>{totalItems}</span>
                </div>

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

              <Link
                href="/checkout"
                className="mt-6 block w-full rounded-lg bg-green-700 px-4 py-3 text-center font-semibold text-white transition hover:bg-green-800"
              >
                Proceed to Checkout
              </Link>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
