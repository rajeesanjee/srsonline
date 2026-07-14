import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);

    const query =
      url.searchParams.get("q")?.trim() || "";

    if (!query) {
      return NextResponse.json([]);
    }

    const customers = await prisma.customer.findMany({
      where: {
        isActive: true,
        OR: [
          {
            customerCode: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            name: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            phone: {
              contains: query,
            },
          },
        ],
      },
      orderBy: {
        name: "asc",
      },
      take: 20,
    });

    return NextResponse.json(customers);
  } catch (error) {
    console.error(
      "BILLING CUSTOMER SEARCH ERROR:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to search customers",
      },
      {
        status: 500,
      }
    );
  }
}