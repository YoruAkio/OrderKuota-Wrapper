[**orderkuota**](../README.md)

***

[orderkuota](../globals.md) / OrderKuotaConfig

# Interface: OrderKuotaConfig

Defined in: [types.ts:5](https://github.com/YoruAkio/OrderKuota-Wrapper/blob/aeaaa0f60c1ecb1ed8dadc7d254c13819d45488b/src/types.ts#L5)

Configuration interface for OrderKuota class initialization
All fields are required for proper authentication

## Properties

### apikey

> **apikey**: `string`

Defined in: [types.ts:15](https://github.com/YoruAkio/OrderKuota-Wrapper/blob/aeaaa0f60c1ecb1ed8dadc7d254c13819d45488b/src/types.ts#L15)

API key for gateway access

***

### baseQrString?

> `optional` **baseQrString**: `string`

Defined in: [types.ts:17](https://github.com/YoruAkio/OrderKuota-Wrapper/blob/aeaaa0f60c1ecb1ed8dadc7d254c13819d45488b/src/types.ts#L17)

Base QRIS string for generating payment QR codes (optional, required only for QRIS generation)

***

### password

> **password**: `string`

Defined in: [types.ts:13](https://github.com/YoruAkio/OrderKuota-Wrapper/blob/aeaaa0f60c1ecb1ed8dadc7d254c13819d45488b/src/types.ts#L13)

Password for authentication

***

### pin

> **pin**: `string`

Defined in: [types.ts:9](https://github.com/YoruAkio/OrderKuota-Wrapper/blob/aeaaa0f60c1ecb1ed8dadc7d254c13819d45488b/src/types.ts#L9)

PIN for authentication (numeric string)

***

### userid

> **userid**: `string`

Defined in: [types.ts:11](https://github.com/YoruAkio/OrderKuota-Wrapper/blob/aeaaa0f60c1ecb1ed8dadc7d254c13819d45488b/src/types.ts#L11)

User ID for API calls

***

### username

> **username**: `string`

Defined in: [types.ts:7](https://github.com/YoruAkio/OrderKuota-Wrapper/blob/aeaaa0f60c1ecb1ed8dadc7d254c13819d45488b/src/types.ts#L7)

Username for authentication
