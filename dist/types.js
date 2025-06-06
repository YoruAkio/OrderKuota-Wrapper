/**
 * Custom error class for OrderKuota operations
 */
export class OrderKuotaError extends Error {
    constructor(message, code = 'UNKNOWN_ERROR', status) {
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
