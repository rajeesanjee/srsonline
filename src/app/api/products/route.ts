import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

function optionalNumber(value: unknown) {
  if (
    value === "" ||
    value === null ||
    value === undefined
  ) {
    return null;
  }

  const number = Number(value);

  return Number.isFinite(number) ? number : null;
}

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch products",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    let productCode =
      String(body.productCode || "").trim() || null;

    if (!productCode) {
      const products = await prisma.product.findMany({
        where: {
          productCode: {
            not: null,
          },
        },
        select: {
          productCode: true,
        },
      });

      const highestCode = products.reduce(
        (highest, product) => {
          const code = Number(product.productCode);

          if (
            Number.isInteger(code) &&
            code > highest
          ) {
            return code;
          }

          return highest;
        },
        1000
      );

      productCode = String(highestCode + 1);
    }

    const barcode =
      String(body.barcode || "").trim() || null;

    const name = String(body.name || "").trim();

    const nameTamil =
      String(body.nameTamil || "").trim() || null;

    const category = String(
      body.category || ""
    ).trim();

    const unit =
      String(body.unit || "PCS").trim() || "PCS";

    const purchasePrice = Number(
      body.purchasePrice || 0
    );

    const mrp = Number(body.mrp || 0);

    const wholesalePrice = optionalNumber(
      body.wholesalePrice
    );

    const retailPrice = Number(
      body.retailPrice || 0
    );

    const cardPrice = optionalNumber(body.cardPrice);

    const wholesaleProfitPercent = optionalNumber(
      body.wholesaleProfitPercent
    );

    const retailProfitPercent = optionalNumber(
      body.retailProfitPercent
    );

    const cardProfitPercent = optionalNumber(
      body.cardProfitPercent
    );

    const gstRate = Number(body.gstRate || 0);

    const hsnCode =
      String(body.hsnCode || "").trim() || null;

    const stock = Number(body.stock || 0);

    const allowDecimal = Boolean(body.allowDecimal);

    const supplierName =
      String(body.supplierName || "").trim() || null;

    const counter = Number(body.counter || 0);

    const discountPercent = optionalNumber(
      body.discountPercent
    );

    if (!name || !category) {
      return NextResponse.json(
        {
          error:
            "Product name and category are required",
        },
        {
          status: 400,
        }
      );
    }

    const requiredNumbers = [
      purchasePrice,
      mrp,
      retailPrice,
      gstRate,
      stock,
      counter,
    ];

    if (
      requiredNumbers.some(
        (value) =>
          !Number.isFinite(value) || value < 0
      )
    ) {
      return NextResponse.json(
        {
          error: "Enter valid product values",
        },
        {
          status: 400,
        }
      );
    }

    if (![0, 1, 2, 3].includes(counter)) {
      return NextResponse.json(
        {
          error: "Select a valid counter",
        },
        {
          status: 400,
        }
      );
    }

    if (![0, 5, 18].includes(gstRate)) {
      return NextResponse.json(
        {
          error: "Select a valid GST rate",
        },
        {
          status: 400,
        }
      );
    }

    if (!allowDecimal && !Number.isInteger(stock)) {
      return NextResponse.json(
        {
          error:
            "Stock must be a whole number unless decimal quantity is enabled",
        },
        {
          status: 400,
        }
      );
    }

    const product = await prisma.product.create({
      data: {
        productCode,
        barcode,
        name,
        nameTamil,
        category,
        unit,
        purchasePrice,
        mrp,
        wholesalePrice,
        retailPrice,
        cardPrice,
        wholesaleProfitPercent,
        retailProfitPercent,
        cardProfitPercent,
        gstRate,
        hsnCode,
        stock,
        allowDecimal,
        supplierName,
        counter,
        discountPercent,
      },
    });

    return NextResponse.json(product, {
      status: 201,
    });
  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to create product",
      },
      {
        status: 500,
      }
    );
  }
}