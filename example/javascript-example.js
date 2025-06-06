/**
 * JavaScript example showing basic usage of OrderKuota wrapper
 * This demonstrates the functionality without TypeScript typing
 */

import OrderKuota from '../dist/index.js';

async function main() {
    const client = new OrderKuota({
        username: "your-username",
        password: "your-password", 
        userid: "your-userid",
        apikey: "your-apikey",
        pin: "your-pin"
    });

    try {
        // Check balance
        const balance = await client.checkBalance();
        console.log(`Balance: Rp ${balance.balance.toLocaleString('id-ID')}`);
        console.log(`Message: ${balance.message}`);

        // Check available methods
        const methods = client.getAvailableMethods();
        console.log('\nAvailable methods:');
        console.log(methods);

        // Try fetching histories
        console.log('\nFetching histories...');
        
        try {
            const qrisHistory = await client.fetchQrisHistory();
            console.log(`QRIS: ${qrisHistory.data?.length || 0} transactions`);
        } catch (e) {
            console.log('QRIS history not available');
        }

        try {
            const vaHistory = await client.fetchVirtualAccountHistory();
            console.log(`VA: ${vaHistory.data?.length || 0} transactions`);
        } catch (e) {
            console.log('VA history not available');
        }

        try {
            const retailHistory = await client.fetchRetailHistory(); 
            console.log(`Retail: ${retailHistory.data?.length || 0} transactions`);
        } catch (e) {
            console.log('Retail history not available');
        }

    } catch (error) {
        console.error('Error:', error.message);
        if (error.code) {
            console.error('Error code:', error.code);
        }
    }
}

main().catch(console.error);
