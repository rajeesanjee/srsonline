import { prisma } from "../src/lib/prisma";
import { transliterateTamil } from "../src/lib/tamil-transliterate";

async function main() {
  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: "asc",
    },
  });

  const existingNumericCodes = products
    .map((product) => Number(product.productCode))
    .filter(
      (code) =>
        Number.isInteger(code) &&
        Number.isFinite(code)
    );

  let nextProductCode =
    existingNumericCodes.length > 0
      ? Math.max(...existingNumericCodes) + 1
      : 1001;

  let updatedCount = 0;

  for (const product of products) {
    const updateData: {
      productCode?: string;
      nameTamil?: string;
    } = {};

    if (!product.productCode) {
      updateData.productCode =
        String(nextProductCode);

      nextProductCode += 1;
    }

    if (!product.nameTamil?.trim()) {
      const tamilName = transliterateTamil(
        product.name
      ).trim();

      if (tamilName) {
        updateData.nameTamil = tamilName;
      }
    }

    if (Object.keys(updateData).length === 0) {
      console.log(
        `SKIP: ${product.name} already complete`
      );

      continue;
    }

    await prisma.product.update({
      where: {
        id: product.id,
      },
      data: updateData,
    });

    updatedCount += 1;

    console.log(
      `UPDATED: ${product.name}`,
      updateData
    );
  }

  console.log("");
  console.log(
    `Product backfill completed. ${updatedCount} product(s) updated.`
  );
}

main()
  .catch((error) => {
    console.error("PRODUCT BACKFILL ERROR:", error);

    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });