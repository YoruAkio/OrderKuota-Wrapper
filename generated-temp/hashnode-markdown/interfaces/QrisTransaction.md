[**orderkuota**](../README.md)

***

[orderkuota](../globals.md) / QrisTransaction

# Interface: QrisTransaction

Defined in: [types.ts:51](https://github.com/YoruAkio/OrderKuota-Wrapper/blob/aeaaa0f60c1ecb1ed8dadc7d254c13819d45488b/src/types.ts#L51)

QRIS transaction interface

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

### qris\_data?

> `optional` **qris\_data**: `object`

Defined in: [types.ts:53](https://github.com/YoruAkio/OrderKuota-Wrapper/blob/aeaaa0f60c1ecb1ed8dadc7d254c13819d45488b/src/types.ts#L53)

QRIS specific data

#### merchant\_name?

> `optional` **merchant\_name**: `string`

Merchant name for the transaction

#### terminal\_id?

> `optional` **terminal\_id**: `string`

Terminal ID used for the transaction

***

### status

> **status**: `string`

Defined in: [types.ts:43](https://github.com/YoruAkio/OrderKuota-Wrapper/blob/aeaaa0f60c1ecb1ed8dadc7d254c13819d45488b/src/types.ts#L43)

Transaction status (success, pending, failed, etc.)

#### Inherited from

[`BaseTransaction`](BaseTransaction.md).[`status`](BaseTransaction.md#status)
