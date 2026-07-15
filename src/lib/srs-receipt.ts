export type SrsReceiptItem = {
  code: string;
  name: string;
  quantity: number;
  rate: number;
  amount: number;
};

export type SrsReceiptPayment = {
  type: string;
  cashAmount: number;
  cardAmount: number;
  gpayAmount: number;
  creditAmount: number;
  otherAmount?: number;
};

export type SrsReceiptSale = {
  billNumber: string;
  billDate: string;
  customerName: string;
  itemCount: number;
  subtotal: number;
  gstTotal: number;
  total: number;
  previousBalance: number;
  closingBalance: number;
  items: SrsReceiptItem[];
  payment: SrsReceiptPayment;
};

const ESC = 27;
const GS = 29;
const LF = 10;

const RECEIPT_COLUMNS = 42;

function money(value: number) {
  return value.toFixed(2);
}

function textBytes(value: string) {
  return Array.from(
    new TextEncoder().encode(value)
  );
}

function safeText(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[^\x20-\x7E]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function truncate(
  value: string,
  length: number
) {
  if (value.length <= length) {
    return value;
  }

  return value.slice(0, length);
}

function left(
  value: string,
  length: number
) {
  return truncate(value, length)
    .padEnd(length, " ");
}

function right(
  value: string,
  length: number
) {
  return truncate(value, length)
    .padStart(length, " ");
}

function line(
  label: string,
  value: string
) {
  const valueWidth = 16;

  return (
    left(
      label,
      RECEIPT_COLUMNS - valueWidth
    ) +
    right(value, valueWidth)
  );
}

function itemAmountLine(
  quantity: number,
  rate: number,
  amount: number
) {
  return (
    right(String(quantity), 12) +
    right(money(rate), 14) +
    right(money(amount), 16)
  );
}

export function buildSrsReceipt(
  sale: SrsReceiptSale
): Uint8Array {
  const bytes: number[] = [];

  function command(...values: number[]) {
    bytes.push(...values);
  }

  function write(value: string) {
    bytes.push(
      ...textBytes(value)
    );
  }

  function writeLine(
    value = ""
  ) {
    write(value);
    command(LF);
  }

  function alignLeft() {
    command(ESC, 97, 0);
  }

  function alignCenter() {
    command(ESC, 97, 1);
  }

  function bold(enabled: boolean) {
    command(
      ESC,
      69,
      enabled ? 1 : 0
    );
  }

  function normalSize() {
    command(GS, 33, 0);
  }

  function doubleSize() {
    command(GS, 33, 17);
  }

  const separator =
    "-".repeat(RECEIPT_COLUMNS);

  command(ESC, 64);

  alignCenter();
  bold(true);
  doubleSize();

  writeLine("S. RAJALAKSHMI");
  writeLine("STORES");

  normalSize();

  writeLine(
    "WHOLESALE & RETAIL PROVISIONS"
  );

  bold(false);

  writeLine(
    "No.39, Saidapet Road, Vadapalani"
  );

  writeLine(
    "Chennai - 26"
  );

  writeLine(
    "Phone: 9025725928, 8925112312"
  );

  writeLine(separator);

  alignLeft();

  writeLine(
    `No: ${safeText(sale.billNumber)}`
  );

  writeLine(
    `Date: ${safeText(sale.billDate)}`
  );

  if (
    safeText(sale.customerName) &&
    safeText(sale.customerName)
      .toUpperCase() !== "CASH"
  ) {
    writeLine(
      `Customer: ${safeText(
        sale.customerName
      )}`
    );
  }

  writeLine(separator);

  bold(true);

  writeLine(
    left("Particulars", 20) +
      right("Qty", 6) +
      right("Rate", 8) +
      right("Value", 8)
  );

  bold(false);

  writeLine(separator);

  for (const item of sale.items) {
    writeLine(
      truncate(
        safeText(item.name),
        RECEIPT_COLUMNS
      )
    );

    writeLine(
      itemAmountLine(
        item.quantity,
        item.rate,
        item.amount
      )
    );
  }

  writeLine(separator);

  bold(true);

  writeLine(
    line(
      `Tot Items : ${sale.itemCount}`,
      `TOTAL: ${money(sale.total)}`
    )
  );

  writeLine(separator);

  doubleSize();

  writeLine(
    `BILL AMOUNT: ${money(
      sale.total
    )}`
  );

  normalSize();

  writeLine(separator);

  bold(false);

  if (
    sale.payment.cashAmount > 0
  ) {
    writeLine(
      line(
        "CASH",
        money(
          sale.payment.cashAmount
        )
      )
    );
  }

  if (
    sale.payment.cardAmount > 0
  ) {
    writeLine(
      line(
        "CARD",
        money(
          sale.payment.cardAmount
        )
      )
    );
  }

  if (
    sale.payment.gpayAmount > 0
  ) {
    writeLine(
      line(
        "GPAY",
        money(
          sale.payment.gpayAmount
        )
      )
    );
  }

  if (
    sale.payment.creditAmount > 0
  ) {
    writeLine(
      line(
        "CREDIT",
        money(
          sale.payment.creditAmount
        )
      )
    );
  }

  if (sale.previousBalance !== 0) {
    writeLine(
      line(
        "PREVIOUS BAL",
        money(
          sale.previousBalance
        )
      )
    );
  }

  if (sale.closingBalance !== 0) {
    bold(true);

    writeLine(
      line(
        "CLOSING BAL",
        money(
          sale.closingBalance
        )
      )
    );

    bold(false);
  }

  writeLine(separator);

  bold(true);

  writeLine(
    "GPAY NUMBER*7358653901"
  );

  writeLine(
    "GPAY NAME*S.RAJALAKSHMI STORES"
  );

  bold(false);

  writeLine(
    "Goods once sold cannot be returned"
  );

  alignCenter();
  bold(true);

  writeLine(
    "THANK YOU VISIT AGAIN !!!!!"
  );

  bold(false);

  alignLeft();

  writeLine("Worker Name :");
  writeLine("Tray No.    :");

  command(ESC, 100, 4);

  command(GS, 86, 1);

  return new Uint8Array(bytes);
}
