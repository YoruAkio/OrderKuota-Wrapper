import axios, { AxiosResponse, AxiosError } from "axios";
import * as QRCode from "qrcode";
import * as qs from "qs";
import { OrderKuotaConfig, HistoryOptions, OrderKuotaError } from "./types.js";

/**
 * OrderKuota API wrapper for Indonesian QRIS payment system.
 *
 * Supports OTP authentication, token management, QRIS payments, and QR code generation.
 *
 * @example
 * ```typescript
 * const client = new OrderKuota({
 *   username: 'your-username',
 *   password: 'your-password'
 * });
 *
 * const otp = await client.getOTP();
 * const token = await client.getToken('123456');
 * const payment = await client.generateQRISAjaib(10000);
 * ```
 */
export default class OrderKuota {
  private readonly username: string;
  private readonly password: string;
  private token?: string;
  private readonly baseQrString?: string;

  // API endpoints
  private static readonly OK_LOGIN_ENDPOINT =
    "https://app.orderkuota.com/api/v2/login";
  private static readonly OKE_GET_ENDPOINT =
    "https://app.orderkuota.com/api/v2/get";

  private static readonly OK_HEADERS = {
    "User-Agent": "okhttp/4.12.0",
    Host: "app.orderkuota.com",
    "Content-Type": "application/x-www-form-urlencoded",
  };

  private static readonly OK_CONSTANTS = {
    app_reg_id:
      "e5aCENGrQOWvhQWYnv-uNc:APA91bFj3O_mv5Nf_2SM4Duz4Z8Ug3nBNaHlgodlY92CBuNIA9xmc0Dahev5xxqssPmnTdcie4mlhiG9ZAE1iCe1QbyhxcUyGXlenJxiUaXdfm1rklOEo9k",
    phone_uuid: "e5aCENGrQOWvhQWYnv-uNc",
    phone_model: "sdk_gphone64_x86_64",
    phone_android_version: "16",
    app_version_code: "250811",
    app_version_name: "25.08.11",
    ui_mode: "light",
  };

  /**
   * Create OrderKuota client
   *
   * @param config Configuration with username and password
   * @throws {OrderKuotaError} When username or password is missing
   */
  constructor(config: OrderKuotaConfig) {
    // Validate required fields
    if (!config.username || !config.password) {
      throw new OrderKuotaError(
        "Missing required configuration. Username and password are required.",
        "MISSING_CONFIG",
      );
    }

    this.username = config.username;
    this.password = config.password;
    this.token = config.token;
    this.baseQrString = config.baseQrString;
  }

  /**
   * Request OTP for authentication
   *
   * @returns Promise with OTP response including email
   */
  async getOTP(): Promise<any> {
    try {
      const payload = qs.stringify({
        username: this.username,
        password: this.password,
        ...OrderKuota.OK_CONSTANTS,
      });

      const response: AxiosResponse = await axios.post(
        OrderKuota.OK_LOGIN_ENDPOINT,
        payload,
        {
          headers: {
            ...OrderKuota.OK_HEADERS,
            "User-Agent": "okhttp/4.12.0",
          },
        },
      );

      const data = response?.data;

      // Return API response directly
      if (data?.success === false) {
        return data;
      }

      const email = data?.results?.otp_value;

      if (!email) {
        return {
          success: false,
          message: "Failed to get OTP email from response",
        };
      }

      return {
        status: "success",
        email: email,
        message: `OTP has been sent to ${email}. Please check your email.`,
      };
    } catch (error) {
      if (error instanceof OrderKuotaError) {
        throw error;
      }

      if (error instanceof AxiosError) {
        return {
          success: false,
          message: `Network error: ${error.message}`,
        };
      }

      return {
        success: false,
        message: `Unexpected error during OTP request: ${error}`,
      };
    }
  }

  /**
   * Authenticates and retrieves access token using OTP.
   *
   * @param otp OTP code received via email
   * @returns Promise with authentication token and user data
   */
  async getToken(otp: string): Promise<any> {
    try {
      if (!otp) {
        throw new OrderKuotaError(
          "OTP code is required",
          "INVALID_CREDENTIALS",
        );
      }

      const payload = qs.stringify({
        username: this.username,
        password: otp,
        ...OrderKuota.OK_CONSTANTS,
      });

      const response: AxiosResponse = await axios.post(
        OrderKuota.OK_LOGIN_ENDPOINT,
        payload,
        {
          headers: {
            ...OrderKuota.OK_HEADERS,
            "User-Agent": "okhttp/4.12.0",
          },
        },
      );

      const data = response.data;

      // Return API response directly
      if (data?.success === false) {
        return data;
      }

      if (!data?.results?.token) {
        return {
          success: false,
          message: "Token not found in response.",
        };
      }

      this.token = data.results.token;

      return {
        status: "success",
        token: data.results.token,
        id: data.results.id,
        name: data.results.name,
        username: data.results.username,
        balance: data.results.balance,
        message: "Token successfully obtained.",
      };
    } catch (error) {
      if (error instanceof OrderKuotaError) {
        throw error;
      }

      if (error instanceof AxiosError) {
        return {
          success: false,
          message: `Network error: ${error.message}`,
        };
      }

      return {
        success: false,
        message: `Unexpected error during token request: ${error}`,
      };
    }
  }

  /**
   * Get QRIS transaction history
   *
   * @param historyType Type of history ('qris_history' or 'qris_ajaib_history')
   * @param options Optional filters for history
   * @returns Promise with transaction history
   */
  async getQRISHistory(
    historyType: string = "qris_history",
    options: HistoryOptions = {},
  ): Promise<any> {
    try {
      if (!this.token) {
        throw new OrderKuotaError(
          "Token is required. Please call getToken() first.",
          "INVALID_CREDENTIALS",
        );
      }

      const timestamp = Date.now().toString();
      const tokenId = this.token.split(":")[0]; // Extract token ID

      // Prepare payload for QRIS history
      const payload = {
        app_reg_id: OrderKuota.OK_CONSTANTS.app_reg_id,
        phone_uuid: OrderKuota.OK_CONSTANTS.phone_uuid,
        phone_model: OrderKuota.OK_CONSTANTS.phone_model,
        [`requests[${historyType}][keterangan]`]: options.keterangan || "",
        [`requests[${historyType}][jumlah]`]: options.jumlah || "",
        request_time: timestamp,
        phone_android_version: OrderKuota.OK_CONSTANTS.phone_android_version,
        app_version_code: OrderKuota.OK_CONSTANTS.app_version_code,
        auth_username: this.username,
        [`requests[${historyType}][page]`]: options.page || "1",
        auth_token: this.token,
        app_version_name: OrderKuota.OK_CONSTANTS.app_version_name,
        ui_mode: OrderKuota.OK_CONSTANTS.ui_mode,
        [`requests[${historyType}][dari_tanggal]`]: options.dari_tanggal || "",
        "requests[0]": "account",
        [`requests[${historyType}][ke_tanggal]`]: options.ke_tanggal || "",
      };

      const response: AxiosResponse = await axios.post(
        `https://app.orderkuota.com/api/v2/qris/mutasi/${tokenId}`,
        qs.stringify(payload),
        {
          headers: {
            ...OrderKuota.OK_HEADERS,
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": "okhttp/4.12.0",
          },
        },
      );

      return response.data;
    } catch (error) {
      if (error instanceof OrderKuotaError) {
        throw error;
      }

      if (error instanceof AxiosError) {
        return {
          success: false,
          message: `Network error: ${error.message}`,
        };
      }

      return {
        success: false,
        message: `Unexpected error during QRIS history request: ${error}`,
      };
    }
  }

  /**
   * Fetches available QRIS menu options and account status.
   *
   * @returns Promise with QRIS menu data and account information
   */
  async fetchQrisMenu(): Promise<any> {
    try {
      if (!this.token) {
        throw new OrderKuotaError(
          "Token is required. Please call getToken() first.",
          "INVALID_CREDENTIALS",
        );
      }

      const timestamp = Date.now().toString();
      const tokenId = this.token.split(":")[0]; // Extract token ID

      // Prepare payload data
      const payload = {
        request_time: timestamp,
        app_reg_id: OrderKuota.OK_CONSTANTS.app_reg_id,
        phone_android_version: OrderKuota.OK_CONSTANTS.phone_android_version,
        app_version_code: OrderKuota.OK_CONSTANTS.app_version_code,
        phone_uuid: OrderKuota.OK_CONSTANTS.phone_uuid,
        auth_username: this.username,
        "requests[1]": "qris_menu",
        auth_token: this.token,
        app_version_name: OrderKuota.OK_CONSTANTS.app_version_name,
        ui_mode: OrderKuota.OK_CONSTANTS.ui_mode,
        "requests[0]": "account",
        phone_model: OrderKuota.OK_CONSTANTS.phone_model,
      };

      const response: AxiosResponse = await axios.post(
        `https://app.orderkuota.com/api/v2/qris/menu/${tokenId}`,
        qs.stringify(payload),
        {
          headers: {
            ...OrderKuota.OK_HEADERS,
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": "okhttp/4.12.0",
          },
        },
      );

      return response.data;
    } catch (error) {
      if (error instanceof OrderKuotaError) {
        throw error;
      }

      if (error instanceof AxiosError) {
        return {
          success: false,
          message: `Network error: ${error.message}`,
        };
      }

      return {
        success: false,
        message: `Unexpected error during QRIS menu request: ${error}`,
      };
    }
  }

  /**
   * Generates QRIS Ajaib payment with specified amount.
   *
   * @param amount Payment amount in Indonesian Rupiah (default: 1000)
   * @returns Promise with QRIS payment data and QR string
   */
  async generateQRISAjaib(amount: number = 1000): Promise<any> {
    try {
      if (!this.token) {
        throw new OrderKuotaError(
          "Token is required. Please call getToken() first.",
          "INVALID_CREDENTIALS",
        );
      }

      if (amount <= 0) {
        throw new OrderKuotaError(
          "Amount must be greater than 0",
          "INVALID_AMOUNT",
        );
      }

      const timestamp = Date.now().toString();

      // Prepare payload with required fields
      const payload = {
        ...OrderKuota.OK_CONSTANTS,
        auth_username: this.username,
        auth_token: this.token,
        request_time: timestamp,
        "requests[qris_ajaib][amount]": amount.toString(),
      };

      const response: AxiosResponse = await axios.post(
        OrderKuota.OKE_GET_ENDPOINT,
        qs.stringify(payload),
        {
          headers: {
            ...OrderKuota.OK_HEADERS,
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": "okhttp/4.12.0",
          },
        },
      );

      return response.data;
    } catch (error) {
      if (error instanceof OrderKuotaError) {
        throw error;
      }

      if (error instanceof AxiosError) {
        return {
          success: false,
          message: `Network error: ${error.message}`,
        };
      }

      return {
        success: false,
        message: `Unexpected error during QRIS Ajaib generation: ${error}`,
      };
    }
  }

  /**
   * Checks current account balance from QRIS menu data.
   *
   * @returns Promise with balance and QRIS balance information
   */
  async checkBalance(): Promise<any> {
    try {
      if (!this.token) {
        return {
          success: false,
          message: "Token is required. Please call getToken() first.",
        };
      }

      const menuResponse = await this.fetchQrisMenu();

      if (menuResponse?.success === false) {
        return {
          success: false,
          message: menuResponse?.message || "Failed to check balance",
        };
      }

      if (menuResponse?.account?.success !== true) {
        return {
          success: false,
          message: menuResponse?.account?.message || "Failed to check balance",
        };
      }

      const accountData = menuResponse?.account?.results;

      if (!accountData) {
        return {
          success: false,
          message: "Account data not found in response",
        };
      }

      return {
        success: true,
        balance: accountData.balance || 0,
        qris_balance: accountData.qris_balance || 0,
      };
    } catch (error) {
      return {
        success: false,
        message: `Unexpected error during balance check: ${error}`,
      };
    }
  }

  /**
   * Generate QR code image from QRIS string
   *
   * @param qrisString QRIS string to convert
   * @param options QR code generation options
   * @returns Promise with base64 encoded QR image
   */
  async generateQRImage(
    qrisString: string,
    options: QRCode.QRCodeToDataURLOptions = {},
  ): Promise<string> {
    try {
      if (!qrisString) {
        throw new OrderKuotaError(
          "QRIS string is required",
          "INVALID_RESPONSE",
        );
      }

      const defaultOptions: QRCode.QRCodeToDataURLOptions = {
        type: "image/png",
        margin: 1,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
        width: 256,
        ...options,
      };

      return await QRCode.toDataURL(qrisString, defaultOptions);
    } catch (error) {
      throw new OrderKuotaError(
        `Failed to generate QR image: ${error}`,
        "QR_GENERATION_FAILED",
      );
    }
  }

  /**
   * Sets authentication token manually.
   *
   * @param token Authentication token to set
   */
  setToken(token: string): void {
    this.token = token;
  }

  /**
   * Gets current authentication token.
   *
   * @returns Current token or undefined if not set
   */
  getTokenValue(): string | undefined {
    return this.token;
  }

  /**
   * Gets current configuration without sensitive data.
   *
   * @returns Configuration object excluding password
   */
  getConfig(): Omit<OrderKuotaConfig, "password"> {
    return {
      username: this.username,
      token: this.token,
      baseQrString: this.baseQrString,
    };
  }

  /**
   * Validates if configuration has required fields.
   *
   * @returns True if username and password are both set
   */
  isConfigValid(): boolean {
    return !!(this.username && this.password);
  }

  /**
   * Checks if authentication token is available.
   *
   * @returns True if token is set and ready for API calls
   */
  hasToken(): boolean {
    return !!this.token;
  }
}
