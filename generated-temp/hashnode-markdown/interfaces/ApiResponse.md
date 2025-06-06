[**orderkuota**](../README.md)

***

[orderkuota](../globals.md) / ApiResponse

# Interface: ApiResponse\<T\>

Defined in: [types.ts:84](https://github.com/YoruAkio/OrderKuota-Wrapper/blob/aeaaa0f60c1ecb1ed8dadc7d254c13819d45488b/src/types.ts#L84)

Generic API response wrapper

## Extended by

- [`QrisHistoryResponse`](QrisHistoryResponse.md)
- [`VirtualAccountHistoryResponse`](VirtualAccountHistoryResponse.md)
- [`RetailHistoryResponse`](RetailHistoryResponse.md)

## Type Parameters

### T

`T` = `any`

## Properties

### data?

> `optional` **data**: `T`

Defined in: [types.ts:90](https://github.com/YoruAkio/OrderKuota-Wrapper/blob/aeaaa0f60c1ecb1ed8dadc7d254c13819d45488b/src/types.ts#L90)

Response data payload

***

### error?

> `optional` **error**: `string`

Defined in: [types.ts:92](https://github.com/YoruAkio/OrderKuota-Wrapper/blob/aeaaa0f60c1ecb1ed8dadc7d254c13819d45488b/src/types.ts#L92)

Error details if any

***

### message

> **message**: `string`

Defined in: [types.ts:88](https://github.com/YoruAkio/OrderKuota-Wrapper/blob/aeaaa0f60c1ecb1ed8dadc7d254c13819d45488b/src/types.ts#L88)

Response message

***

### status

> **status**: `boolean`

Defined in: [types.ts:86](https://github.com/YoruAkio/OrderKuota-Wrapper/blob/aeaaa0f60c1ecb1ed8dadc7d254c13819d45488b/src/types.ts#L86)

Response status - true if successful
