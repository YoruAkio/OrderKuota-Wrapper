[**OrderKuota-Wrapper v1.0.9**](../README.md)

***

[OrderKuota-Wrapper](../globals.md) / RetailTransaction

# Interface: RetailTransaction

Retail transaction interface

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

### product\_code?

> `optional` **product\_code**: `string`

Product code for the transaction

***

### status

> **status**: `string`

Transaction status (success, pending, failed, etc.)

#### Inherited from

[`BaseTransaction`](BaseTransaction.md).[`status`](BaseTransaction.md#status)

***

### target?

> `optional` **target**: `string`

Target number (phone, account, etc.)
