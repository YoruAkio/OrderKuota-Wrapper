[**orderkuota**](../README.md)

***

[orderkuota](../globals.md) / RetailTransaction

# Interface: RetailTransaction

Defined in: [types.ts:74](https://github.com/YoruAkio/OrderKuota-Wrapper/blob/aeaaa0f60c1ecb1ed8dadc7d254c13819d45488b/src/types.ts#L74)

Retail transaction interface

## Extends

- [`BaseTransaction`](BaseTransaction.md)

## Properties

### amount

> **amount**: `number`

Defined in: [types.ts:39](https://github.com/YoruAkio/OrderKuota-Wrapper/blob/aeaaa0f60c1ecb1ed8dadc7d254c13819d45488b/src/types.ts#L39)

Transaction amount in IDR

#### Inherited from

[`BaseTransaction`](BaseTransaction.md).[`amount`](BaseTransaction.md#amount)

***

### date

> **date**: `string`

Defined in: [types.ts:41](https://github.com/YoruAkio/OrderKuota-Wrapper/blob/aeaaa0f60c1ecb1ed8dadc7d254c13819d45488b/src/types.ts#L41)

Transaction date in ISO format

#### Inherited from

[`BaseTransaction`](BaseTransaction.md).[`date`](BaseTransaction.md#date)

***

### description?

> `optional` **description**: `string`

Defined in: [types.ts:45](https://github.com/YoruAkio/OrderKuota-Wrapper/blob/aeaaa0f60c1ecb1ed8dadc7d254c13819d45488b/src/types.ts#L45)

Optional transaction description

#### Inherited from

[`BaseTransaction`](BaseTransaction.md).[`description`](BaseTransaction.md#description)

***

### id

> **id**: `string`

Defined in: [types.ts:37](https://github.com/YoruAkio/OrderKuota-Wrapper/blob/aeaaa0f60c1ecb1ed8dadc7d254c13819d45488b/src/types.ts#L37)

Unique transaction ID

#### Inherited from

[`BaseTransaction`](BaseTransaction.md).[`id`](BaseTransaction.md#id)

***

### product\_code?

> `optional` **product\_code**: `string`

Defined in: [types.ts:76](https://github.com/YoruAkio/OrderKuota-Wrapper/blob/aeaaa0f60c1ecb1ed8dadc7d254c13819d45488b/src/types.ts#L76)

Product code for the transaction

***

### status

> **status**: `string`

Defined in: [types.ts:43](https://github.com/YoruAkio/OrderKuota-Wrapper/blob/aeaaa0f60c1ecb1ed8dadc7d254c13819d45488b/src/types.ts#L43)

Transaction status (success, pending, failed, etc.)

#### Inherited from

[`BaseTransaction`](BaseTransaction.md).[`status`](BaseTransaction.md#status)

***

### target?

> `optional` **target**: `string`

Defined in: [types.ts:78](https://github.com/YoruAkio/OrderKuota-Wrapper/blob/aeaaa0f60c1ecb1ed8dadc7d254c13819d45488b/src/types.ts#L78)

Target number (phone, account, etc.)
