[**OrderKuota-Wrapper v1.0.9**](../README.md)

***

[OrderKuota-Wrapper](../globals.md) / OrderKuotaConfig

# Interface: OrderKuotaConfig

Configuration interface for OrderKuota class initialization
All fields are required for proper authentication

## Properties

### apikey

> **apikey**: `string`

API key for gateway access

***

### baseQrString?

> `optional` **baseQrString**: `string`

Base QRIS string for generating payment QR codes (optional, required only for QRIS generation)

***

### password

> **password**: `string`

Password for authentication

***

### pin

> **pin**: `string`

PIN for authentication (numeric string)

***

### userid

> **userid**: `string`

User ID for API calls

***

### username

> **username**: `string`

Username for authentication
