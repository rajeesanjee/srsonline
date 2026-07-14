import * as XLSX from "xlsx";
import fs from "node:fs";
import path from "node:path";

import { prisma } from "../src/lib/prisma";

type LegacyCustomerRow = {
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

function findCustomerWorkbook() {
  if (!fs.existsSync(importsDirectory)) {
    throw new Error(
      `Imports directory not found: ${importsDirectory}`
    );
  }

  const files = fs.readdirSync(importsDirectory);

  const workbookFile = files.find((file) =>
    file.toLowerCase().includes("customer")
  );

  if (!workbookFile) {
    throw new Error(
      "Customer workbook not found in imports folder"
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

function normalizePhone(value: string) {
  const groups = value.match(/\d+/g) ?? [];

  const candidates = groups
    .map((group) =>
      group.replace(/\D/g, "")
    )
    .filter(Boolean);

  for (const candidate of candidates) {
    if (
      candidate.length === 10 &&
      /^[6-9]/.test(candidate)
    ) {
      return candidate;
    }

    if (
      candidate.length === 12 &&
      candidate.startsWith("91") &&
      /^[6-9]/.test(candidate.slice(2))
    ) {
      return candidate.slice(2);
    }
  }

  return null;
}

function extractPhone(
  address: string,
  contactNumbers: string
) {
  return (
    normalizePhone(contactNumbers) ??
    normalizePhone(address)
  );
}

function cleanAddress(
  address: string,
  extractedPhone: string | null
) {
  if (!address) {
    return null;
  }

  let cleaned = address.trim();

  if (extractedPhone) {
    cleaned = cleaned
      .replace(extractedPhone, "")
      .replace(`91${extractedPhone}`, "");
  }

  cleaned = cleaned
    .replace(/^[,\s-]+/, "")
    .replace(/[,\s-]+$/, "")
    .replace(/\s{2,}/g, " ")
    .trim();

  return cleaned || null;
}

function inferArea(address: string | null) {
  if (!address) {
    return null;
  }

  const parts = address
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length === 0) {
    return null;
  }

  return parts[0].slice(0, 100);
}

async function main() {
  console.log("");
  console.log(
    "=============================================="
  );
  console.log(
    "RAJALAKSHMI STORES CUSTOMER MASTER IMPORT"
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

  const workbookPath = findCustomerWorkbook();

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
    workbook.Sheets["CUSTOMER_DETAILS"];

  if (!worksheet) {
    throw new Error(
      'Sheet "CUSTOMER_DETAILS" not found'
    );
  }

  const rows =
    XLSX.utils.sheet_to_json<LegacyCustomerRow>(
      worksheet,
      {
        range: 1,
        defval: "",
        raw: false,
      }
    );

  console.log(
    `Excel customer rows found: ${rows.length}`
  );

  console.log("");

  let validRows = 0;
  let skippedRows = 0;
  let createdCount = 0;
  let updatedCount = 0;
  let failedCount = 0;

  const seenCodes = new Set<string>();

  for (const row of rows) {
    const customerCode = cleanText(row.Code);

    const name = cleanText(row.Name);

    if (!customerCode || !name) {
      skippedRows += 1;
      continue;
    }

    if (seenCodes.has(customerCode)) {
      console.warn(
        `SKIP DUPLICATE CODE: ${customerCode} - ${name}`
      );

      skippedRows += 1;
      continue;
    }

    seenCodes.add(customerCode);

    const rawAddress = cleanText(row.Address);

    const contactNumbers = cleanText(
      row["Contact Nos"]
    );

    const phone = extractPhone(
      rawAddress,
      contactNumbers
    );

    const address = cleanAddress(
      rawAddress,
      phone
    );

    const area = inferArea(address);

    validRows += 1;

    if (DRY_RUN) {
      if (validRows <= 25) {
        console.log({
          customerCode,
          name,
          phone,
          address,
          area,
          openingBalance: 0,
          balance: 0,
        });
      }

      continue;
    }

    try {
      const existing =
        await prisma.customer.findUnique({
          where: {
            customerCode,
          },
          select: {
            id: true,
          },
        });

      if (existing) {
        await prisma.customer.update({
          where: {
            customerCode,
          },
          data: {
            name,
            phone,
            address,
            area,
            isActive: true,
          },
        });

        updatedCount += 1;
      } else {
        await prisma.customer.create({
          data: {
            customerCode,
            name,
            nameTamil: null,
            phone,
            address,
            area,
            openingBalance: 0,
            balance: 0,
            creditLimit: 0,
            rewardPoints: 0,
            lastVisitDate: null,
            isActive: true,
          },
        });

        createdCount += 1;
      }

      const processed =
        createdCount + updatedCount;

      if (
        processed > 0 &&
        processed % 100 === 0
      ) {
        console.log(
          `Processed ${processed} customers...`
        );
      }
    } catch (error) {
      failedCount += 1;

      console.error(
        `FAILED: ${customerCode} - ${name}`
      );

      console.error(error);
    }
  }

  console.log("");
  console.log(
    "=============================================="
  );
  console.log("CUSTOMER IMPORT SUMMARY");
  console.log(
    "=============================================="
  );

  console.log(`Excel rows: ${rows.length}`);
  console.log(`Valid customers: ${validRows}`);
  console.log(`Skipped rows: ${skippedRows}`);

  if (DRY_RUN) {
    console.log("");
    console.log(
      "DRY RUN COMPLETE - DATABASE WAS NOT MODIFIED"
    );

    console.log(
      "Run with DRY_RUN=false after reviewing the output."
    );
  } else {
    console.log(`Created: ${createdCount}`);
    console.log(`Updated: ${updatedCount}`);
    console.log(`Failed: ${failedCount}`);

    console.log("");
    console.log(
      "LIVE CUSTOMER IMPORT COMPLETE"
    );
  }
}

main()
  .catch((error) => {
    console.error("");
    console.error("CUSTOMER IMPORT FAILED");
    console.error(error);

    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
