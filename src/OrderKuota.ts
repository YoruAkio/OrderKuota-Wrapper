import axios from 'axios';
import { OrderKuotaConfig, BalanceResponse } from './types';

/**
 * OrderKuota class handles various operations related to order quotas.
 */
export default class OrderKuota {
    private username: string | null;
    private pin: string | null;
    private userid: string | null;
    private apikey: string | null;
    private password: string | null;

    /**
     * Constructor initializes the class with optional configuration.
     * @param {Partial<OrderKuotaConfig>} options - Configuration options for initializing the class.
     */
    constructor(options: Partial<OrderKuotaConfig> = {}) {
        this.username = options.username || null;
        this.pin = options.pin || null;
        this.userid = options.userid || null;
        this.apikey = options.apikey || null;
        this.password = options.password || null;
    }

    /**
     * Method to check balance.
     * @returns {Promise<BalanceResponse>} - The balance response.
     * @throws {Error} - Throws an error if username, pin, or password is not set.
     */
    async checkBalance(): Promise<BalanceResponse> {
        if (!this.username || !this.pin || !this.password) {
            throw new Error('Authentication required: Set username, pin, password first on constructor');
        }

        const url = `https://h2h.okeconnect.com/trx/balance?memberID=${this.userid}&pin=${this.pin}&password=${this.password}`;
        const response = await axios.get<BalanceResponse>(url);
        return response.data;
    }

    /**
     * Method to fetch QRIS transaction history.
     * @returns {Promise<any>} - The QRIS transaction history.
     * @throws {Error} - Throws an error if userid or apikey is not set.
     */
    async fetchQrisHistory(): Promise<any> {
        if (!this.userid || !this.apikey) {
            throw new Error('Authentication required: Set userid and apikey first on constructor');
        }

        const url = `https://gateway.okeconnect.com/api/mutasi/qris/${this.userid}/${this.apikey}`;
        const response = await axios.get(url);
        return response.data;
    }

    /**
     * Method to fetch virtual account transaction history.
     * @returns {Promise<any>} - The virtual account transaction history.
     * @throws {Error} - Throws an error if userid or apikey is not set.
     */
    async fetchVirtualAccountHistory(): Promise<any> {
        if (!this.userid || !this.apikey) {
            throw new Error('Authentication required: Set userid and apikey first on constructor');
        }

        const url = `https://gateway.okeconnect.com/api/mutasi/va/${this.userid}/${this.apikey}`;
        const response = await axios.get(url);
        return response.data;
    }

    /**
     * Method to fetch retail transaction history.
     * @returns {Promise<any>} - The retail transaction history.
     * @throws {Error} - Throws an error if userid or apikey is not set.
     */
    async fetchRetailHistory(): Promise<any> {
        if (!this.userid || !this.apikey) {
            throw new Error('Authentication required: Set userid and apikey first on constructor');
        }

        const url = `https://gateway.okeconnect.com/api/mutasi/retail/${this.userid}/${this.apikey}`;
        const response = await axios.get(url);
        return response.data;
    }
}