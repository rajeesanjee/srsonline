import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditProductForm from "@/components/admin/EditProductForm";

type EditProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: {
      id,
    },
  });

  if (!product) {
    notFound();
  }

  return (
    <main className="p-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Edit Product
          </h1>

          <p className="mt-2 text-gray-600">
            Update the product details below.
          </p>
        </div>

        <EditProductForm
          product={{
            id: product.id,
            name: product.name,
            category: product.category,
            price: Number(product.price),
            stock: product.stock,
          }}
        />
      </div>
    </main>
  );
}