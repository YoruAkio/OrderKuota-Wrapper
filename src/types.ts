/**
 * Configuration interface for OrderKuota class initialization
 * All fields are required for proper authentication
 */
export interface OrderKuotaConfig {
    /** Username for authentication */
    username: string;
    /** PIN for authentication (numeric string) */
    pin: string;
    /** User ID for API calls */
    userid: string;
    /** Password for authentication */
    password: string;
    /** API key for gateway access */
    apikey: string;
}

/**
 * Response interface for balance check
 */
export interface BalanceResponse {
    /** Status of the request - true if successful */
    status: boolean;
    /** Response message from the API */
    message: string;
    /** Current balance amount in IDR */
    balance: number;
}

/**
 * Base transaction interface
 */
export interface BaseTransaction {
    /** Unique transaction ID */
    id: string;
    /** Transaction amount in IDR */
    amount: number;
    /** Transaction date in ISO format */
    date: string;
    /** Transaction status (success, pending, failed, etc.) */
    status: string;
    /** Optional transaction description */
    description?: string;
}

/**
 * QRIS transaction interface
 */
export interface QrisTransaction extends BaseTransaction {
    /** QRIS specific data */
    qris_data?: {
        /** Merchant name for the transaction */
        merchant_name?: string;
        /** Terminal ID used for the transaction */
        terminal_id?: string;
    };
}

/**
 * Virtual Account transaction interface
 */
export interface VirtualAccountTransaction extends BaseTransaction {
    /** Virtual account number */
    va_number?: string;
    /** Bank code (e.g., BCA, BNI, BRI, etc.) */
    bank_code?: string;
}

/**
 * Retail transaction interface
 */
export interface RetailTransaction extends BaseTransaction {
    /** Product code for the transaction */
    product_code?: string;
    /** Target number (phone, account, etc.) */
    target?: string;
}

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T = any> {
    /** Response status - true if successful */
    status: boolean;
    /** Response message */
    message: string;
    /** Response data payload */
    data?: T;
    /** Error details if any */
    error?: string;
}

/**
 * QRIS history response
 */
export interface QrisHistoryResponse extends ApiResponse<QrisTransaction[]> {}

/**
 * Virtual Account history response
 */
export interface VirtualAccountHistoryResponse extends ApiResponse<VirtualAccountTransaction[]> {}

/**
 * Retail history response
 */
export interface RetailHistoryResponse extends ApiResponse<RetailTransaction[]> {}

/**
 * Error codes that can be returned by OrderKuota operations
 */
export type OrderKuotaErrorCode = 
    | 'MISSING_CONFIG'
    | 'BALANCE_CHECK_FAILED'
    | 'API_ERROR'
    | 'EMPTY_RESPONSE'
    | 'INVALID_RESPONSE'
    | 'NETWORK_ERROR'
    | 'QRIS_FETCH_FAILED'
    | 'VA_FETCH_FAILED'
    | 'RETAIL_FETCH_FAILED'
    | 'UNKNOWN_ERROR';

/**
 * Custom error class for OrderKuota operations
 */
export class OrderKuotaError extends Error {
    /** Error code for programmatic handling */
    public readonly code: OrderKuotaErrorCode;
    /** HTTP status code if applicable */
    public readonly status?: number;

    constructor(
        message: string,
        code: OrderKuotaErrorCode = 'UNKNOWN_ERROR',
        status?: number
    ) {
        super(message);
        this.name = 'OrderKuotaError';
        this.code = code;
        this.status = status;
        
        // Maintains proper stack trace for where our error was thrown (V8 only)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, OrderKuotaError);
        }
    }
}