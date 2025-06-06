import OrderKuota, { OrderKuotaError, BalanceResponse } from '../src/index.js';

/**
 * Example demonstrating TypeScript usage of OrderKuota wrapper
 * This example shows proper type safety and IDE intellisense support
 */

async function main() {
    // Initialize with proper typing
    const client = new OrderKuota({
        username: "your-username",
        password: "your-password",
        userid: "your-userid",
        apikey: "your-apikey",
        pin: "your-pin"
    });

    try {
        // Type-safe balance checking with intellisense
        const balance: BalanceResponse = await client.checkBalance();
        
        // IDE will show proper type hints for balance properties
        console.log(`Status: ${balance.status}`);
        console.log(`Message: ${balance.message}`);
        console.log(`Balance: Rp ${balance.balance.toLocaleString('id-ID')}`);

        // Check available methods (useful for discovery)
        const methods = client.getAvailableMethods();
        console.log('\nAvailable methods:');
        Object.entries(methods).forEach(([method, description]) => {
            console.log(`- ${method}: ${description}`);
        });

        // Fetch transaction histories with proper typing
        console.log('\nFetching transaction histories...');
        
        const qrisHistory = await client.fetchQrisHistory();
        console.log(`QRIS transactions: ${qrisHistory.data?.length || 0}`);
        
        const vaHistory = await client.fetchVirtualAccountHistory(); 
        console.log(`VA transactions: ${vaHistory.data?.length || 0}`);
        
        const retailHistory = await client.fetchRetailHistory();
        console.log(`Retail transactions: ${retailHistory.data?.length || 0}`);

    } catch (error) {
        // Type-safe error handling
        if (error instanceof OrderKuotaError) {
            console.error(`OrderKuota Error [${error.code}]:`, error.message);
            if (error.status) {
                console.error(`HTTP Status: ${error.status}`);
            }
        } else {
            console.error('Unknown error:', error);
        }
    }
}

// Example of method discovery for IDE autocomplete
function demonstrateAutocomplete() {
    const client = new OrderKuota({
        username: "demo",
        password: "demo", 
        userid: "demo",
        apikey: "demo",
        pin: "demo"
    });

    // When you type "client." IDE will show:
    // - checkBalance(): Promise<BalanceResponse>
    // - fetchQrisHistory(): Promise<QrisHistoryResponse>
    // - fetchVirtualAccountHistory(): Promise<VirtualAccountHistoryResponse>
    // - fetchRetailHistory(): Promise<RetailHistoryResponse>
    // - getConfig(): Omit<OrderKuotaConfig, 'password' | 'pin' | 'apikey'>
    // - isConfigValid(): boolean
    // - getAvailableMethods(): object
    // - getEndpoints(): object

    return client;
}

// Run the example
if (require.main === module) {
    main().catch(console.error);
}

export { main, demonstrateAutocomplete };
