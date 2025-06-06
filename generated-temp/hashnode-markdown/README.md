**orderkuota**

***

# OrderKuota Node.js API Wrapper

A fully type-safe Node.js wrapper for OrderKuota API with complete TypeScript support.

## Features

- ✅ **Full TypeScript Support** - Complete type definitions for all methods and responses
- ✅ **Type-Safe Configuration** - Required fields validation at compile time
- ✅ **Custom Error Handling** - Specific error types with detailed information
- ✅ **Modern Promise-based API** - Full async/await support
- ✅ **QRIS QR Code Generation** - Generate payment QR codes with custom styling
- ✅ **Base64 Image Support** - Direct base64 output for web applications
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

All configuration fields are **required** except `baseQrString` which is needed only for QRIS generation:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `username` | string | Yes | Your account username |
| `password` | string | Yes | Your account password |
| `userid` | string | Yes | User ID or Merchant Code from [OkeConnect](https://okeconnect.com/integrasi/payment_gateway) |
| `apikey` | string | Yes | API Key from [OkeConnect](https://okeconnect.com/integrasi/payment_gateway) |
| `pin` | string | Yes | Your account PIN |
| `baseQrString` | string | No | Base QRIS string for QR code generation (required only for QRIS features) |

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
| `QRIS_GENERATION_FAILED` | QRIS string generation failed |
| `INVALID_AMOUNT` | Payment amount is invalid |
| `INVALID_QRIS_FORMAT` | Base QRIS string format is invalid |
| `MISSING_BASE_QR_STRING` | Base QR string is required for QRIS generation |
| `CRC_CALCULATION_FAILED` | CRC16 checksum calculation failed |
| `INVALID_QRIS_STRING` | QRIS string is empty or invalid |
| `QR_GENERATION_FAILED` | QR code image generation failed |
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

This project is licensed under the MIT License - see the [LICENSE](_media/LICENSE) file for details.

## QRIS Payment QR Code Generation

OrderKuota supports generating QRIS (Quick Response Code Indonesian Standard) strings and QR code images for Indonesian digital payments.

### Configuration for QRIS Generation

To use QRIS generation features, you need to provide a `baseQrString` in your configuration:

```typescript
const client = new OrderKuota({
  username: 'your-username',
  password: 'your-password',
  userid: 'your-userid',
  apikey: 'your-apikey',
  pin: 'your-pin',
  baseQrString: 'your-base-qris-string' // Required for QRIS generation
});

// Check if QRIS generation is available
if (client.isQrisGenerationAvailable()) {
  console.log('QRIS generation is available!');
} else {
  console.log('baseQrString not configured');
}
```

### `generateQrisString(amount: number): Promise<string>`

Generate a QRIS string with the specified payment amount.

```typescript
try {
  const amount = 50000; // 50,000 IDR
  const qrisString = await client.generateQrisString(amount);
  console.log('Generated QRIS:', qrisString);
  
  // Use this string with any QR code library
  // const qrCode = await QR.toDataURL(qrisString);
} catch (error) {
  console.error('QRIS generation failed:', error.message);
}
```

### `generateQrisImage(qrisString: string, options?): Promise<string>`

Generate a QR code image from a QRIS string and return it as base64.

```typescript
try {
  const qrisString = await client.generateQrisString(75000);
  
  const qrImageBase64 = await client.generateQrisImage(qrisString, {
    width: 512,        // QR code width in pixels (default: 512)
    margin: 4,         // Margin around the QR code (default: 4)
    color: {
      dark: '#000000', // Dark color for QR modules (default: '#000000')
      light: '#FFFFFF' // Light color for background (default: '#FFFFFF')
    }
  });
  
  console.log('QR Image Base64:', qrImageBase64);
  
  // Use in HTML
  const imgSrc = `data:image/png;base64,${qrImageBase64}`;
  
  // Or save to file
  const fs = require('fs');
  fs.writeFileSync('payment-qr.png', qrImageBase64, 'base64');
  
} catch (error) {
  console.error('QR image generation failed:', error.message);
}
```

### `generateQrisQrCode(amount: number, options?): Promise<string>`

Generate a complete QRIS QR code image with the specified amount in one step.

```typescript
try {
  // Generate QR code directly from amount
  const qrCodeBase64 = await client.generateQrisQrCode(100000, {
    width: 256,
    margin: 6,
    color: {
      dark: '#1a1a1a',
      light: '#f5f5f5'
    }
  });
  
  console.log('QR Code generated successfully!');
  
  // Display in web application
  document.getElementById('qr-image').src = `data:image/png;base64,${qrCodeBase64}`;
  
} catch (error) {
  console.error('QR code generation failed:', error.message);
}
```

### Complete QRIS Example

```typescript
import OrderKuota from 'orderkuota';
import fs from 'fs';

const client = new OrderKuota({
  username: 'your-username',
  password: 'your-password',
  userid: 'your-userid',
  apikey: 'your-apikey',
  pin: 'your-pin',
  baseQrString: 'your-base-qris-string-here'
});

async function createPaymentQrCode() {
  try {
    if (!client.isQrisGenerationAvailable()) {
      throw new Error('QRIS generation not available');
    }
    
    const amount = 150000; // 150,000 IDR
    
    // Method 1: Two-step process (more control)
    const qrisString = await client.generateQrisString(amount);
    const qrImage = await client.generateQrisImage(qrisString);
    
    // Method 2: One-step process (simpler)
    const qrCodeDirect = await client.generateQrisQrCode(amount, {
      width: 300,
      color: { dark: '#2c5530', light: '#ffffff' }
    });
    
    // Save QR codes
    fs.writeFileSync('payment-step1.png', qrImage, 'base64');
    fs.writeFileSync('payment-direct.png', qrCodeDirect, 'base64');
    
    console.log(`✅ QR codes generated for payment of Rp ${amount.toLocaleString()}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createPaymentQrCode();
```

### `isQrisGenerationAvailable(): boolean`

Check if QRIS generation is available (baseQrString is configured and valid).

```typescript
if (client.isQrisGenerationAvailable()) {
  // Generate QRIS codes
} else {
  console.log('Please configure baseQrString for QRIS generation');
}
```
