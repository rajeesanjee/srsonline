import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

import PrintBillClient from "./print-bill-client";

export default async function PrintBillPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;

  const sale = await prisma.sale.findUnique({
    where: {
      id,
    },

    include: {
      items: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!sale) {
    notFound();
  }

  return (
    <PrintBillClient
      sale={{
        id: sale.id,

        billNumber: sale.billNumber,

        billDate:
          sale.billDate.toISOString(),

        customerCode:
          sale.customerCode,

        customerName:
          sale.customerName,

        previousBalance:
          Number(sale.previousBalance),

        receivedAmount:
          Number(sale.receivedAmount),

        closingBalance:
          Number(sale.closingBalance),

        priceMode:
          sale.priceMode,

        paymentType:
          sale.paymentType,

        cashAmount:
          Number(sale.cashAmount),

        cardAmount:
          Number(sale.cardAmount),

        gpayAmount:
          Number(sale.gpayAmount),

        creditAmount:
          Number(sale.creditAmount),

        subtotal:
          Number(sale.subtotal),

        gstTotal:
          Number(sale.gstTotal),

        total:
          Number(sale.total),

        itemCount:
          Number(sale.itemCount),

        items: sale.items.map((item) => ({
          id: item.id,

          productCode:
            item.productCode,

          productName:
            item.productName,

          productNameTamil:
            item.productNameTamil,

          quantity:
            Number(item.quantity),

          rate:
            Number(item.rate),

          amount:
            Number(item.amount),

          counter:
            item.counter,
        })),
      }}
    />
  );
}
