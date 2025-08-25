[**OrderKuota-Wrapper v1.0.9**](../README.md)

***

[OrderKuota-Wrapper](../globals.md) / BaseTransaction

# Interface: BaseTransaction

Base transaction interface

## Extended by

- [`QrisTransaction`](QrisTransaction.md)
- [`VirtualAccountTransaction`](VirtualAccountTransaction.md)
- [`RetailTransaction`](RetailTransaction.md)

## Properties

### amount

> **amount**: `number`

Transaction amount in IDR

***

### date

> **date**: `string`

Transaction date in ISO format

***

### description?

> `optional` **description**: `string`

Optional transaction description

***

### id

> **id**: `string`

Unique transaction ID

***

### status

> **status**: `string`

Transaction status (success, pending, failed, etc.)
