# OrderKuota Node.js API Wrapper

A fully type-safe Node.js wrapper for OrderKuota API with complete TypeScript support.

## Features

- ✅ **Full TypeScript Support** - Complete type definitions for all methods and responses
- ✅ **Type-Safe Configuration** - Required fields validation at compile time
- ✅ **Modern Promise-based API** - Full async/await support
- ✅ **QRIS QR Code Generation** - Generate payment QR codes with custom styling
- ✅ **Base64 Image Support** - Direct base64 output for web applications

## Note

> **⚠ Beta Notice:**
> This package is currently in **beta testing**. Some transaction checking methods may not work as expected, as not all features have been fully tested. Please report any issues you encounter.

## Installation

```bash
npm install orderkuota

# or using bun

bun add orderkuota
```

## Quick Start

### JavaScript Usage

```javascript
const OrderKuota = require('orderkuota');

const client = new OrderKuota({
  username: 'your-username',
  password: 'your-password',
  userid: 'your-userid',
  apikey: 'your-apikey',
  pin: 'your-pin'
});

const balance = await client.checkBalance();
console.log(balance.balance);
```

### TypeScript Usage

```typescript
import OrderKuota, { 
  OrderKuotaConfig, 
  BalanceResponse,
  QrisHistoryResponse 
} from 'orderkuota';

const config: OrderKuotaConfig = {
  username: 'your-username',
  password: 'your-password', 
  userid: 'your-userid',
  apikey: 'your-apikey',
  pin: 'your-pin'
};

const client = new OrderKuota(config);

// Full type safety
const balance: BalanceResponse = await client.checkBalance();
const qrisHistory: QrisHistoryResponse = await client.fetchQrisHistory();
```

## Documentation

📚 **Full API documentation is available at:** [GitHub Pages](https://yoruakio.github.io/OrderKuota-Wrapper/)

## Contributing

If you want to contribute to this project, simply submit a pull request. For any bugs, suggestions, or fixes, please open an issue on the GitHub repository.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
