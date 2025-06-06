# OrderKuota Node.js API Wrapper

A fully type-safe Node.js wrapper for OrderKuota API with complete TypeScript support.

## Features

- ✅ **Full TypeScript Support** - Complete type definitions for all methods and responses
- ✅ **Type-Safe Configuration** - Required fields validation at compile time
- ✅ **Custom Error Handling** - Specific error types with detailed information
- ✅ **Modern Promise-based API** - Full async/await support
- ✅ **Comprehensive Documentation** - JSDoc comments for all methods

## Note

> **⚠ Beta Notice:**
> This package is currently in **beta testing**. Some transaction checking methods may not work as expected, as not all features have been fully tested. Please report any issues you encounter.

## Installation

```bash
npm install orderkuota

# or using bun

bun add orderkuota
```

## Quick Start

### JavaScript Usage

```javascript
const OrderKuota = require('orderkuota');

const client = new OrderKuota({
  username: 'your-username',
  password: 'your-password',
  userid: 'your-userid',
  apikey: 'your-apikey',
  pin: 'your-pin'
});

const balance = await client.checkBalance();
console.log(balance.balance);
```

### TypeScript Usage

```typescript
import OrderKuota, { 
  OrderKuotaConfig, 
  BalanceResponse,
  QrisHistoryResponse 
} from 'orderkuota';

const config: OrderKuotaConfig = {
  username: 'your-username',
  password: 'your-password', 
  userid: 'your-userid',
  apikey: 'your-apikey',
  pin: 'your-pin'
};

const client = new OrderKuota(config);

// Full type safety
const balance: BalanceResponse = await client.checkBalance();
const qrisHistory: QrisHistoryResponse = await client.fetchQrisHistory();
```

## Configuration

All configuration fields are **required**:

| Field | Type | Description |
|-------|------|-------------|
| `username` | string | Your account username |
| `password` | string | Your account password |
| `userid` | string | User ID or Merchant Code from [OkeConnect](https://okeconnect.com/integrasi/payment_gateway) |
| `apikey` | string | API Key from [OkeConnect](https://okeconnect.com/integrasi/payment_gateway) |
| `pin` | string | Your account PIN |

## API Methods

### `checkBalance(): Promise<BalanceResponse>`

Check your account balance.

**Note:** Manage your IP whitelist in [account settings](https://okeconnect.com/integrasi/trx_ip)

```typescript
try {
  const balance = await client.checkBalance();
  console.log(`Current balance: ${balance.balance}`);
  console.log(`Status: ${balance.status}`);
  console.log(`Message: ${balance.message}`);
} catch (error) {
  console.error('Balance check failed:', error.message);
}
```

### `fetchQrisHistory(): Promise<QrisHistoryResponse>`

Fetch QRIS (Quick Response Code Indonesian Standard) transaction history.

```typescript
try {
  const history = await client.fetchQrisHistory();
  if (history.data) {
    history.data.forEach(transaction => {
      console.log(`Transaction: ${transaction.id} - ${transaction.amount}`);
      if (transaction.qris_data?.merchant_name) {
        console.log(`Merchant: ${transaction.qris_data.merchant_name}`);
      }
    });
  }
} catch (error) {
  console.error('Failed to fetch QRIS history:', error.message);
}
```

### `fetchVirtualAccountHistory(): Promise<VirtualAccountHistoryResponse>`

Fetch Virtual Account transaction history.

```typescript
try {
  const history = await client.fetchVirtualAccountHistory();
  if (history.data) {
    history.data.forEach(transaction => {
      console.log(`VA Transaction: ${transaction.id} - ${transaction.amount}`);
      if (transaction.va_number) {
        console.log(`VA Number: ${transaction.va_number}`);
      }
    });
  }
} catch (error) {
  console.error('Failed to fetch VA history:', error.message);
}
```

### `fetchRetailHistory(): Promise<RetailHistoryResponse>`

Fetch retail (Alfamart & Indomart) transaction history.

```typescript
try {
  const history = await client.fetchRetailHistory();
  if (history.data) {
    history.data.forEach(transaction => {
      console.log(`Retail Transaction: ${transaction.id} - ${transaction.amount}`);
      if (transaction.product_code) {
        console.log(`Product: ${transaction.product_code}`);
      }
    });
  }
} catch (error) {
  console.error('Failed to fetch retail history:', error.message);
}
```

### `getConfig(): Omit<OrderKuotaConfig, 'password' | 'pin' | 'apikey'>`

Get current configuration without sensitive data.

```typescript
const config = client.getConfig();
console.log(`Username: ${config.username}, User ID: ${config.userid}`);
```

### `isConfigValid(): boolean`

Validate if the current configuration is complete.

```typescript
if (client.isConfigValid()) {
  console.log('Configuration is valid');
} else {
  console.log('Missing required configuration');
}
```

## Error Handling

The wrapper provides detailed error information through the `OrderKuotaError` class:

```typescript
import { OrderKuotaError } from 'orderkuota';

try {
  const balance = await client.checkBalance();
} catch (error) {
  if (error instanceof OrderKuotaError) {
    console.error(`Error [${error.code}]: ${error.message}`);
    if (error.status) {
      console.error(`HTTP Status: ${error.status}`);
    }
  } else {
    console.error('Unexpected error:', error);
  }
}
```

### Error Codes

| Code | Description |
|------|-------------|
| `MISSING_CONFIG` | Required configuration fields are missing |
| `BALANCE_CHECK_FAILED` | Balance check API returned an error |
| `QRIS_FETCH_FAILED` | QRIS history fetch failed |
| `VA_FETCH_FAILED` | Virtual Account history fetch failed |
| `RETAIL_FETCH_FAILED` | Retail history fetch failed |
| `NETWORK_ERROR` | Network connection error |
| `UNKNOWN_ERROR` | Unexpected error occurred |

## TypeScript Interfaces

All response types are fully typed:

```typescript
interface BalanceResponse {
  status: boolean;
  message: string;
  balance: number;
}

interface QrisTransaction {
  id: string;
  amount: number;
  date: string;
  status: string;
  description?: string;
  qris_data?: {
    merchant_name?: string;
    terminal_id?: string;
  };
}

interface QrisHistoryResponse {
  status: boolean;
  message: string;
  data?: QrisTransaction[];
  error?: string;
}
```

## Registration

To register for an account, contact an admin from [Telegram](https://t.me/orderkuota).

## Contributing

If you want to contribute to this project, simply submit a pull request. For any bugs, suggestions, or fixes, please open an issue on the GitHub repository.

## Contact

If you encounter a bug, error, or want to request a feature, you can contact the package maintainer directly:

- Telegram: [@Ethermite](https://t.me/ethermite)
- Group: [Vertion Group](https://t.me/vertion)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
