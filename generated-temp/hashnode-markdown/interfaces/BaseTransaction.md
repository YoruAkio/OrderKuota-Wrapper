[**orderkuota**](../README.md)

***

[orderkuota](../globals.md) / BaseTransaction

# Interface: BaseTransaction

Defined in: [types.ts:35](https://github.com/YoruAkio/OrderKuota-Wrapper/blob/aeaaa0f60c1ecb1ed8dadc7d254c13819d45488b/src/types.ts#L35)

Base transaction interface

## Extended by

- [`QrisTransaction`](QrisTransaction.md)
- [`VirtualAccountTransaction`](VirtualAccountTransaction.md)
- [`RetailTransaction`](RetailTransaction.md)

## Properties

### amount

> **amount**: `number`

Defined in: [types.ts:39](https://github.com/YoruAkio/OrderKuota-Wrapper/blob/aeaaa0f60c1ecb1ed8dadc7d254c13819d45488b/src/types.ts#L39)

Transaction amount in IDR

***

### date

> **date**: `string`

Defined in: [types.ts:41](https://github.com/YoruAkio/OrderKuota-Wrapper/blob/aeaaa0f60c1ecb1ed8dadc7d254c13819d45488b/src/types.ts#L41)

Transaction date in ISO format

***

### description?

> `optional` **description**: `string`

Defined in: [types.ts:45](https://github.com/YoruAkio/OrderKuota-Wrapper/blob/aeaaa0f60c1ecb1ed8dadc7d254c13819d45488b/src/types.ts#L45)

Optional transaction description

***

### id

> **id**: `string`

Defined in: [types.ts:37](https://github.com/YoruAkio/OrderKuota-Wrapper/blob/aeaaa0f60c1ecb1ed8dadc7d254c13819d45488b/src/types.ts#L37)

Unique transaction ID

***

### status

> **status**: `string`

Defined in: [types.ts:43](https://github.com/YoruAkio/OrderKuota-Wrapper/blob/aeaaa0f60c1ecb1ed8dadc7d254c13819d45488b/src/types.ts#L43)

Transaction status (success, pending, failed, etc.)
