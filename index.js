'use strict';

var soap = require('soap');
var Q = require('q');
var merge = require('merge')

var url = 'https://ssl.ditonlinebetalingssystem.dk/remote/payment.asmx?WSDL';
var merchantnumber = 0;
var epayresponse = 1;

var NodeEpay = {};

var init = function (mn) {
    merchantnumber = mn;
};

var getClient = function () {
    var deferred = Q.defer();
    soap.createClient(url, function (err, client) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(client);
        }
    });
    return deferred.promise;
}

var call = function (functionName, args) {
    if (merchantnumber === 0) {
        throw new Error('Please call init to set merchant number');
    }
    var deferred = Q.defer();
    soap.createClient(url, function (err, client) {
        if (err) {
            deferred.reject(err);
        } else {
            var fn = client[functionName];
            var arg = merge({
                'merchantnumber': merchantnumber,
                'epayresponse': epayresponse,
            }, args);
            if (!fn || fn === undefined) {
                deferred.reject(new Error('Function  \'' + functionName + '\' does not exist!'));
            }
            fn(arg, function(err, result) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(result);
                }
            });
        }

    });
    return deferred.promise;
};

NodeEpay.init = init;
NodeEpay.call = call;
NodeEpay.getClient = getClient;
module.exports = NodeEpay;
