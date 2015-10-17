# Node Epay
A simple wrapper for epay's soap API
Make sure that you are calling from an ip address that is opened on the epay panel

### Usage
```javascript
var NodeEpay = require('node-epay');
NodeEpay.init(MERCHANT_NUMBER);
NodeEpay.call(FUNCTION, PARAMS).
then(function (res) {
    //Do something
});
```

### Functions
Get an overview of available functions here: (epay api)[http://tech.epay.dk/en/payment-web-service]

### License
MIT
