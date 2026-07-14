import * as XLSX from "xlsx";
import fs from "node:fs";
import path from "node:path";

import { prisma } from "../src/lib/prisma";

type LegacyProductRow = {
  Code?: unknown;
  "Product Name"?: unknown;
  PRate?: unknown;
  MRP?: unknown;
  RRate?: unknown;
  WRate?: unknown;
  Location?: unknown;
  Reorder?: unknown;
  SalesTax?: unknown;
  PrchsTax?: unknown;
};

const DRY_RUN = process.env.DRY_RUN !== "false";

const importsDirectory = path.join(
  process.cwd(),
  "imports"
);

function findWorkbook() {
  if (!fs.existsSync(importsDirectory)) {
    throw new Error(
      `Imports directory not found: ${importsDirectory}`
    );
  }

  const files = fs.readdirSync(importsDirectory);

  const workbookFile = files.find((file) => {
    const name = file.toLowerCase();

    return (
      name.endsWith(".xls") ||
      name.endsWith(".xlsx")
    );
  });

  if (!workbookFile) {
    throw new Error(
      "No Excel workbook found in imports folder"
    );
  }

  return path.join(
    importsDirectory,
    workbookFile
  );
}

function cleanText(value: unknown) {
  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  return String(value).trim();
}

function cleanNumber(
  value: unknown,
  fallback = 0
) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return fallback;
  }

  const number = Number(
    String(value)
      .replace(/,/g, "")
      .trim()
  );

  if (!Number.isFinite(number)) {
    return fallback;
  }

  return number;
}

function normalizeCounter(value: unknown) {
  const counter = Math.trunc(
    cleanNumber(value, 0)
  );

  if ([0, 1, 2, 3].includes(counter)) {
    return counter;
  }

  return 0;
}

function normalizeGst(value: unknown) {
  const gst = cleanNumber(value, 0);

  if (gst === 5) {
    return 5;
  }

  if (gst === 18) {
    return 18;
  }

  return 0;
}

function calculateProfitPercent(
  purchasePrice: number,
  sellingPrice: number
) {
  if (
    purchasePrice <= 0 ||
    sellingPrice <= 0
  ) {
    return null;
  }

  const percentage =
    ((sellingPrice - purchasePrice) /
      purchasePrice) *
    100;

  if (!Number.isFinite(percentage)) {
    return null;
  }

  return Number(percentage.toFixed(2));
}

async function main() {
  console.log("");
  console.log(
    "=============================================="
  );
  console.log(
    "RAJALAKSHMI STORES LEGACY PRODUCT IMPORT"
  );
  console.log(
    "=============================================="
  );
  console.log("");

  console.log(
    `MODE: ${DRY_RUN ? "DRY RUN - DATABASE WILL NOT CHANGE" : "LIVE IMPORT"}`
  );
  console.log("");

  const workbookPath = findWorkbook();

  console.log("Workbook:");
  console.log(workbookPath);
  console.log("");

  const workbook = XLSX.readFile(
    workbookPath,
    {
      raw: false,
    }
  );

  const worksheet =
    workbook.Sheets["PRODUCT_DETAILS_FULL"];

  if (!worksheet) {
    throw new Error(
      'Sheet "PRODUCT_DETAILS_FULL" not found'
    );
  }

  const rows =
    XLSX.utils.sheet_to_json<LegacyProductRow>(
      worksheet,
      {
        range: 1,
        defval: "",
        raw: false,
      }
    );

  console.log(
    `Excel product rows found: ${rows.length}`
  );
  console.log("");

  let validRows = 0;
  let skippedRows = 0;
  let createdCount = 0;
  let updatedCount = 0;
  let failedCount = 0;

  const seenCodes = new Set<string>();

  for (const row of rows) {
    const productCode = cleanText(row.Code);
    const name = cleanText(row["Product Name"]);

    if (!productCode || !name) {
      skippedRows += 1;
      continue;
    }

    if (seenCodes.has(productCode)) {
      console.warn(
        `SKIP DUPLICATE EXCEL CODE: ${productCode} - ${name}`
      );

      skippedRows += 1;
      continue;
    }

    seenCodes.add(productCode);

    const purchasePrice = Math.max(
      cleanNumber(row.PRate),
      0
    );

    const mrp = Math.max(
      cleanNumber(row.MRP),
      0
    );

    const retailPrice = Math.max(
      cleanNumber(row.RRate),
      0
    );

    const wholesalePrice = Math.max(
      cleanNumber(row.WRate),
      0
    );

    const counter = normalizeCounter(
      row.Location
    );

    const gstRate = normalizeGst(
      row.SalesTax
    );

    const wholesaleProfitPercent =
      calculateProfitPercent(
        purchasePrice,
        wholesalePrice
      );

    const retailProfitPercent =
      calculateProfitPercent(
        purchasePrice,
        retailPrice
      );

    /*
     * Legacy workbook does not contain a separate
     * card price. Until we get that data, card price
     * starts with the retail price.
     */
    const cardPrice = retailPrice;

    const cardProfitPercent =
      retailProfitPercent;

    validRows += 1;

    if (DRY_RUN) {
      if (validRows <= 20) {
        console.log({
          productCode,
          name,
          purchasePrice,
          mrp,
          retailPrice,
          wholesalePrice,
          cardPrice,
          wholesaleProfitPercent,
          retailProfitPercent,
          cardProfitPercent,
          gstRate,
          counter,
        });
      }

      continue;
    }

    try {
      const existing =
        await prisma.product.findUnique({
          where: {
            productCode,
          },
          select: {
            id: true,
          },
        });

      if (existing) {
        await prisma.product.update({
          where: {
            productCode,
          },
          data: {
            name,
            purchasePrice,
            mrp,
            wholesalePrice,
            retailPrice,
            cardPrice,
            wholesaleProfitPercent,
            retailProfitPercent,
            cardProfitPercent,
            gstRate,
            counter,
          },
        });

        updatedCount += 1;
      } else {
        await prisma.product.create({
          data: {
            productCode,
            name,
            nameTamil: null,
            category: "GENERAL",
            unit: "PCS",
            purchasePrice,
            mrp,
            wholesalePrice,
            retailPrice,
            cardPrice,
            wholesaleProfitPercent,
            retailProfitPercent,
            cardProfitPercent,
            gstRate,
            hsnCode: null,
            stock: 0,
            allowDecimal: false,
            supplierName: null,
            counter,
            discountPercent: null,
          },
        });

        createdCount += 1;
      }

      const processed =
        createdCount + updatedCount;

      if (
        processed % 250 === 0
      ) {
        console.log(
          `Processed ${processed} products...`
        );
      }
    } catch (error) {
      failedCount += 1;

      console.error(
        `FAILED: ${productCode} - ${name}`
      );

      console.error(error);
    }
  }

  console.log("");
  console.log(
    "=============================================="
  );
  console.log("IMPORT SUMMARY");
  console.log(
    "=============================================="
  );

  console.log(`Excel rows: ${rows.length}`);
  console.log(`Valid products: ${validRows}`);
  console.log(`Skipped rows: ${skippedRows}`);

  if (DRY_RUN) {
    console.log("");
    console.log(
      "DRY RUN COMPLETE - DATABASE WAS NOT MODIFIED"
    );

    console.log(
      "Run with DRY_RUN=false only after reviewing this output."
    );
  } else {
    console.log(`Created: ${createdCount}`);
    console.log(`Updated: ${updatedCount}`);
    console.log(`Failed: ${failedCount}`);

    console.log("");
    console.log("LIVE PRODUCT IMPORT COMPLETE");
  }
}

main()
  .catch((error) => {
    console.error("");
    console.error("PRODUCT IMPORT FAILED");
    console.error(error);

    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
