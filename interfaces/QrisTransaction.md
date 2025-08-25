[**OrderKuota-Wrapper v1.0.9**](../README.md)

***

[OrderKuota-Wrapper](../globals.md) / QrisTransaction

# Interface: QrisTransaction

QRIS transaction interface

## Extends

- [`BaseTransaction`](BaseTransaction.md)

## Properties

### amount

> **amount**: `number`

Transaction amount in IDR

#### Inherited from

[`BaseTransaction`](BaseTransaction.md).[`amount`](BaseTransaction.md#amount)

***

### date

> **date**: `string`

Transaction date in ISO format

#### Inherited from

[`BaseTransaction`](BaseTransaction.md).[`date`](BaseTransaction.md#date)

***

### description?

> `optional` **description**: `string`

Optional transaction description

#### Inherited from

[`BaseTransaction`](BaseTransaction.md).[`description`](BaseTransaction.md#description)

***

### id

> **id**: `string`

Unique transaction ID

#### Inherited from

[`BaseTransaction`](BaseTransaction.md).[`id`](BaseTransaction.md#id)

***

### qris\_data?

> `optional` **qris\_data**: `object`

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

Transaction status (success, pending, failed, etc.)

#### Inherited from

[`BaseTransaction`](BaseTransaction.md).[`status`](BaseTransaction.md#status)
