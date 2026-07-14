import * as XLSX from "xlsx";
import path from "node:path";

const workbookPath = path.join(
  process.cwd(),
  "imports",
  "product list 14th july.xls"
);

function main() {
  console.log("");
  console.log("========================================");
  console.log("RAJALAKSHMI STORES PRODUCT FILE INSPECT");
  console.log("========================================");
  console.log("");

  console.log("Reading:");
  console.log(workbookPath);
  console.log("");

  const workbook = XLSX.readFile(workbookPath, {
    cellDates: true,
    raw: false,
  });

  console.log("WORKBOOK SHEETS");
  console.log("----------------");

  workbook.SheetNames.forEach(
    (sheetName, index) => {
      console.log(
        `${index + 1}. ${sheetName}`
      );
    }
  );

  console.log("");

  for (const sheetName of workbook.SheetNames) {
    const worksheet =
      workbook.Sheets[sheetName];

    if (!worksheet) {
      continue;
    }

    const rows = XLSX.utils.sheet_to_json<
      unknown[]
    >(worksheet, {
      header: 1,
      defval: "",
      raw: false,
    });

    console.log("========================================");
    console.log(`SHEET: ${sheetName}`);
    console.log(`ROW COUNT: ${rows.length}`);
    console.log("========================================");

    const previewRows = rows.slice(0, 15);

    previewRows.forEach((row, index) => {
      console.log("");
      console.log(`ROW ${index + 1}`);

      if (Array.isArray(row)) {
        row.forEach((value, columnIndex) => {
          console.log(
            `  COLUMN ${columnIndex + 1}:`,
            JSON.stringify(value)
          );
        });
      } else {
        console.log(row);
      }
    });

    console.log("");
  }
}

try {
  main();
} catch (error) {
  console.error("");
  console.error("EXCEL INSPECTION FAILED");
  console.error("");

  if (error instanceof Error) {
    console.error(error.message);
    console.error(error.stack);
  } else {
    console.error(error);
  }

  process.exitCode = 1;
}