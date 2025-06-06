[**orderkuota**](../README.md)

***

[orderkuota](../globals.md) / OrderKuota

# Class: OrderKuota

Defined in: [OrderKuota.ts:62](https://github.com/YoruAkio/OrderKuota-Wrapper/blob/aeaaa0f60c1ecb1ed8dadc7d254c13819d45488b/src/OrderKuota.ts#L62)

OrderKuota class handles various operations related to order quotas and payment systems.

This wrapper provides a TypeScript-friendly interface to the OrderKuota API,
including balance checking, transaction history retrieval, and error handling.

## Example

```typescript
import OrderKuota from 'orderkuota';

const client = new OrderKuota({
  username: 'your-username',
  password: 'your-password',
  userid: 'your-userid',
  apikey: 'your-apikey',
  pin: 'your-pin',
  baseQrString: 'your-base-qris-string' // Optional, for QRIS generation
});

// Check balance
try {
  const balance = await client.checkBalance();
  console.log(`Balance: Rp ${balance.balance.toLocaleString()}`);
} catch (error) {
  if (error instanceof OrderKuotaError) {
    console.error(`Error [${error.code}]:`, error.message);
  }
}

// Generate QRIS payment string
if (client.isQrisGenerationAvailable()) {
  const qrisString = await client.generateQrisString(50000);
  console.log('QRIS for 50,000 IDR:', qrisString);
  
  // Generate QR code image from QRIS string
  const qrImageBase64 = await client.generateQrisImage(qrisString);
  console.log('QR Image Base64:', qrImageBase64);
  
  // Or generate QR code directly with amount
  const qrCodeBase64 = await client.generateQrisQrCode(75000, {
    width: 256,
    color: { dark: '#1a1a1a', light: '#ffffff' }
  });
}

// Fetch transaction history
const qrisHistory = await client.fetchQrisHistory();
```

## Constructors

### Constructor

> **new OrderKuota**(`config`): `OrderKuota`

Defined in: [OrderKuota.ts:87](https://github.com/YoruAkio/OrderKuota-Wrapper/blob/aeaaa0f60c1ecb1ed8dadc7d254c13819d45488b/src/OrderKuota.ts#L87)

Creates a new OrderKuota instance.

#### Parameters

##### config

[`OrderKuotaConfig`](../interfaces/OrderKuotaConfig.md)

Configuration object containing authentication credentials

#### Returns

`OrderKuota`

#### Throws

When required configuration is missing

#### Example

```typescript
const client = new OrderKuota({
  username: 'your-username',
  password: 'your-password',
  userid: 'your-userid',
  apikey: 'your-apikey',
  pin: 'your-pin'
});
```

## Methods

### checkBalance()

> **checkBalance**(): `Promise`\<[`BalanceResponse`](../interfaces/BalanceResponse.md)\>

Defined in: [OrderKuota.ts:120](https://github.com/YoruAkio/OrderKuota-Wrapper/blob/aeaaa0f60c1ecb1ed8dadc7d254c13819d45488b/src/OrderKuota.ts#L120)

Checks the current account balance.

#### Returns

`Promise`\<[`BalanceResponse`](../interfaces/BalanceResponse.md)\>

Promise that resolves to balance information

#### Throws

When the API request fails or returns an error

#### Example

```typescript
try {
  const balance = await client.checkBalance();
  console.log(`Current balance: ${balance.balance}`);
} catch (error) {
  console.error('Failed to check balance:', error.message);
}
```

***

### fetchQrisHistory()

> **fetchQrisHistory**(): `Promise`\<[`QrisHistoryResponse`](../interfaces/QrisHistoryResponse.md)\>

Defined in: [OrderKuota.ts:238](https://github.com/YoruAkio/OrderKuota-Wrapper/blob/aeaaa0f60c1ecb1ed8dadc7d254c13819d45488b/src/OrderKuota.ts#L238)

Fetches QRIS (Quick Response Code Indonesian Standard) transaction history.

#### Returns

`Promise`\<[`QrisHistoryResponse`](../interfaces/QrisHistoryResponse.md)\>

Promise that resolves to QRIS transaction history

#### Throws

When the API request fails or returns an error

#### Example

```typescript
try {
  const history = await client.fetchQrisHistory();
  console.log(`Found ${history.data?.length || 0} QRIS transactions`);
  
  if (history.data) {
    history.data.forEach(transaction => {
      console.log(`${transaction.date}: Rp ${transaction.amount.toLocaleString()}`);
    });
  }
} catch (error) {
  if (error instanceof OrderKuotaError) {
    console.error(`QRIS History Error [${error.code}]:`, error.message);
  }
}
```

***

### fetchRetailHistory()

> **fetchRetailHistory**(): `Promise`\<[`RetailHistoryResponse`](../interfaces/RetailHistoryResponse.md)\>

Defined in: [OrderKuota.ts:334](https://github.com/YoruAkio/OrderKuota-Wrapper/blob/aeaaa0f60c1ecb1ed8dadc7d254c13819d45488b/src/OrderKuota.ts#L334)

Fetches retail transaction history.

#### Returns

`Promise`\<[`RetailHistoryResponse`](../interfaces/RetailHistoryResponse.md)\>

Promise that resolves to retail transaction history

#### Throws

When the API request fails or returns an error

#### Example

```typescript
try {
  const history = await client.fetchRetailHistory();
  console.log(`Found ${history.data?.length || 0} retail transactions`);
  
  if (history.data) {
    history.data.forEach(transaction => {
      console.log(`${transaction.product_code} -> ${transaction.target}: Rp ${transaction.amount.toLocaleString()}`);
    });
  }
} catch (error) {
  if (error instanceof OrderKuotaError) {
    console.error(`Retail History Error [${error.code}]:`, error.message);
  }
}
```

***

### fetchVirtualAccountHistory()

> **fetchVirtualAccountHistory**(): `Promise`\<[`VirtualAccountHistoryResponse`](../interfaces/VirtualAccountHistoryResponse.md)\>

Defined in: [OrderKuota.ts:286](https://github.com/YoruAkio/OrderKuota-Wrapper/blob/aeaaa0f60c1ecb1ed8dadc7d254c13819d45488b/src/OrderKuota.ts#L286)

Fetches Virtual Account transaction history.

#### Returns

`Promise`\<[`VirtualAccountHistoryResponse`](../interfaces/VirtualAccountHistoryResponse.md)\>

Promise that resolves to Virtual Account transaction history

#### Throws

When the API request fails or returns an error

#### Example

```typescript
try {
  const history = await client.fetchVirtualAccountHistory();
  console.log(`Found ${history.data?.length || 0} VA transactions`);
  
  if (history.data) {
    history.data.forEach(transaction => {
      console.log(`${transaction.bank_code}: ${transaction.va_number} - Rp ${transaction.amount.toLocaleString()}`);
    });
  }
} catch (error) {
  if (error instanceof OrderKuotaError) {
    console.error(`VA History Error [${error.code}]:`, error.message);
  }
}
```

***

### generateQrisImage()

> **generateQrisImage**(`qrisString`, `options`): `Promise`\<`string`\>

Defined in: [OrderKuota.ts:555](https://github.com/YoruAkio/OrderKuota-Wrapper/blob/aeaaa0f60c1ecb1ed8dadc7d254c13819d45488b/src/OrderKuota.ts#L555)

Generates a QR code image from a QRIS string and returns it as base64.

This method takes a QRIS string (either generated by generateQrisString or provided manually)
and converts it into a QR code image. The image is returned as a base64 string that can be
directly used in web applications or saved to a file.

#### Parameters

##### qrisString

`string`

The QRIS string to convert to QR code image

##### options

Optional QR code generation options

###### color?

\{ `dark?`: `string`; `light?`: `string`; \}

QR code colors

###### color.dark?

`string`

Dark color for QR code modules (default: '#000000')

###### color.light?

`string`

Light color for background (default: '#FFFFFF')

###### margin?

`number`

Margin around the QR code (default: 4)

###### width?

`number`

Width of the QR code image (default: 512)

#### Returns

`Promise`\<`string`\>

Promise that resolves to base64 encoded QR code image

#### Throws

When QR code generation fails

#### Example

```typescript
try {
  // Generate QRIS and convert to QR code image
  const qrisString = await client.generateQrisString(50000);
  const qrImageBase64 = await client.generateQrisImage(qrisString);
  
  // Use in HTML img tag
  const imgSrc = `data:image/png;base64,${qrImageBase64}`;
  
  // Or save to file
  const fs = require('fs');
  fs.writeFileSync('qr-code.png', qrImageBase64, 'base64');
} catch (error) {
  if (error instanceof OrderKuotaError) {
    console.error(`QR Generation Error [${error.code}]:`, error.message);
  }
}
```

***

### generateQrisQrCode()

> **generateQrisQrCode**(`amount`, `options`): `Promise`\<`string`\>

Defined in: [OrderKuota.ts:647](https://github.com/YoruAkio/OrderKuota-Wrapper/blob/aeaaa0f60c1ecb1ed8dadc7d254c13819d45488b/src/OrderKuota.ts#L647)

Generates a complete QRIS payment QR code image with the specified amount.

This is a convenience method that combines generateQrisString and generateQrisImage
in a single call. It generates the QRIS string for the specified amount and
immediately converts it to a QR code image.

#### Parameters

##### amount

`number`

The payment amount in IDR (Indonesian Rupiah)

##### options

Optional QR code generation options (same as generateQrisImage)

###### color?

\{ `dark?`: `string`; `light?`: `string`; \}

###### color.dark?

`string`

###### color.light?

`string`

###### margin?

`number`

###### width?

`number`

#### Returns

`Promise`\<`string`\>

Promise that resolves to base64 encoded QR code image

#### Throws

When amount is invalid, baseQrString is missing, or generation fails

#### Example

```typescript
try {
  // Generate QR code for 100,000 IDR payment in one step
  const qrImageBase64 = await client.generateQrisQrCode(100000, {
    width: 256,
    color: {
      dark: '#1a1a1a',
      light: '#ffffff'
    }
  });
  
  // Display in web page
  document.getElementById('qr-image').src = `data:image/png;base64,${qrImageBase64}`;
  
} catch (error) {
  if (error instanceof OrderKuotaError) {
    console.error(`QR Code Generation Error [${error.code}]:`, error.message);
  }
}
```

***

### generateQrisString()

> **generateQrisString**(`amount`): `Promise`\<`string`\>

Defined in: [OrderKuota.ts:385](https://github.com/YoruAkio/OrderKuota-Wrapper/blob/aeaaa0f60c1ecb1ed8dadc7d254c13819d45488b/src/OrderKuota.ts#L385)

Generates a QRIS (Quick Response Code Indonesian Standard) string with the specified amount.

This method creates a payment-ready QRIS string that can be converted to a QR code
for Indonesian digital payments. The generated string includes the payment amount
and maintains proper QRIS format compliance.

#### Parameters

##### amount

`number`

The payment amount in IDR (Indonesian Rupiah)

#### Returns

`Promise`\<`string`\>

Promise that resolves to the generated QRIS string

#### Throws

When amount is invalid, baseQrString is missing, or generation fails

#### Example

```typescript
try {
  // Generate QRIS for 50,000 IDR payment
  const qrisString = await client.generateQrisString(50000);
  console.log('Generated QRIS:', qrisString);
  
  // Convert to QR code using your preferred QR library
  // const qrCode = await QR.toDataURL(qrisString);
} catch (error) {
  if (error instanceof OrderKuotaError) {
    console.error(`QRIS Generation Error [${error.code}]:`, error.message);
  }
}
```

***

### getAvailableMethods()

> **getAvailableMethods**(): `object`

Defined in: [OrderKuota.ts:741](https://github.com/YoruAkio/OrderKuota-Wrapper/blob/aeaaa0f60c1ecb1ed8dadc7d254c13819d45488b/src/OrderKuota.ts#L741)

Gets available methods and their descriptions for IDE autocomplete support.

#### Returns

`object`

Object containing method names and descriptions

##### checkBalance

> **checkBalance**: `string` = `'Check current account balance'`

##### fetchQrisHistory

> **fetchQrisHistory**: `string` = `'Fetch QRIS transaction history'`

##### fetchRetailHistory

> **fetchRetailHistory**: `string` = `'Fetch retail transaction history'`

##### fetchVirtualAccountHistory

> **fetchVirtualAccountHistory**: `string` = `'Fetch Virtual Account transaction history'`

##### generateQrisImage

> **generateQrisImage**: `string` = `'Generate QR code image from QRIS string and return as base64'`

##### generateQrisQrCode

> **generateQrisQrCode**: `string` = `'Generate complete QRIS QR code image with specified amount'`

##### generateQrisString

> **generateQrisString**: `string` = `'Generate QRIS payment string with specified amount'`

##### getAvailableMethods

> **getAvailableMethods**: `string` = `'Get list of available methods'`

##### getConfig

> **getConfig**: `string` = `'Get current configuration (without sensitive data)'`

##### isConfigValid

> **isConfigValid**: `string` = `'Validate if configuration is complete for basic operations'`

##### isQrisGenerationAvailable

> **isQrisGenerationAvailable**: `string` = `'Check if QRIS generation is available'`

#### Example

```typescript
const methods = client.getAvailableMethods();
console.log(methods);
```

***

### getConfig()

> **getConfig**(): `Omit`\<[`OrderKuotaConfig`](../interfaces/OrderKuotaConfig.md), `"password"` \| `"pin"` \| `"apikey"` \| `"baseQrString"`\>

Defined in: [OrderKuota.ts:688](https://github.com/YoruAkio/OrderKuota-Wrapper/blob/aeaaa0f60c1ecb1ed8dadc7d254c13819d45488b/src/OrderKuota.ts#L688)

Gets the current configuration (without sensitive data).

#### Returns

`Omit`\<[`OrderKuotaConfig`](../interfaces/OrderKuotaConfig.md), `"password"` \| `"pin"` \| `"apikey"` \| `"baseQrString"`\>

Object containing non-sensitive configuration data

#### Example

```typescript
const config = client.getConfig();
console.log(`User ID: ${config.userid}`);
```

***

### getEndpoints()

> **getEndpoints**(): `object`

Defined in: [OrderKuota.ts:768](https://github.com/YoruAkio/OrderKuota-Wrapper/blob/aeaaa0f60c1ecb1ed8dadc7d254c13819d45488b/src/OrderKuota.ts#L768)

Get API endpoints used by this wrapper (for debugging purposes).

#### Returns

`object`

Object containing API endpoint URLs

##### balance

> **balance**: `string`

##### qrisHistory

> **qrisHistory**: `string`

##### retailHistory

> **retailHistory**: `string`

##### vaHistory

> **vaHistory**: `string`

#### Example

```typescript
const endpoints = client.getEndpoints();
console.log('Balance API:', endpoints.balance);
```

***

### isConfigValid()

> **isConfigValid**(): `boolean`

Defined in: [OrderKuota.ts:708](https://github.com/YoruAkio/OrderKuota-Wrapper/blob/aeaaa0f60c1ecb1ed8dadc7d254c13819d45488b/src/OrderKuota.ts#L708)

Validates if the current configuration is complete for basic operations.
Note: baseQrString is optional and only required for QRIS generation.

#### Returns

`boolean`

True if all required fields are present

#### Example

```typescript
if (client.isConfigValid()) {
  console.log('Configuration is valid for API operations');
}
```

***

### isQrisGenerationAvailable()

> **isQrisGenerationAvailable**(): `boolean`

Defined in: [OrderKuota.ts:726](https://github.com/YoruAkio/OrderKuota-Wrapper/blob/aeaaa0f60c1ecb1ed8dadc7d254c13819d45488b/src/OrderKuota.ts#L726)

Checks if QRIS generation is available (baseQrString is configured).

#### Returns

`boolean`

True if QRIS generation is available

#### Example

```typescript
if (client.isQrisGenerationAvailable()) {
  const qrisString = await client.generateQrisString(50000);
} else {
  console.log('QRIS generation not available - baseQrString not configured');
}
```
