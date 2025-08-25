[**OrderKuota-Wrapper v1.0.9**](../README.md)

***

[OrderKuota-Wrapper](../globals.md) / OrderKuota

# Class: OrderKuota

OrderKuota API wrapper for TypeScript.

Provides balance checking, transaction history, and QRIS payment generation.

## Example

```typescript
const client = new OrderKuota({
  username: 'your-username',
  password: 'your-password',
  userid: 'your-userid',
  apikey: 'your-apikey',
  pin: 'your-pin'
});

const balance = await client.checkBalance();
const qrisCode = await client.generateQrisQrCode(50000);
```

## Constructors

### Constructor

> **new OrderKuota**(`config`): `OrderKuota`

Create OrderKuota client instance.

#### Parameters

##### config

[`OrderKuotaConfig`](../interfaces/OrderKuotaConfig.md)

Configuration with authentication credentials

#### Returns

`OrderKuota`

#### Throws

When required config is missing

## Methods

### checkBalance()

> **checkBalance**(): `Promise`\<[`BalanceResponse`](../interfaces/BalanceResponse.md)\>

Check account balance.

#### Returns

`Promise`\<[`BalanceResponse`](../interfaces/BalanceResponse.md)\>

Promise with balance information

#### Throws

When API request fails

***

### fetchQrisHistory()

> **fetchQrisHistory**(): `Promise`\<[`QrisHistoryResponse`](../interfaces/QrisHistoryResponse.md)\>

Fetch QRIS transaction history.

#### Returns

`Promise`\<[`QrisHistoryResponse`](../interfaces/QrisHistoryResponse.md)\>

Promise with QRIS transaction history

#### Throws

When API request fails

***

### fetchRetailHistory()

> **fetchRetailHistory**(): `Promise`\<[`RetailHistoryResponse`](../interfaces/RetailHistoryResponse.md)\>

Fetch retail transaction history.

#### Returns

`Promise`\<[`RetailHistoryResponse`](../interfaces/RetailHistoryResponse.md)\>

Promise with retail transaction history

#### Throws

When API request fails

***

### fetchVirtualAccountHistory()

> **fetchVirtualAccountHistory**(): `Promise`\<[`VirtualAccountHistoryResponse`](../interfaces/VirtualAccountHistoryResponse.md)\>

Fetch Virtual Account transaction history.

#### Returns

`Promise`\<[`VirtualAccountHistoryResponse`](../interfaces/VirtualAccountHistoryResponse.md)\>

Promise with Virtual Account transaction history

#### Throws

When API request fails

***

### generateQrisImage()

> **generateQrisImage**(`qrisString`, `options`): `Promise`\<`string`\>

Generate QR code image from QRIS string.

#### Parameters

##### qrisString

`string`

QRIS string to convert

##### options

QR code options (width, margin, colors)

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

Promise with base64 encoded QR code image

#### Throws

When generation fails

***

### generateQrisQrCode()

> **generateQrisQrCode**(`amount`, `options`): `Promise`\<`string`\>

Generate complete QRIS QR code image with amount.

#### Parameters

##### amount

`number`

Payment amount in IDR

##### options

QR code options (width, margin, colors)

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

Promise with base64 encoded QR code image

#### Throws

When generation fails

***

### generateQrisString()

> **generateQrisString**(`amount`): `Promise`\<`string`\>

Generate QRIS string for payment amount.

#### Parameters

##### amount

`number`

Payment amount in IDR

#### Returns

`Promise`\<`string`\>

Promise with QRIS string

#### Throws

When amount is invalid or baseQrString missing

***

### getAvailableMethods()

> **getAvailableMethods**(): `object`

Get available methods and descriptions for IDE autocomplete.

#### Returns

`object`

Object with method names and descriptions

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

***

### getConfig()

> **getConfig**(): `Omit`\<[`OrderKuotaConfig`](../interfaces/OrderKuotaConfig.md), `"password"` \| `"pin"` \| `"apikey"` \| `"baseQrString"`\>

Get current configuration (without sensitive data).

#### Returns

`Omit`\<[`OrderKuotaConfig`](../interfaces/OrderKuotaConfig.md), `"password"` \| `"pin"` \| `"apikey"` \| `"baseQrString"`\>

Object with non-sensitive config data

***

### getEndpoints()

> **getEndpoints**(): `object`

Get API endpoints for debugging.

#### Returns

`object`

Object with API endpoint URLs

##### balance

> **balance**: `string`

##### qrisHistory

> **qrisHistory**: `string`

##### retailHistory

> **retailHistory**: `string`

##### vaHistory

> **vaHistory**: `string`

***

### isConfigValid()

> **isConfigValid**(): `boolean`

Validate if configuration is complete for basic operations.
Note: baseQrString is optional, only required for QRIS generation.

#### Returns

`boolean`

True if all required fields are present

***

### isQrisGenerationAvailable()

> **isQrisGenerationAvailable**(): `boolean`

Check if QRIS generation is available.

#### Returns

`boolean`

True if baseQrString is configured
