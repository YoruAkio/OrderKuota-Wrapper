[**OrderKuota-Wrapper v1.0.9**](../README.md)

***

[OrderKuota-Wrapper](../globals.md) / OrderKuotaError

# Class: OrderKuotaError

Custom error class for OrderKuota operations

## Extends

- `Error`

## Constructors

### Constructor

> **new OrderKuotaError**(`message`, `code`, `status?`): `OrderKuotaError`

#### Parameters

##### message

`string`

##### code

[`OrderKuotaErrorCode`](../type-aliases/OrderKuotaErrorCode.md) = `'UNKNOWN_ERROR'`

##### status?

`number`

#### Returns

`OrderKuotaError`

#### Overrides

`Error.constructor`

## Properties

### code

> `readonly` **code**: [`OrderKuotaErrorCode`](../type-aliases/OrderKuotaErrorCode.md)

Error code for programmatic handling

***

### status?

> `readonly` `optional` **status**: `number`

HTTP status code if applicable
