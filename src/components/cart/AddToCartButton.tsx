"use client";

type CartItem = {
  productId: string;
  productName: string;
  quantity: number;
};

type AddToCartButtonProps = {
  productId: string;
  productName: string;
};

export default function AddToCartButton({
  productId,
  productName,
}: AddToCartButtonProps) {
  function handleAddToCart() {
    const savedCart = localStorage.getItem("cart");

    const cart: CartItem[] = savedCart ? JSON.parse(savedCart) : [];

    const existingItem = cart.find(
      (item) => item.productId === productId
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        productId,
        productName,
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    alert(`${productName} added to cart`);
  }

  return (
    <button
      type="button"
      onClick={handleAddToCart}
      className="mt-2 w-full rounded-lg bg-green-700 px-4 py-2 font-semibold text-white transition hover:bg-green-800"
    >
      Add to Cart
    </button>
  );
}