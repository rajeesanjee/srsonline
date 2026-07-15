const SRS_PRINT_AGENT_URL =
  "http://127.0.0.1:8787";

export type SrsPrintAgentStatus = {
  ready: boolean;
  printer: string | null;
  message: string;
};

export async function checkSrsPrintAgent():
  Promise<SrsPrintAgentStatus> {
  try {
    const response = await fetch(
      `${SRS_PRINT_AGENT_URL}/health`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return {
        ready: false,
        printer: null,
        message: `Print Agent returned ${response.status}`,
      };
    }

    const result = (
      await response.text()
    ).trim();

    const [status, printer] =
      result.split("|");

    if (status !== "READY") {
      return {
        ready: false,
        printer: printer || null,
        message: result,
      };
    }

    return {
      ready: true,
      printer: printer || null,
      message: result,
    };
  } catch {
    return {
      ready: false,
      printer: null,
      message:
        "SRS Print Agent is not running.",
    };
  }
}

export async function sendRawReceiptToSrsAgent(
  receiptBytes: Uint8Array
): Promise<void> {
  const binaryParts: string[] = [];

  const chunkSize = 8192;

  for (
    let offset = 0;
    offset < receiptBytes.length;
    offset += chunkSize
  ) {
    const chunk = receiptBytes.subarray(
      offset,
      offset + chunkSize
    );

    binaryParts.push(
      String.fromCharCode(...chunk)
    );
  }

  const base64 = btoa(
    binaryParts.join("")
  );

  const response = await fetch(
    `${SRS_PRINT_AGENT_URL}/print`,
    {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
      },
      body: base64,
    }
  );

  const result = (
    await response.text()
  ).trim();

  if (
    !response.ok ||
    result !== "PRINTED"
  ) {
    throw new Error(
      result ||
        "POS80 direct printing failed."
    );
  }
}
