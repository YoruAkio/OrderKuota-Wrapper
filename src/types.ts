export interface OrderKuotaConfig {
    username: string;
    pin: string;
    userid: string;
    password: string;
    apikey: string;
}

export interface BalanceResponse {
    status: boolean;
    message: string;
    balance: number;
}