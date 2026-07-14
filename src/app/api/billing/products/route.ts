import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const query = url.searchParams.get("q")?.trim() || "";

    if (!query) {
      return NextResponse.json([]);
    }

    const exactProduct = await prisma.product.findFirst({
      where: {
        OR: [
          {
            productCode: query,
          },
          {
            barcode: query,
          },
        ],
      },
    });

    if (exactProduct) {
      return NextResponse.json([exactProduct]);
    }

    const products = await prisma.product.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            nameTamil: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            productCode: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            barcode: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
      },
      orderBy: {
        name: "asc",
      },
      take: 20,
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("BILLING PRODUCT SEARCH ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to search products",
      },
      {
        status: 500,
      }
    );
  }
}