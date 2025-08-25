[**OrderKuota-Wrapper v1.0.9**](../README.md)

***

[OrderKuota-Wrapper](../globals.md) / ApiResponse

# Interface: ApiResponse\<T\>

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

Response data payload

***

### error?

> `optional` **error**: `string`

Error details if any

***

### message

> **message**: `string`

Response message

***

### status

> **status**: `boolean`

Response status - true if successful
