import * as XLSX from "xlsx";
import fs from "node:fs";
import path from "node:path";

import { prisma } from "../src/lib/prisma";

type LegacySupplierRow = {
  Code?: unknown;
  Name?: unknown;
  Address?: unknown;
  "Contact Nos"?: unknown;
};

const DRY_RUN = process.env.DRY_RUN !== "false";

const importsDirectory = path.join(
  process.cwd(),
  "imports"
);

function findSupplierWorkbook() {
  if (!fs.existsSync(importsDirectory)) {
    throw new Error(
      `Imports directory not found: ${importsDirectory}`
    );
  }

  const files = fs.readdirSync(importsDirectory);

  const workbookFile = files.find((file) =>
    file.toLowerCase().includes("supplier")
  );

  if (!workbookFile) {
    throw new Error(
      "Supplier workbook not found in imports folder"
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

  return String(value)
    .replace(/\s+/g, " ")
    .trim();
}

function findIndianMobile(text: string) {
  if (!text) {
    return null;
  }

  const normalized = text.replace(
    /[^\d+]/g,
    " "
  );

  const groups = normalized
    .split(/\s+/)
    .map((value) =>
      value.replace(/\D/g, "")
    )
    .filter(Boolean);

  for (const group of groups) {
    if (
      group.length === 10 &&
      /^[6-9]/.test(group)
    ) {
      return group;
    }

    if (
      group.length === 12 &&
      group.startsWith("91") &&
      /^[6-9]/.test(group.slice(2))
    ) {
      return group.slice(2);
    }
  }

  const combined = text.replace(/\D/g, "");

  const mobileMatch = combined.match(
    /(?:91)?([6-9]\d{9})/
  );

  return mobileMatch?.[1] ?? null;
}

function findGstin(text: string) {
  if (!text) {
    return null;
  }

  const normalized = text
    .toUpperCase()
    .replace(/\s+/g, "");

  const match = normalized.match(
    /\b\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]\b/
  );

  return match?.[0] ?? null;
}

function cleanAddress(
  rawAddress: string
) {
  if (!rawAddress) {
    return null;
  }

  const cleaned = rawAddress
    .replace(/\s{2,}/g, " ")
    .replace(/^[,\s;-]+/, "")
    .replace(/[,\s;-]+$/, "")
    .trim();

  return cleaned || null;
}

async function main() {
  console.log("");
  console.log(
    "=============================================="
  );
  console.log(
    "RAJALAKSHMI STORES SUPPLIER MASTER IMPORT"
  );
  console.log(
    "=============================================="
  );
  console.log("");

  console.log(
    `MODE: ${
      DRY_RUN
        ? "DRY RUN - DATABASE WILL NOT CHANGE"
        : "LIVE IMPORT"
    }`
  );

  console.log("");

  const workbookPath =
    findSupplierWorkbook();

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
    workbook.Sheets["SUPPLIER_DETAILS"];

  if (!worksheet) {
    throw new Error(
      'Sheet "SUPPLIER_DETAILS" not found'
    );
  }

  const rows =
    XLSX.utils.sheet_to_json<LegacySupplierRow>(
      worksheet,
      {
        range: 1,
        defval: "",
        raw: false,
      }
    );

  console.log(
    `Excel supplier rows found: ${rows.length}`
  );

  console.log("");

  let validRows = 0;
  let skippedRows = 0;
  let createdCount = 0;
  let updatedCount = 0;
  let failedCount = 0;

  const seenCodes = new Set<string>();

  for (const row of rows) {
    const supplierCode = cleanText(
      row.Code
    );

    const name = cleanText(
      row.Name
    );

    if (!supplierCode || !name) {
      skippedRows += 1;
      continue;
    }

    if (seenCodes.has(supplierCode)) {
      console.warn(
        `SKIP DUPLICATE CODE: ${supplierCode} - ${name}`
      );

      skippedRows += 1;
      continue;
    }

    seenCodes.add(supplierCode);

    const rawAddress = cleanText(
      row.Address
    );

    const contactDetails = cleanText(
      row["Contact Nos"]
    );

    const combinedDetails = [
      rawAddress,
      contactDetails,
    ]
      .filter(Boolean)
      .join(" ");

    const phone = findIndianMobile(
      combinedDetails
    );

    const gstin = findGstin(
      combinedDetails
    );

    const address = cleanAddress(
      rawAddress
    );

    const preservedContactDetails =
      contactDetails || null;

    validRows += 1;

    if (DRY_RUN) {
      if (validRows <= 25) {
        console.log({
          supplierCode,
          name,
          phone,
          address,
          contactDetails:
            preservedContactDetails,
          gstin,
          openingBalance: 0,
          balance: 0,
        });
      }

      continue;
    }

    try {
      const existing =
        await prisma.supplier.findUnique({
          where: {
            supplierCode,
          },
          select: {
            id: true,
          },
        });

      if (existing) {
        await prisma.supplier.update({
          where: {
            supplierCode,
          },
          data: {
            name,
            phone,
            address,
            contactDetails:
              preservedContactDetails,
            gstin,
            isActive: true,
          },
        });

        updatedCount += 1;
      } else {
        await prisma.supplier.create({
          data: {
            supplierCode,
            name,
            phone,
            address,
            contactDetails:
              preservedContactDetails,
            gstin,
            openingBalance: 0,
            balance: 0,
            isActive: true,
          },
        });

        createdCount += 1;
      }

      const processed =
        createdCount + updatedCount;

      if (
        processed > 0 &&
        processed % 50 === 0
      ) {
        console.log(
          `Processed ${processed} suppliers...`
        );
      }
    } catch (error) {
      failedCount += 1;

      console.error(
        `FAILED: ${supplierCode} - ${name}`
      );

      console.error(error);
    }
  }

  console.log("");
  console.log(
    "=============================================="
  );
  console.log(
    "SUPPLIER IMPORT SUMMARY"
  );
  console.log(
    "=============================================="
  );

  console.log(
    `Excel rows: ${rows.length}`
  );

  console.log(
    `Valid suppliers: ${validRows}`
  );

  console.log(
    `Skipped rows: ${skippedRows}`
  );

  if (DRY_RUN) {
    console.log("");

    console.log(
      "DRY RUN COMPLETE - DATABASE WAS NOT MODIFIED"
    );

    console.log(
      "Run with DRY_RUN=false after reviewing the output."
    );
  } else {
    console.log(
      `Created: ${createdCount}`
    );

    console.log(
      `Updated: ${updatedCount}`
    );

    console.log(
      `Failed: ${failedCount}`
    );

    console.log("");

    console.log(
      "LIVE SUPPLIER IMPORT COMPLETE"
    );
  }
}

main()
  .catch((error) => {
    console.error("");

    console.error(
      "SUPPLIER IMPORT FAILED"
    );

    console.error(error);

    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
