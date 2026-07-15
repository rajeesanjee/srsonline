$ErrorActionPreference = "Stop"

$PrinterName = "POS80 Printer"

Write-Host ""
Write-Host "========================================"
Write-Host " S. RAJALAKSHMI STORES"
Write-Host " POS80 RAW PRINTER TEST"
Write-Host "========================================"
Write-Host ""

Write-Host "Checking Windows printer..."
Write-Host "Printer name: $PrinterName"
Write-Host ""

$printer = Get-WmiObject -Class Win32_Printer |
    Where-Object {
        $_.Name -eq $PrinterName
    }

if (-not $printer) {
    Write-Host "ERROR: Printer not found."
    Write-Host ""
    Write-Host "Available printers:"
    Write-Host ""

    Get-WmiObject -Class Win32_Printer |
        Select-Object Name |
        Format-Table -AutoSize

    Read-Host "Press ENTER to close"

    exit 1
}

Write-Host "Printer found."
Write-Host "Status: $($printer.PrinterStatus)"
Write-Host ""

$RawPrinterCode = @'
using System;
using System.ComponentModel;
using System.Runtime.InteropServices;

public static class SrsRawPrinter
{
    [StructLayout(
        LayoutKind.Sequential,
        CharSet = CharSet.Unicode
    )]
    public class DOC_INFO_1
    {
        [MarshalAs(UnmanagedType.LPWStr)]
        public string pDocName;

        [MarshalAs(UnmanagedType.LPWStr)]
        public string pOutputFile;

        [MarshalAs(UnmanagedType.LPWStr)]
        public string pDataType;
    }

    [DllImport(
        "winspool.drv",
        SetLastError = true,
        CharSet = CharSet.Unicode
    )]
    private static extern bool OpenPrinter(
        string szPrinter,
        out IntPtr hPrinter,
        IntPtr pd
    );

    [DllImport(
        "winspool.drv",
        SetLastError = true
    )]
    private static extern bool ClosePrinter(
        IntPtr hPrinter
    );

    [DllImport(
        "winspool.drv",
        SetLastError = true,
        CharSet = CharSet.Unicode
    )]
    private static extern int StartDocPrinter(
        IntPtr hPrinter,
        int level,
        [In] DOC_INFO_1 di
    );

    [DllImport(
        "winspool.drv",
        SetLastError = true
    )]
    private static extern bool EndDocPrinter(
        IntPtr hPrinter
    );

    [DllImport(
        "winspool.drv",
        SetLastError = true
    )]
    private static extern bool StartPagePrinter(
        IntPtr hPrinter
    );

    [DllImport(
        "winspool.drv",
        SetLastError = true
    )]
    private static extern bool EndPagePrinter(
        IntPtr hPrinter
    );

    [DllImport(
        "winspool.drv",
        SetLastError = true
    )]
    private static extern bool WritePrinter(
        IntPtr hPrinter,
        byte[] pBytes,
        int dwCount,
        out int dwWritten
    );

    public static void SendBytes(
        string printerName,
        byte[] bytes
    )
    {
        IntPtr printerHandle;

        if (!OpenPrinter(
            printerName,
            out printerHandle,
            IntPtr.Zero
        ))
        {
            throw new Win32Exception(
                Marshal.GetLastWin32Error(),
                "Unable to open printer."
            );
        }

        try
        {
            DOC_INFO_1 document =
                new DOC_INFO_1();

            document.pDocName =
                "SRS POS80 RAW TEST";

            document.pDataType =
                "RAW";

            int jobId = StartDocPrinter(
                printerHandle,
                1,
                document
            );

            if (jobId == 0)
            {
                throw new Win32Exception(
                    Marshal.GetLastWin32Error(),
                    "Unable to start print job."
                );
            }

            try
            {
                if (!StartPagePrinter(
                    printerHandle
                ))
                {
                    throw new Win32Exception(
                        Marshal.GetLastWin32Error(),
                        "Unable to start printer page."
                    );
                }

                try
                {
                    int written;

                    bool success = WritePrinter(
                        printerHandle,
                        bytes,
                        bytes.Length,
                        out written
                    );

                    if (!success)
                    {
                        throw new Win32Exception(
                            Marshal.GetLastWin32Error(),
                            "Unable to write printer data."
                        );
                    }

                    if (written != bytes.Length)
                    {
                        throw new Exception(
                            "Printer accepted only part of the receipt."
                        );
                    }
                }
                finally
                {
                    EndPagePrinter(
                        printerHandle
                    );
                }
            }
            finally
            {
                EndDocPrinter(
                    printerHandle
                );
            }
        }
        finally
        {
            ClosePrinter(
                printerHandle
            );
        }
    }
}
'@

Add-Type -TypeDefinition $RawPrinterCode

$ESC = [byte]27
$GS = [byte]29
$LF = [byte]10

$bytes = New-Object `
    System.Collections.Generic.List[byte]

function Add-Bytes {
    param(
        [byte[]]$Data
    )

    $bytes.AddRange($Data)
}

function Add-Text {
    param(
        [string]$Text
    )

    $encoded = [System.Text.Encoding]::ASCII.GetBytes(
        $Text
    )

    $bytes.AddRange($encoded)
}

# ESC @
# Initialize printer
Add-Bytes ([byte[]]@(
    $ESC,
    64
))

# ESC a 1
# Center align
Add-Bytes ([byte[]]@(
    $ESC,
    97,
    1
))

# ESC E 1
# Bold ON
Add-Bytes ([byte[]]@(
    $ESC,
    69,
    1
))

# GS ! 17
# Double width and double height
Add-Bytes ([byte[]]@(
    $GS,
    33,
    17
))

Add-Text "S. RAJALAKSHMI"
Add-Bytes ([byte[]]@($LF))

Add-Text "STORES"
Add-Bytes ([byte[]]@($LF))

# GS ! 0
# Normal size
Add-Bytes ([byte[]]@(
    $GS,
    33,
    0
))

Add-Text "WHOLESALE & RETAIL PROVISIONS"
Add-Bytes ([byte[]]@($LF))

# Bold OFF
Add-Bytes ([byte[]]@(
    $ESC,
    69,
    0
))

Add-Text "No.39, Saidapet Road"
Add-Bytes ([byte[]]@($LF))

Add-Text "Vadapalani, Chennai - 26"
Add-Bytes ([byte[]]@($LF))

Add-Text "Phone: 9025725928, 8925112312"
Add-Bytes ([byte[]]@($LF))

Add-Text "------------------------------------------"
Add-Bytes ([byte[]]@($LF))

# Bold ON
Add-Bytes ([byte[]]@(
    $ESC,
    69,
    1
))

Add-Text "SRS DIRECT POS PRINT TEST"
Add-Bytes ([byte[]]@($LF))

# Bold OFF
Add-Bytes ([byte[]]@(
    $ESC,
    69,
    0
))

Add-Text "Printer: POS80 Printer"
Add-Bytes ([byte[]]@($LF))

Add-Text "80MM RAW ESC/POS"
Add-Bytes ([byte[]]@($LF))

Add-Text "------------------------------------------"
Add-Bytes ([byte[]]@($LF))

Add-Text "THIS IS A SMALL TEST RECEIPT"
Add-Bytes ([byte[]]@($LF))

Add-Text "ONLY ONE RECEIPT SHOULD PRINT"
Add-Bytes ([byte[]]@($LF))

Add-Text "------------------------------------------"
Add-Bytes ([byte[]]@($LF))

# Bold ON
Add-Bytes ([byte[]]@(
    $ESC,
    69,
    1
))

Add-Text "THANK YOU"
Add-Bytes ([byte[]]@($LF))

# Bold OFF
Add-Bytes ([byte[]]@(
    $ESC,
    69,
    0
))

# Feed exactly 4 lines
Add-Bytes ([byte[]]@(
    $ESC,
    100,
    4
))

# Partial cut
Add-Bytes ([byte[]]@(
    $GS,
    86,
    1
))

$printData = $bytes.ToArray()

Write-Host "RAW receipt size: $($printData.Length) bytes"
Write-Host ""
Write-Host "IMPORTANT:"
Write-Host "This test sends one small RAW ESC/POS job."
Write-Host ""

$answer = Read-Host "Type PRINT to send the test"

if ($answer -ne "PRINT") {
    Write-Host ""
    Write-Host "Test cancelled."

    exit 0
}

Write-Host ""
Write-Host "Sending RAW print job..."

[SrsRawPrinter]::SendBytes(
    $PrinterName,
    $printData
)

Write-Host ""
Write-Host "PRINT JOB SENT SUCCESSFULLY."
Write-Host ""

Read-Host "Press ENTER to close"
