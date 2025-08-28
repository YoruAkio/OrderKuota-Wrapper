import OrderKuota, { OrderKuotaError } from "../src/index.js";

/**
 * Example demonstrating TypeScript usage of OrderKuota wrapper
 * This example shows proper type safety and IDE intellisense support
 */

async function main() {
  // Initialize with proper typing - only username and password are required
  const client = new OrderKuota({
    username: "your-username",
    password: "your-password",
  });

  try {
    console.log("=== OrderKuota TypeScript Example ===\n");

    // Step 1: Request OTP
    console.log("1. Requesting OTP...");
    const otpResponse = await client.getOTP();

    if (otpResponse.status === "success") {
      console.log(`✅ OTP sent to: ${otpResponse.email}`);
      console.log(`Message: ${otpResponse.message}\n`);
    } else {
      console.log(`❌ OTP request failed: ${otpResponse.message}\n`);
      return;
    }

    // Step 2: Get token with OTP (you would use actual OTP from email)
    console.log("2. Getting authentication token...");
    console.log("⚠️  In real usage, enter the OTP received via email");
    const mockOtp = "123456"; // Replace with actual OTP

    const tokenResponse = await client.getToken(mockOtp);

    if (tokenResponse.status === "success") {
      console.log(`✅ Token obtained successfully`);
      console.log(`User: ${tokenResponse.name} (${tokenResponse.username})`);
      console.log(`Balance: Rp ${tokenResponse.balance}`);
      console.log(`Token: ${tokenResponse.token?.substring(0, 20)}...\n`);
    } else {
      console.log(`❌ Token request failed: ${tokenResponse.message}\n`);
      return;
    }

    // Step 3: Check balance using menu data
    console.log("3. Checking account balance...");
    const balanceResponse = await client.checkBalance();

    if (balanceResponse.success) {
      console.log(
        `✅ Current Balance: Rp ${balanceResponse.balance?.toLocaleString("id-ID")}`,
      );
      console.log(
        `QRIS Balance: Rp ${balanceResponse.qris_balance?.toLocaleString("id-ID")}\n`,
      );
    } else {
      console.log(`❌ Balance check failed: ${balanceResponse.message}\n`);
    }

    // Step 4: Fetch QRIS menu
    console.log("4. Fetching QRIS menu...");
    const menuResponse = await client.fetchQrisMenu();

    if (menuResponse.success !== false) {
      console.log(`✅ QRIS menu fetched successfully`);
      console.log(
        `Account status: ${menuResponse.account?.success ? "Active" : "Inactive"}\n`,
      );
    } else {
      console.log(`❌ QRIS menu fetch failed: ${menuResponse.message}\n`);
    }

    // Step 5: Generate QRIS payment
    console.log("5. Generating QRIS payment...");
    const paymentAmount = 10000; // Rp 10,000
    const qrisResponse = await client.generateQRISAjaib(paymentAmount);

    if (
      qrisResponse.success !== false &&
      qrisResponse.qris_ajaib?.results?.qr_string
    ) {
      console.log(
        `✅ QRIS payment generated for Rp ${paymentAmount.toLocaleString("id-ID")}`,
      );
      const qrString = qrisResponse.qris_ajaib.results.qr_string;
      console.log(`QR String: ${qrString.substring(0, 50)}...\n`);

      // Step 6: Generate QR code image
      console.log("6. Generating QR code image...");
      try {
        const qrImage = await client.generateQRImage(qrString, {
          width: 300,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#FFFFFF",
          },
        });
        console.log(`✅ QR code image generated (base64 format)`);
        console.log(`Image data: ${qrImage.substring(0, 50)}...\n`);
      } catch (qrError) {
        console.log(
          `❌ QR image generation failed: ${qrError instanceof Error ? qrError.message : qrError}\n`,
        );
      }
    } else {
      console.log(
        `❌ QRIS generation failed: ${qrisResponse.message || "Unknown error"}\n`,
      );
    }

    // Step 7: Get QRIS history
    console.log("7. Fetching QRIS transaction history...");
    const historyResponse = await client.getQRISHistory("qris_history", {
      page: "1",
    });

    if (historyResponse.success !== false) {
      console.log(`✅ QRIS history fetched`);
      const transactions = historyResponse.qris_history?.results || [];
      console.log(`Found ${transactions.length} transactions\n`);
    } else {
      console.log(`❌ QRIS history fetch failed: ${historyResponse.message}\n`);
    }

    // Step 8: Demonstrate utility methods
    console.log("8. Client configuration and status...");
    console.log(`Config valid: ${client.isConfigValid()}`);
    console.log(`Has token: ${client.hasToken()}`);

    const config = client.getConfig();
    console.log(`Username: ${config.username}`);
    console.log(`Token available: ${config.token ? "Yes" : "No"}`);
  } catch (error) {
    // Type-safe error handling
    if (error instanceof OrderKuotaError) {
      console.error(`\n❌ OrderKuota Error [${error.code}]:`, error.message);
      if (error.status) {
        console.error(`HTTP Status: ${error.status}`);
      }
    } else {
      console.error("\n❌ Unknown error:", error);
    }
  }
}

/**
 * Example of proper TypeScript usage with IDE autocomplete
 * When you type "client." in your IDE, you'll see all available methods
 */
function demonstrateTypeSafety() {
  const client = new OrderKuota({
    username: "demo",
    password: "demo",
  });

  // IDE will show these available methods with full type information:
  // - getOTP(): Promise<any>
  // - getToken(otp: string): Promise<any>
  // - getQRISHistory(historyType?: string, options?: HistoryOptions): Promise<any>
  // - fetchQrisMenu(): Promise<any>
  // - generateQRISAjaib(amount?: number): Promise<any>
  // - checkBalance(): Promise<any>
  // - generateQRImage(qrisString: string, options?: QRCodeToDataURLOptions): Promise<string>
  // - setToken(token: string): void
  // - getTokenValue(): string | undefined
  // - getConfig(): Omit<OrderKuotaConfig, 'password'>
  // - isConfigValid(): boolean
  // - hasToken(): boolean

  return client;
}

// Run the example
if (require.main === module) {
  main().catch(console.error);
}

export { main, demonstrateTypeSafety };
