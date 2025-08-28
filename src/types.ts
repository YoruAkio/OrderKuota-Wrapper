/**
 * Configuration for initializing OrderKuota client
 */
export interface OrderKuotaConfig {
  /** Username for authentication */
  username: string;
  /** Password for authentication */
  password: string;
  /** Authentication token (optional, obtained via getToken) */
  token?: string;
  /** Base QRIS string for payment QR codes (optional) */
  baseQrString?: string;
}

/**
 * Response from OTP request
 */
export interface OTPResponse {
  /** Request status */
  status: string;
  /** Email where OTP was sent */
  email: string;
  /** Response message */
  message: string;
}

/**
 * Response from token authentication
 */
export interface TokenResponse {
  /** Request status */
  status: string;
  /** Authentication token */
  token?: string;
  /** User ID */
  id?: string;
  /** User display name */
  name?: string;
  /** Username */
  username?: string;
  /** Account balance */
  balance?: string;
  /** Response message */
  message: string;
}

/**
 * QRIS transaction data
 */
export interface QrisTransaction {
  /** Transaction ID */
  id?: string;
  /** Amount in IDR */
  amount?: number;
  /** Transaction date */
  date?: string;
  /** Transaction status */
  status?: string;
  /** Description */
  description?: string;
  /** Additional data */
  [key: string]: any;
}

/**
 * QRIS menu item
 */
export interface QrisMenuItem {
  /** Item ID */
  id?: string;
  /** Item name */
  name?: string;
  /** Item description */
  description?: string;
  /** Additional data */
  [key: string]: any;
}

/**
 * QRIS menu response
 */
export interface QrisMenuResponse {
  /** Response status */
  status: string;
  /** Menu items */
  data?: QrisMenuItem[];
  /** Response message */
  message: string;
}

/**
 * QRIS Ajaib payment response
 */
export interface QrisAjaibResponse {
  /** Response status */
  status: string;
  /** QRIS payment data */
  data?: {
    /** QR code string */
    qr_string?: string;
    /** Additional data */
    [key: string]: any;
  };
  /** Response message */
  message: string;
}

/**
 * Options for fetching transaction history
 */
export interface HistoryOptions {
  /** Page number */
  page?: string;
  /** Description filter */
  keterangan?: string;
  /** Amount filter */
  jumlah?: string;
  /** Start date */
  dari_tanggal?: string;
  /** End date */
  ke_tanggal?: string;
}

/**
 * Generic API response
 */
export interface ApiResponse<T = any> {
  /** Success status */
  success?: boolean;
  /** Response message */
  message?: string;
  /** Response data */
  results?: T;
  /** Additional data */
  [key: string]: any;
}

/**
 * Error codes for OrderKuota operations
 */
export type OrderKuotaErrorCode =
  | "MISSING_CONFIG"
  | "API_ERROR"
  | "EMPTY_RESPONSE"
  | "INVALID_RESPONSE"
  | "NETWORK_ERROR"
  | "INVALID_AMOUNT"
  | "INVALID_CREDENTIALS"
  | "QR_GENERATION_FAILED"
  | "UNKNOWN_ERROR";

/**
 * Custom error for OrderKuota operations
 */
export class OrderKuotaError extends Error {
  /** Error code */
  public readonly code: OrderKuotaErrorCode;
  /** HTTP status code */
  public readonly status?: number;

  constructor(
    message: string,
    code: OrderKuotaErrorCode = "UNKNOWN_ERROR",
    status?: number,
  ) {
    super(message);
    this.name = "OrderKuotaError";
    this.code = code;
    this.status = status;

    // Maintain proper stack trace (V8 only)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, OrderKuotaError);
    }
  }
}
