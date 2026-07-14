"use client";

type PrintableSale = {
  id: string;

  billNumber: string;

  billDate: string;

  customerCode: string | null;

  customerName: string;

  previousBalance: number;

  receivedAmount: number;

  closingBalance: number;

  priceMode: string;

  paymentType: string;

  cashAmount: number;

  cardAmount: number;

  gpayAmount: number;

  creditAmount: number;

  subtotal: number;

  gstTotal: number;

  total: number;

  itemCount: number;

  items: Array<{
    id: string;

    productCode: string | null;

    productName: string;

    productNameTamil: string | null;

    quantity: number;

    rate: number;

    amount: number;

    counter: number;
  }>;
};

export default function PrintBillClient({
  sale,
}: {
  sale: PrintableSale;
}) {
  const billDate = new Date(
    sale.billDate
  ).toLocaleString("en-IN", {
    dateStyle: "short",
    timeStyle: "short",
  });

  return (
    <>
      <style jsx global>{`
        @page {
          size: 80mm auto;
          margin: 2mm;
        }

        html,
        body {
          margin: 0;
          padding: 0;
          background: white;
        }

        @media print {
          .no-print {
            display: none !important;
          }

          body {
            width: 76mm;
          }
        }
      `}</style>

      <div className="min-h-screen bg-stone-200 py-6 print:bg-white print:py-0">
        <div className="no-print mx-auto mb-4 flex max-w-[80mm] justify-between gap-2">
          <button
            type="button"
            onClick={() => {
              window.history.back();
            }}
            className="border bg-white px-4 py-2 font-bold"
          >
            Back
          </button>

          <button
            type="button"
            onClick={() => {
              window.print();
            }}
            className="bg-red-900 px-5 py-2 font-black text-white"
          >
            Print Bill
          </button>
        </div>

        <main className="mx-auto w-[76mm] bg-white px-1 py-2 font-mono text-[10px] leading-tight text-black">
          <header className="text-center">
            <h1 className="text-[17px] font-black">
              RAJALAKSHMI STORES
            </h1>

            <p className="font-bold">
              WHOLESALE & RETAIL PROVISIONS
            </p>

            <p>
              Chennai
            </p>
          </header>

          <Divider />

          <div className="grid grid-cols-2 gap-x-2">
            <span>Bill No</span>

            <strong className="text-right">
              {sale.billNumber}
            </strong>

            <span>Date</span>

            <strong className="text-right">
              {billDate}
            </strong>

            <span>Customer</span>

            <strong className="text-right">
              {sale.customerName}
            </strong>

            {sale.customerCode && (
              <>
                <span>Customer Code</span>

                <strong className="text-right">
                  {sale.customerCode}
                </strong>
              </>
            )}

            <span>Payment</span>

            <strong className="text-right">
              {sale.paymentType}
            </strong>
          </div>

          <Divider />

          <div className="grid grid-cols-[1fr_30px_52px_58px] border-b border-black pb-1 font-black">
            <span>ITEM</span>

            <span className="text-right">
              QTY
            </span>

            <span className="text-right">
              RATE
            </span>

            <span className="text-right">
              AMOUNT
            </span>
          </div>

          <div>
            {sale.items.map((item) => (
              <div
                key={item.id}
                className="border-b border-dashed border-stone-400 py-1"
              >
                <div className="grid grid-cols-[1fr_30px_52px_58px]">
                  <div className="pr-1">
                    <strong>
                      {item.productName}
                    </strong>

                    {item.productCode && (
                      <span className="ml-1">
                        [{item.productCode}]
                      </span>
                    )}

                    {item.productNameTamil && (
                      <div
                        lang="ta"
                        className="font-sans font-bold"
                      >
                        {item.productNameTamil}
                      </div>
                    )}
                  </div>

                  <span className="text-right">
                    {formatQuantity(
                      item.quantity
                    )}
                  </span>

                  <span className="text-right">
                    {item.rate.toFixed(2)}
                  </span>

                  <strong className="text-right">
                    {item.amount.toFixed(2)}
                  </strong>
                </div>
              </div>
            ))}
          </div>

          <Divider />

          <SummaryRow
            label="Items"
            value={formatQuantity(
              sale.itemCount
            )}
          />

          <SummaryRow
            label="Subtotal"
            value={`₹${sale.subtotal.toFixed(
              2
            )}`}
          />

          <SummaryRow
            label="GST Included"
            value={`₹${sale.gstTotal.toFixed(
              2
            )}`}
          />

          <div className="my-1 border-t border-black" />

          <SummaryRow
            label="TOTAL"
            value={`₹${sale.total.toFixed(2)}`}
            strong
          />

          {sale.cashAmount > 0 && (
            <SummaryRow
              label="Cash"
              value={`₹${sale.cashAmount.toFixed(
                2
              )}`}
            />
          )}

          {sale.cardAmount > 0 && (
            <SummaryRow
              label="Card"
              value={`₹${sale.cardAmount.toFixed(
                2
              )}`}
            />
          )}

          {sale.gpayAmount > 0 && (
            <SummaryRow
              label="GPay / UPI"
              value={`₹${sale.gpayAmount.toFixed(
                2
              )}`}
            />
          )}

          {sale.creditAmount > 0 && (
            <SummaryRow
              label="Credit"
              value={`₹${sale.creditAmount.toFixed(
                2
              )}`}
            />
          )}

          {sale.customerCode && (
            <>
              <Divider />

              <SummaryRow
                label="Previous Balance"
                value={`₹${sale.previousBalance.toFixed(
                  2
                )}`}
              />

              <SummaryRow
                label="Received"
                value={`₹${sale.receivedAmount.toFixed(
                  2
                )}`}
              />

              <SummaryRow
                label="Closing Balance"
                value={`₹${sale.closingBalance.toFixed(
                  2
                )}`}
                strong
              />
            </>
          )}

          <Divider />

          <footer className="text-center">
            <p className="font-black">
              THANK YOU
            </p>

            <p>
              Please visit again
            </p>
          </footer>
        </main>
      </div>
    </>
  );
}

function Divider() {
  return (
    <div className="my-1 border-t border-dashed border-black" />
  );
}

function SummaryRow({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div
      className={`flex justify-between py-0.5 ${
        strong
          ? "text-[14px] font-black"
          : ""
      }`}
    >
      <span>
        {label}
      </span>

      <span>
        {value}
      </span>
    </div>
  );
}

function formatQuantity(value: number) {
  if (Number.isInteger(value)) {
    return String(value);
  }

  return value
    .toFixed(3)
    .replace(/0+$/, "")
    .replace(/\.$/, "");
}
