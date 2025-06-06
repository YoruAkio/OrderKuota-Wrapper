[**orderkuota**](../README.md)

***

[orderkuota](../globals.md) / OrderKuotaError

# Class: OrderKuotaError

Defined in: [types.ts:135](https://github.com/YoruAkio/OrderKuota-Wrapper/blob/aeaaa0f60c1ecb1ed8dadc7d254c13819d45488b/src/types.ts#L135)

Custom error class for OrderKuota operations

## Extends

- `Error`

## Constructors

### Constructor

> **new OrderKuotaError**(`message`, `code`, `status?`): `OrderKuotaError`

Defined in: [types.ts:141](https://github.com/YoruAkio/OrderKuota-Wrapper/blob/aeaaa0f60c1ecb1ed8dadc7d254c13819d45488b/src/types.ts#L141)

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

Defined in: [types.ts:137](https://github.com/YoruAkio/OrderKuota-Wrapper/blob/aeaaa0f60c1ecb1ed8dadc7d254c13819d45488b/src/types.ts#L137)

Error code for programmatic handling

***

### status?

> `readonly` `optional` **status**: `number`

Defined in: [types.ts:139](https://github.com/YoruAkio/OrderKuota-Wrapper/blob/aeaaa0f60c1ecb1ed8dadc7d254c13819d45488b/src/types.ts#L139)

HTTP status code if applicable
