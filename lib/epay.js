import soap from 'soap';
import Promise from 'bluebird';

const URL = 'https://ssl.ditonlinebetalingssystem.dk/remote/payment.asmx?WSDL';

export default class Epay {
  constructor({merchantnumber}) {
    if (!merchantnumber) {
      throw new Error('Please provide a merchantnumber');
    }
    this.merchantnumber = merchantnumber;
  }

  getClient() {
    return new Promise((resolve, reject) => {
      soap.createClient(URL, (err, client) => {
          if (err) {
            reject(err);
          } else {
            resolve(client);
          }
      });
    });
  }

  call(fnCall, args) {
    return new Promise((resolve, reject) => {
      this.getClient()
        .then((client) => {
          const fn = client[fnCall];
          const arg = {
            'merchantnumber': this.merchantnumber,
            'epayresponse': 1,
            ... args
          };
          if (!fn || fn === undefined) {
              reject(new Error(`Function '${fnCall}' does not exist!`));
          }
          fn(arg, function(err, result) {
              if (err) {
                  reject(err);
              } else {
                  resolve(result);
              }
          });
        })
        .catch(err => reject(err));
    });
  }
}
