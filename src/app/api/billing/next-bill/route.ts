import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const sales = await prisma.sale.findMany({
      select: {
        billNumber: true,
      },
    });

    const highestBillNumber = sales.reduce(
      (highest, sale) => {
        const match = sale.billNumber.match(/^SE(\d+)$/i);

        if (!match) {
          return highest;
        }

        const number = Number(match[1]);

        if (
          Number.isInteger(number) &&
          number > highest
        ) {
          return number;
        }

        return highest;
      },
      7800
    );

    return NextResponse.json({
      billNumber: `SE${highestBillNumber + 1}`,
    });
  } catch (error) {
    console.error("NEXT BILL NUMBER ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to generate bill number",
      },
      {
        status: 500,
      }
    );
  }
}