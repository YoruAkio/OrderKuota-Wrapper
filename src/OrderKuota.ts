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
 * OrderKuota API wrapper for TypeScript.
 *
 * Provides balance checking, transaction history, and QRIS payment generation.
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
 *
 * const balance = await client.checkBalance();
 * const qrisCode = await client.generateQrisQrCode(50000);
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
     * Create OrderKuota client instance.
     *
     * @param config - Configuration with authentication credentials
     * @throws {OrderKuotaError} When required config is missing
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
     * Check account balance.
     *
     * @returns Promise with balance information
     * @throws {OrderKuotaError} When API request fails
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
     * Fetch QRIS transaction history.
     *
     * @returns Promise with QRIS transaction history
     * @throws {OrderKuotaError} When API request fails
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
     * Fetch Virtual Account transaction history.
     *
     * @returns Promise with Virtual Account transaction history
     * @throws {OrderKuotaError} When API request fails
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
     * Fetch retail transaction history.
     *
     * @returns Promise with retail transaction history
     * @throws {OrderKuotaError} When API request fails
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
     * Generate QRIS string for payment amount.
     *
     * @param amount - Payment amount in IDR
     * @returns Promise with QRIS string
     * @throws {OrderKuotaError} When amount is invalid or baseQrString missing
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
     * Calculate CRC16 checksum for QRIS validation.
     *
     * @param str - QRIS string to checksum
     * @returns 4-character hexadecimal checksum
     * @throws {OrderKuotaError} When string is empty or calculation fails
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
     * Generate QR code image from QRIS string.
     *
     * @param qrisString - QRIS string to convert
     * @param options - QR code options (width, margin, colors)
     * @returns Promise with base64 encoded QR code image
     * @throws {OrderKuotaError} When generation fails
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
     * Generate complete QRIS QR code image with amount.
     *
     * @param amount - Payment amount in IDR
     * @param options - QR code options (width, margin, colors)
     * @returns Promise with base64 encoded QR code image
     * @throws {OrderKuotaError} When generation fails
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
     * Get current configuration (without sensitive data).
     *
     * @returns Object with non-sensitive config data
     */
    getConfig(): Omit<OrderKuotaConfig, 'password' | 'pin' | 'apikey' | 'baseQrString'> {
        return {
            username: this.username,
            userid: this.userid
        };
    }

    /**
     * Validate if configuration is complete for basic operations.
     * Note: baseQrString is optional, only required for QRIS generation.
     *
     * @returns True if all required fields are present
     */
    isConfigValid(): boolean {
        return !!(this.username && this.pin && this.userid && this.apikey && this.password);
    }

    /**
     * Check if QRIS generation is available.
     *
     * @returns True if baseQrString is configured
     */
    isQrisGenerationAvailable(): boolean {
        return !!(this.baseQrString && this.baseQrString.includes("5802ID"));
    }

    /**
     * Get available methods and descriptions for IDE autocomplete.
     *
     * @returns Object with method names and descriptions
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
     * Get API endpoints for debugging.
     *
     * @returns Object with API endpoint URLs
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