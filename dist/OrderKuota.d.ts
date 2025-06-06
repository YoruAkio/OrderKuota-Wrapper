import { OrderKuotaConfig, BalanceResponse, QrisHistoryResponse, VirtualAccountHistoryResponse, RetailHistoryResponse } from './types.js';
/**
 * OrderKuota class handles various operations related to order quotas and payment systems.
 *
 * This wrapper provides a TypeScript-friendly interface to the OrderKuota API,
 * including balance checking, transaction history retrieval, and error handling.
 *
 * @example
 * ```typescript
 * import OrderKuota from 'orderkuota';
 *
 * const client = new OrderKuota({
 *   username: 'your-username',
 *   password: 'your-password',
 *   userid: 'your-userid',
 *   apikey: 'your-apikey',
 *   pin: 'your-pin',
 *   baseQrString: 'your-base-qris-string' // Optional, for QRIS generation
 * });
 *
 * // Check balance
 * try {
 *   const balance = await client.checkBalance();
 *   console.log(`Balance: Rp ${balance.balance.toLocaleString()}`);
 * } catch (error) {
 *   if (error instanceof OrderKuotaError) {
 *     console.error(`Error [${error.code}]:`, error.message);
 *   }
 * }
 *
 * // Generate QRIS payment string
 * if (client.isQrisGenerationAvailable()) {
 *   const qrisString = await client.generateQrisString(50000);
 *   console.log('QRIS for 50,000 IDR:', qrisString);
 *
 *   // Generate QR code image from QRIS string
 *   const qrImageBase64 = await client.generateQrisImage(qrisString);
 *   console.log('QR Image Base64:', qrImageBase64);
 *
 *   // Or generate QR code directly with amount
 *   const qrCodeBase64 = await client.generateQrisQrCode(75000, {
 *     width: 256,
 *     color: { dark: '#1a1a1a', light: '#ffffff' }
 *   });
 * }
 *
 * // Fetch transaction history
 * const qrisHistory = await client.fetchQrisHistory();
 * ```
 */
export default class OrderKuota {
    private readonly username;
    private readonly pin;
    private readonly userid;
    private readonly apikey;
    private readonly password;
    private readonly baseQrString?;
    /**
     * Creates a new OrderKuota instance.
     *
     * @param config - Configuration object containing authentication credentials
     * @throws {OrderKuotaError} When required configuration is missing
     *
     * @example
     * ```typescript
     * const client = new OrderKuota({
     *   username: 'your-username',
     *   password: 'your-password',
     *   userid: 'your-userid',
     *   apikey: 'your-apikey',
     *   pin: 'your-pin'
     * });
     * ```
     */
    constructor(config: OrderKuotaConfig);
    /**
     * Checks the current account balance.
     *
     * @returns Promise that resolves to balance information
     * @throws {OrderKuotaError} When the API request fails or returns an error
     *
     * @example
     * ```typescript
     * try {
     *   const balance = await client.checkBalance();
     *   console.log(`Current balance: ${balance.balance}`);
     * } catch (error) {
     *   console.error('Failed to check balance:', error.message);
     * }
     * ```
     */
    checkBalance(): Promise<BalanceResponse>;
    /**
     * Fetches QRIS (Quick Response Code Indonesian Standard) transaction history.
     *
     * @returns Promise that resolves to QRIS transaction history
     * @throws {OrderKuotaError} When the API request fails or returns an error
     *
     * @example
     * ```typescript
     * try {
     *   const history = await client.fetchQrisHistory();
     *   console.log(`Found ${history.data?.length || 0} QRIS transactions`);
     *
     *   if (history.data) {
     *     history.data.forEach(transaction => {
     *       console.log(`${transaction.date}: Rp ${transaction.amount.toLocaleString()}`);
     *     });
     *   }
     * } catch (error) {
     *   if (error instanceof OrderKuotaError) {
     *     console.error(`QRIS History Error [${error.code}]:`, error.message);
     *   }
     * }
     * ```
     */
    fetchQrisHistory(): Promise<QrisHistoryResponse>;
    /**
     * Fetches Virtual Account transaction history.
     *
     * @returns Promise that resolves to Virtual Account transaction history
     * @throws {OrderKuotaError} When the API request fails or returns an error
     *
     * @example
     * ```typescript
     * try {
     *   const history = await client.fetchVirtualAccountHistory();
     *   console.log(`Found ${history.data?.length || 0} VA transactions`);
     *
     *   if (history.data) {
     *     history.data.forEach(transaction => {
     *       console.log(`${transaction.bank_code}: ${transaction.va_number} - Rp ${transaction.amount.toLocaleString()}`);
     *     });
     *   }
     * } catch (error) {
     *   if (error instanceof OrderKuotaError) {
     *     console.error(`VA History Error [${error.code}]:`, error.message);
     *   }
     * }
     * ```
     */
    fetchVirtualAccountHistory(): Promise<VirtualAccountHistoryResponse>;
    /**
     * Fetches retail transaction history.
     *
     * @returns Promise that resolves to retail transaction history
     * @throws {OrderKuotaError} When the API request fails or returns an error
     *
     * @example
     * ```typescript
     * try {
     *   const history = await client.fetchRetailHistory();
     *   console.log(`Found ${history.data?.length || 0} retail transactions`);
     *
     *   if (history.data) {
     *     history.data.forEach(transaction => {
     *       console.log(`${transaction.product_code} -> ${transaction.target}: Rp ${transaction.amount.toLocaleString()}`);
     *     });
     *   }
     * } catch (error) {
     *   if (error instanceof OrderKuotaError) {
     *     console.error(`Retail History Error [${error.code}]:`, error.message);
     *   }
     * }
     * ```
     */
    fetchRetailHistory(): Promise<RetailHistoryResponse>;
    /**
     * Generates a QRIS (Quick Response Code Indonesian Standard) string with the specified amount.
     *
     * This method creates a payment-ready QRIS string that can be converted to a QR code
     * for Indonesian digital payments. The generated string includes the payment amount
     * and maintains proper QRIS format compliance.
     *
     * @param amount - The payment amount in IDR (Indonesian Rupiah)
     * @returns Promise that resolves to the generated QRIS string
     * @throws {OrderKuotaError} When amount is invalid, baseQrString is missing, or generation fails
     *
     * @example
     * ```typescript
     * try {
     *   // Generate QRIS for 50,000 IDR payment
     *   const qrisString = await client.generateQrisString(50000);
     *   console.log('Generated QRIS:', qrisString);
     *
     *   // Convert to QR code using your preferred QR library
     *   // const qrCode = await QR.toDataURL(qrisString);
     * } catch (error) {
     *   if (error instanceof OrderKuotaError) {
     *     console.error(`QRIS Generation Error [${error.code}]:`, error.message);
     *   }
     * }
     * ```
     */
    generateQrisString(amount: number): Promise<string>;
    /**
     * Calculates CRC16 checksum for QRIS string validation.
     *
     * This method implements the CRC16-CCITT algorithm used in QRIS standard
     * to ensure data integrity. The checksum is appended to the end of the
     * QRIS string to validate the QR code content.
     *
     * @param str - The QRIS string to calculate checksum for
     * @returns The 4-character hexadecimal CRC16 checksum
     * @throws {OrderKuotaError} When string is empty or calculation fails
     *
     * @example
     * ```typescript
     * try {
     *   const checksum = client.calculateCRC16(qrisString);
     *   console.log('CRC16 Checksum:', checksum); // e.g., "A1B2"
     * } catch (error) {
     *   console.error('CRC calculation failed:', error.message);
     * }
     * ```
     */
    private calculateCRC16;
    /**
     * Generates a QR code image from a QRIS string and returns it as base64.
     *
     * This method takes a QRIS string (either generated by generateQrisString or provided manually)
     * and converts it into a QR code image. The image is returned as a base64 string that can be
     * directly used in web applications or saved to a file.
     *
     * @param qrisString - The QRIS string to convert to QR code image
     * @param options - Optional QR code generation options
     * @param options.width - Width of the QR code image (default: 512)
     * @param options.margin - Margin around the QR code (default: 4)
     * @param options.color - QR code colors
     * @param options.color.dark - Dark color for QR code modules (default: '#000000')
     * @param options.color.light - Light color for background (default: '#FFFFFF')
     * @returns Promise that resolves to base64 encoded QR code image
     * @throws {OrderKuotaError} When QR code generation fails
     *
     * @example
     * ```typescript
     * try {
     *   // Generate QRIS and convert to QR code image
     *   const qrisString = await client.generateQrisString(50000);
     *   const qrImageBase64 = await client.generateQrisImage(qrisString);
     *
     *   // Use in HTML img tag
     *   const imgSrc = `data:image/png;base64,${qrImageBase64}`;
     *
     *   // Or save to file
     *   const fs = require('fs');
     *   fs.writeFileSync('qr-code.png', qrImageBase64, 'base64');
     * } catch (error) {
     *   if (error instanceof OrderKuotaError) {
     *     console.error(`QR Generation Error [${error.code}]:`, error.message);
     *   }
     * }
     * ```
     */
    generateQrisImage(qrisString: string, options?: {
        width?: number;
        margin?: number;
        color?: {
            dark?: string;
            light?: string;
        };
    }): Promise<string>;
    /**
     * Generates a complete QRIS payment QR code image with the specified amount.
     *
     * This is a convenience method that combines generateQrisString and generateQrisImage
     * in a single call. It generates the QRIS string for the specified amount and
     * immediately converts it to a QR code image.
     *
     * @param amount - The payment amount in IDR (Indonesian Rupiah)
     * @param options - Optional QR code generation options (same as generateQrisImage)
     * @returns Promise that resolves to base64 encoded QR code image
     * @throws {OrderKuotaError} When amount is invalid, baseQrString is missing, or generation fails
     *
     * @example
     * ```typescript
     * try {
     *   // Generate QR code for 100,000 IDR payment in one step
     *   const qrImageBase64 = await client.generateQrisQrCode(100000, {
     *     width: 256,
     *     color: {
     *       dark: '#1a1a1a',
     *       light: '#ffffff'
     *     }
     *   });
     *
     *   // Display in web page
     *   document.getElementById('qr-image').src = `data:image/png;base64,${qrImageBase64}`;
     *
     * } catch (error) {
     *   if (error instanceof OrderKuotaError) {
     *     console.error(`QR Code Generation Error [${error.code}]:`, error.message);
     *   }
     * }
     * ```
     */
    generateQrisQrCode(amount: number, options?: {
        width?: number;
        margin?: number;
        color?: {
            dark?: string;
            light?: string;
        };
    }): Promise<string>;
    /**
     * Gets the current configuration (without sensitive data).
     *
     * @returns Object containing non-sensitive configuration data
     *
     * @example
     * ```typescript
     * const config = client.getConfig();
     * console.log(`User ID: ${config.userid}`);
     * ```
     */
    getConfig(): Omit<OrderKuotaConfig, 'password' | 'pin' | 'apikey' | 'baseQrString'>;
    /**
     * Validates if the current configuration is complete for basic operations.
     * Note: baseQrString is optional and only required for QRIS generation.
     *
     * @returns True if all required fields are present
     *
     * @example
     * ```typescript
     * if (client.isConfigValid()) {
     *   console.log('Configuration is valid for API operations');
     * }
     * ```
     */
    isConfigValid(): boolean;
    /**
     * Checks if QRIS generation is available (baseQrString is configured).
     *
     * @returns True if QRIS generation is available
     *
     * @example
     * ```typescript
     * if (client.isQrisGenerationAvailable()) {
     *   const qrisString = await client.generateQrisString(50000);
     * } else {
     *   console.log('QRIS generation not available - baseQrString not configured');
     * }
     * ```
     */
    isQrisGenerationAvailable(): boolean;
    /**
     * Gets available methods and their descriptions for IDE autocomplete support.
     *
     * @returns Object containing method names and descriptions
     *
     * @example
     * ```typescript
     * const methods = client.getAvailableMethods();
     * console.log(methods);
     * ```
     */
    getAvailableMethods(): {
        checkBalance: string;
        fetchQrisHistory: string;
        fetchVirtualAccountHistory: string;
        fetchRetailHistory: string;
        generateQrisString: string;
        generateQrisImage: string;
        generateQrisQrCode: string;
        getConfig: string;
        isConfigValid: string;
        isQrisGenerationAvailable: string;
        getAvailableMethods: string;
    };
    /**
     * Get API endpoints used by this wrapper (for debugging purposes).
     *
     * @returns Object containing API endpoint URLs
     *
     * @example
     * ```typescript
     * const endpoints = client.getEndpoints();
     * console.log('Balance API:', endpoints.balance);
     * ```
     */
    getEndpoints(): {
        balance: string;
        qrisHistory: string;
        vaHistory: string;
        retailHistory: string;
    };
}
