export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-yellow-300 to-yellow-100">
      <div className="mx-auto flex max-w-7xl flex-col items-center px-6 py-20 text-center">
        <h1 className="mb-6 text-5xl font-extrabold text-red-700">
          Welcome to Rajalakshmi Stores
        </h1>

        <p className="mb-8 max-w-2xl text-lg text-gray-700">
          Your trusted destination for wholesale and retail provisions.
          Shop from thousands of quality products at the best prices.
        </p>

        <div className="flex gap-4">
          <button className="rounded-full bg-red-700 px-8 py-3 font-semibold text-white hover:bg-red-800">
            Shop Now
          </button>

          <button className="rounded-full border-2 border-red-700 px-8 py-3 font-semibold text-red-700 hover:bg-red-700 hover:text-white">
            View Offers
          </button>
        </div>
      </div>
    </section>
  );
}