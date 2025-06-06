import axios, { AxiosResponse, AxiosError } from 'axios';
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
 *   pin: 'your-pin'
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
    getConfig(): Omit<OrderKuotaConfig, 'password' | 'pin' | 'apikey'> {
        return {
            username: this.username,
            userid: this.userid
        };
    }

    /**
     * Validates if the current configuration is complete.
     * 
     * @returns True if all required fields are present
     * 
     * @example
     * ```typescript
     * if (client.isConfigValid()) {
     *   console.log('Configuration is valid');
     * }
     * ```
     */
    isConfigValid(): boolean {
        return !!(this.username && this.pin && this.userid && this.apikey && this.password);
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
            getConfig: 'Get current configuration (without sensitive data)',
            isConfigValid: 'Validate if configuration is complete',
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