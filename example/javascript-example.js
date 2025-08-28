/**
 * JavaScript example showing basic usage of OrderKuota wrapper
 * This demonstrates the functionality without TypeScript typing
 */

import OrderKuota from "../dist/index.js";

async function main() {
  console.log("=== OrderKuota JavaScript Example ===\n");

  const client = new OrderKuota({
    username: "your-username",
    password: "your-password",
  });

  try {
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

    // Step 2: Get token with OTP (mock for demo)
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

    // Step 3: Check balance
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
    const paymentAmount = 15000; // Rp 15,000
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

      // Generate QR code image
      console.log("6. Generating QR code image...");
      try {
        const qrImage = await client.generateQRImage(qrString, {
          width: 256,
          margin: 1,
        });
        console.log(`✅ QR code image generated (base64 format)`);
        console.log(`Image size: ${qrImage.length} characters\n`);
      } catch (qrError) {
        console.log(`❌ QR image generation failed: ${qrError.message}\n`);
      }
    } else {
      console.log(
        `❌ QRIS generation failed: ${qrisResponse.message || "Unknown error"}\n`,
      );
    }

    // Step 6: Try to get QRIS history
    console.log("7. Fetching QRIS transaction history...");
    try {
      const historyResponse = await client.getQRISHistory("qris_history", {
        page: "1",
      });

      if (historyResponse.success !== false) {
        console.log(`✅ QRIS history fetched`);
        const transactions = historyResponse.qris_history?.results || [];
        console.log(`Found ${transactions.length} transactions\n`);
      } else {
        console.log(
          `❌ QRIS history fetch failed: ${historyResponse.message}\n`,
        );
      }
    } catch (historyError) {
      console.log(`❌ QRIS history error: ${historyError.message}\n`);
    }

    // Step 7: Show client status
    console.log("8. Client information...");
    console.log(`Configuration valid: ${client.isConfigValid()}`);
    console.log(`Has authentication token: ${client.hasToken()}`);

    const config = client.getConfig();
    console.log(`Username: ${config.username}`);
    console.log(`Token status: ${config.token ? "Available" : "Not set"}`);

    console.log("\n✅ Example completed successfully!");
  } catch (error) {
    console.error("\n❌ Error occurred:", error.message);
    if (error.code) {
      console.error("Error code:", error.code);
    }
    if (error.status) {
      console.error("HTTP status:", error.status);
    }
  }
}

// Additional helper function to demonstrate error handling
async function demonstrateErrorHandling() {
  console.log("\n=== Error Handling Demo ===");

  try {
    // Try to create client with invalid config
    const invalidClient = new OrderKuota({});
  } catch (error) {
    console.log(`✅ Configuration validation works: ${error.message}`);
  }

  try {
    // Try to use methods without token
    const client = new OrderKuota({
      username: "test",
      password: "test",
    });

    await client.checkBalance();
  } catch (error) {
    console.log(`✅ Token validation works: ${error.message}`);
  }
}

// Run the examples
main()
  .then(() => demonstrateErrorHandling())
  .catch(console.error);
