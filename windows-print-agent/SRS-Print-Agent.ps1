$ErrorActionPreference = "Stop"

$PrinterName = "POS80 Printer"
$Port = 8787
$Prefix = "http://127.0.0.1:$Port/"

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
                "SRS BILL RECEIPT";

            document.pDataType = "RAW";

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
                    EndPagePrinter(printerHandle);
                }
            }
            finally
            {
                EndDocPrinter(printerHandle);
            }
        }
        finally
        {
            ClosePrinter(printerHandle);
        }
    }
}
'@

Add-Type -TypeDefinition $RawPrinterCode

$printer = Get-WmiObject -Class Win32_Printer |
    Where-Object {
        $_.Name -eq $PrinterName
    }

if (-not $printer) {
    Write-Host ""
    Write-Host "ERROR: POS80 Printer was not found."
    Write-Host ""

    Read-Host "Press ENTER to close"

    exit 1
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($Prefix)
$listener.Start()

Write-Host ""
Write-Host "========================================"
Write-Host " SRS PRINT AGENT v1"
Write-Host " S. RAJALAKSHMI STORES"
Write-Host "========================================"
Write-Host ""
Write-Host "Printer : $PrinterName"
Write-Host "Address : $Prefix"
Write-Host ""
Write-Host "STATUS  : READY"
Write-Host ""
Write-Host "Keep this window open while billing."
Write-Host ""

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()

        $request = $context.Request
        $response = $context.Response

        $response.Headers.Add(
            "Access-Control-Allow-Origin",
            "*"
        )

        $response.Headers.Add(
            "Access-Control-Allow-Headers",
            "*"
        )

        $response.Headers.Add(
            "Access-Control-Allow-Methods",
            "GET, POST, OPTIONS"
        )

        $response.Headers.Add(
            "Access-Control-Allow-Private-Network",
            "true"
        )

        if ($request.HttpMethod -eq "OPTIONS") {
            $response.StatusCode = 204
            $response.Close()

            continue
        }

        if (
            $request.HttpMethod -eq "GET" -and
            $request.Url.AbsolutePath -eq "/health"
        ) {
            $result = "READY|POS80 Printer"

            $data = [System.Text.Encoding]::UTF8.GetBytes(
                $result
            )

            $response.StatusCode = 200
            $response.ContentType = "text/plain"
            $response.ContentLength64 = $data.Length

            $response.OutputStream.Write(
                $data,
                0,
                $data.Length
            )

            $response.Close()

            continue
        }

        if (
            $request.HttpMethod -eq "POST" -and
            $request.Url.AbsolutePath -eq "/print"
        ) {
            $reader = New-Object System.IO.StreamReader(
                $request.InputStream,
                [System.Text.Encoding]::UTF8
            )

            $base64 = $reader.ReadToEnd()

            $reader.Close()

            if (
                $null -eq $base64 -or
                $base64.Trim().Length -eq 0
            ) {
                throw "Print data is empty."
            }

            $printBytes = [Convert]::FromBase64String(
                $base64.Trim()
            )

            if ($printBytes.Length -gt 1000000) {
                throw "Print job is too large."
            }

            Write-Host (
                "PRINT JOB: " +
                $printBytes.Length +
                " bytes"
            )

            [SrsRawPrinter]::SendBytes(
                $PrinterName,
                $printBytes
            )

            $result = "PRINTED"

            $data = [System.Text.Encoding]::UTF8.GetBytes(
                $result
            )

            $response.StatusCode = 200
            $response.ContentType = "text/plain"
            $response.ContentLength64 = $data.Length

            $response.OutputStream.Write(
                $data,
                0,
                $data.Length
            )

            $response.Close()

            Write-Host "PRINTED SUCCESSFULLY"

            continue
        }

        $response.StatusCode = 404
        $response.Close()
    }
    catch {
        Write-Host ""
        Write-Host "PRINT AGENT ERROR:"
        Write-Host $_.Exception.Message
        Write-Host ""

        try {
            $message = $_.Exception.Message

            $data = [System.Text.Encoding]::UTF8.GetBytes(
                $message
            )

            $response.StatusCode = 500
            $response.ContentType = "text/plain"
            $response.ContentLength64 = $data.Length

            $response.OutputStream.Write(
                $data,
                0,
                $data.Length
            )

            $response.Close()
        }
        catch {
        }
    }
}
