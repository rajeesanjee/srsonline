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

type ProductContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  request: Request,
  context: ProductContext
) {
  try {
    const { id } = await context.params;

    const product = await prisma.product.findUnique({
      where: {
        id,
      },
    });

    if (!product) {
      return NextResponse.json(
        {
          error: "Product not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("GET PRODUCT ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch product",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PUT(
  request: Request,
  context: ProductContext
) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const name = String(body.name || "").trim();

    const nameTamil =
      String(body.nameTamil || "").trim() || null;

    const barcode =
      String(body.barcode || "").trim() || null;

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

    const product = await prisma.product.update({
      where: {
        id,
      },
      data: {
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

    return NextResponse.json(product);
  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to update product",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  request: Request,
  context: ProductContext
) {
  try {
    const { id } = await context.params;

    await prisma.product.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to delete product",
      },
      {
        status: 500,
      }
    );
  }
}