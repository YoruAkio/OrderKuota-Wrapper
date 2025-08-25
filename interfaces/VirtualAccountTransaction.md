[**OrderKuota-Wrapper v1.0.9**](../README.md)

***

[OrderKuota-Wrapper](../globals.md) / VirtualAccountTransaction

# Interface: VirtualAccountTransaction

Virtual Account transaction interface

## Extends

- [`BaseTransaction`](BaseTransaction.md)

## Properties

### amount

> **amount**: `number`

Transaction amount in IDR

#### Inherited from

[`BaseTransaction`](BaseTransaction.md).[`amount`](BaseTransaction.md#amount)

***

### bank\_code?

> `optional` **bank\_code**: `string`

Bank code (e.g., BCA, BNI, BRI, etc.)

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

### status

> **status**: `string`

Transaction status (success, pending, failed, etc.)

#### Inherited from

[`BaseTransaction`](BaseTransaction.md).[`status`](BaseTransaction.md#status)

***

### va\_number?

> `optional` **va\_number**: `string`

Virtual account number
