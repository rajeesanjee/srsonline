"use client";

import { useEffect } from "react";

type PrintableSale = {
  id: string;
  billNumber: string;
  billDate: string;
  customerCode: string | null;
  customerName: string;
  customerPhone: string | null;
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
  const date = new Date(sale.billDate);

  const billDate = date.toLocaleDateString(
    "en-GB"
  );

  const billTime = date.toLocaleTimeString(
    "en-IN",
    {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }
  );

  const counterGroups = Array.from(
    sale.items.reduce(
      (groups, item) => {
        const counter = item.counter ?? 0;

        const current =
          groups.get(counter) ?? [];

        current.push(item);
        groups.set(counter, current);

        return groups;
      },
      new Map<
        number,
        PrintableSale["items"]
      >()
    )
  ).sort(
    ([counterA], [counterB]) =>
      counterA - counterB
  );

  function printReceipt() {
    const receipt =
      document.getElementById(
        "thermal-receipt"
      );

    if (!receipt) {
      window.alert(
        "Receipt content could not be found."
      );
      return;
    }

    const printWindow = window.open(
      "",
      "_blank",
      "width=420,height=700"
    );

    if (!printWindow) {
      window.alert(
        "Print window was blocked. Allow pop-ups for this Codespace."
      );
      return;
    }

    const receiptHtml = receipt.outerHTML;

    printWindow.document.open();

    printWindow.document.write(`
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />

  <title>${sale.billNumber}</title>

  <style>
    @page {
      size: 80mm auto;
      margin: 0;
    }

    html,
    body {
      width: 80mm;
      margin: 0;
      padding: 0;
      background: #ffffff;
      color: #000000;
    }

    body {
      font-family: "Courier New", monospace;
      font-weight: 700;
    }

    #thermal-receipt {
      box-sizing: border-box;
      width: 70mm;
      margin: 0;
      padding: 1mm 1mm 2mm 1mm;
      color: #000000;
      background: #ffffff;
      font-family: "Courier New", monospace;
      font-size: 12px;
      font-weight: 700;
      line-height: 1.12;
    }

    #thermal-receipt * {
      box-sizing: border-box;
      color: #000000;
    }

    .center {
      text-align: center;
    }

    .right {
      text-align: right;
    }

    .black {
      font-weight: 900;
    }

    .store-name {
      margin-top: 2px;
      font-family: Arial Black, Arial, sans-serif;
      font-size: 20px;
      font-weight: 900;
      line-height: 1;
      letter-spacing: -0.7px;
      white-space: nowrap;
      text-align: center;
    }

    .tamil {
      font-family: Arial, "Noto Sans Tamil", sans-serif;
      font-weight: 900;
    }

    .divider {
      width: 100%;
      margin: 5px 0;
      border-top: 2px dashed #000000;
    }

    .bill-row {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      font-size: 12px;
      font-weight: 900;
    }

    .header-row,
    .item-values {
      display: grid;
      grid-template-columns:
        minmax(0, 1fr)
        34px
        54px
        61px;
      column-gap: 0;
      font-size: 12px;
      font-weight: 900;
    }

    .product-name {
      margin-top: 4px;
      font-size: 13px;
      font-weight: 900;
      line-height: 1.08;
      overflow-wrap: anywhere;
    }

    .product-tamil {
      font-family: Arial, "Noto Sans Tamil", sans-serif;
      font-size: 14px;
      font-weight: 900;
      line-height: 1.12;
      overflow-wrap: anywhere;
    }

    .counter {
      margin: 4px 0;
      font-size: 13px;
      font-weight: 900;
    }

    .totals-row {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      align-items: center;
      font-size: 13px;
      font-weight: 900;
    }

    .bill-amount {
      width: 100%;
      padding: 4px 0;
      font-family: Arial Black, Arial, sans-serif;
      font-size: 21px;
      font-weight: 900;
      letter-spacing: -0.7px;
      white-space: nowrap;
      text-align: center;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      font-weight: 900;
    }

    .summary-strong {
      font-size: 15px;
    }

    .gpay-details {
      font-size: 12px;
      font-weight: 900;
    }

    .thank-you {
      margin-top: 4px;
      text-align: center;
      font-size: 15px;
      font-weight: 900;
    }

    .qr-area {
      display: grid;
      grid-template-columns: 28mm minmax(0, 1fr);
      align-items: center;
      gap: 2mm;
      width: 100%;
    }

    .qr-area img {
      display: block;
      width: 27mm;
      height: 27mm;
      object-fit: contain;
    }

    .qr-text {
      min-width: 0;
      text-align: center;
      font-weight: 900;
    }

    .upi-id {
      font-size: 8px;
      overflow-wrap: anywhere;
      word-break: break-all;
    }

    @media print {
      html,
      body {
        width: 80mm !important;
        min-width: 80mm !important;
        margin: 0 !important;
        padding: 0 !important;
      }

      #thermal-receipt {
        width: 70mm !important;
        margin-left: 1mm !important;
        margin-right: 0 !important;
      }
    }
  </style>
</head>

<body>
  ${receiptHtml}

  <script>
    window.addEventListener("load", function () {
      window.setTimeout(function () {
        window.print();
      }, 300);
    });

    window.addEventListener(
      "afterprint",
      function () {
        window.close();
      }
    );
  </script>
</body>
</html>
    `);

    printWindow.document.close();
  }

  function openWhatsApp() {
    const itemLines = sale.items.flatMap(
      (item) => [
        item.productName,
        `${formatQuantity(
          item.quantity
        )} x ${item.rate.toFixed(
          2
        )} = ₹${item.amount.toFixed(2)}`,
        "",
      ]
    );

    const message = [
      "*S. RAJALAKSHMI STORES*",
      "Wholesale & Retail Provisions",
      "No.39, Saidapet Road",
      "Vadapalani, Chennai - 26",
      "",
      `*Bill No:* ${sale.billNumber}`,
      `*Date:* ${billDate}`,
      `*Customer:* ${sale.customerName}`,
      "",
      "*BILL DETAILS*",
      "------------------------------",
      ...itemLines,
      "------------------------------",
      `*Items:* ${formatQuantity(
        sale.itemCount
      )}`,
      `*BILL AMOUNT: ₹${sale.total.toFixed(
        2
      )}*`,
      `*Payment:* ${sale.paymentType}`,

      sale.cashAmount > 0
        ? `Cash: ₹${sale.cashAmount.toFixed(
            2
          )}`
        : "",

      sale.cardAmount > 0
        ? `Card: ₹${sale.cardAmount.toFixed(
            2
          )}`
        : "",

      sale.gpayAmount > 0
        ? `GPay / UPI: ₹${sale.gpayAmount.toFixed(
            2
          )}`
        : "",

      sale.creditAmount > 0
        ? `Credit: ₹${sale.creditAmount.toFixed(
            2
          )}`
        : "",

      sale.customerCode
        ? `Previous Balance: ₹${sale.previousBalance.toFixed(
            2
          )}`
        : "",

      sale.customerCode
        ? `Received: ₹${sale.receivedAmount.toFixed(
            2
          )}`
        : "",

      sale.customerCode
        ? `*Closing Balance: ₹${sale.closingBalance.toFixed(
            2
          )}*`
        : "",

      "",
      "*GPAY / UPI*",
      "7358653901@okbizaxis",
      "S. RAJALAKSHMI STORES",
      "",
      "Goods once sold cannot be returned.",
      "",
      "*THANK YOU. PLEASE VISIT AGAIN!*",
    ]
      .filter(Boolean)
      .join("\n");

    const phone = normalizeWhatsAppPhone(
      sale.customerPhone
    );

    const whatsappUrl = phone
      ? `https://wa.me/${phone}?text=${encodeURIComponent(
          message
        )}`
      : `https://wa.me/?text=${encodeURIComponent(
          message
        )}`;

    window.open(
      whatsappUrl,
      "_blank"
    );
  }

  useEffect(() => {
    function handleKeyboard(
      event: KeyboardEvent
    ) {
      /*
       * Block Ctrl+P on this page.
       * It previously printed the entire Admin layout
       * and caused excessive thermal paper feed.
       */
      if (
        event.ctrlKey &&
        event.key.toLowerCase() === "p"
      ) {
        event.preventDefault();

        window.alert(
          "Use P or the Print Bill button for thermal printing."
        );

        return;
      }

      if (
        event.key.toLowerCase() === "p"
      ) {
        const target =
          event.target as HTMLElement;

        if (
          target.tagName !== "INPUT" &&
          target.tagName !== "TEXTAREA"
        ) {
          event.preventDefault();
          printReceipt();
        }

        return;
      }

      if (
        event.key.toLowerCase() === "w"
      ) {
        event.preventDefault();
        openWhatsApp();
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();

        window.location.href =
          "/admin/billing";
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyboard
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyboard
      );
    };
  });

  return (
    <div className="min-h-screen bg-stone-200 py-6">
      <div className="mx-auto mb-4 flex max-w-[120mm] justify-center gap-2">
        <button
          type="button"
          onClick={() => {
            window.location.href =
              "/admin/billing";
          }}
          className="border bg-white px-4 py-2 font-bold"
        >
          Back
        </button>

        <button
          type="button"
          onClick={openWhatsApp}
          className="bg-green-700 px-4 py-2 font-black text-white"
        >
          W · WhatsApp
        </button>

        <button
          type="button"
          onClick={printReceipt}
          className="bg-red-900 px-5 py-2 font-black text-white"
        >
          P · Print Bill
        </button>
      </div>

      <div
        id="thermal-receipt"
        className="mx-auto w-[70mm] bg-white px-1 py-1 font-mono text-[12px] font-bold leading-[1.12] text-black"
      >
        <div className="center tamil text-[13px] font-black">
          ஓம் முருகன் துணை
        </div>

        <div className="store-name">
          S. RAJALAKSHMI STORES
        </div>

        <div className="center mt-1 text-[12px] font-black">
          WHOLESALE &amp; RETAIL PROVISIONS
        </div>

        <div className="center mt-1 text-[12px] font-black">
          No.39, Saidapet Road,
          <br />
          Vadapalani, Chennai - 26
        </div>

        <div className="center mt-1 text-[12px] font-black">
          Phone: 9025725928, 8925112312
        </div>

        <ReceiptDivider />

        <div className="bill-row">
          <div>
            No: {sale.billNumber}
          </div>

          <div className="center">
            {billDate}
          </div>

          <div className="right">
            {billTime}
          </div>
        </div>

        {sale.customerCode && (
          <>
            <ReceiptDivider />

            <div className="text-[12px] font-black">
              Customer: {sale.customerName}
            </div>

            <div className="text-[12px] font-black">
              Code: {sale.customerCode}
            </div>
          </>
        )}

        <ReceiptDivider />

        <div className="header-row">
          <div>Particulars</div>

          <div className="right">
            Qty
          </div>

          <div className="right">
            Rate
          </div>

          <div className="right">
            Value
          </div>
        </div>

        <ReceiptDivider />

        {counterGroups.map(
          ([counter, counterItems]) => (
            <div key={counter}>
              <div className="counter">
                Counter : {counter}
              </div>

              {counterItems.map((item) => (
                <div
                  key={item.id}
                  className="mb-2"
                >
                  <div
                    className={
                      item.productNameTamil
                        ? "product-tamil"
                        : "product-name"
                    }
                    lang={
                      item.productNameTamil
                        ? "ta"
                        : undefined
                    }
                  >
                    {item.productNameTamil ||
                      item.productName}
                  </div>

                  <div className="item-values">
                    <div />

                    <div className="right">
                      {formatQuantity(
                        item.quantity
                      )}
                    </div>

                    <div className="right">
                      {item.rate.toFixed(2)}
                    </div>

                    <div className="right">
                      {item.amount.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        <ReceiptDivider />

        <div className="totals-row">
          <div>
            Tot Items :
            {formatQuantity(
              sale.itemCount
            )}
          </div>

          <div className="px-2">
            TOTAL :
          </div>

          <div className="right">
            {sale.total.toFixed(2)}
          </div>
        </div>

        <ReceiptDivider />

        <div className="bill-amount">
          BILL AMOUNT: {sale.total.toFixed(2)}
        </div>

        <ReceiptDivider />

        {sale.cashAmount > 0 && (
          <SummaryRow
            label="CASH"
            value={sale.cashAmount}
          />
        )}

        {sale.cardAmount > 0 && (
          <SummaryRow
            label="CARD"
            value={sale.cardAmount}
          />
        )}

        {sale.gpayAmount > 0 && (
          <SummaryRow
            label="GPAY"
            value={sale.gpayAmount}
          />
        )}

        {sale.creditAmount > 0 && (
          <SummaryRow
            label="CREDIT"
            value={sale.creditAmount}
          />
        )}

        {sale.customerCode && (
          <>
            <ReceiptDivider />

            <SummaryRow
              label="Previous Balance"
              value={sale.previousBalance}
            />

            <SummaryRow
              label="Received"
              value={sale.receivedAmount}
            />

            <SummaryRow
              label="Closing Balance"
              value={sale.closingBalance}
              strong
            />
          </>
        )}

        <ReceiptDivider />

        <div className="gpay-details">
          GPAY NUMBER*7358653901
        </div>

        <div className="gpay-details">
          GPAY NAME*RAJALAKSHMI SUDALAIMUTHU
        </div>

        <div className="center mt-1 text-[12px] font-black">
          Goods once sold cannot be returned
        </div>

        <div className="thank-you">
          THANK YOU VISIT AGAIN !!!!!
        </div>

        <div className="mt-1 text-[12px] font-black">
          Worker Name : __________________
        </div>

        <div className="text-[12px] font-black">
          Tray No. : ______________________
        </div>

        <ReceiptDivider />

        <div className="qr-area">
          <img
            src="/payment/gpay-qr.png"
            alt="S. Rajalakshmi Stores UPI QR"
          />

          <div className="qr-text">
            <div className="text-[14px] font-black">
              SCAN &amp; PAY
            </div>

            <div className="mt-1 text-[15px] font-black">
              GPay
            </div>

            <div className="mt-1 text-[11px] font-black">
              S. RAJALAKSHMI
              <br />
              STORES
            </div>

            <div className="upi-id mt-1 font-black">
              7358653901@okbizaxis
            </div>
          </div>
        </div>

        <ReceiptDivider />
      </div>
    </div>
  );
}

function ReceiptDivider() {
  return (
    <div className="divider" />
  );
}

function SummaryRow({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: number;
  strong?: boolean;
}) {
  return (
    <div
      className={`summary-row ${
        strong
          ? "summary-strong"
          : ""
      }`}
    >
      <span>{label}</span>

      <span>
        {value.toFixed(2)}
      </span>
    </div>
  );
}

function normalizeWhatsAppPhone(
  phone: string | null
) {
  if (!phone) {
    return null;
  }

  const digits = phone.replace(
    /\D/g,
    ""
  );

  if (
    digits.length === 10 &&
    /^[6-9]/.test(digits)
  ) {
    return `91${digits}`;
  }

  if (
    digits.length === 12 &&
    digits.startsWith("91")
  ) {
    return digits;
  }

  return null;
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
