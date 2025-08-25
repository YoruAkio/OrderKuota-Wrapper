[**OrderKuota-Wrapper v1.0.9**](../README.md)

***

[OrderKuota-Wrapper](../globals.md) / QrisHistoryResponse

# Interface: QrisHistoryResponse

QRIS history response

## Extends

- [`ApiResponse`](ApiResponse.md)\<[`QrisTransaction`](QrisTransaction.md)[]\>

## Properties

### data?

> `optional` **data**: [`QrisTransaction`](QrisTransaction.md)[]

Response data payload

#### Inherited from

[`ApiResponse`](ApiResponse.md).[`data`](ApiResponse.md#data)

***

### error?

> `optional` **error**: `string`

Error details if any

#### Inherited from

[`ApiResponse`](ApiResponse.md).[`error`](ApiResponse.md#error)

***

### message

> **message**: `string`

Response message

#### Inherited from

[`ApiResponse`](ApiResponse.md).[`message`](ApiResponse.md#message)

***

### status

> **status**: `boolean`

Response status - true if successful

#### Inherited from

[`ApiResponse`](ApiResponse.md).[`status`](ApiResponse.md#status)
