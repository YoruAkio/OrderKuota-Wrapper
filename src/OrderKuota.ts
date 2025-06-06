import axios, { AxiosResponse, AxiosError } from 'axios';
import * as QRCode from 'qrcode';
import { 
    OrderKuotaConfig, 
    BalanceResponse, 
    QrisHistoryResponse,
    VirtualAccountHistoryResponse,
    RetailHistoryResponse,
    OrderKuotaError,
    OrderKuotaErrorCode
} from './types.js';

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
    private readonly username: string;
    private readonly pin: string;
    private readonly userid: string;
    private readonly apikey: string;
    private readonly password: string;
    private readonly baseQrString?: string;

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
    constructor(config: OrderKuotaConfig) {
        // Validate required fields
        if (!config.username || !config.password || !config.userid || !config.apikey || !config.pin) {
            throw new OrderKuotaError(
                'Missing required configuration. All fields (username, password, userid, apikey, pin) are required.',
                'MISSING_CONFIG'
            );
        }

        this.username = config.username;
        this.pin = config.pin;
        this.userid = config.userid;
        this.apikey = config.apikey;
        this.password = config.password;
        this.baseQrString = config.baseQrString;
    }

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
    async checkBalance(): Promise<BalanceResponse> {
        try {
            const url = `https://h2h.okeconnect.com/trx/balance?memberID=${this.userid}&pin=${this.pin}&password=${this.password}`;
            const response: AxiosResponse<string> = await axios.get(url);
            
            // Handle string response (most common case)
            if (typeof response.data === 'string') {
                const balanceText = response.data.trim();
                
                // If empty response, treat as error
                if (!balanceText) {
                    throw new OrderKuotaError(
                        'Empty response from balance API',
                        'EMPTY_RESPONSE'
                    );
                }
                
                // Check for common error indicators
                if (balanceText.toLowerCase().includes('error') || 
                    balanceText.toLowerCase().includes('failed') ||
                    balanceText.toLowerCase().includes('invalid') ||
                    balanceText.toLowerCase().includes('unauthorized') ||
                    balanceText.toLowerCase().includes('access denied')) {
                    throw new OrderKuotaError(
                        `API Error: ${balanceText}`,
                        'API_ERROR'
                    );
                }
                
                // Parse balance from text like "Saldo Rp 1.234.567" or "Saldo 1.247"
                const balanceMatch = balanceText.match(/(?:saldo\s*)?(?:rp\s*)?([\d.,]+)/i);
                let balance = 0;
                
                if (balanceMatch) {
                    // Remove dots (thousands separator) and convert comma to decimal point
                    const balanceStr = balanceMatch[1].replace(/\./g, '').replace(/,/g, '.');
                    balance = parseFloat(balanceStr) || 0;
                } else {
                    // If we can't parse the balance, log the response for debugging
                    console.warn('Could not parse balance from response:', balanceText);
                }
                
                return {
                    status: true,
                    message: balanceText,
                    balance: balance
                };
            }
            
            // Handle JSON response (fallback)
            const jsonData = response.data as any;
            if (jsonData && typeof jsonData === 'object') {
                if (!jsonData.status) {
                    throw new OrderKuotaError(
                        jsonData.message || 'Balance check failed',
                        'BALANCE_CHECK_FAILED'
                    );
                }
                return {
                    status: jsonData.status,
                    message: jsonData.message || 'Success',
                    balance: jsonData.balance || 0
                };
            }
            
            // If we can't parse the response at all
            throw new OrderKuotaError(
                'Invalid response format from balance API',
                'INVALID_RESPONSE'
            );
            
        } catch (error) {
            if (error instanceof OrderKuotaError) {
                throw error;
            }
            
            if (axios.isAxiosError(error)) {
                const status = error.response?.status;
                const message = error.response?.data || error.message;
                
                throw new OrderKuotaError(
                    `Network error: ${message}`,
                    'NETWORK_ERROR',
                    status
                );
            }
            
            throw new OrderKuotaError(
                'Unknown error occurred while checking balance',
                'UNKNOWN_ERROR'
            );
        }
    }

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
    async fetchQrisHistory(): Promise<QrisHistoryResponse> {
        try {
            const url = `https://gateway.okeconnect.com/api/mutasi/qris/${this.userid}/${this.apikey}`;
            const response: AxiosResponse<QrisHistoryResponse> = await axios.get(url);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const status = error.response?.status;
                const message = error.response?.data?.message || error.message;
                
                throw new OrderKuotaError(
                    `Failed to fetch QRIS history: ${message}`,
                    'QRIS_FETCH_FAILED',
                    status
                );
            }
            
            throw new OrderKuotaError(
                'Unknown error occurred while fetching QRIS history',
                'UNKNOWN_ERROR'
            );
        }
    }

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
    async fetchVirtualAccountHistory(): Promise<VirtualAccountHistoryResponse> {
        try {
            const url = `https://gateway.okeconnect.com/api/mutasi/va/${this.userid}/${this.apikey}`;
            const response: AxiosResponse<VirtualAccountHistoryResponse> = await axios.get(url);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const status = error.response?.status;
                const message = error.response?.data?.message || error.message;
                
                throw new OrderKuotaError(
                    `Failed to fetch Virtual Account history: ${message}`,
                    'VA_FETCH_FAILED',
                    status
                );
            }
            
            throw new OrderKuotaError(
                'Unknown error occurred while fetching Virtual Account history',
                'UNKNOWN_ERROR'
            );
        }
    }

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
    async fetchRetailHistory(): Promise<RetailHistoryResponse> {
        try {
            const url = `https://gateway.okeconnect.com/api/mutasi/retail/${this.userid}/${this.apikey}`;
            const response: AxiosResponse<RetailHistoryResponse> = await axios.get(url);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const status = error.response?.status;
                const message = error.response?.data?.message || error.message;
                
                throw new OrderKuotaError(
                    `Failed to fetch retail history: ${message}`,
                    'RETAIL_FETCH_FAILED',
                    status
                );
            }
            
            throw new OrderKuotaError(
                'Unknown error occurred while fetching retail history',
                'UNKNOWN_ERROR'
            );
        }
    }

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
    async generateQrisString(amount: number): Promise<string> {
        try {
            // Validate amount parameter
            if (!amount || amount <= 0) {
                throw new OrderKuotaError(
                    'Amount must be greater than 0',
                    'INVALID_AMOUNT'
                );
            }

            // Check if baseQrString is configured
            if (!this.baseQrString) {
                throw new OrderKuotaError(
                    'Base QR string is required for QRIS generation. Please provide baseQrString in configuration.',
                    'MISSING_BASE_QR_STRING'
                );
            }

            // Validate QRIS format - must contain Indonesian country code
            if (!this.baseQrString.includes("5802ID")) {
                throw new OrderKuotaError(
                    'Invalid QRIS format: missing Indonesian country code (5802ID)',
                    'INVALID_QRIS_FORMAT'
                );
            }

            // Convert amount to integer (remove decimal places)
            const finalAmount = Math.floor(amount);

            // Prepare base QRIS string by removing last 4 characters (CRC) and updating version
            // Change from static (010211) to dynamic (010212) QRIS
            const qrisBase = this.baseQrString.slice(0, -4).replace("010211", "010212");

            // Create amount tag in QRIS format
            // Format: 54 + length + amount
            // 54 = Transaction Amount tag
            const nominalStr = finalAmount.toString();
            const nominalTag = `54${nominalStr.length.toString().padStart(2, '0')}${nominalStr}`;

            // Find insertion position (before country code)
            const insertPosition = qrisBase.indexOf("5802ID");
            if (insertPosition === -1) {
                throw new OrderKuotaError(
                    'Invalid QRIS format: cannot find country code position',
                    'INVALID_QRIS_FORMAT'
                );
            }

            // Insert amount tag before country code
            const qrisWithNominal = qrisBase.slice(0, insertPosition) + nominalTag + qrisBase.slice(insertPosition);

            // Calculate and append CRC16 checksum
            const checksum = this.calculateCRC16(qrisWithNominal);
            
            return qrisWithNominal + checksum;

        } catch (error) {
            if (error instanceof OrderKuotaError) {
                throw error;
            }
            
            throw new OrderKuotaError(
                `Failed to generate QRIS string: ${error instanceof Error ? error.message : 'Unknown error'}`,
                'QRIS_GENERATION_FAILED'
            );
        }
    }

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
    private calculateCRC16(str: string): string {
        try {
            // Validate input string
            if (!str || str.length === 0) {
                throw new OrderKuotaError(
                    'String cannot be empty for CRC16 calculation',
                    'CRC_CALCULATION_FAILED'
                );
            }

            // Initialize CRC with all bits set (0xFFFF)
            let crc = 0xFFFF;

            // Process each character in the string
            for (let i = 0; i < str.length; i++) {
                // XOR the character with the high byte of CRC
                crc ^= str.charCodeAt(i) << 8;
                
                // Process each bit
                for (let j = 0; j < 8; j++) {
                    // If MSB is set, shift left and XOR with polynomial
                    // 0x1021 is the CRC16-CCITT polynomial
                    crc = (crc & 0x8000) ? ((crc << 1) ^ 0x1021) : (crc << 1);
                }
                
                // Keep only 16 bits
                crc &= 0xFFFF;
            }

            // Convert to uppercase hexadecimal string with padding
            return crc.toString(16).toUpperCase().padStart(4, '0');

        } catch (error) {
            if (error instanceof OrderKuotaError) {
                throw error;
            }
            
            throw new OrderKuotaError(
                `Failed to calculate CRC16: ${error instanceof Error ? error.message : 'Unknown error'}`,
                'CRC_CALCULATION_FAILED'
            );
        }
    }

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
    async generateQrisImage(
        qrisString: string, 
        options: {
            width?: number;
            margin?: number;
            color?: {
                dark?: string;
                light?: string;
            };
        } = {}
    ): Promise<string> {
        try {
            // Validate QRIS string input
            if (!qrisString || qrisString.trim().length === 0) {
                throw new OrderKuotaError(
                    'QRIS string cannot be empty',
                    'INVALID_QRIS_STRING'
                );
            }

            // Set default options
            const qrOptions = {
                width: options.width || 512,
                margin: options.margin || 4,
                color: {
                    dark: options.color?.dark || '#000000',
                    light: options.color?.light || '#FFFFFF'
                },
                type: 'image/png' as const
            };

            // Generate QR code as base64
            const qrImageDataUrl = await QRCode.toDataURL(qrisString, qrOptions);
            
            // Extract base64 data (remove data:image/png;base64, prefix)
            const base64Data = qrImageDataUrl.split(',')[1];
            
            if (!base64Data) {
                throw new OrderKuotaError(
                    'Failed to extract base64 data from QR code',
                    'QR_GENERATION_FAILED'
                );
            }

            return base64Data;

        } catch (error) {
            if (error instanceof OrderKuotaError) {
                throw error;
            }
            
            throw new OrderKuotaError(
                `Failed to generate QR code image: ${error instanceof Error ? error.message : 'Unknown error'}`,
                'QR_GENERATION_FAILED'
            );
        }
    }

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
    async generateQrisQrCode(
        amount: number,
        options: {
            width?: number;
            margin?: number;
            color?: {
                dark?: string;
                light?: string;
            };
        } = {}
    ): Promise<string> {
        try {
            // Generate QRIS string first
            const qrisString = await this.generateQrisString(amount);
            
            // Convert to QR code image
            return await this.generateQrisImage(qrisString, options);

        } catch (error) {
            if (error instanceof OrderKuotaError) {
                throw error;
            }
            
            throw new OrderKuotaError(
                `Failed to generate QRIS QR code: ${error instanceof Error ? error.message : 'Unknown error'}`,
                'QR_GENERATION_FAILED'
            );
        }
    }

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
    getConfig(): Omit<OrderKuotaConfig, 'password' | 'pin' | 'apikey' | 'baseQrString'> {
        return {
            username: this.username,
            userid: this.userid
        };
    }

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
    isConfigValid(): boolean {
        return !!(this.username && this.pin && this.userid && this.apikey && this.password);
    }

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
    isQrisGenerationAvailable(): boolean {
        return !!(this.baseQrString && this.baseQrString.includes("5802ID"));
    }

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
    getAvailableMethods() {
        return {
            checkBalance: 'Check current account balance',
            fetchQrisHistory: 'Fetch QRIS transaction history',
            fetchVirtualAccountHistory: 'Fetch Virtual Account transaction history', 
            fetchRetailHistory: 'Fetch retail transaction history',
            generateQrisString: 'Generate QRIS payment string with specified amount',
            generateQrisImage: 'Generate QR code image from QRIS string and return as base64',
            generateQrisQrCode: 'Generate complete QRIS QR code image with specified amount',
            getConfig: 'Get current configuration (without sensitive data)',
            isConfigValid: 'Validate if configuration is complete for basic operations',
            isQrisGenerationAvailable: 'Check if QRIS generation is available',
            getAvailableMethods: 'Get list of available methods'
        };
    }

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
    getEndpoints() {
        return {
            balance: `https://h2h.okeconnect.com/trx/balance?memberID=${this.userid}&pin=${this.pin}&password=${this.password}`,
            qrisHistory: `https://gateway.okeconnect.com/api/mutasi/qris/${this.userid}/${this.apikey}`,
            vaHistory: `https://gateway.okeconnect.com/api/mutasi/va/${this.userid}/${this.apikey}`,
            retailHistory: `https://gateway.okeconnect.com/api/mutasi/retail/${this.userid}/${this.apikey}`
        };
    }
}