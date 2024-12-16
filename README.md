# Order Kuota Node.js API Wrapper

## Installation

```bash
npm install orderkuota
```

## Documentation

If you wanna register you can contact an admin from [telegram](https://t.me/orderkuota)

UserID: User ID or Merchant Code of your account in OkeConnect from [here](https://okeconnect.com/integrasi/payment_gateway)
ApiKey: API Key from [here](https://okeconnect.com/integrasi/payment_gateway)

### Initialize OrderKuota Object

```javascript
const orderkuota = require('orderkuota');
const OrKut = new OrderKuota({
    username: 'yourusername',
    pin: 'yourpin',
    userid: 'OK-----',
    apikey: 'yourapikey',
    password: 'yourpassword',
});
```

### Check Balance

Check balance of your account
Note: Manage you IP whitelist in your account setting [here](https://okeconnect.com/integrasi/trx_ip)

```javascript
OrK.checkBalance().then(async(response) => {
    console.log(response);
}).catch((error) => {
    console.log(error);
})
```

### Fetch Qris Transaction History
Fetch qris transaction history

```javascript
OrKut.fetchQrisHistory().then(async(res) => {
    console.log(res);
}).catch((err) => {
    console.log(err);
});
```

### Fetch Virtial Account Transaction History
Fetch virtual account transaction history

```javascript
OrKut.fetchVirtualAccountHistory().then(async(res) => {
    console.log(res);
}).catch((err) => {
    console.log(err);
});
```

### Fetch Alfa n Indo Mart Transaction History
Fetch alfa n indo mart transaction history

```javascript
OrKut.fetchRetailHistory().then(async(res) => {
    console.log(res);
}).catch((err) => {
    console.log(err);
});
```

## Contact

You can contact me at teleram my username is [@Ethermite](https://t.me/ethermite) or join my telegram group [here](https://t.me/vertion)

## Contributing

Feel free to contribute to this project by submitting a pull request or by opening an issue.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
