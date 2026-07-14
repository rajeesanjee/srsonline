import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

type PriceMode =
  | "RETAIL"
  | "CARD"
  | "WHOLESALE";

type PaymentMode =
  | "CASH"
  | "CARD"
  | "GPAY"
  | "CREDIT"
  | "MIXED";

type SaleItemInput = {
  productId?: string;
  productCode?: string | null;
  barcode?: string | null;
  quantity?: number;
};

type CreateSaleInput = {
  billNumber?: string;
  customerId?: string | null;
  priceMode?: PriceMode;
  paymentMode?: PaymentMode;
  receivedAmount?: number;
  cashAmount?: number;
  cardAmount?: number;
  gpayAmount?: number;
  creditAmount?: number;
  items?: SaleItemInput[];
};

function money(value: number) {
  return Number(value.toFixed(2));
}

function normalizedQuantity(value: number) {
  return Number(value.toFixed(3));
}

function isPriceMode(
  value: unknown
): value is PriceMode {
  return (
    value === "RETAIL" ||
    value === "CARD" ||
    value === "WHOLESALE"
  );
}

function getProductRate(
  product: {
    retailPrice: unknown;
    cardPrice: unknown;
    wholesalePrice: unknown;
  },
  priceMode: PriceMode
) {
  if (priceMode === "CARD") {
    return Number(
      product.cardPrice ??
        product.retailPrice
    );
  }

  if (priceMode === "WHOLESALE") {
    return Number(
      product.wholesalePrice ??
        product.retailPrice
    );
  }

  return Number(product.retailPrice);
}

function isPaymentMode(
  value: unknown
): value is PaymentMode {
  return (
    value === "CASH" ||
    value === "CARD" ||
    value === "GPAY" ||
    value === "CREDIT" ||
    value === "MIXED"
  );
}

export async function POST(
  request: Request
) {
  try {
    const body =
      (await request.json()) as CreateSaleInput;

    const billNumber =
      body.billNumber?.trim() || "";

    const customerId =
      body.customerId?.trim() || null;

    const priceMode = isPriceMode(
      body.priceMode
    )
      ? body.priceMode
      : "RETAIL";

    const paymentMode = isPaymentMode(
      body.paymentMode
    )
      ? body.paymentMode
      : "CASH";

    const cashAmount = money(
      Math.max(Number(body.cashAmount) || 0, 0)
    );

    const cardAmount = money(
      Math.max(Number(body.cardAmount) || 0, 0)
    );

    const gpayAmount = money(
      Math.max(Number(body.gpayAmount) || 0, 0)
    );

    const creditAmount = money(
      Math.max(Number(body.creditAmount) || 0, 0)
    );

    const receivedAmount = money(
      cashAmount + cardAmount + gpayAmount
    );

    const inputItems = Array.isArray(
      body.items
    )
      ? body.items
      : [];

    if (!billNumber) {
      return NextResponse.json(
        {
          error: "Bill number is required",
        },
        {
          status: 400,
        }
      );
    }

    if (inputItems.length === 0) {
      return NextResponse.json(
        {
          error:
            "Add at least one product before saving",
        },
        {
          status: 400,
        }
      );
    }

    const invalidItem = inputItems.find(
      (item) =>
        !item.productId ||
        !item.productId.trim()
    );

    if (invalidItem) {
      return NextResponse.json(
        {
          error:
            "One or more bill items do not have a valid product",
        },
        {
          status: 400,
        }
      );
    }

    const duplicateBill =
      await prisma.sale.findUnique({
        where: {
          billNumber,
        },
        select: {
          id: true,
        },
      });

    if (duplicateBill) {
      return NextResponse.json(
        {
          error: `Bill ${billNumber} already exists`,
        },
        {
          status: 409,
        }
      );
    }

    /*
     * Repeated products are allowed as separate
     * bill lines.
     *
     * Example:
     *
     * SUGAR Qty 1
     * SUGAR Qty 1
     *
     * We fetch the product only once from the DB,
     * but preserve both SaleItem rows.
     */
    const uniqueProductIds = Array.from(
      new Set(
        inputItems.map(
          (item) =>
            item.productId!.trim()
        )
      )
    );

    const products =
      await prisma.product.findMany({
        where: {
          id: {
            in: uniqueProductIds,
          },
        },
      });

    if (
      products.length !==
      uniqueProductIds.length
    ) {
      return NextResponse.json(
        {
          error:
            "One or more products no longer exist",
        },
        {
          status: 400,
        }
      );
    }

    const productMap = new Map(
      products.map((product) => [
        product.id,
        product,
      ])
    );

    const customer = customerId
      ? await prisma.customer.findUnique({
          where: {
            id: customerId,
          },
        })
      : null;

    if (customerId && !customer) {
      return NextResponse.json(
        {
          error:
            "Selected customer no longer exists",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Prepare every bill line separately.
     * Repeated product IDs remain repeated.
     */
    const preparedItems = inputItems.map(
      (item, index) => {
        const productId =
          item.productId!.trim();

        const product =
          productMap.get(productId);

        if (!product) {
          throw new Error(
            `Bill line ${
              index + 1
            }: product not found`
          );
        }

        const itemQuantity =
          normalizedQuantity(
            Number(item.quantity) || 0
          );

        if (itemQuantity <= 0) {
          throw new Error(
            `${product.name}: quantity must be greater than zero`
          );
        }

        if (
          !product.allowDecimal &&
          !Number.isInteger(itemQuantity)
        ) {
          throw new Error(
            `${product.name}: decimal quantity is not allowed`
          );
        }

        const rate = money(
          getProductRate(
            product,
            priceMode
          )
        );

        const mrp = money(
          Number(product.mrp)
        );

        const gstRate = money(
          Number(product.gstRate)
        );

        const amount = money(
          rate * itemQuantity
        );

        const gstAmount =
          gstRate > 0
            ? money(
                amount -
                  amount /
                    (1 + gstRate / 100)
              )
            : 0;

        return {
          product,
          productId,
          quantity: itemQuantity,
          mrp,
          rate,
          gstRate,
          gstAmount,
          amount,
        };
      }
    );

    /*
     * Aggregate repeated bill lines only for
     * stock validation and stock deduction.
     */
    const stockQuantities = new Map<
      string,
      number
    >();

    for (const item of preparedItems) {
      const currentQuantity =
        stockQuantities.get(
          item.productId
        ) ?? 0;

      stockQuantities.set(
        item.productId,
        normalizedQuantity(
          currentQuantity + item.quantity
        )
      );
    }

    for (const [
      productId,
      totalQuantity,
    ] of stockQuantities) {
      const product =
        productMap.get(productId);

      if (!product) {
        throw new Error(
          "Product not found during stock validation"
        );
      }

      const currentStock = Number(
        product.stock
      );

      if (
        currentStock <
        totalQuantity
      ) {
        throw new Error(
          `${product.name}: insufficient stock. Required ${totalQuantity}, available ${currentStock}`
        );
      }
    }

    const itemCount = normalizedQuantity(
      preparedItems.reduce(
        (sum, item) =>
          sum + item.quantity,
        0
      )
    );

    const subtotal = money(
      preparedItems.reduce(
        (sum, item) =>
          sum + item.amount,
        0
      )
    );

    const gstTotal = money(
      preparedItems.reduce(
        (sum, item) =>
          sum + item.gstAmount,
        0
      )
    );

    const discount = 0;
    const roundOff = 0;

    const total = money(
      subtotal - discount + roundOff
    );

    const previousBalance = money(
      customer
        ? Number(customer.balance)
        : 0
    );

    const paymentTotal = money(
      cashAmount +
        cardAmount +
        gpayAmount +
        creditAmount
    );

    if (
      Math.abs(paymentTotal - total) > 0.009
    ) {
      return NextResponse.json(
        {
          error: `Payment total ₹${paymentTotal.toFixed(
            2
          )} must equal bill total ₹${total.toFixed(
            2
          )}`,
        },
        {
          status: 400,
        }
      );
    }

    if (creditAmount > 0 && !customer) {
      return NextResponse.json(
        {
          error:
            "Select a customer before credit sale",
        },
        {
          status: 400,
        }
      );
    }

    const closingBalance = customer
      ? money(
          previousBalance + creditAmount
        )
      : 0;

    const paymentType = paymentMode;

    const effectiveReceivedAmount =
      receivedAmount;

    const savedSale =
      await prisma.$transaction(
        async (tx) => {
          const sale = await tx.sale.create({
            data: {
              billNumber,
              billDate: new Date(),

              customerId:
                customer?.id ?? null,

              customerCode:
                customer?.customerCode ??
                null,

              customerName:
                customer?.name ?? "CASH",

              previousBalance,

              receivedAmount:
                effectiveReceivedAmount,

              closingBalance,

              priceMode,

              itemCount,

              subtotal,
              gstTotal,
              discount,
              roundOff,
              total,

              paymentType,

              cashAmount,

              cardAmount,

              gpayAmount,

              creditAmount,

              otherAmount: 0,

              status: "COMPLETED",

              /*
               * Every prepared item becomes its own
               * SaleItem row.
               *
               * Repeated products remain separate.
               */
              items: {
                create: preparedItems.map(
                  (item) => ({
                    productId:
                      item.product.id,

                    productCode:
                      item.product
                        .productCode,

                    barcode:
                      item.product.barcode,

                    productName:
                      item.product.name,

                    productNameTamil:
                      item.product.nameTamil,

                    counter:
                      item.product.counter,

                    quantity:
                      item.quantity,

                    mrp: item.mrp,

                    rate: item.rate,

                    gstRate:
                      item.gstRate,

                    gstAmount:
                      item.gstAmount,

                    discountPercent: 0,

                    discountAmount: 0,

                    amount: item.amount,
                  })
                ),
              },
            },

            include: {
              items: true,
            },
          });

          /*
           * Deduct stock once per product using the
           * combined quantity of repeated bill lines.
           */
          for (const [
            productId,
            totalQuantity,
          ] of stockQuantities) {
            const product =
              productMap.get(productId);

            if (!product) {
              throw new Error(
                "Product not found during stock update"
              );
            }

            const stockUpdate =
              await tx.product.updateMany({
                where: {
                  id: productId,

                  stock: {
                    gte: totalQuantity,
                  },
                },

                data: {
                  stock: {
                    decrement:
                      totalQuantity,
                  },
                },
              });

            if (stockUpdate.count !== 1) {
              throw new Error(
                `${product.name}: stock changed while saving. Please retry the bill.`
              );
            }
          }

          if (customer) {
            await tx.customer.update({
              where: {
                id: customer.id,
              },

              data: {
                balance: closingBalance,

                lastVisitDate:
                  new Date(),
              },
            });
          }

          return sale;
        }
      );

    return NextResponse.json(
      {
        success: true,

        sale: {
          id: savedSale.id,

          billNumber:
            savedSale.billNumber,

          total:
            Number(savedSale.total),

          previousBalance:
            Number(
              savedSale.previousBalance
            ),

          receivedAmount:
            Number(
              savedSale.receivedAmount
            ),

          closingBalance:
            Number(
              savedSale.closingBalance
            ),

          itemCount:
            Number(savedSale.itemCount),

          lineCount:
            preparedItems.length,
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "SAVE BILL ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to save bill",
      },
      {
        status: 500,
      }
    );
  }
}
