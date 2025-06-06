[**orderkuota**](../README.md)

***

[orderkuota](../globals.md) / QrisHistoryResponse

# Interface: QrisHistoryResponse

Defined in: [types.ts:98](https://github.com/YoruAkio/OrderKuota-Wrapper/blob/aeaaa0f60c1ecb1ed8dadc7d254c13819d45488b/src/types.ts#L98)

QRIS history response

## Extends

- [`ApiResponse`](ApiResponse.md)\<[`QrisTransaction`](QrisTransaction.md)[]\>

## Properties

### data?

> `optional` **data**: [`QrisTransaction`](QrisTransaction.md)[]

Defined in: [types.ts:90](https://github.com/YoruAkio/OrderKuota-Wrapper/blob/aeaaa0f60c1ecb1ed8dadc7d254c13819d45488b/src/types.ts#L90)

Response data payload

#### Inherited from

[`ApiResponse`](ApiResponse.md).[`data`](ApiResponse.md#data)

***

### error?

> `optional` **error**: `string`

Defined in: [types.ts:92](https://github.com/YoruAkio/OrderKuota-Wrapper/blob/aeaaa0f60c1ecb1ed8dadc7d254c13819d45488b/src/types.ts#L92)

Error details if any

#### Inherited from

[`ApiResponse`](ApiResponse.md).[`error`](ApiResponse.md#error)

***

### message

> **message**: `string`

Defined in: [types.ts:88](https://github.com/YoruAkio/OrderKuota-Wrapper/blob/aeaaa0f60c1ecb1ed8dadc7d254c13819d45488b/src/types.ts#L88)

Response message

#### Inherited from

[`ApiResponse`](ApiResponse.md).[`message`](ApiResponse.md#message)

***

### status

> **status**: `boolean`

Defined in: [types.ts:86](https://github.com/YoruAkio/OrderKuota-Wrapper/blob/aeaaa0f60c1ecb1ed8dadc7d254c13819d45488b/src/types.ts#L86)

Response status - true if successful

#### Inherited from

[`ApiResponse`](ApiResponse.md).[`status`](ApiResponse.md#status)
